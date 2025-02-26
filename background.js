// Statistics tracking
function saveBlockEvent(url, pattern, category) {
	const now = new Date();
	const timestamp = now.getTime();
	const day = now.toISOString().split('T')[0];

	chrome.storage.local.get(['blockStats'], (result) => {
		const stats = result.blockStats || {
			totalBlocks: 0,
			dailyStats: {},
			topSites: {},
			categoryStats: {}
		};

		// Update total blocks
		stats.totalBlocks++;

		// Update daily stats
		if (!stats.dailyStats[day]) {
			stats.dailyStats[day] = 0;
		}
		stats.dailyStats[day]++;

		// Update top sites
		const hostname = new URL(url).hostname;
		if (!stats.topSites[hostname]) {
			stats.topSites[hostname] = 0;
		}
		stats.topSites[hostname]++;

		// Update category stats
		const blockCategory = category || 'Custom';
		if (!stats.categoryStats[blockCategory]) {
			stats.categoryStats[blockCategory] = 0;
		}
		stats.categoryStats[blockCategory]++;

		// Store updated stats
		chrome.storage.local.set({ blockStats: stats });
	});
}

// Preset configurations
const presets = {
	name: 'adult-content',
	keywords: [
		// English keywords
		'porn', 'xxx', 'sex', 'adult', 'nsfw', 'nude', 'naked',
		'pornhub', 'xvideos', 'xhamster', 'redtube', 'youporn',
		'explicit', 'erotic', 'hentai', 'boobs', 'pussy',
		// Arabic keywords
		'سكس', 'بورن', 'جنس', 'اباحي', 'اباحية', 'عاري',
		'عارية', 'نيك', 'طيز', 'زب', 'كس', 'افلام_للكبار',
		'مثير', 'شهوة', 'شهواني', 'مؤخرة', 'صدر', 'نكاح',
		'دعارة', 'جماع', 'مواقع_اباحية', 'افلام_سكس',
		'صور_سكس', 'افلام_اباحية', 'مقاطع_سكس', 'سحاق',
		'خلاعة', 'فاحشة', 'عهر', 'فيديو_سكس', 'سكسي',
		'عربده','عربدة'
	],
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
	const urlPath = urlObj.pathname.toLowerCase();
	
	// Check if this is a search engine URL
	const isSearchEngine = hostname.includes('google.') || 
						 hostname.includes('bing.') || 
						 hostname.includes('yahoo.') || 
						 hostname.includes('duckduckgo.') || 
						 hostname.includes('yandex.');
	
	for (const pattern of blockedList) {
		const patternLower = pattern.toLowerCase();
		
		// Always check full URL first for any pattern
		if (urlLower.includes(patternLower)) {
			saveBlockEvent(url, pattern, getCategoryFromItem(pattern));
			return true;
		}
		
		// Additional checks for Light mode
		if (!isHeavyMode && isSearchEngine) {
			// Get search query
			const searchQuery = urlObj.searchParams.get('q') || 
							  urlObj.searchParams.get('p') || 
							  urlObj.searchParams.get('text') || '';
			
			if (searchQuery) {
				const decodedQuery = decodeURIComponent(searchQuery)
					.toLowerCase()
					.replace(/\+/g, ' ');
				
				// Check for exact word matches in search query
				if (decodedQuery.split(/[\s,]+/).includes(patternLower)) {
					saveBlockEvent(url, pattern, getCategoryFromItem(pattern));
					return true;
				}
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
				const pattern = results[0].result.keyword;
				chrome.tabs.get(tabId, (tab) => {
					saveBlockEvent(tab.url, pattern, getCategoryFromItem(pattern));
					chrome.tabs.remove(tabId);
				});
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
			if (isBlocked(changeInfo.url, blockedList, isHeavyMode)) {
				chrome.tabs.remove(tabId);
			} else if (isHeavyMode) {
				checkPageContent(tabId, blockedList);
			}
		});
	}
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
	chrome.storage.sync.get(['blockedList', 'blockingMode'], (result) => {
		const blockedList = result.blockedList || [];
		const isHeavyMode = result.blockingMode === 'heavy';
		if (isBlocked(details.url, blockedList, isHeavyMode)) {
			chrome.tabs.remove(details.tabId);
		}
	});
});
