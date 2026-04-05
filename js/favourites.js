// Global Variables
let books = [];

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

async function loadFavorites() {
    try {
        const response = await fetch('http://localhost:8081/api/books');
        const data = await response.json();
        books = data.map(dbBook => ({
            ...dbBook,
            summary: dbBook.summaryText,
            image: null
        }));
        renderFavorites();
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Filter for favorites
    const favBooks = books.filter(book => book.isFavorite);

    if (favBooks.length === 0) {
        grid.innerHTML = '<p>No favorites yet. Go add some!</p>';
        return;
    }

    favBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';

        const imageHtml = book.image 
            ? `<img src="${book.image}" alt="${book.title}" class="book-image">`
            : `<div class="book-placeholder">${book.title}</div>`;

        // Heart is always active on this page
        const heartClass = 'btn-heart active';

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
        grid.appendChild(card);
    });
}

window.toggleFavorite = async function(id) {
    const book = books.find(b => b.id == id);
    if (book) {
        book.isFavorite = !book.isFavorite; // Toggle false
        
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
        renderFavorites(); // Re-render to remove the item from the list
    }
};

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