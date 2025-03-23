/**
 * Category page JavaScript for Monster Survivors
 * Handles game listing, filtering, searching and pagination
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gamesContainer = document.getElementById('games-container');
    const paginationContainer = document.getElementById('pagination');
    const categoryTitle = document.getElementById('category-title');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Variables
    let currentPage = 1;
    const gamesPerPage = 12;
    let filteredGames = [...gamesData];
    let currentCategory = 'all';
    let searchTerm = '';
    
    // Check for category in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) {
        currentCategory = urlParams.get('category');
        // Update active filter button
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === currentCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Initial filtering and rendering
    filterGames();
    
    // Filter buttons click event
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentCategory = this.dataset.filter;
            currentPage = 1;
            
            // Update active class
            filterButtons.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
            
            // Update URL without reloading page
            const url = new URL(window.location);
            if (currentCategory === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', currentCategory);
            }
            window.history.pushState({}, '', url);
            
            filterGames();
        });
    });
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        searchTerm = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        filterGames();
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchTerm = searchInput.value.trim().toLowerCase();
            currentPage = 1;
            filterGames();
        }
    });
    
    // Main filtering function
    function filterGames() {
        // Apply category filter
        if (currentCategory === 'all') {
            filteredGames = [...gamesData];
            updateCategoryTitle('All Games');
        } else {
            filteredGames = gamesData.filter(game => game.category === currentCategory);
            
            // Find category name
            const categoryObj = categories.find(cat => cat.id === currentCategory);
            const categoryName = categoryObj ? `${categoryObj.name} Games` : 'Games';
            updateCategoryTitle(categoryName);
        }
        
        // Apply search filter if there's a search term
        if (searchTerm) {
            filteredGames = filteredGames.filter(game => 
                game.name.toLowerCase().includes(searchTerm) || 
                game.description.toLowerCase().includes(searchTerm)
            );
        }
        
        renderGames();
        renderPagination();
    }
    
    // Update category title
    function updateCategoryTitle(title) {
        if (categoryTitle) {
            categoryTitle.textContent = title;
        }
    }
    
    // Render games with pagination
    function renderGames() {
        if (!gamesContainer) return;
        
        gamesContainer.innerHTML = '';
        
        if (filteredGames.length === 0) {
            gamesContainer.innerHTML = `
                <div class="no-games">
                    <h3>No games found</h3>
                    <p>Try changing your search or filter.</p>
                </div>
            `;
            
            // Hide pagination
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            
            return;
        }
        
        // Show pagination
        if (paginationContainer) {
            paginationContainer.style.display = 'flex';
        }
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * gamesPerPage;
        const endIndex = Math.min(startIndex + gamesPerPage, filteredGames.length);
        const currentGames = filteredGames.slice(startIndex, endIndex);
        
        // Create game cards
        currentGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            gameCard.innerHTML = `
                <div class="game-thumbnail">
                    <img src="${game.imageUrl}" alt="${game.name}">
                    <div class="game-overlay">
                        <a href="game.html?id=${game.id}" class="play-btn">Play Now</a>
                    </div>
                </div>
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <div class="game-meta">
                        <span class="category">${categories.find(cat => cat.id === game.category).name}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${game.rating}</span>
                    </div>
                </div>
            `;
            
            gamesContainer.appendChild(gameCard);
        });
    }
    
    // Render pagination
    function renderPagination() {
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
        
        // Don't show pagination if only one page
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.innerHTML = '';
        
        // Previous page button
        if (currentPage > 1) {
            const prevBtn = createPaginationButton('&laquo;', currentPage - 1);
            paginationContainer.appendChild(prevBtn);
        }
        
        // Page number buttons
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust startPage if endPage is maxed out
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = createPaginationButton(i, i);
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            paginationContainer.appendChild(pageBtn);
        }
        
        // Next page button
        if (currentPage < totalPages) {
            const nextBtn = createPaginationButton('&raquo;', currentPage + 1);
            paginationContainer.appendChild(nextBtn);
        }
    }
    
    // Helper function to create pagination buttons
    function createPaginationButton(text, pageNum) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.innerHTML = text;
        button.addEventListener('click', function() {
            currentPage = pageNum;
            renderGames();
            renderPagination();
            // Scroll to top of games container
            window.scrollTo({
                top: document.querySelector('.games-grid').offsetTop - 100,
                behavior: 'smooth'
            });
        });
        return button;
    }
}); 