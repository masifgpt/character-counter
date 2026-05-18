/**
 * AnalyticsText - Core Application Script
 * Optimized Architecture with System Theme Sync, Persistence Management & Metric Parsers
 */

document.addEventListener('DOMContentLoaded', () => {
    // Application DOM Target Registry
    const textInput = document.getElementById('text-input');
    const textareaWrapper = textInput.parentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentDateDisplay = document.getElementById('current-date');
    const autosaveToggle = document.getElementById('autosave-toggle');
    
    // Metric Counter Targets
    const charCountElement = document.getElementById('char-count');
    const wordCountElement = document.getElementById('word-count');
    const sentenceCountElement = document.getElementById('sentence-count');
    const paragraphCountElement = document.getElementById('paragraph-count');
    const readingTimeElement = document.getElementById('reading-time');
    const spaceStatusElement = document.getElementById('space-status');

    // Action Operation Control Elements
    const btnUppercase = document.getElementById('btn-uppercase');
    const btnLowercase = document.getElementById('btn-lowercase');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');

    // Storage Context Key Definition tokens
    const STORAGE_TEXT_KEY = 'analytics_text_payload';
    const STORAGE_THEME_KEY = 'analytics_theme_pref';
    const STORAGE_AUTOSAVE_KEY = 'analytics_autosave_pref';

    /* ==========================================================================
       1. INITIALIZATION & CORE HYDRATION ENGINE
       ========================================================================== */
    function initializeApp() {
        renderCurrentSystemDate();
        hydrateUserPreferences();
        executeTextAnalysis(textInput.value);
    }

    // Displays the current date dynamically inside the header UI panel
    function renderCurrentSystemDate() {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Restoration processing layer for local themes, toggles, and workspace save states
    function hydrateUserPreferences() {
        // Hydrate UI Theme preference config
        const persistentTheme = localStorage.getItem(STORAGE_THEME_KEY);
        if (persistentTheme) {
            document.documentElement.setAttribute('data-theme', persistentTheme);
            updateThemeToggleButtonIcon(persistentTheme);
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const currentMode = systemPrefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentMode);
            updateThemeToggleButtonIcon(currentMode);
        }

        // Hydrate configurations for auto-save processing toggle switch
        const persistentAutosavePref = localStorage.getItem(STORAGE_AUTOSAVE_KEY);
        if (persistentAutosavePref !== null) {
            autosaveToggle.checked = persistentAutosavePref === 'true';
        }

        // Restore textual data if the auto-save parameter tracking mechanism is enabled
        if (autosaveToggle.checked) {
            const cachedWorkspaceString = localStorage.getItem(STORAGE_TEXT_KEY);
            if (cachedWorkspaceString) {
                textInput.value = cachedWorkspaceString;
            }
        }
    }

    /* ==========================================================================
       2. ANALYTICS & COMPUTATION PROCESSING ENGINES
       ========================================================================== */
    function executeTextAnalysis(rawTextString) {
        // Evaluation constraints tracking management structures
        const totalCharacters = rawTextString.length;
        const totalCharsNoSpaces = rawTextString.replace(/\s/g, '').length;
        const spacesExcludedCount = totalCharacters - totalCharsNoSpaces;

        // Structured parsing calculations for localized text components
        const localizedNormalizedText = rawTextString.trim();
        
        // Exact processing algorithms using Regular Expressions
        const totalWords = localizedNormalizedText === '' ? 0 : localizedNormalizedText.split(/\s+/).length;
        
        const totalSentences = rawTextString === '' ? 0 : (rawTextString.match(/[.!?]+(\s|$)/g) || []).length;
        
        const totalParagraphs = rawTextString === '' ? 0 : rawTextString.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        // Estimated configuration calculations for tracking reading runtime metrics (Standard: ~200 WPM)
        const computedReadingRuntime = Math.ceil(totalWords / 200);

        // Dispatches computed context data directly into UI layouts
        updateDOMMetricCounters({
            characters: totalCharacters,
            words: totalWords,
            sentences: totalSentences,
            paragraphs: totalParagraphs,
            readingTime: computedReadingRuntime,
            spacesExcluded: spacesExcludedCount
        });

        // Toggle visibility state classes depending on standard data checks
        if (totalCharacters > 0) {
            textareaWrapper.classList.add('has-content');
        } else {
            textareaWrapper.classList.remove('has-content');
        }

        // Commit logic processing loops targeting local state storage blocks
        if (autosaveToggle.checked) {
            localStorage.setItem(STORAGE_TEXT_KEY, rawTextString);
        }
    }

    function updateDOMMetricCounters(metricsDataPayload) {
        charCountElement.textContent = metricsDataPayload.characters;
        wordCountElement.textContent = metricsDataPayload.words;
        sentenceCountElement.textContent = metricsDataPayload.sentences;
        paragraphCountElement.textContent = metricsDataPayload.paragraphs;
        readingTimeElement.textContent = `${metricsDataPayload.readingTime} min`;
        spaceStatusElement.textContent = `${metricsDataPayload.spacesExcluded} spaces excluded`;
    }

    /* ==========================================================================
       3. TEXT TRANSFORMATION & TOOLBAR MANIPULATION HANDLERS
       ========================================================================== */
    btnUppercase.addEventListener('click', () => {
        if (textInput.value.length === 0) return flashNotificationHint('No text found');
        textInput.value = textInput.value.toUpperCase();
        executeTextAnalysis(textInput.value);
    });

    btnLowercase.addEventListener('click', () => {
        if (textInput.value.length === 0) return flashNotificationHint('No text found');
        textInput.value = textInput.value.toLowerCase();
        executeTextAnalysis(textInput.value);
    });

    btnClear.addEventListener('click', () => {
        if (textInput.value.length === 0) return;
        
        // Triggers a smooth layout fading clear execution transition
        textInput.style.opacity = '0';
        setTimeout(() => {
            textInput.value = '';
            executeTextAnalysis('');
            if (autosaveToggle.checked) {
                localStorage.removeItem(STORAGE_TEXT_KEY);
            }
            textInput.style.opacity = '1';
        }, 150);
    });

    btnCopy.addEventListener('click', async () => {
        const textToCapture = textInput.value;
        if (textToCapture.length === 0) {
            return flashNotificationHint('Workspace is empty');
        }

        try {
            await navigator.clipboard.writeText(textToCapture);
            flashNotificationHint('Copied to Clipboard!', true);
        } catch (error) {
            flashNotificationHint('Failed to copy text.');
        }
    });

    // Custom non-intrusive micro-feedback tracking notification layout generator
    function flashNotificationHint(messageText, isSuccessEvent = false) {
        const originalButtonLabel = btnCopy.innerHTML;
        
        if (isSuccessEvent) {
            btnCopy.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
            btnCopy.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                btnCopy.innerHTML = originalButtonLabel;
                btnCopy.style.background = '';
            }, 2000);
        } else {
            alert(messageText); // Clean fallback for custom message handling alerts
        }
    }

    /* ==========================================================================
       4. GLOBAL EVENT REGISTRATION LIFECYCLES
       ========================================================================== */
    
    // Real-time user text input capture engine
    textInput.addEventListener('input', (event) => {
        executeTextAnalysis(event.target.value);
    });

    // Auto-save toggle interface component changes
    autosaveToggle.addEventListener('change', (event) => {
        const isCheckedState = event.target.checked;
        localStorage.setItem(STORAGE_AUTOSAVE_KEY, isCheckedState);
        
        if (isCheckedState) {
            localStorage.setItem(STORAGE_TEXT_KEY, textInput.value);
        } else {
            localStorage.removeItem(STORAGE_TEXT_KEY);
        }
    });

    // Light / Dark interface structural state change execution
    themeToggleBtn.addEventListener('click', () => {
        const currentActiveTheme = document.documentElement.getAttribute('data-theme');
        const targetThemeMode = currentActiveTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', targetThemeMode);
        localStorage.setItem(STORAGE_THEME_KEY, targetThemeMode);
        updateThemeToggleButtonIcon(targetThemeMode);
    });

    function updateThemeToggleButtonIcon(themeMode) {
        const structuralIconElement = themeToggleBtn.querySelector('i');
        if (themeMode === 'dark') {
            structuralIconElement.className = 'fa-solid fa-sun';
        } else {
            structuralIconElement.className = 'fa-solid fa-moon';
        }
    }

    // Initialize configuration build on runtime trigger
    initializeApp();
});