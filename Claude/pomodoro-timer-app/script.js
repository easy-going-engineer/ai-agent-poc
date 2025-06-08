class PomodoroTimer {
    constructor() {
        this.isRunning = false;
        this.currentSession = 1;
        this.sessionType = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.timeLeft = 25 * 60; // seconds
        this.timer = null;
        
        // Settings
        this.workDuration = 25;
        this.shortBreakDuration = 5;
        this.longBreakDuration = 15;
        this.sessionsUntilLongBreak = 4;
        this.autoStartBreaks = true;
        this.autoStartPomodoros = true;
        
        // Stats
        this.completedSessions = 0;
        this.totalFocusTime = 0;
        this.currentStreak = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.loadStats();
        this.updateDisplay();
        this.updateProgress();
    }

    initializeElements() {
        // Timer elements
        this.timeDisplay = document.getElementById('time-display');
        this.sessionTypeDisplay = document.getElementById('session-type');
        this.sessionCountDisplay = document.getElementById('session-count');
        this.progressCircle = document.getElementById('progress-circle');
        
        // Control buttons
        this.startPauseBtn = document.getElementById('start-pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.skipBtn = document.getElementById('skip-btn');
        
        // Settings
        this.workDurationInput = document.getElementById('work-duration');
        this.shortBreakDurationInput = document.getElementById('short-break-duration');
        this.longBreakDurationInput = document.getElementById('long-break-duration');
        this.sessionsUntilLongBreakInput = document.getElementById('sessions-until-long-break');
        this.autoStartBreaksInput = document.getElementById('auto-start-breaks');
        this.autoStartPomodorosInput = document.getElementById('auto-start-pomodoros');
        
        // Stats
        this.completedSessionsDisplay = document.getElementById('completed-sessions');
        this.totalFocusTimeDisplay = document.getElementById('total-focus-time');
        this.currentStreakDisplay = document.getElementById('current-streak');
    }

    bindEvents() {
        this.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.skipBtn.addEventListener('click', () => this.skipSession());
        
        // Settings events
        this.workDurationInput.addEventListener('change', () => this.updateSettings());
        this.shortBreakDurationInput.addEventListener('change', () => this.updateSettings());
        this.longBreakDurationInput.addEventListener('change', () => this.updateSettings());
        this.sessionsUntilLongBreakInput.addEventListener('change', () => this.updateSettings());
        this.autoStartBreaksInput.addEventListener('change', () => this.updateSettings());
        this.autoStartPomodorosInput.addEventListener('change', () => this.updateSettings());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleTimer();
            }
            if (e.code === 'KeyR' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.resetTimer();
            }
            if (e.code === 'KeyS' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.skipSession();
            }
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startPauseBtn.textContent = '一時停止';
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgress();
            
            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startPauseBtn.textContent = '開始';
        clearInterval(this.timer);
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.getCurrentSessionDuration() * 60;
        this.updateDisplay();
        this.updateProgress();
    }

    skipSession() {
        this.pauseTimer();
        this.completeSession();
    }

    completeSession() {
        this.pauseTimer();
        
        // Update stats
        if (this.sessionType === 'work') {
            this.completedSessions++;
            this.totalFocusTime += this.workDuration;
            this.currentStreak++;
            this.currentSession++;
        }
        
        // Play notification sound (if needed)
        this.playNotification();
        
        // Determine next session type
        this.determineNextSession();
        
        // Auto-start next session if enabled
        if (this.shouldAutoStart()) {
            setTimeout(() => {
                this.startTimer();
            }, 1000);
        }
        
        // Update displays
        this.updateDisplay();
        this.updateProgress();
        this.updateStats();
        this.saveStats();
        
        // Add celebration animation
        document.body.classList.add('celebrating');
        setTimeout(() => {
            document.body.classList.remove('celebrating');
        }, 500);
    }

    determineNextSession() {
        if (this.sessionType === 'work') {
            if (this.currentSession % this.sessionsUntilLongBreak === 0) {
                this.sessionType = 'longBreak';
            } else {
                this.sessionType = 'shortBreak';
            }
        } else {
            this.sessionType = 'work';
        }
        
        this.timeLeft = this.getCurrentSessionDuration() * 60;
        this.updateTimerClass();
    }

    shouldAutoStart() {
        if (this.sessionType === 'work') {
            return this.autoStartPomodoros;
        } else {
            return this.autoStartBreaks;
        }
    }

    getCurrentSessionDuration() {
        switch (this.sessionType) {
            case 'work':
                return this.workDuration;
            case 'shortBreak':
                return this.shortBreakDuration;
            case 'longBreak':
                return this.longBreakDuration;
            default:
                return this.workDuration;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update session type display
        const sessionTypeText = {
            'work': '作業時間',
            'shortBreak': '短い休憩',
            'longBreak': '長い休憩'
        };
        this.sessionTypeDisplay.textContent = sessionTypeText[this.sessionType];
        this.sessionCountDisplay.textContent = `セッション: ${this.currentSession}`;
        
        // Update document title
        document.title = `${this.timeDisplay.textContent} - ${sessionTypeText[this.sessionType]} - Pomodoro Timer`;
    }

    updateProgress() {
        const totalDuration = this.getCurrentSessionDuration() * 60;
        const progress = (totalDuration - this.timeLeft) / totalDuration;
        const circumference = 2 * Math.PI * 140; // radius = 140
        const offset = circumference * (1 - progress);
        
        this.progressCircle.style.strokeDashoffset = offset;
    }

    updateTimerClass() {
        document.body.className = `timer-${this.sessionType}`;
    }

    updateSettings() {
        this.workDuration = parseInt(this.workDurationInput.value);
        this.shortBreakDuration = parseInt(this.shortBreakDurationInput.value);
        this.longBreakDuration = parseInt(this.longBreakDurationInput.value);
        this.sessionsUntilLongBreak = parseInt(this.sessionsUntilLongBreakInput.value);
        this.autoStartBreaks = this.autoStartBreaksInput.checked;
        this.autoStartPomodoros = this.autoStartPomodorosInput.checked;
        
        // Reset timer if not running
        if (!this.isRunning) {
            this.timeLeft = this.getCurrentSessionDuration() * 60;
            this.updateDisplay();
            this.updateProgress();
        }
        
        this.saveSettings();
    }

    updateStats() {
        this.completedSessionsDisplay.textContent = this.completedSessions;
        this.totalFocusTimeDisplay.textContent = this.totalFocusTime;
        this.currentStreakDisplay.textContent = this.currentStreak;
    }

    playNotification() {
        // Create audio context for notification sound
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
        
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const sessionTypeText = {
                'work': '作業時間',
                'shortBreak': '短い休憩',
                'longBreak': '長い休憩'
            };
            
            new Notification('Pomodoro Timer', {
                body: `${sessionTypeText[this.sessionType]}が完了しました！`,
                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9zdmc+'
            });
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    saveSettings() {
        const settings = {
            workDuration: this.workDuration,
            shortBreakDuration: this.shortBreakDuration,
            longBreakDuration: this.longBreakDuration,
            sessionsUntilLongBreak: this.sessionsUntilLongBreak,
            autoStartBreaks: this.autoStartBreaks,
            autoStartPomodoros: this.autoStartPomodoros
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.workDuration = settings.workDuration || 25;
            this.shortBreakDuration = settings.shortBreakDuration || 5;
            this.longBreakDuration = settings.longBreakDuration || 15;
            this.sessionsUntilLongBreak = settings.sessionsUntilLongBreak || 4;
            this.autoStartBreaks = settings.autoStartBreaks !== undefined ? settings.autoStartBreaks : true;
            this.autoStartPomodoros = settings.autoStartPomodoros !== undefined ? settings.autoStartPomodoros : true;
            
            // Update input values
            this.workDurationInput.value = this.workDuration;
            this.shortBreakDurationInput.value = this.shortBreakDuration;
            this.longBreakDurationInput.value = this.longBreakDuration;
            this.sessionsUntilLongBreakInput.value = this.sessionsUntilLongBreak;
            this.autoStartBreaksInput.checked = this.autoStartBreaks;
            this.autoStartPomodorosInput.checked = this.autoStartPomodoros;
            
            this.timeLeft = this.getCurrentSessionDuration() * 60;
        }
    }

    saveStats() {
        const stats = {
            completedSessions: this.completedSessions,
            totalFocusTime: this.totalFocusTime,
            currentStreak: this.currentStreak,
            lastSaveDate: new Date().toDateString()
        };
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }

    loadStats() {
        const saved = localStorage.getItem('pomodoroStats');
        if (saved) {
            const stats = JSON.parse(saved);
            const today = new Date().toDateString();
            
            // Reset streak if it's a new day
            if (stats.lastSaveDate !== today) {
                this.currentStreak = 0;
            } else {
                this.completedSessions = stats.completedSessions || 0;
                this.totalFocusTime = stats.totalFocusTime || 0;
                this.currentStreak = stats.currentStreak || 0;
            }
        }
        this.updateStats();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const pomodoroTimer = new PomodoroTimer();
    
    // Request notification permission
    pomodoroTimer.requestNotificationPermission();
    
    // Add keyboard shortcut info to the page
    const shortcutInfo = document.createElement('div');
    shortcutInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    shortcutInfo.innerHTML = `
        <div>ショートカット:</div>
        <div>スペース: 開始/停止</div>
        <div>R: リセット</div>
        <div>S: スキップ</div>
    `;
    document.body.appendChild(shortcutInfo);
    
    // Show shortcuts on hover
    let shortcutTimeout;
    document.addEventListener('mousemove', () => {
        shortcutInfo.style.opacity = '1';
        clearTimeout(shortcutTimeout);
        shortcutTimeout = setTimeout(() => {
            shortcutInfo.style.opacity = '0';
        }, 3000);
    });
});