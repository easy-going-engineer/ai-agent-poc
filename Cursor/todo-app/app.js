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

    const addTaskToDOM = (task) => {
        const li = document.createElement('li'); // タスクリスト
        li.textContent = `${task.id}. ${task.text}`;
        li.dataset.id = task.id; // 一意の識別子を持たせる
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
                const tasks = getTasksFromDOM();
                const taskIndex = tasks.findIndex(t => t.id === task.id); // IDを使用して削除
                tasks.splice(taskIndex, 1);
                saveTasks(tasks);
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
                id: parseInt(li.dataset.id, 10), // IDを取得
                text: li.firstChild.textContent.replace(/^\d+\.\s/, ''), // 番号を除去
                completed: li.classList.contains('completed')
            });
        });
        return tasks;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task, index) => {
            task.id = index + 1; // IDを1から始まる連番に再割り振り
            addTaskToDOM(task);
        });
        saveTasks(tasks); // 再割り振り後のタスクを保存
    };

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskId = tasks.length + 1; // 新しいタスクのIDを設定
            const task = { id: taskId, text: taskText, completed: false };
            tasks.push(task);
            addTaskToDOM(task);
            saveTasks(tasks);
            taskInput.value = '';
        }
    });

    loadTasks();
    renderTasks(); // 初期ロード時に番号を割り振る
});