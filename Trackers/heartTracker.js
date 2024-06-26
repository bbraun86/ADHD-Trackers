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
        const data = {
            date: document.getElementById('date').value,
            initialHearts: document.getElementById('initial-hearts').value,
            totalHearts: document.getElementById('total-hearts').innerText,
            remainingHearts: document.getElementById('remaining-hearts').innerText,
            tasks: getTableData('tasks-table'),
            heartsUsed: getTableData('hearts-used-table'),
            selfCare: getTableData('self-care-table'),
            energyLevels: document.getElementById('energy-levels').value,
            adjustments: document.getElementById('adjustments').value
        };
    
        fetch('/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                alert(result.message);
            } else if (result.error) {
                alert(result.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    function loadData() {
        fetch('/getData')
        .then(response => response.json())
        .then(data => {
            document.getElementById('date').value = data.date;
            document.getElementById('initial-hearts').value = data.initialHearts;
            document.getElementById('total-hearts').innerText = data.totalHearts;
            document.getElementById('remaining-hearts').innerText = data.remainingHearts;
            setTableData('tasks-table', data.tasks);
            setTableData('hearts-used-table', data.heartsUsed);
            setTableData('self-care-table', data.selfCare);
            document.getElementById('energy-levels').value = data.energyLevels;
            document.getElementById('adjustments').value = data.adjustments;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    function getTableData(tableId) {
        const table = document.getElementById(tableId);
        const rows = table.getElementsByTagName('tr');
        const data = [];
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const rowData = [];
            for (let j = 0; j < cells.length - 1; j++) {
                rowData.push(cells[j].innerText);
            }
            data.push(rowData);
        }
        return data;
    }
    
    function setTableData(tableId, data) {
        const table = document.getElementById(tableId);
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        data.forEach(rowData => {
            const row = table.insertRow();
            rowData.forEach(cellData => {
                const cell = row.insertCell();
                cell.innerText = cellData;
            });
            const removeCell = row.insertCell();
            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.onclick = function() {
                table.deleteRow(row.rowIndex);
            };
            removeCell.appendChild(removeButton);
        });
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