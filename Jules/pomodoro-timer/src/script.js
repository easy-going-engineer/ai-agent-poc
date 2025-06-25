document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const pomodoroModeBtn = document.getElementById('pomodoro-mode-btn');
    const shortBreakModeBtn = document.getElementById('short-break-mode-btn');
    const longBreakModeBtn = document.getElementById('long-break-mode-btn');

    const pomodoroDurationInput = document.getElementById('pomodoro-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    const bgColorPicker = document.getElementById('bg-color-picker');
    const bgImageUrlInput = document.getElementById('bg-image-url');
    const applyAppearanceBtn = document.getElementById('apply-appearance-btn');

    const historyList = document.getElementById('history-list');

    // Timer State
    let timerInterval;
    let currentTimeInSeconds;
    let currentMode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
    let isTimerRunning = false;

    // Default Durations (in minutes)
    let durations = {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
    };

    const APP_STORAGE_KEY = 'pomodoroApp';

    // --- Timer Logic ---
    function updateDisplay() {
        const minutes = Math.floor(currentTimeInSeconds / 60);
        const seconds = currentTimeInSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (isTimerRunning) return;
        isTimerRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        timerInterval = setInterval(() => {
            currentTimeInSeconds--;
            updateDisplay();
            if (currentTimeInSeconds <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                addHistoryEntry(currentMode, durations[currentMode]);
                // For now, just reset to current mode's default
                resetTimer();
                alert(`${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} session finished!`);
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isTimerRunning) return;
        isTimerRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        pauseTimer(); // Stop any active timer
        currentTimeInSeconds = durations[currentMode] * 60;
        updateDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    // --- Mode Selection ---
    function setMode(mode) {
        currentMode = mode;
        resetTimer(); // Reset timer to new mode's duration

        // Update active button
        [pomodoroModeBtn, shortBreakModeBtn, longBreakModeBtn].forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
    }

    // --- Settings Management ---
    function loadSettings() {
        const storedAppData = JSON.parse(localStorage.getItem(APP_STORAGE_KEY));
        if (storedAppData && storedAppData.settings) {
            durations = { ...durations, ...storedAppData.settings };
        }
        pomodoroDurationInput.value = durations.pomodoro;
        shortBreakDurationInput.value = durations.shortBreak;
        longBreakDurationInput.value = durations.longBreak;
        resetTimer(); // Apply loaded/default durations to the timer
    }

    function saveSettings() {
        const newPomodoroDuration = parseInt(pomodoroDurationInput.value, 10);
        const newShortBreakDuration = parseInt(shortBreakDurationInput.value, 10);
        const newLongBreakDuration = parseInt(longBreakDurationInput.value, 10);

        if (isNaN(newPomodoroDuration) || newPomodoroDuration <= 0 ||
            isNaN(newShortBreakDuration) || newShortBreakDuration <= 0 ||
            isNaN(newLongBreakDuration) || newLongBreakDuration <= 0) {
            alert("Please enter valid positive numbers for durations.");
            return;
        }

        durations.pomodoro = newPomodoroDuration;
        durations.shortBreak = newShortBreakDuration;
        durations.longBreak = newLongBreakDuration;

        const storedAppData = JSON.parse(localStorage.getItem(APP_STORAGE_KEY)) || {};
        storedAppData.settings = durations;
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(storedAppData));

        alert("Settings saved!");
        // If current mode's duration changed, reset timer
        resetTimer();
    }

    // --- History Tracking ---
    let historyEntries = [];

    function loadHistory() {
        const storedAppData = JSON.parse(localStorage.getItem(APP_STORAGE_KEY));
        if (storedAppData && storedAppData.history) {
            historyEntries = storedAppData.history;
        }
        renderHistory();
    }

    function addHistoryEntry(type, duration) {
        const now = new Date();
        const entry = {
            type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
            duration: duration,
            date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
        };
        historyEntries.unshift(entry); // Add to the beginning of the array
        if (historyEntries.length > 20) { // Keep only last 20 entries
            historyEntries.pop();
        }

        const storedAppData = JSON.parse(localStorage.getItem(APP_STORAGE_KEY)) || {};
        storedAppData.history = historyEntries;
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(storedAppData));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = ''; // Clear existing list
        if (historyEntries.length === 0) {
            historyList.innerHTML = '<li class="list-group-item text-center">No history yet.</li>';
            return;
        }
        historyEntries.forEach(entry => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = `${entry.type} - ${entry.duration} min`;
            const dateSpan = document.createElement('span');
            dateSpan.className = 'badge bg-secondary rounded-pill';
            dateSpan.textContent = entry.date;
            li.appendChild(dateSpan);
            historyList.appendChild(li);
        });
    }

    // --- Appearance Customization ---
    let appearanceSettings = {
        bgColor: '#f4f4f4',
        bgImageUrl: ''
    };

    function loadAppearance() {
        const storedAppData = JSON.parse(localStorage.getItem(APP_STORAGE_KEY));
        if (storedAppData && storedAppData.appearance) {
            appearanceSettings = { ...appearanceSettings, ...storedAppData.appearance };
        }
        applyAppearanceSettings(); // Apply loaded or default settings
        bgColorPicker.value = appearanceSettings.bgColor;
        bgImageUrlInput.value = appearanceSettings.bgImageUrl;
    }

    function applyAppearanceSettings() {
        document.body.style.backgroundColor = appearanceSettings.bgColor;
        if (appearanceSettings.bgImageUrl) {
            document.body.style.backgroundImage = `url('${appearanceSettings.bgImageUrl}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundPosition = 'center';
        } else {
            document.body.style.backgroundImage = 'none';
        }
    }

    function saveAndApplyAppearance() {
        appearanceSettings.bgColor = bgColorPicker.value;
        appearanceSettings.bgImageUrl = bgImageUrlInput.value.trim();

        applyAppearanceSettings();

        const storedAppData = JSON.parse(localStorage.getItem(APP_STORAGE_KEY)) || {};
        storedAppData.appearance = appearanceSettings;
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(storedAppData));
        alert("Appearance settings applied!");
    }

    // --- Initialization ---
    function init() {
        loadSettings(); // Also calls resetTimer internally
        loadHistory();
        loadAppearance();

        setMode('pomodoro'); // Set initial mode and update display

        // Event Listeners
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);

        pomodoroModeBtn.addEventListener('click', () => setMode('pomodoro'));
        shortBreakModeBtn.addEventListener('click', () => setMode('shortBreak'));
        longBreakModeBtn.addEventListener('click', () => setMode('longBreak'));

        saveSettingsBtn.addEventListener('click', saveSettings);
        applyAppearanceBtn.addEventListener('click', saveAndApplyAppearance);

        // Initial button states
        pauseBtn.disabled = true;
    }

    init();
});
