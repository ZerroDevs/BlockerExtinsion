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
	// Stats elements
	const statsButton = document.getElementById('statsButton');
	const statsTab = document.getElementById('statsTab');
	const timeButtons = document.querySelectorAll('.time-btn');
	const totalBlocksCount = document.getElementById('totalBlocksCount');
	const topCategory = document.getElementById('topCategory');
	const categoryPercent = document.getElementById('categoryPercent');
	const topBlockedSites = document.getElementById('topBlockedSites');
	const blockingPattern = document.getElementById('blockingPattern');

	// Track active tab
	let previousTab = 'blockTab';
	let isStatsOpen = false;

	// Add stats button handler
	statsButton.addEventListener('click', () => {
		isStatsOpen = !isStatsOpen;
		
		if (isStatsOpen) {
			// Store current active tab before switching to stats
			const activeTab = document.querySelector('.tab-btn.active');
			if (activeTab) {
				previousTab = activeTab.dataset.tab + 'Tab';
			}

			// Hide all tabs
			document.querySelectorAll('.tab-content').forEach(tab => {
				tab.classList.add('hidden');
			});
			// Remove active class from all tab buttons
			document.querySelectorAll('.tab-btn').forEach(btn => {
				btn.classList.remove('active');
			});
			// Show stats tab
			statsTab.classList.remove('hidden');
			// Toggle stats icon
			document.querySelector('.stats-default').classList.add('hidden');
			document.querySelector('.stats-active').classList.remove('hidden');
			statsButton.classList.add('active');
			// Load stats
			loadStats('day');
		} else {
			// Hide stats tab
			statsTab.classList.add('hidden');
			// Show previous tab
			document.getElementById(previousTab).classList.remove('hidden');
			// Update tab button state
			const previousTabBtn = document.querySelector(`[data-tab="${previousTab.replace('Tab', '')}"]`);
			if (previousTabBtn) {
				previousTabBtn.classList.add('active');
			}
			// Reset stats icon
			document.querySelector('.stats-default').classList.remove('hidden');
			document.querySelector('.stats-active').classList.add('hidden');
			statsButton.classList.remove('active');
		}
	});

	// Handle time period buttons
	timeButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			timeButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			loadStats(btn.dataset.period);
		});
	});

	// Load and display stats
	function loadStats(period = 'day') {
		chrome.storage.local.get(['blockStats'], (result) => {
			const stats = result.blockStats || {
				totalBlocks: 0,
				dailyStats: {},
				topSites: {},
				categoryStats: {}
			};

			// Update total blocks
			totalBlocksCount.textContent = stats.totalBlocks;

			// Get top category
			const categories = Object.entries(stats.categoryStats)
				.sort(([,a], [,b]) => b - a);
			
			if (categories.length > 0) {
				const [topCat, topCount] = categories[0];
				topCategory.textContent = topCat;
				const percentage = ((topCount / stats.totalBlocks) * 100).toFixed(1);
				categoryPercent.textContent = `${percentage}% of total blocks`;
			}

			// Update top sites list
			const topSites = Object.entries(stats.topSites)
				.sort(([,a], [,b]) => b - a)
				.slice(0, 5);
			
			topBlockedSites.innerHTML = topSites.map(([site, count]) => `
				<div class="site-item">
					<span class="site-name">${site}</span>
					<span class="site-count">${count}</span>
				</div>
			`).join('');

			// Update blocking pattern based on period
			updateBlockingPattern(stats.dailyStats, period);
		});
	}

	// Handle time period buttons
	timeButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			timeButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			loadStats(btn.dataset.period);
		});
	});

	// Load initial stats
	loadStats('day');

	// Get DOM elements
	const blockingMode = document.getElementById('blockingMode');
	const modeText = document.getElementById('modeText');
	const themeToggle = document.getElementById('themeToggle');
	const lightModeDesc = document.querySelector('.mode-description.light-mode');
	const heavyModeDesc = document.querySelector('.mode-description.heavy-mode');

	// Load blocking mode
	chrome.storage.sync.get(['blockingMode'], (result) => {
		const isHeavy = result.blockingMode === 'heavy';
		blockingMode.checked = isHeavy;
		modeText.textContent = isHeavy ? 'Heavy' : 'Light';
		lightModeDesc.classList.toggle('hidden', isHeavy);
		heavyModeDesc.classList.toggle('hidden', !isHeavy);
	});

	// Handle blocking mode toggle
	blockingMode.addEventListener('change', (e) => {
		const isHeavy = e.target.checked;
		const mode = isHeavy ? 'heavy' : 'light';
		chrome.storage.sync.set({ blockingMode: mode });
		modeText.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
		lightModeDesc.classList.toggle('hidden', isHeavy);
		heavyModeDesc.classList.toggle('hidden', !isHeavy);
	});

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
			if (isStatsOpen) {
				isStatsOpen = false;
				statsButton.classList.remove('active');
				document.querySelector('.stats-default').classList.remove('hidden');
				document.querySelector('.stats-active').classList.add('hidden');
			}

			const tabName = button.dataset.tab;
			tabButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
			
			// Hide stats tab
			statsTab.classList.add('hidden');
			
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

	// Custom Preset Management
	const createPresetBtn = document.getElementById('createPresetBtn');
	const customPresetModal = document.getElementById('customPresetModal');
	const customPresetForm = document.getElementById('customPresetForm');
	const cancelCustomPreset = document.getElementById('cancelCustomPreset');
	const keywordInput = document.getElementById('keywordInput');
	const urlInput = document.getElementById('urlInput');
	const addKeyword = document.getElementById('addKeyword');
	const addUrl = document.getElementById('addUrl');
	const keywordsList = document.getElementById('keywordsList');
	const urlsList = document.getElementById('urlsList');
	const customPresetsContainer = document.querySelector('.custom-presets-container');

	let customKeywords = [];
	let customUrls = [];

	// Show custom preset modal
	createPresetBtn.addEventListener('click', () => {
		customPresetModal.classList.add('show');
		resetCustomPresetForm();
	});

	// Hide custom preset modal
	cancelCustomPreset.addEventListener('click', () => {
		customPresetModal.classList.remove('show');
		resetCustomPresetForm();
	});

	// Add keyword
	addKeyword.addEventListener('click', () => {
		const keyword = keywordInput.value.trim();
		if (keyword && !customKeywords.includes(keyword)) {
			customKeywords.push(keyword);
			renderRuleItem(keyword, keywordsList, 'keyword');
			keywordInput.value = '';
		}
	});

	// Add URL validation function
	function isValidUrlOrDomain(value) {
		// URL pattern that checks for http/https or valid domain format
		const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
		return urlPattern.test(value);
	}

	// Add URL input handler
	urlInput.addEventListener('input', (e) => {
		const value = e.target.value.trim();
		if (isValidUrlOrDomain(value)) {
			urlInput.style.borderColor = 'var(--success-color)';
			addUrl.disabled = false;
		} else {
			urlInput.style.borderColor = 'var(--danger-color)';
			addUrl.disabled = true;
		}
	});

	// Modify URL add button handler
	addUrl.addEventListener('click', () => {
		const url = urlInput.value.trim();
		if (url && isValidUrlOrDomain(url) && !customUrls.includes(url)) {
			customUrls.push(url);
			renderRuleItem(url, urlsList, 'url');
			urlInput.value = '';
			urlInput.style.borderColor = 'var(--border-color)';
			addUrl.disabled = true;
		}
	});

	// Add error message display
	urlInput.addEventListener('focus', () => {
		if (!urlInput.nextElementSibling?.classList.contains('input-error')) {
			const errorMsg = document.createElement('div');
			errorMsg.className = 'input-error';
			errorMsg.textContent = 'Please enter a valid URL or domain (e.g., example.com, https://example.com)';
			urlInput.parentElement.appendChild(errorMsg);
		}
	});

	urlInput.addEventListener('blur', () => {
		const errorMsg = urlInput.parentElement.querySelector('.input-error');
		if (errorMsg) {
			errorMsg.remove();
		}
		if (!urlInput.value.trim()) {
			urlInput.style.borderColor = 'var(--border-color)';
		}
	});

	// Handle form submission
	customPresetForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = document.getElementById('presetName').value;
		const description = document.getElementById('presetDescription').value;

		if (customKeywords.length === 0 && customUrls.length === 0) {
			alert('Please add at least one keyword or URL to the preset');
			return;
		}

		const newPreset = {
			id: Date.now().toString(),
			name,
			description,
			keywords: customKeywords,
			domains: customUrls,
			isCustom: true
		};

		saveCustomPreset(newPreset);
		customPresetModal.classList.remove('show');
		resetCustomPresetForm();
	});

	// Render rule item
	function renderRuleItem(value, container, type) {
		const item = document.createElement('div');
		item.className = 'rule-item';
		item.innerHTML = `
			<span>${value}</span>
			<button class="remove-rule" data-value="${value}" data-type="${type}">
				<svg viewBox="0 0 24 24" width="16" height="16">
					<path d="M6 6l12 12m-12 0l12-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		`;

		container.appendChild(item);

		// Add remove handler
		item.querySelector('.remove-rule').addEventListener('click', (e) => {
			const value = e.currentTarget.dataset.value;
			const type = e.currentTarget.dataset.type;
			if (type === 'keyword') {
				customKeywords = customKeywords.filter(k => k !== value);
			} else {
				customUrls = customUrls.filter(u => u !== value);
			}
			item.remove();
		});
	}

	// Save custom preset
	function saveCustomPreset(preset) {
		chrome.storage.sync.get(['customPresets'], (result) => {
			const customPresets = result.customPresets || [];
			customPresets.push(preset);
			chrome.storage.sync.set({ customPresets }, () => {
				renderCustomPresets();
			});
		});
	}

	// Render custom presets
	function renderCustomPresets() {
		chrome.storage.sync.get(['customPresets', 'blockedList'], (result) => {
			const customPresets = result.customPresets || [];
			const blockedList = result.blockedList || [];
			customPresetsContainer.innerHTML = '';

			customPresets.forEach(preset => {
				const isActive = preset.keywords.every(k => blockedList.includes(k)) &&
							   preset.domains.every(d => blockedList.includes(d));

				const presetElement = document.createElement('div');
				presetElement.className = 'custom-preset-item';
				presetElement.innerHTML = `
					<div class="custom-preset-header">
						<div class="custom-preset-info">
							<h3>${preset.name}</h3>
							<p>${preset.description}</p>
						</div>
						<div class="custom-preset-controls">
							<button class="edit-preset-btn" data-id="${preset.id}">
								<svg viewBox="0 0 24 24" width="20" height="20">
									<path d="M15 6l3 3L9 18H6v-3l9-9z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								</svg>
							</button>
							<button class="delete-preset-btn" data-id="${preset.id}">
								<svg viewBox="0 0 24 24" width="20" height="20">
									<path d="M6 6l12 12m-12 0l12-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
								</svg>
							</button>
							<label class="switch">
								<input type="checkbox" ${isActive ? 'checked' : ''} data-preset-id="${preset.id}">
								<span class="slider"></span>
							</label>
						</div>
					</div>
					<div class="custom-preset-rules">
						${preset.keywords.map(k => `<span class="rule-tag keyword">${k}</span>`).join('')}
						${preset.domains.map(d => `<span class="rule-tag url">${d}</span>`).join('')}
					</div>
				`;

				// Add event listeners
				const toggle = presetElement.querySelector('input[type="checkbox"]');
				toggle.addEventListener('change', (e) => {
					handleCustomPresetToggle(preset, e.target.checked);
				});

				const deleteBtn = presetElement.querySelector('.delete-preset-btn');
				deleteBtn.addEventListener('click', () => {
					if (confirm('Are you sure you want to delete this preset?')) {
						deleteCustomPreset(preset.id);
					}
				});

				const editBtn = presetElement.querySelector('.edit-preset-btn');
				editBtn.addEventListener('click', () => {
					editCustomPreset(preset);
				});

				customPresetsContainer.appendChild(presetElement);
			});
		});
	}

	// Handle custom preset toggle
	function handleCustomPresetToggle(preset, checked) {
		chrome.storage.sync.get(['blockedList'], (result) => {
			let blockedList = result.blockedList || [];
			
			if (checked) {
				// Add all keywords and domains from preset
				const newItems = [...preset.keywords, ...preset.domains]
					.filter(item => !blockedList.includes(item));
				blockedList = [...blockedList, ...newItems];
			} else {
				// Remove all keywords and domains from preset
				blockedList = blockedList.filter(item => 
					!preset.keywords.includes(item) && !preset.domains.includes(item)
				);
			}

			chrome.storage.sync.set({ blockedList }, () => {
				renderBlockedItems(blockedList);
			});
		});
	}

	// Delete custom preset
	function deleteCustomPreset(presetId) {
		chrome.storage.sync.get(['customPresets'], (result) => {
			const customPresets = result.customPresets.filter(p => p.id !== presetId);
			chrome.storage.sync.set({ customPresets }, () => {
				renderCustomPresets();
			});
		});
	}

	// Edit custom preset
	function editCustomPreset(preset) {
		// Populate form with preset data
		document.getElementById('presetName').value = preset.name;
		document.getElementById('presetDescription').value = preset.description;
		customKeywords = [...preset.keywords];
		customUrls = [...preset.domains];

		// Render existing rules
		keywordsList.innerHTML = '';
		urlsList.innerHTML = '';
		customKeywords.forEach(keyword => renderRuleItem(keyword, keywordsList, 'keyword'));
		customUrls.forEach(url => renderRuleItem(url, urlsList, 'url'));

		// Show modal
		customPresetModal.classList.add('show');

		// Update form submission to handle edit
		const originalSubmit = customPresetForm.onsubmit;
		customPresetForm.onsubmit = (e) => {
			e.preventDefault();
			const updatedPreset = {
				...preset,
				name: document.getElementById('presetName').value,
				description: document.getElementById('presetDescription').value,
				keywords: customKeywords,
				domains: customUrls
			};

			chrome.storage.sync.get(['customPresets'], (result) => {
				const customPresets = result.customPresets.map(p => 
					p.id === preset.id ? updatedPreset : p
				);
				chrome.storage.sync.set({ customPresets }, () => {
					renderCustomPresets();
					customPresetModal.classList.remove('show');
					resetCustomPresetForm();
				});
			});

			// Restore original submit handler
			customPresetForm.onsubmit = originalSubmit;
		};
	}

	// Reset custom preset form
	function resetCustomPresetForm() {
		customPresetForm.reset();
		customKeywords = [];
		customUrls = [];
		keywordsList.innerHTML = '';
		urlsList.innerHTML = '';
	}

	// Initial render of custom presets
	renderCustomPresets();
});

// Helper function for blocking pattern
function updateBlockingPattern(dailyStats, period) {
	const chartContainer = document.getElementById('blockingPattern');
	const dates = Object.keys(dailyStats).sort();
	
	if (dates.length === 0) {
		chartContainer.innerHTML = '<div class="no-data">No blocking data available</div>';
		return;
	}

	// Create simple bar chart
	const maxValue = Math.max(...Object.values(dailyStats));
	const bars = dates.map(date => {
		const height = (dailyStats[date] / maxValue) * 100;
		return `
			<div class="chart-bar" style="height: ${height}%" title="${date}: ${dailyStats[date]} blocks">
				<div class="bar-value">${dailyStats[date]}</div>
			</div>
		`;
	}).join('');

	chartContainer.innerHTML = `<div class="chart">${bars}</div>`;
}
