document.addEventListener('DOMContentLoaded', async () => {
    // Step A: Parse URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    // Step B: Retrieve books
    const response = await fetch('http://localhost:8081/api/books');
    const data = await response.json();
    const books = data.map(dbBook => ({
        ...dbBook,
        summary: dbBook.summaryText,
        author: 'Unknown Author'
    }));

    // Step C: Find book
    const book = books.find(b => b.id == bookId);

    // Step D: Inject or Redirect
    if (book) {
        document.getElementById('book-title').innerText = book.title;
        document.getElementById('book-author').innerText = book.author || 'Unknown Author';
        document.getElementById('book-category').innerText = book.category;
        
        const summaryBox = document.getElementById('book-summary');
        summaryBox.innerText = book.summary || '';
        
        document.title = `${book.title} - BookMinds`;

        // Save Button Logic
        const saveBtn = document.getElementById('btn-save-summary');

        summaryBox.addEventListener('input', () => {
            saveBtn.classList.remove('hidden');
        });

        saveBtn.addEventListener('click', async () => {
            book.summary = summaryBox.innerText;
            
            await fetch('http://localhost:8081/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: book.id,
                    title: book.title,
                    category: book.category,
                    isFavorite: book.isFavorite,
                    summaryText: book.summary
                })
            });
            
            // Feedback
            saveBtn.innerText = "Saved!";
            setTimeout(() => {
                saveBtn.innerText = "Save Changes";
                saveBtn.classList.add('hidden');
            }, 2000);
        });
    } else {
        alert('Book not found');
        window.location.href = 'index.html';
    }
});