// ==============================
// タスクリスト管理用の定数・関数
// ==============================

// タスクをローカルストレージから取得
function loadTasks() {
  const tasks = localStorage.getItem('cline-tasks');
  return tasks ? JSON.parse(tasks) : [];
}

// タスクをローカルストレージに保存
function saveTasks(tasks) {
  localStorage.setItem('cline-tasks', JSON.stringify(tasks));
}

// タスクの連番を振り直す
function renumberTasks(tasks) {
  return tasks.map((task, idx) => ({ ...task, number: idx + 1 }));
}

// ==============================
// UI要素の取得
// ==============================

const taskInput = document.getElementById('task-input'); // 入力欄
const addBtn = document.getElementById('add-btn');       // 追加ボタン
const taskList = document.getElementById('task-list');   // タスクリスト

// ==============================
// タスクの描画
// ==============================

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    // タスクリストの各行
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    // 番号
    const numSpan = document.createElement('span');
    numSpan.textContent = `${task.number}. `;
    li.appendChild(numSpan);

    // タスク名
    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    textSpan.style.flex = '1';
    textSpan.style.marginLeft = '8px';
    li.appendChild(textSpan);

    // 完了ボタン
    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? '未完了' : '完了';
    doneBtn.style.marginRight = '8px';
    doneBtn.onclick = () => toggleComplete(task.id);
    li.appendChild(doneBtn);

    // 編集ボタン
    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.style.marginRight = '8px';
    editBtn.onclick = () => startEditTask(task.id, task.text);
    li.appendChild(editBtn);

    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.className = 'delete-btn';
    delBtn.onclick = () => confirmDelete(task.id);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });
}

/*
==============================
 タスク編集機能
==============================
*/
let editingId = null;

function startEditTask(id, oldText) {
  // 既存の編集欄があれば終了
  if (editingId !== null) return;
  editingId = id;

  // 対象liを取得
  const li = [...taskList.children].find(li => li.dataset.id === id);
  if (!li) return;

  // テキスト部分をinputに置換
  const input = document.createElement('input');
  input.type = 'text';
  input.value = oldText;
  input.style.flex = '1';
  input.style.marginLeft = '8px';

  // 保存ボタン
  const saveBtn = document.createElement('button');
  saveBtn.textContent = '保存';
  saveBtn.style.marginRight = '8px';
  saveBtn.onclick = () => saveEditTask(id, input.value);

  // キャンセルボタン
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'キャンセル';
  cancelBtn.onclick = () => cancelEditTask();

  // liの内容を編集用に差し替え
  li.innerHTML = '';
  // 番号
  const numSpan = document.createElement('span');
  numSpan.textContent = `${[...taskList.children].findIndex(l => l.dataset.id === id) + 1}. `;
  li.appendChild(numSpan);
  li.appendChild(input);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);

  input.focus();
}

function saveEditTask(id, newText) {
  if (!newText.trim()) {
    cancelEditTask();
    return;
  }
  let tasks = loadTasks();
  tasks = tasks.map(task =>
    task.id === id ? { ...task, text: newText } : task
  );
  saveTasks(tasks);
  renderTasks(renumberTasks(tasks));
  editingId = null;
}

function cancelEditTask() {
  editingId = null;
  renderTasks(renumberTasks(loadTasks()));
}

// ==============================
// タスク追加処理
// ==============================

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  let tasks = loadTasks();
  const newTask = {
    id: crypto.randomUUID(), // 一意のID
    number: tasks.length + 1,
    text,
    completed: false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(renumberTasks(tasks));
  taskInput.value = '';
}

// ==============================
// タスク完了状態の切り替え
// ==============================

function toggleComplete(id) {
  let tasks = loadTasks();
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks(tasks);
  renderTasks(renumberTasks(tasks));
}

// ==============================
// タスク削除処理（確認ポップアップ付き）
// ==============================

function confirmDelete(id) {
  // ポップアップウィンドウ
  if (window.confirm('本当にこのタスクを削除しますか？')) {
    deleteTask(id);
  }
}

function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(task => task.id !== id);
  tasks = renumberTasks(tasks);
  saveTasks(tasks);
  renderTasks(tasks);
}

// ==============================
// イベントリスナー
// ==============================

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// ==============================
// 初期化
// ==============================

window.addEventListener('DOMContentLoaded', () => {
  const tasks = renumberTasks(loadTasks());
  saveTasks(tasks);
  renderTasks(tasks);
});
