class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // デフォルト25分
        this.isRunning = false;
        this.timerId = null;
        this.isWorkTime = true;
        this.history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
        
        // DOM要素
        this.timeDisplay = document.getElementById('time');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        this.backgroundColorInput = document.getElementById('backgroundColor');
        this.backgroundImageInput = document.getElementById('backgroundImage');
        this.historyList = document.getElementById('historyList');

        // イベントリスナーの設定
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.workTimeInput.addEventListener('change', () => this.updateTime());
        this.breakTimeInput.addEventListener('change', () => this.updateTime());
        this.backgroundColorInput.addEventListener('change', () => this.updateBackground());
        this.backgroundImageInput.addEventListener('change', () => this.updateBackground());

        // 初期設定の読み込み
        this.loadSettings();
        this.updateDisplay();
        this.renderHistory();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = this.isWorkTime ? 
            this.workTimeInput.value * 60 : 
            this.breakTimeInput.value * 60;
        this.updateDisplay();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.switchMode();
        }
    }

    switchMode() {
        this.isWorkTime = !this.isWorkTime;
        this.timeLeft = this.isWorkTime ? 
            this.workTimeInput.value * 60 : 
            this.breakTimeInput.value * 60;
        
        if (this.isWorkTime) {
            this.addToHistory();
        }
        
        this.updateDisplay();
        this.playNotification();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTime() {
        if (!this.isRunning) {
            this.timeLeft = this.isWorkTime ? 
                this.workTimeInput.value * 60 : 
                this.breakTimeInput.value * 60;
            this.updateDisplay();
        }
    }

    updateBackground() {
        const bgColor = this.backgroundColorInput.value;
        const bgImage = this.backgroundImageInput.value;
        
        document.body.style.backgroundColor = bgColor;
        if (bgImage) {
            document.body.style.backgroundImage = `url(${bgImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } else {
            document.body.style.backgroundImage = 'none';
        }

        // 設定を保存
        localStorage.setItem('pomodoroSettings', JSON.stringify({
            backgroundColor: bgColor,
            backgroundImage: bgImage
        }));
    }

    addToHistory() {
        const now = new Date();
        const historyItem = {
            date: now.toLocaleString(),
            duration: this.workTimeInput.value
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        localStorage.setItem('pomodoroHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>${item.date}</span>
                <span>${item.duration}分</span>
            `;
            this.historyList.appendChild(historyItem);
        });
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
        if (settings.backgroundColor) {
            this.backgroundColorInput.value = settings.backgroundColor;
        }
        if (settings.backgroundImage) {
            this.backgroundImageInput.value = settings.backgroundImage;
        }
        this.updateBackground();
    }

    playNotification() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
    }
}

// タイマーの初期化
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 