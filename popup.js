// Preset configurations
const presets = {
	adultContent: {
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
			'خلاعة', 'فاحشة', 'عهر', 'فيديو_سكس', 'سكسي'
		],
		domains: [
			'pornhub.com', 'xvideos.com', 'xhamster.com', 'redtube.com',
			'youporn.com', 'xnxx.com', 'brazzers.com', 'onlyfans.com',
			'livejasmin.com', 'stripchat.com', 'chaturbate.com',
			'cam4.com', 'myfreecams.com', 'adultfriendfinder.com'
		]
	},
	socialMedia: {
		name: 'social-media',
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
		name: 'gaming',
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
		name: 'gambling',
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

// Add preset toggle handlers
function handlePresetToggle(presetKey, checked) {
	chrome.storage.sync.get(['presetLocks', 'blockedList'], (result) => {
		const presetLocks = result.presetLocks || {};
		const presetLock = presetLocks[presetKey];
		
		if (presetLock?.locked) {
			// Show unlock modal if trying to disable a locked preset
			if (!checked) {
				currentPreset = presetKey;
				showModal('unlockModal');
			}
			// Revert the checkbox to its previous state
			document.getElementById(`${presetKey}Preset`).checked = true;
			return;
		}

		let blockedList = result.blockedList || [];
		const preset = presets[presetKey];
		
		if (checked) {
			const newItems = [...preset.keywords, ...preset.domains]
				.filter(item => !blockedList.includes(item));
			
			if (newItems.length > 0) {
				blockedList = [...blockedList, ...newItems];
				chrome.storage.sync.set({ blockedList }, () => {
					renderBlockedItems(blockedList);
				});
			}
		} else {
			blockedList = blockedList.filter(item => 
				!preset.keywords.includes(item) && 
				!preset.domains.includes(item)
			);
			chrome.storage.sync.set({ blockedList }, () => {
				renderBlockedItems(blockedList);
			});
		}
	});
}

// Password protection functions
let currentPreset = null;

function hashPassword(password) {
	return Array.from(password).reduce(
		(hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0
	).toString();
}

function showModal(modalId) {
	document.getElementById(modalId).classList.add('show');
}

function hideModal(modalId) {
	document.getElementById(modalId).classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
	// Get DOM elements
	const themeToggle = document.getElementById('themeToggle');
	const blockInput = document.getElementById('blockInput');
	const addBlock = document.getElementById('addBlock');
	const blockedItems = document.getElementById('blockedItems');
	const totalBlocked = document.getElementById('totalBlocked');
	const tabButtons = document.querySelectorAll('.tab-btn');
	const tabContents = document.querySelectorAll('.tab-content');
	
	// Password protection elements
	const lockButtons = document.querySelectorAll('.lock-btn');
	const setPasswordModal = document.getElementById('setPasswordModal');
	const unlockModal = document.getElementById('unlockModal');
	const newPassword = document.getElementById('newPassword');
	const confirmPassword = document.getElementById('confirmPassword');
	const unlockPassword = document.getElementById('unlockPassword');
	const savePassword = document.getElementById('savePassword');
	const cancelSetPassword = document.getElementById('cancelSetPassword');
	const submitUnlock = document.getElementById('submitUnlock');
	const cancelUnlock = document.getElementById('cancelUnlock');

	// Tab switching
	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const tabName = button.dataset.tab;
			tabButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
			
			tabContents.forEach(content => {
				content.classList.add('hidden');
				if (content.id === `${tabName}Tab`) {
					content.classList.remove('hidden');
				}
			});

			if (tabName === 'manage') {
				loadBlockedItems();
			}
		});
	});

	// Theme handling
	chrome.storage.sync.get(['theme'], (result) => {
		if (result.theme === 'dark') {
			document.body.classList.remove('light-theme');
			document.body.classList.add('dark-theme');
		}
	});

	themeToggle.addEventListener('click', () => {
		const isDark = document.body.classList.contains('dark-theme');
		document.body.classList.toggle('dark-theme');
		document.body.classList.toggle('light-theme');
		chrome.storage.sync.set({ theme: isDark ? 'light' : 'dark' });
	});

	// Lock button handlers
	lockButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const presetKey = btn.dataset.preset;
			currentPreset = presetKey;
			
			chrome.storage.sync.get(['presetLocks'], (result) => {
				const presetLocks = result.presetLocks || {};
				const presetLock = presetLocks[presetKey];
				
				if (presetLock?.locked) {
					showModal('unlockModal');
				} else {
					showModal('setPasswordModal');
				}
			});
		});
	});

	// Save password handler
	savePassword.addEventListener('click', () => {
		const password = newPassword.value;
		const confirm = confirmPassword.value;

		if (password.length < 4) {
			alert('Password must be at least 4 characters long');
			return;
		}

		if (password !== confirm) {
			alert('Passwords do not match');
			return;
		}

		const passwordHash = hashPassword(password);
		chrome.storage.sync.get(['presetLocks'], (result) => {
			const presetLocks = result.presetLocks || {};
			presetLocks[currentPreset] = {
				locked: true,
				passwordHash: passwordHash
			};
			
			chrome.storage.sync.set({ presetLocks }, () => {
				const presetElement = document.querySelector(`[data-preset="${currentPreset}"]`)
					.closest('.preset-item');
				presetElement.classList.add('locked');
				hideModal('setPasswordModal');
				newPassword.value = '';
				confirmPassword.value = '';
			});
		});
	});

	// Unlock handler
	submitUnlock.addEventListener('click', () => {
		const password = unlockPassword.value;
		
		chrome.storage.sync.get(['presetLocks'], (result) => {
			const presetLocks = result.presetLocks || {};
			const presetLock = presetLocks[currentPreset];
			
			if (hashPassword(password) === presetLock.passwordHash) {
				presetLocks[currentPreset] = {
					locked: false,
					passwordHash: null
				};
				
				chrome.storage.sync.set({ presetLocks }, () => {
					const presetElement = document.querySelector(`[data-preset="${currentPreset}"]`)
						.closest('.preset-item');
					presetElement.classList.remove('locked');
					hideModal('unlockModal');
					unlockPassword.value = '';
				});
			} else {
				alert('Incorrect password');
			}
		});
	});

	// Cancel buttons
	cancelSetPassword.addEventListener('click', () => {
		hideModal('setPasswordModal');
		newPassword.value = '';
		confirmPassword.value = '';
	});

	cancelUnlock.addEventListener('click', () => {
		hideModal('unlockModal');
		unlockPassword.value = '';
	});

	// Add blocked item
	addBlock.addEventListener('click', () => {
		const value = blockInput.value.trim();
		if (!value) return;

		chrome.storage.sync.get(['blockedList'], (result) => {
			const blockedList = result.blockedList || [];
			if (!blockedList.includes(value)) {
				blockedList.push(value);
				chrome.storage.sync.set({ blockedList }, () => {
					renderBlockedItems(blockedList);
					blockInput.value = '';
					const successMsg = document.createElement('div');
					successMsg.className = 'success-message';
					successMsg.textContent = 'Item added to block list';
					blockInput.parentElement.appendChild(successMsg);
					setTimeout(() => successMsg.remove(), 2000);
				});
			}
		});
	});

	// Handle enter key
	blockInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			addBlock.click();
		}
	});

	// Check if item is from locked preset
	async function isItemFromLockedPreset(item) {
		return new Promise((resolve) => {
			chrome.storage.sync.get(['presetLocks'], (result) => {
				const presetLocks = result.presetLocks || {};
				const isLocked = Object.entries(presets).some(([key, preset]) => {
					const isPresetItem = preset.keywords.includes(item) || preset.domains.includes(item);
					return isPresetItem && presetLocks[key]?.locked;
				});
				resolve(isLocked);
			});
		});
	}

	// Render blocked items
	async function renderBlockedItems(items) {
		blockedItems.innerHTML = '';
		totalBlocked.textContent = items.length;

		for (const item of items) {
			const itemElement = document.createElement('div');
			itemElement.className = 'blocked-item';
			
			const text = document.createElement('span');
			text.textContent = item;
			
			const isLocked = await isItemFromLockedPreset(item);
			if (isLocked) {
				itemElement.classList.add('locked-item');
			}

			const deleteBtn = document.createElement('button');
			deleteBtn.className = 'delete-btn';
			deleteBtn.innerHTML = `
				<svg viewBox="0 0 24 24" width="18" height="18">
					<path d="M6 6l12 12m-12 0l12-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			`;
			
			if (!isLocked) {
				deleteBtn.addEventListener('click', () => {
					chrome.storage.sync.get(['blockedList'], (result) => {
						const blockedList = result.blockedList.filter(i => i !== item);
						chrome.storage.sync.set({ blockedList }, () => {
							renderBlockedItems(blockedList);
						});
					});
				});
			}

			itemElement.appendChild(text);
			if (!isLocked) {
				itemElement.appendChild(deleteBtn);
			}
			blockedItems.appendChild(itemElement);
		}
	}

	// Load initial states
	function loadBlockedItems() {
		chrome.storage.sync.get(['blockedList', 'presetLocks'], (result) => {
			const blockedList = result.blockedList || [];
			const presetLocks = result.presetLocks || {};
			
			renderBlockedItems(blockedList);
			
			// Update preset toggles and lock states
			Object.entries(presets).forEach(([key, preset]) => {
				const hasAllPresetItems = preset.keywords.every(keyword => 
					blockedList.includes(keyword)
				) && preset.domains.every(domain => 
					blockedList.includes(domain)
				);
				
				const presetElement = document.querySelector(`[data-preset="${key}"]`)
					.closest('.preset-item');
				const checkbox = document.getElementById(`${key}Preset`);
				
				checkbox.checked = hasAllPresetItems;
				
				if (presetLocks[key]?.locked) {
					presetElement.classList.add('locked');
				}
			});
		});
	}

	// Initial load
	loadBlockedItems();

	// Add preset toggle handlers
	document.getElementById('adultContentPreset').addEventListener('change', (e) => {
		handlePresetToggle('adultContent', e.target.checked);
	});

	document.getElementById('socialMediaPreset').addEventListener('change', (e) => {
		handlePresetToggle('socialMedia', e.target.checked);
	});

	document.getElementById('gamingPreset').addEventListener('change', (e) => {
		handlePresetToggle('gaming', e.target.checked);
	});

	document.getElementById('gamblingPreset').addEventListener('change', (e) => {
		handlePresetToggle('gambling', e.target.checked);
	});
});
