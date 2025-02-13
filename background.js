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

// Function to show block notification
function showBlockNotification(reason, type) {
	const category = type === 'domain' ? 'Website' : 'Content';
	const categoryName = getCategoryFromItem(reason);
	const title = `🚫 ${category} Blocked`;
	let message = '';

	if (type === 'domain') {
		message = `⛔ Access blocked: "${reason}"\n📁 Category: ${categoryName}`;
	} else if (type === 'keyword') {
		message = `⚠️ Blocked ${categoryName.toLowerCase()} content detected`;
	}

	// Create simple notification without icon
	const notificationId = `block-${Date.now()}`;
	chrome.notifications.create(notificationId, {
		type: 'basic',
		title: title,
		message: message,
		priority: 2,
		requireInteraction: false,
		iconUrl: chrome.runtime.getURL('icon.svg')
	}, (notificationId) => {
		if (chrome.runtime.lastError) {
			// If notification fails, log to console
			console.error('Notification failed:', chrome.runtime.lastError);
			// Try without icon as fallback
			chrome.notifications.create(notificationId, {
				type: 'basic',
				title: title,
				message: message,
				priority: 2,
				requireInteraction: false
			});
		}
		
		// Auto-clear notification after 3 seconds
		setTimeout(() => {
			chrome.notifications.clear(notificationId);
		}, 3000);
	});
}

// Add notification click handler
chrome.notifications.onClicked.addListener((notificationId) => {
	if (notificationId.startsWith('block-')) {
		chrome.notifications.clear(notificationId);
	}
});





// Helper function to check if a URL matches any blocked pattern
function isBlocked(url, blockedList) {
	const urlLower = url.toLowerCase();
	const hostname = new URL(url).hostname.toLowerCase();
	
	// Check for exact domain matches first
	const matchedDomain = blockedList.find(pattern => 
		pattern.includes('.com') && hostname.includes(pattern)
	);
	if (matchedDomain) {
		showBlockNotification(matchedDomain, 'domain');
		return true;
	}

	// Check for keyword matches
	const matchedKeyword = blockedList.find(pattern => {
		const patternLower = pattern.toLowerCase();
		return urlLower.includes(patternLower) || hostname.includes(patternLower);
	});
	if (matchedKeyword) {
		showBlockNotification(matchedKeyword, 'keyword');
		return true;
	}

	return false;
}

// Helper function to check page content with improved detection
function checkPageContent(tabId, blockedList) {
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
			
			const socialMediaClasses = ['facebook', 'twitter', 'instagram', 'social', 'share'];
			const hasSocialMediaElements = socialMediaClasses.some(className => 
				document.getElementsByClassName(className).length > 0
			);

			const gameRelatedElements = document.querySelectorAll(
				'[class*="game"],[class*="play"],[id*="game"],[id*="play"]'
			).length > 0;

			const contentToCheck = [
				pageText,
				metaContent,
				...links,
				hasSocialMediaElements ? 'social-media-elements-present' : '',
				gameRelatedElements ? 'game-elements-present' : ''
			].join(' ');

			// Return both the result and the matched keyword
			const matchedKeyword = keywords.find(keyword => 
				contentToCheck.includes(keyword.toLowerCase())
			);
			return { blocked: !!matchedKeyword, keyword: matchedKeyword };
		},
		args: [blockedList]
	}).then(results => {
		if (results[0]?.result.blocked) {
			showBlockNotification(results[0].result.keyword, 'keyword');
			chrome.tabs.remove(tabId);
		}
	}).catch(() => {
		// Handle any errors silently
	});
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		chrome.storage.sync.get(['blockedList'], (result) => {
			const blockedList = result.blockedList || [];
			if (isBlocked(changeInfo.url, blockedList)) {
				chrome.tabs.remove(tabId);
			}
		});
	}
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
	chrome.storage.sync.get(['blockedList'], (result) => {
		const blockedList = result.blockedList || [];
		if (isBlocked(details.url, blockedList)) {
			chrome.tabs.remove(details.tabId);
		}
	});
});

// Listen for completed navigation to check page content
chrome.webNavigation.onCompleted.addListener((details) => {
	chrome.storage.sync.get(['blockedList'], (result) => {
		const blockedList = result.blockedList || [];
		checkPageContent(details.tabId, blockedList);
	});
});