document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Data
    const response = await fetch('http://localhost:8081/api/books');
    const data = await response.json();
    const books = data;

    // 2. Calculate Stats
    const totalBooks = books.length;
    const favoriteCount = books.filter(book => book.isFavorite).length;
    // Create a Set from mapped categories to count unique values
    const uniqueCategories = new Set(books.map(book => book.category)).size;

    // 3. Update DOM
    const statTotal = document.getElementById('stat-total');
    const statFavorites = document.getElementById('stat-favorites');
    const statCategories = document.getElementById('stat-categories');

    if (statTotal) statTotal.textContent = totalBooks;
    if (statFavorites) statFavorites.textContent = favoriteCount;
    if (statCategories) statCategories.textContent = uniqueCategories;

    // 4. Reset Functionality
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all books.')) {
                localStorage.removeItem('myBooks');
                alert('Library Reset');
                window.location.reload();
            }
        });
    }
});