// Global Variables
let books = [];

document.addEventListener('DOMContentLoaded', () => {
    loadLibrary();
});

async function loadLibrary() {
    try {
        const response = await fetch('http://localhost:8081/api/books');
        const data = await response.json();
        books = data.map(dbBook => ({
            ...dbBook,
            summary: dbBook.summaryText,
            author: 'Unknown Author',
            image: null
        }));
        renderLibrary();
    } catch (error) {
        console.error('Error loading library:', error);
    }
}

function renderLibrary() {
    const container = document.getElementById('library-container');
    if (!container) return;

    container.innerHTML = '';

    // 4. Empty State
    if (books.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:20px; font-size: 1.2rem; color: #666;">Library is empty. Go add some books!</p>';
        return;
    }

    // 2. Group Data
    const categories = {};
    books.forEach(book => {
        const cat = book.category || 'Uncategorized';
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push(book);
    });

    // 3. Render Logic
    for (const [category, categoryBooks] of Object.entries(categories)) {
        // 1. Create Section
        const section = document.createElement('div');
        section.className = 'category-section';

        // 2. Add Title
        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category;
        section.appendChild(title);

        // 3. Create Row Container
        const row = document.createElement('div');
        row.className = 'book-row';

        // 4. Loop Books
        categoryBooks.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';

            const imageHtml = book.image 
                ? `<img src="${book.image}" alt="${book.title}" class="book-image">`
                : `<div class="book-placeholder">${book.title}</div>`;

            const heartClass = book.isFavorite ? 'btn-heart active' : 'btn-heart';

            card.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span class="card-category">${book.category}</span>
                        <button class="${heartClass}" onclick="toggleFavorite(${book.id})">♥</button>
                    </div>
                    <h3 class="card-title" contenteditable="true" onblur="updateTitle(${book.id}, this.innerText)">${book.title}</h3>
                    <button class="btn-secondary" onclick="window.location.href='book.html?id=${book.id}'" style="margin-top: 10px; width: 100%;">Read Summary</button>
                </div>
            `;
            row.appendChild(card);
        });

        section.appendChild(row);
        container.appendChild(section);
    }
}

// Helper: Toggle Favorite
window.toggleFavorite = async function(id) {
    const book = books.find(b => b.id == id);
    if (book) {
        book.isFavorite = !book.isFavorite;
        
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
        renderLibrary(); // Re-render to update UI
    }
};

// Helper: Update Title
window.updateTitle = async function(id, newTitle) {
    const book = books.find(b => b.id == id);
    if (book && newTitle.trim() !== "") {
        book.title = newTitle.trim();
        
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
    }
};