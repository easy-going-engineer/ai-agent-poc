// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Initialize tasks array
let tasks = [];

// --- Local Storage Functions ---
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    } else {
        tasks = [];
    }
}

// --- Task Manipulation Functions ---
function addTask(taskText) {
    if (taskText.trim() === '') {
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function handleEdit(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newText = prompt('タスクを編集:', task.text);
    if (newText !== null && newText.trim() !== '') {
        updateTask(taskId, newText.trim());
    } else if (newText !== null && newText.trim() === '') {
        alert('タスク名は空にできません。');
    }
}

function updateTask(taskId, newText) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.text = newText;
        saveTasks();
        renderTasks();
    }
}

/**
 * Deletes a specific task after confirmation.
 * @param {number} taskId - The ID of the task to delete.
 */
function deleteTask(taskId) {
    if (confirm('このタスクを削除してもよろしいですか？')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        console.log('Task deleted. ID:', taskId);
    }
}

// --- Rendering Functions ---
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="list-group-item text-muted text-center">タスクはありません。</li>';
        return;
    }

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = `list-group-item d-flex justify-content-between align-items-center task-item ${task.completed ? 'completed' : ''}`;
        listItem.dataset.id = task.id;

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.style.cursor = 'pointer';
        taskTextSpan.addEventListener('click', () => toggleTaskCompletion(task.id));

        const buttonsDiv = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-sm btn-warning me-2 edit-btn';
        editButton.textContent = '編集';
        editButton.dataset.id = task.id;
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleEdit(task.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-danger delete-btn';
        deleteButton.textContent = '削除';
        deleteButton.dataset.id = task.id;
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id); // Call deleteTask
        });

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        listItem.appendChild(taskTextSpan);
        listItem.appendChild(buttonsDiv);
        taskList.appendChild(listItem);
    });
}

// --- Event Listeners ---
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value;
    addTask(taskText);
    renderTasks();
    taskInput.value = '';
});

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const taskText = taskInput.value;
        addTask(taskText);
        renderTasks();
        taskInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});
