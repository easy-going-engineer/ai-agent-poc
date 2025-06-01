// タイマー状態管理
let timer = null;
let isRunning = false;
let isWork = true;
let workMinutes = 25;
let breakMinutes = 5;
let remainingSeconds = workMinutes * 60;
let sessionStartTime = null;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  updateTimerDisplay();
  loadHistory();
  loadBgSetting();

  document.getElementById('start-btn').onclick = startTimer;
  document.getElementById('pause-btn').onclick = pauseTimer;
  document.getElementById('reset-btn').onclick = resetTimer;
  document.getElementById('settings-form').onsubmit = setSettings;
  document.getElementById('bg-select').onchange = changeBg;
  document.getElementById('stop-btn').onclick = stopSession;
});

function updateTimerDisplay() {
  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const sec = String(remainingSeconds % 60).padStart(2, '0');
  document.getElementById('timer-display').textContent = `${min}:${sec}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  if (!sessionStartTime) sessionStartTime = new Date();
  timer = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      addHistory(isWork ? '作業' : '休憩', sessionStartTime, new Date());
      sessionStartTime = null;
      isWork = !isWork;
      remainingSeconds = (isWork ? workMinutes : breakMinutes) * 60;
      updateTimerDisplay();
      // 自動で次のセッションを開始
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  if (timer) clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  if (timer) clearInterval(timer);
  isRunning = false;
  if (sessionStartTime) {
    addHistory(isWork ? '作業' : '休憩', sessionStartTime, new Date(), true);
    sessionStartTime = null;
  }
  isWork = true;
  remainingSeconds = workMinutes * 60;
  updateTimerDisplay();
}

function setSettings(e) {
  e.preventDefault();
  const work = parseInt(document.getElementById('work-minutes').value, 10);
  const brk = parseInt(document.getElementById('break-minutes').value, 10);
  if (work > 0 && brk > 0) {
    workMinutes = work;
    breakMinutes = brk;
    isWork = true;
    remainingSeconds = workMinutes * 60;
    saveSettings();
    updateTimerDisplay();
    resetTimer();
  }
}

function addHistory(type, startTime, endTime, isReset = false) {
  // startTime, endTime: Dateオブジェクト
  const entry = {
    type,
    start: startTime ? startTime.toLocaleString('ja-JP') : '',
    end: endTime ? endTime.toLocaleString('ja-JP') : '',
    isReset: !!isReset
  };
  let history = JSON.parse(localStorage.getItem('pomodoroHistory') || '[]');
  history.unshift(entry);
  if (history.length > 20) history = history.slice(0, 20);
  localStorage.setItem('pomodoroHistory', JSON.stringify(history));
  loadHistory();
}

// 終了ボタン処理
function stopSession() {
  if (timer) clearInterval(timer);
  isRunning = false;
  const label = isWork ? '作業途中終了' : '休憩途中終了';
  if (sessionStartTime) {
    addHistory(label, sessionStartTime, new Date());
    sessionStartTime = null;
  } else {
    // セッション未開始時は履歴追加しない
  }
  // タイマーをリセット（作業セッションに戻す）
  isWork = true;
  remainingSeconds = workMinutes * 60;
  updateTimerDisplay();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('pomodoroHistory') || '[]');
  const list = document.getElementById('history-list');
  list.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    let label = '';
    if (item.type.endsWith('途中終了')) {
      label = `${item.start}〜${item.end} - ${item.type}`;
    } else if (item.isReset) {
      label = `${item.start}〜${item.end} - ${item.type}リセット終了`;
    } else {
      label = `${item.start}〜${item.end} - ${item.type}完了`;
    }
    li.textContent = label;
    list.appendChild(li);
  });
}

function saveSettings() {
  localStorage.setItem('pomodoroSettings', JSON.stringify({
    workMinutes,
    breakMinutes
  }));
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('pomodoroSettings') || '{}');
  if (settings.workMinutes) {
    workMinutes = settings.workMinutes;
    document.getElementById('work-minutes').value = workMinutes;
  }
  if (settings.breakMinutes) {
    breakMinutes = settings.breakMinutes;
    document.getElementById('break-minutes').value = breakMinutes;
  }
  remainingSeconds = workMinutes * 60;
}

function changeBg() {
  const val = document.getElementById('bg-select').value;
  const body = document.getElementById('main-bg');
  body.className = '';
  body.style.backgroundImage = '';
  switch (val) {
    case 'light':
      body.classList.add('bg-light');
      break;
    case 'dark':
      body.classList.add('bg-dark', 'text-white');
      break;
    case 'blue':
      body.style.backgroundColor = '#007bff';
      body.style.color = '#fff';
      break;
    case 'image1':
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')";
      body.style.backgroundSize = 'cover';
      body.style.color = '#fff';
      break;
    case 'image2':
      body.style.backgroundImage = "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80')";
      body.style.backgroundSize = 'cover';
      body.style.color = '#fff';
      break;
  }
  localStorage.setItem('pomodoroBg', val);
}

function loadBgSetting() {
  const val = localStorage.getItem('pomodoroBg') || 'light';
  document.getElementById('bg-select').value = val;
  changeBg();
}
