// Global Variables
let books = [];

document.addEventListener('DOMContentLoaded', () => {
    loadBooksFromDatabase();

    const bookForm = document.getElementById('book-form');
    if (bookForm) {
        bookForm.addEventListener('submit', saveBook);
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    const closeSpan = document.querySelector('.close-modal');
    if (closeSpan) {
        closeSpan.addEventListener('click', closeModal);
    }

    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') closeModal();
        });
    }
});

async function loadBooksFromDatabase() {
    try {
        const response = await fetch('http://localhost:8081/api/books');
        const data = await response.json();
        
        books = data.map(dbBook => ({
            ...dbBook,
            summary: dbBook.summaryText,
            // Default values for missing backend fields
            author: 'Unknown Author',
            insight: '',
            image: null
        }));

        renderCategories();
        renderBooks();
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Render Categories
function renderCategories() {
    const categoryContainer = document.getElementById('category-filter');
    if (!categoryContainer) return;

    categoryContainer.innerHTML = '';

    const categories = ['All', ...new Set(books.map(book => book.category))];

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.className = 'category-btn';
        if (category === 'All') btn.classList.add('active');

        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBooks(category);
        });

        categoryContainer.appendChild(btn);
    });
}

// Render Function
function renderBooks(filter = 'All') {
    const bookGrid = document.getElementById('book-grid');
    if (!bookGrid) return;

    bookGrid.innerHTML = '';

    // Add Book Card
    const addCard = document.createElement('div');
    addCard.className = 'add-book-card';
    addCard.onclick = function() { openModal(); };
    addCard.style.cursor = 'pointer';
    addCard.innerHTML = `
        <span class="add-icon">+</span>
        <span>Add New Book</span>
    `;
    bookGrid.appendChild(addCard);

    // Filter Books
    const filteredBooks = filter === 'All' ? books : books.filter(book => book.category === filter);

    // Render Books
    filteredBooks.forEach(book => {
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
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        `;
        bookGrid.appendChild(card);
    });
}

// Add/Edit Logic
function saveBook(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const summary = document.getElementById('summary').value || 'No summary added yet.';

    const bookData = {
        title: title,
        category: category,
        isFavorite: false,
        summaryText: summary
    };

    fetch('http://localhost:8081/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    })
    .then(response => {
        if (response.ok) {
            loadBooksFromDatabase();
            closeModal();
        }
    });
}

// Edit Function
window.editBook = function(id) {
    const book = books.find(b => b.id == id);
    if (book) {
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('category').value = book.category;
        document.getElementById('insight').value = book.insight || '';
        document.getElementById('summary').value = book.summary;

        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) submitBtn.textContent = "Update Book";

        openModal();
    }
};

// Delete Function
window.deleteBook = function(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        // 1. Construct the URL dynamically
        // We use a template literal (backticks `) to inject the 'id' variable 
        // directly into the endpoint string (e.g., .../api/books/5).
        const deleteUrl = `http://localhost:8081/api/books/${id}`;

        // 2. Initiate the Fetch Request
        fetch(deleteUrl, {
            // We explicitly set the method to 'DELETE'. 
            // Without this, fetch defaults to 'GET'.
            method: 'DELETE'
        })
        .then(response => {
            // 3. Handle the Response
            // response.ok checks if the HTTP status code is in the 200-299 range (Success).
            if (response.ok) {
                // 4. Update the UI
                // Since the database has changed, we reload the list from the backend 
                // to ensure our frontend view matches the database state.
                loadBooksFromDatabase();
            } else {
                console.error('Failed to delete the book from the server.');
            }
        })
        .catch(error => {
            // Handle network errors (e.g., server is down)
            console.error('Error deleting book:', error);
        });
    }
};

// Toggle Favorite Function
window.toggleFavorite = function(id) {
    const book = books.find(b => b.id == id);
    if (book) {
        book.isFavorite = !book.isFavorite;
        localStorage.setItem('myBooks', JSON.stringify(books));
        const activeBtn = document.querySelector('.category-btn.active');
        renderBooks(activeBtn ? activeBtn.textContent : 'All');
    }
};

// Update Title Function
window.updateTitle = function(id, newTitle) {
    const book = books.find(b => b.id == id);
    if (book && newTitle.trim() !== "") {
        book.title = newTitle.trim();
        localStorage.setItem('myBooks', JSON.stringify(books));
    }
};

// Helper: Open Modal
function openModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

// Helper: Close Modal
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    const form = document.getElementById('book-form');
    if (form) form.reset();
    
    document.getElementById('book-id').value = '';
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) submitBtn.textContent = "Save Book";
}