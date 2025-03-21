document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput'); // 入力欄
    const addTaskButton = document.getElementById('addTaskButton'); // 入力欄
    const taskList = document.getElementById('taskList'); // タスクリスト

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTaskToDOM = (task, index) => {
        const li = document.createElement('li'); // タスクリスト
        li.textContent = `${index + 1}. ${task.text}`;
        if (task.completed) {
            li.classList.add('completed');
        }

        const completeButton = document.createElement('button'); // タスクリスト
        completeButton.textContent = '完了';
        completeButton.addEventListener('click', () => {
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveTasks(getTasksFromDOM());
        });

        const deleteButton = document.createElement('button'); // タスクリスト
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            if (confirm('本当に削除しますか？')) { // ポップアップウィンドウ
                li.remove(); // 選択した行のみを削除
                saveTasks(getTasksFromDOM());
                renderTasks(); // タスクの番号を再割り振り
            }
        });

        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    };

    const getTasksFromDOM = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.firstChild.textContent.replace(/^\d+\.\s/, ''), // 番号を除去
                completed: li.classList.contains('completed')
            });
        });
        return tasks;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = getTasksFromDOM();
        tasks.forEach((task, index) => addTaskToDOM(task, index));
    };

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, completed: false };
            addTaskToDOM(task, taskList.children.length);
            saveTasks(getTasksFromDOM());
            taskInput.value = '';
        }
    });

    loadTasks();
    renderTasks(); // 初期ロード時に番号を割り振る
});