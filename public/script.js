document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('entries-container');
    

    const fetchEntries = async () => {
        const response = await fetch('/api/entries');
        const entries = await response.json();
        entriesContainer.innerHTML = '';
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.innerHTML = `
                <p><strong>${entry.name}</strong> says:</p>
                <p>${entry.message}</p>
                <hr>
            `;
            entriesContainer.appendChild(entryDiv);
        });
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message }),
        });

        form.reset();
        fetchEntries();
    });

    fetchEntries();
});
