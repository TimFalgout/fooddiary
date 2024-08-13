document.addEventListener('DOMContentLoaded', function() {
    const journalForm = document.getElementById('journal-form');
    const inputBG = document.getElementById('inputBG');
    const inputFood = document.getElementById('inputFood');
    const entryList = document.getElementById('entry-list');
    const avgMorning = document.getElementById('average-bg-level-p-morning');
    const avgEvening = document.getElementById('average-bg-level-p-evening');
    const printButton = document.getElementById('printButton');
    const inputDate = document.getElementById('inputDate');
    const amCheckbox = document.getElementById('amCheckbox');
    const pmCheckbox = document.getElementById('pmCheckbox');

    // Ensure only one of AM or PM can be selected
    amCheckbox.addEventListener('change', function() {
        if (amCheckbox.checked) {
            pmCheckbox.checked = false;
        }
    });

    pmCheckbox.addEventListener('change', function() {
        if (pmCheckbox.checked) {
            amCheckbox.checked = false;
        }
    });

    // Load entries from local storage and display them
    loadEntries();
    updateAverages();

    journalForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const bgLevel = inputBG.value;
        const foodEntry = inputFood.value;
        const dateValue = inputDate.value;
        const isAM = amCheckbox.checked;
        const isPM = pmCheckbox.checked;
        
        if (foodEntry.trim() !== '' && dateValue !== '') {
            saveEntry(bgLevel, foodEntry, dateValue, isAM, isPM);
            inputBG.value = '';
            inputFood.value = '';
            inputDate.value = '';
            amCheckbox.checked = false;
            pmCheckbox.checked = false;
            loadEntries();
            updateAverages();
        }
    });

    function saveEntry(bgLevel, foodEntry, dateValue, isAM, isPM) {
        const entries = getEntries();
        entries.push({
            bgLevel: bgLevel,
            foodEntry: foodEntry,
            date: formatDate(dateValue, isAM, isPM)
        });
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }

    function getEntries() {
        const entries = localStorage.getItem('journalEntries');
        return entries ? JSON.parse(entries) : [];
    }

    function loadEntries() {
        const entries = getEntries();
        entryList.innerHTML = '';
        entries.forEach((entry, index) => {
            const entryItem = document.createElement('li');
            entryItem.classList.add('list-group-item');
            entryItem.innerHTML = `<div class="row">
                <div class="col col-lg-2 col-md-3 col-3 date-and-time">
                    <p>${entry.date}</p>
                </div>
                <div class="col col-lg-1 col-md-1 col-1 bg-level">
                    <p>${entry.bgLevel ? entry.bgLevel : ''}</p>
                </div>
                <div class="col food-entries">
                    <p>${entry.foodEntry}</p>
                </div>
            </div>`;
            entryList.appendChild(entryItem);
        });
    }

    function updateAverages() {
        const entries = getEntries();
        let morningSum = 0;
        let morningCount = 0;
        let eveningSum = 0;
        let eveningCount = 0;

        entries.forEach(entry => {
            if (entry.bgLevel) {
                const time = new Date(entry.date).getHours();
                if (time < 12) {
                    morningSum += parseInt(entry.bgLevel);
                    morningCount++;
                } else {
                    eveningSum += parseInt(entry.bgLevel);
                    eveningCount++;
                }
            }
        });

        const avgMorningValue = morningCount > 0 ? (morningSum / morningCount).toFixed(2) : 'N/A';
        const avgEveningValue = eveningCount > 0 ? (eveningSum / eveningCount).toFixed(2) : 'N/A';

        avgMorning.textContent = avgMorningValue;
        avgEvening.textContent = avgEveningValue;
    }

    function formatDate(dateValue, isAM, isPM) {
        const date = new Date(dateValue);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        if (isAM) {
            date.setHours(9); // Set to 9 AM
        } else if (isPM) {
            date.setHours(19); // Set to 7 PM
        } else {
            date.setHours(12); // Default to noon if neither AM nor PM is checked
        }
        return date.toLocaleDateString('en-US', options);
    }

    printButton.addEventListener('click', function() {
        const entries = getEntries();
        const printContent = document.createElement('div');
        const printWindow = window.open('', '', 'height=600,width=800');

        const printHeader = document.createElement('h3');
        printHeader.textContent = 'Previous Entries:';
        printContent.appendChild(printHeader);

        const printTable = document.createElement('table');
        printTable.classList.add('table', 'table-bordered');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Date and Time</th>
                <th>Blood Glucose Level</th>
                <th>Food Entry</th>
            </tr>
        `;
        printTable.appendChild(thead);

        const tbody = document.createElement('tbody');

        entries.slice(-90).forEach(entry => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.bgLevel ? entry.bgLevel : ''}</td>
                <td>${entry.foodEntry}</td>
            `;
            tbody.appendChild(tr);
        });

        printTable.appendChild(tbody);
        printContent.appendChild(printTable);

        const avgSection = document.createElement('div');
        avgSection.innerHTML = `
            <h4>Average Blood Glucose Level:</h4>
            <p>Morning: ${avgMorning.textContent}</p>
            <p>Evening: ${avgEvening.textContent}</p>
        `;
        printContent.appendChild(avgSection);

        printWindow.document.write(printContent.innerHTML);
        printWindow.document.close();
        printWindow.print();
    });
});