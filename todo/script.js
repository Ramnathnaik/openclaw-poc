document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskText = input.value.trim();

        if (taskText === '') return;

        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        const actions = document.createElement('div');
        actions.classList.add('actions');

        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            listItem.classList.toggle('completed');
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            listItem.remove();
        });

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        listItem.appendChild(taskSpan);
        listItem.appendChild(actions);

        list.appendChild(listItem);

        input.value = '';
        input.focus();
    });
});
