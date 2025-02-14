const languages = {
	en: {
		// General
		title: "Site Blocker",
		blockTab: "Block",
		manageTab: "Manage",
		presetsTab: "Presets",
		settingsTab: "Settings",
		statsTab: "Statistics",

		// Blocking Mode
		blockingMode: "Blocking Mode:",
		lightMode: "Light",
		heavyMode: "Heavy",
		lightModeTitle: "🔍 Light Mode",
		heavyModeTitle: "🛡️ Heavy Mode",
		lightModeDesc: "Blocks based on URLs and search terms only. Less intensive but faster.",
		heavyModeDesc: "Full protection with content scanning. More thorough but may be slower.",

		// Settings
		languageSettings: "Language Settings",
		selectLanguage: "Select Language",
		english: "English",
		arabic: "Arabic",
		saveSettings: "Save Settings",
		settingsSaved: "Settings Saved!",

		// Display Settings
		displaySettings: "Display Settings",
		highContrastMode: "High Contrast Mode:",
		highContrastDesc: "Enhances visibility with stronger contrast",

		// Other existing text...
		addBlockPlaceholder: "Enter URL or keyword",
		totalBlocked: "Total Blocked",
		blockedItems: "Blocked Items",

		// Presets
		blockingPresets: "Blocking Presets",
		createPreset: "Create Preset",
		defaultPresets: "Default Presets",
		adultContentTitle: "Adult Content Blocker",
		adultContentDesc: "Blocks adult content, explicit material, and related websites",
		socialMediaTitle: "Social Media Blocker",
		socialMediaDesc: "Blocks popular social media platforms and time-wasting sites",
		gamingTitle: "Gaming Sites Blocker",
		gamingDesc: "Blocks gaming websites and online game platforms",
		gamblingTitle: "Gambling Blocker",
		gamblingDesc: "Blocks gambling, betting, and casino websites",

		// Light/Heavy Mode Features
		checksWebsiteUrls: "✓ Checks website URLs",
		checksSearchQueries: "✓ Checks search queries",
		noPageScanning: "✗ No page content scanning",
		includesLightMode: "✓ Everything in Light mode",
		scansPageContent: "✓ Scans page content",
		checksEmbeddedLinks: "✓ Checks embedded links",

		// Custom Preset Modal
		createCustomPreset: "Create Custom Preset",
		presetName: "Preset Name",
		presetDescription: "Description",
		enterPresetName: "Enter preset name",
		enterPresetDesc: "Enter preset description",
		blockRules: "Block Rules",
		keywords: "Keywords",
		enterKeyword: "Enter keyword",
		urlsDomains: "URLs/Domains",
		enterUrl: "Enter URL or domain",
		addBtn: "Add",
		createPresetBtn: "Create Preset",
		cancelBtn: "Cancel",
		urlValidationMsg: "Please enter a valid URL or domain (e.g., example.com, https://example.com)",
		atLeastOneRequired: "Please add at least one keyword or URL",

		// Lock functionality
		lock: "Lock",
		unlock: "Unlock",
		passwordProtected: "🔒 Password Protected",
		setPasswordProtection: "Set Password Protection",
		enterPassword: "Enter password",
		confirmPassword: "Confirm password",
		lockPreset: "Lock Preset",
		incorrectPassword: "Incorrect password",
		passwordMinLength: "Password must be at least 4 characters long",
		passwordsNotMatch: "Passwords do not match",

		// Statistics
		statsHeader: "Blocking Statistics",
		totalBlocksTitle: "Total Blocks",
		mostBlockedCategory: "Most Blocked Category",
		percentOfTotal: "% of total blocks",
		mostBlockedSites: "Most Blocked Sites",
		blockingPattern: "Blocking Pattern",
		timeFilterDay: "Day",
		timeFilterWeek: "Week",
		timeFilterMonth: "Month",
		noDataAvailable: "No blocking data available",
		trendFromLast: "↑ 12% from last period"
	},
	ar: {
		// General
		title: "حاجب المواقع",
		blockTab: "حظر",
		manageTab: "إدارة",
		presetsTab: "القوالب",
		settingsTab: "الإعدادات",
		statsTab: "الإحصائيات",

		// Blocking Mode
		blockingMode: "وضع الحظر:",
		lightMode: "خفيف",
		heavyMode: "شامل",
		lightModeTitle: "🔍 الوضع الخفيف",
		heavyModeTitle: "🛡️ الوضع الشامل",
		lightModeDesc: "يحظر على أساس عناوين URL وعبارات البحث فقط. أقل كثافة ولكن أسرع.",
		heavyModeDesc: "حماية كاملة مع فحص المحتوى. أكثر شمولاً ولكن قد يكون أبطأ.",

		// Settings
		languageSettings: "إعدادات اللغة",
		selectLanguage: "اختر اللغة",
		english: "الإنجليزية",
		arabic: "العربية",
		saveSettings: "حفظ الإعدادات",
		settingsSaved: "تم الحفظ!",

		// Display Settings
		displaySettings: "إعدادات العرض",
		highContrastMode: "وضع التباين العالي:",
		highContrastDesc: "يحسن الرؤية بتباين أقوى",

		// Other existing text...
		addBlockPlaceholder: "أدخل رابط أو كلمة مفتاحية",
		totalBlocked: "إجمالي المحظورات",
		blockedItems: "العناصر المحظورة",

		// Presets
		blockingPresets: "قوالب الحظر",
		createPreset: "إنشاء قالب",
		defaultPresets: "القوالب الافتراضية",
		adultContentTitle: "حاجب المحتوى للبالغين",
		adultContentDesc: "يحظر المحتوى للبالغين والمواد الصريحة والمواقع ذات الصلة",
		socialMediaTitle: "حاجب وسائل التواصل الاجتماعي",
		socialMediaDesc: "يحظر منصات التواصل الاجتماعي الشائعة ومواقع إضاعة الوقت",
		gamingTitle: "حاجب مواقع الألعاب",
		gamingDesc: "يحظر مواقع الألعاب ومنصات الألعاب عبر الإنترنت",
		gamblingTitle: "حاجب القمار",
		gamblingDesc: "يحظر مواقع القمار والمراهنات والكازينو",

		// Light/Heavy Mode Features
		checksWebsiteUrls: "✓ فحص روابط المواقع",
		checksSearchQueries: "✓ فحص عمليات البحث",
		noPageScanning: "✗ لا يوجد فحص لمحتوى الصفحة",
		includesLightMode: "✓ كل ميزات الوضع الخفيف",
		scansPageContent: "✓ فحص محتوى الصفحة",
		checksEmbeddedLinks: "✓ فحص الروابط المضمنة",

		// Custom Preset Modal
		createCustomPreset: "إنشاء قالب مخصص",
		presetName: "اسم القالب",
		presetDescription: "الوصف",
		enterPresetName: "أدخل اسم القالب",
		enterPresetDesc: "أدخل وصف القالب",
		blockRules: "قواعد الحظر",
		keywords: "الكلمات المفتاحية",
		enterKeyword: "أدخل كلمة مفتاحية",
		urlsDomains: "الروابط/النطاقات",
		enterUrl: "أدخل رابط أو نطاق",
		addBtn: "إضافة",
		createPresetBtn: "إنشاء القالب",
		cancelBtn: "إلغاء",
		urlValidationMsg: "الرجاء إدخال رابط أو نطاق صالح (مثال: example.com، https://example.com)",
		atLeastOneRequired: "الرجاء إضافة كلمة مفتاحية واحدة أو رابط واحد على الأقل",

		// Lock functionality
		lock: "قفل",
		unlock: "فتح",
		passwordProtected: "🔒 محمي بكلمة مرور",
		setPasswordProtection: "تعيين حماية كلمة المرور",
		enterPassword: "أدخل كلمة المرور",
		confirmPassword: "تأكيد كلمة المرور",
		lockPreset: "قفل القالب",
		incorrectPassword: "كلمة المرور غير صحيحة",
		passwordMinLength: "يجب أن تكون كلمة المرور 4 أحرف على الأقل",
		passwordsNotMatch: "كلمات المرور غير متطابقة",

		// Statistics
		statsHeader: "إحصائيات الحظر",
		totalBlocksTitle: "إجمالي عمليات الحظر",
		mostBlockedCategory: "الفئة الأكثر حظراً",
		percentOfTotal: "٪ من إجمالي الحظر",
		mostBlockedSites: "المواقع الأكثر حظراً",
		blockingPattern: "نمط الحظر",
		timeFilterDay: "يوم",
		timeFilterWeek: "أسبوع",
		timeFilterMonth: "شهر",
		noDataAvailable: "لا تتوفر بيانات حظر",
		trendFromLast: "↑ 12٪ من الفترة السابقة"
	}
};