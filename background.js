// Preset configurations
const presets = {
	adultContent: {
		name: 'Adult Content',
		keywords: [
			'porn', 'xxx', 'sex', 'adult', 'nsfw', 'nude', 'naked',
			'pornhub', 'xvideos', 'xhamster', 'redtube', 'youporn',
			'explicit', 'erotic', 'hentai', 'boobs', 'pussy'
		],
		domains: [
			'pornhub.com', 'xvideos.com', 'xhamster.com', 'redtube.com',
			'youporn.com', 'xnxx.com', 'brazzers.com', 'onlyfans.com'
		]
	},
	socialMedia: {
		name: 'Social Media',
		keywords: [
			'facebook', 'instagram', 'twitter', 'tiktok', 'snapchat',
			'social media', 'reels', 'trending'
		],
		domains: [
			'facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com',
			'snapchat.com', 'reddit.com', 'tumblr.com', 'pinterest.com',
			'linkedin.com', 'whatsapp.com', 'telegram.org', 'discord.com'
		]
	},
	gaming: {
		name: 'Gaming',
		keywords: [
			'game', 'gaming', 'steam', 'xbox', 'playstation',
			'twitch', 'fortnite', 'minecraft'
		],
		domains: [
			'steampowered.com', 'twitch.tv', 'epicgames.com',
			'xbox.com', 'playstation.com', 'roblox.com',
			'blizzard.com', 'ea.com', 'unity.com', 'unrealengine.com',
			'gamepedia.com', 'ign.com', 'gamespot.com'
		]
	},
	gambling: {
		name: 'Gambling',
		keywords: [
			'gambling', 'betting', 'casino', 'poker', 'slot',
			'roulette', 'blackjack', 'bet'
		],
		domains: [
			'bet365.com', 'pokerstars.com', 'betway.com',
			'williamhill.com', 'bovada.lv', 'draftkings.com',
			'fanduel.com', 'casino.com', 'bwin.com', '888.com'
		]
	}
};

// Function to get category name from blocked item
function getCategoryFromItem(item) {
	for (const [key, preset] of Object.entries(presets)) {
		if (preset.keywords.includes(item) || preset.domains.includes(item)) {
			return preset.name;
		}
	}
	return 'Custom Block Rule';
}

// Helper function to check if a URL matches any blocked pattern
function isBlocked(url, blockedList, isHeavyMode = false) {
	const urlObj = new URL(url);
	const hostname = urlObj.hostname.toLowerCase();
	const urlLower = url.toLowerCase();
	
	// Check if this is a search engine URL
	const isSearchEngine = hostname.includes('google.') || 
						 hostname.includes('bing.') || 
						 hostname.includes('yahoo.') || 
						 hostname.includes('duckduckgo.') || 
						 hostname.includes('yandex.');
	
	for (const pattern of blockedList) {
		const patternLower = pattern.toLowerCase();
		
		// Check for domain matches first
		if (pattern.includes('.com')) {
			if (urlLower.includes(patternLower)) {
				return true;
			}
			continue;
		}
		
		// Check for keyword matches
		if (!isHeavyMode) {
			// Check if URL contains the pattern
			if (urlLower.includes(patternLower)) {
				return true;
			}
			
			// Check search queries
			if (isSearchEngine) {
				const searchQuery = urlObj.searchParams.toString().toLowerCase();
				if (searchQuery.includes(patternLower)) {
					return true;
				}
			}
		} else {
			// Heavy mode: Check everything
			if (urlLower.includes(patternLower)) {
				return true;
			}
		}
	}
	return false;
}










// Helper function to check page content (only in Heavy mode)
function checkPageContent(tabId, blockedList) {
	chrome.storage.sync.get(['blockingMode'], (result) => {
		// Only check page content in Heavy mode
		if (result.blockingMode !== 'heavy') {
			return;
		}

		chrome.scripting.executeScript({
			target: { tabId },
			function: (keywords) => {
				const pageText = document.body.innerText.toLowerCase();
				const metaTags = document.getElementsByTagName('meta');
				const metaContent = Array.from(metaTags)
					.map(meta => (meta.content || '').toLowerCase())
					.join(' ');
				
				const links = Array.from(document.getElementsByTagName('a'))
					.map(a => (a.href || '').toLowerCase());
				
				const contentToCheck = [
					pageText,
					metaContent,
					...links
				].join(' ');

				const matchedKeyword = keywords.find(keyword => 
					contentToCheck.includes(keyword.toLowerCase())
				);
				return { blocked: !!matchedKeyword, keyword: matchedKeyword };
			},
			args: [blockedList]
		}).then(results => {
			if (results[0]?.result.blocked) {
				chrome.tabs.remove(tabId);
			}
		}).catch(() => {
			// Handle any errors silently
		});
	});
}




// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		chrome.storage.sync.get(['blockedList', 'blockingMode'], (result) => {
			const blockedList = result.blockedList || [];
			const isHeavyMode = result.blockingMode === 'heavy';
			// Only check URL in Light mode
			if (!isHeavyMode) {
				if (isBlocked(changeInfo.url, blockedList, false)) {
					chrome.tabs.remove(tabId);
				}
				return;
			}
			// In Heavy mode, check both URL and content
			if (isBlocked(changeInfo.url, blockedList, true)) {
				chrome.tabs.remove(tabId);
			} else {
				checkPageContent(tabId, blockedList);
			}
		});
	}
});

// Update navigation event listener
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
	chrome.storage.sync.get(['blockedList', 'blockingMode'], (result) => {
		const blockedList = result.blockedList || [];
		const isHeavyMode = result.blockingMode === 'heavy';
		// Only check URL in Light mode
		if (!isHeavyMode) {
			if (isBlocked(details.url, blockedList, false)) {
				chrome.tabs.remove(details.tabId);
			}
			return;
		}
		// In Heavy mode, proceed with URL check (content check happens in onUpdated)
		if (isBlocked(details.url, blockedList, true)) {
			chrome.tabs.remove(details.tabId);
		}
	});
});