document.addEventListener('DOMContentLoaded', function() {
    const journalForm = document.getElementById('journal-form');
    const inputBG = document.getElementById('inputBG');
    const inputFood = document.getElementById('inputFood');
    const entryList = document.getElementById('entry-list');

    // Load entries from local storage and display them
    loadEntries();

    journalForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const bgLevel = inputBG.value;
        const foodEntry = inputFood.value;
        if (bgLevel.trim() !== '' && foodEntry.trim() !== '') {
            saveEntry(bgLevel, foodEntry);
            inputBG.value = '';
            inputFood.value = '';
            loadEntries();
        }
    });

    function saveEntry(bgLevel, foodEntry) {
        const entries = getEntries();
        entries.push({
            bgLevel: bgLevel,
            foodEntry: foodEntry,
            date: new Date().toLocaleString()
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
            const li = document.createElement('li');
            li.textContent = `${entry.date} | ${entry.bgLevel} | ${entry.foodEntry} |`;
            entryList.appendChild(li);
        });
    }
});