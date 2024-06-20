let totalHearts = 17;
    let usedHearts = 0;
    let addedHearts = 0;
    let previousValues = new Map();

    document.addEventListener('DOMContentLoaded', () => {
        updateHearts();
    });

    function updateHearts() {
        totalHearts = parseInt(document.getElementById('initial-hearts').value);
        updateRemainingHearts();
    }

    function updateRemainingHearts() {
        const remainingHearts = totalHearts - usedHearts + addedHearts;
        document.getElementById('remaining-hearts').textContent = '❤️'.repeat(remainingHearts);
    }
    

    function addTask() {
        const table = document.getElementById('tasks-table');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="time"></td>
            <td><input type="number" min="1" max="${totalHearts}" oninput="updateHeartsDisplay(this)"></td>
            <td><input type="checkbox" onchange="moveTaskToSpent(this)"></td>
            <td><input type="text"></td>
            <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
        `;
    }
    

    function moveTaskToSpent(checkbox) {
        const row = checkbox.parentElement.parentElement;
        const cells = row.querySelectorAll('td input');
        const heartsCost = parseInt(cells[2].value) || 0;
    
        if (checkbox.checked) {
            usedHearts += heartsCost;
        } else {
            usedHearts -= heartsCost;
        }
    
        updateRemainingHearts();
    }
    

    function addHeartUsed() {
        const table = document.getElementById('hearts-used-table');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="number" min="1" max="${totalHearts}" oninput="updateUsedHearts(this)"></td>
            <td><input type="text"></td>
            <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
        `;
    }
    

    function addSelfCare() {
        const table = document.getElementById('self-care-table');
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text"></td>
            <td><input type="number" min="1" max="${totalHearts}" oninput="updateAddedHearts(this)"></td>
            <td><input type="text"></td>
            <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
        `;
    }
    
    function adjustHearts(value, action) {
        const num = parseInt(value);
        if (isNaN(num)) {
            console.error('Invalid input value');
            return;
        }
        if (action === 'use') {
            totalHearts -= num;
        } else if (action === 'add') {
            totalHearts += num;
        } else {
            console.error('Invalid action');
        }
        // Update the display of total hearts
    }

    function updateHeartsDisplay(input) {
        const hearts = '❤️'.repeat(input.value);
        let heartsDisplay = input.parentElement.querySelector('span');
        if (!heartsDisplay) {
            heartsDisplay = document.createElement('span');
            input.parentElement.appendChild(heartsDisplay);
        }
        heartsDisplay.innerHTML = hearts;
    }
    
    function updateUsedHearts(input) {
        const previousHearts = parseInt(input.getAttribute('data-previous')) || 0;
        const hearts = parseInt(input.value) || 0;
        usedHearts = usedHearts - previousHearts + hearts;
        input.setAttribute('data-previous', hearts);
        updateRemainingHearts();
    
        let heartsDisplay = input.parentElement.querySelector('span');
        if (!heartsDisplay) {
            heartsDisplay = document.createElement('span');
            input.parentElement.appendChild(heartsDisplay);
        }
        heartsDisplay.innerHTML = '❤️'.repeat(hearts);
    }
    
    function updateAddedHearts(input) {
        const previousHearts = parseInt(input.getAttribute('data-previous')) || 0;
        const hearts = parseInt(input.value) || 0;
        addedHearts = addedHearts - previousHearts + hearts;
        input.setAttribute('data-previous', hearts);
        updateRemainingHearts();
    
        let heartsDisplay = input.parentElement.querySelector('span');
        if (!heartsDisplay) {
            heartsDisplay = document.createElement('span');
            input.parentElement.appendChild(heartsDisplay);
        }
        heartsDisplay.innerHTML = '❤️'.repeat(hearts);
    }
    
    

    function removeRow(button) {
        const row = button.parentElement.parentElement;
        const heartsInput = row.querySelector('td input[type="number"]');
        const hearts = parseInt(heartsInput.value) || 0;
        const table = row.closest('table');

        if (table.id === 'tasks-table') {
            const checkbox = row.querySelector('td input[type="checkbox"]');
            if (checkbox.checked) {
                usedHearts -= hearts;
            }
        } else if (table.id === 'hearts-used-table') {
            usedHearts -= hearts;
        } else if (table.id === 'self-care-table') {
            addedHearts -= hearts;
        }

        row.remove();
        updateRemainingHearts();
    }
    
    

    function updateHearts() {
        totalHearts = parseInt(document.getElementById('initial-hearts').value);
        document.getElementById('total-hearts').textContent = '❤️'.repeat(totalHearts);
        updateRemainingHearts();
    }
    
   
    
    function saveData() {
        const date = document.getElementById('date').value;
        const initialHearts = document.getElementById('initial-hearts').value;
        const remainingHearts = document.getElementById('remaining-hearts').textContent.length;
        const energyLevels = document.getElementById('energy-levels').value;
        const adjustments = document.getElementById('adjustments').value;

        let tasks = [];
        document.querySelectorAll('#tasks-table tr').forEach((row, index) => {
            if (index === 0) return; // Skip header row
            const cells = row.querySelectorAll('td input');
            tasks.push({
                description: cells[0].value,
                time: cells[1].value,
                cost: cells[2].value,
                completed: cells[3].checked,
                notes: cells[4].value
            });
        });
        let heartsUsed = [];
        document.querySelectorAll('#hearts-used-table tr').forEach((row, index) => {
            if (index === 0) return; // Skip header row
            const cells = row.querySelectorAll('td input');
            heartsUsed.push({
                description: cells[0].value,
                hearts: cells[1].value,
                notes: cells[2].value
            });
        });

        let selfCare = [];
        document.querySelectorAll('#self-care-table tr').forEach((row, index) => {
            if (index === 0) return; // Skip header row
            const cells = row.querySelectorAll('td');
            selfCare.push({
                description: cells[0].textContent,
                heartsAdded: cells[1].textContent,
                notes: cells[2].textContent
            });
        });

        const data = {
            date: date,
            initialHearts: initialHearts,
            remainingHearts: remainingHearts,
            energyLevels: energyLevels,
            adjustments: adjustments,
            tasks: tasks,
            heartsUsed: heartsUsed,
            selfCare: selfCare
        };

        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'heart_tracker_data.json';
        a.click();
    }

    function loadData(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            // Populate the fields with the loaded data
            document.getElementById('date').value = data.date;
            document.getElementById('initial-hearts').value = data.initialHearts;
            document.getElementById('energy-levels').value = data.energyLevels;
            document.getElementById('adjustments').value = data.adjustments;
            // Populate the tasks
            const tasksTable = document.getElementById('tasks-table');
            data.tasks.forEach(task => {
                const row = tasksTable.insertRow();
                row.innerHTML = `
                    <td><input type="text" value="${task.description}"></td>
                    <td><input type="time" value="${task.time}"></td>
                    <td><input type="number" min="1" max="${totalHearts}" oninput="updateHeartsDisplay(this)" value="${task.cost}"></td>
                    <td><input type="checkbox" onchange="moveTaskToSpent(this)" ${task.completed ? 'checked' : ''}></td>
                    <td><input type="text" value="${task.notes}"></td>
                    <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
                `;
                if (task.completed) {
                    moveTaskToSpent(row.querySelector('td input[type="checkbox"]'));
                }
            });
            // Populate the hearts used
            const heartsUsedTable = document.getElementById('hearts-used-table');
            data.heartsUsed.forEach(heartUsed => {
                const row = heartsUsedTable.insertRow();
                row.innerHTML = `
                    <td><input type="text" value="${heartUsed.description}"></td>
                    <td><input type="number" min="1" max="${totalHearts}" oninput="updateHeartsDisplay(this)" value="${heartUsed.cost}"></td>
                    <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
                `;
            });
            // Populate the self-care
            const selfCareTable = document.getElementById('self-care-table');
            data.selfCare.forEach(selfCare => {
                const row = selfCareTable.insertRow();
                row.innerHTML = `
                    <td><input type="text" value="${selfCare.description}"></td>
                    <td><input type="number" min="1" max="${totalHearts}" oninput="updateHeartsDisplay(this)" value="${selfCare.cost}"></td>
                    <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
                `;
            });
            // Finally, update the hearts
            updateHearts();
        };
        reader.readAsText(file);
    }
    function updateUI() {
        // Assuming tasks, heartsUsed, and selfCare are arrays and their respective elements are displayed in tables
        const tasksTable = document.getElementById('tasks-table');
        const heartsUsedTable = document.getElementById('hearts-used-table');
        const selfCareTable = document.getElementById('self-care-table');

        // Clear existing rows
        while (tasksTable.rows.length > 1) tasksTable.deleteRow(1);
        while (heartsUsedTable.rows.length > 1) heartsUsedTable.deleteRow(1);
        while (selfCareTable.rows.length > 1) selfCareTable.deleteRow(1);

        // Add new rows
        tasks.forEach(task => addTaskRow(task, tasksTable));
        heartsUsed.forEach(heartUsed => addHeartUsedRow(heartUsed, heartsUsedTable));
        selfCare.forEach(selfCareItem => addSelfCareRow(selfCareItem, selfCareTable));
    }

    function addTaskRow(task, table) {
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${task.description || ''}"></td>
            <td><input type="time" value="${task.time || ''}"></td>
            <td><input type="text" min="1" max="${totalHearts}" value="${task.cost || 0}" oninput="updateHeartsDisplay(this)"></td>
            <td><input type="checkbox" ${task.completed ? 'checked' : ''} onchange="moveTaskToSpent(this)"></td>
            <td><input type="text" value="${task.notes || ''}"></td>
            <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
        `;
    }

    function addHeartUsedRow(heartUsed, table) {
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${heartUsed.description || ''}"></td>
            <td><input type="text" min="1" max="${totalHearts}" value="${heartUsed.hearts || 0}" oninput="updateHeartsDisplay(this)"></td>
            <td><input type="text" value="${heartUsed.notes || ''}"></td>
            <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
        `;
    }

    function addSelfCareRow(selfCareItem, table) {
        const row = table.insertRow();
        row.innerHTML = `
            <td><input type="text" value="${selfCareItem.description || ''}"></td>
            <td><input type="number" min="1" max="${totalHearts}" value="${selfCareItem.hearts || 0}" oninput="updateHeartsDisplay(this)"></td>
            <td><input type="text" value="${selfCareItem.notes || ''}"></td>
            <td><button class="remove-btn" onclick="removeRow(this)">Remove</button></td>
        `;
    }