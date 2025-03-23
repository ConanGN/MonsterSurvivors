/**
 * Game page JavaScript for Monster Survivors
 * Handles loading game in iframe and displaying game information
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gameTitle = document.getElementById('game-title');
    const gameName = document.getElementById('game-name');
    const gameShortDesc = document.getElementById('game-short-desc');
    const gameFrame = document.getElementById('game-frame');
    const gameFullDesc = document.getElementById('game-full-desc');
    const gameCategory = document.getElementById('game-category');
    const gameControls = document.getElementById('game-controls');
    const relatedGamesContainer = document.getElementById('related-games-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    
    // Get game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        // Redirect to homepage if no game ID
        window.location.href = 'index.html';
        return;
    }
    
    // Find game data
    const game = gamesData.find(g => g.id === gameId);
    
    if (!game) {
        // Redirect to homepage if game not found
        window.location.href = 'index.html';
        return;
    }
    
    // Load game data
    loadGameData(game);
    
    // Load related games
    loadRelatedGames(game);
    
    // Set up event listeners
    setupEventListeners(game);
    
    // Function to load game data
    function loadGameData(game) {
        // Update page title
        document.title = `${game.name} - Monster Survivors`;
        
        // Update meta description
        const metaDesc = document.getElementById('game-description');
        if (metaDesc) {
            metaDesc.content = `Play ${game.name} online for free on Monster Survivors. ${game.shortDescription}`;
        }
        
        // Update game title and description
        if (gameTitle) gameTitle.textContent = `Play ${game.name} - Monster Survivors`;
        if (gameName) gameName.textContent = game.name;
        if (gameShortDesc) gameShortDesc.textContent = game.shortDescription;
        
        // Load game in iframe
        if (gameFrame) {
            gameFrame.src = game.gameUrl;
        }
        
        // Update game details
        if (gameFullDesc) gameFullDesc.textContent = game.description;
        if (gameCategory) {
            const categoryObj = categories.find(cat => cat.id === game.category);
            gameCategory.textContent = categoryObj ? categoryObj.name : game.category;
        }
        if (gameControls) gameControls.textContent = game.controls;
        
        // Show like count (from localStorage if available)
        const likes = getLikeCount(game.id);
        if (likeCount) likeCount.textContent = likes;
        
        // Update like button if game is liked
        if (likeBtn && isGameLiked(game.id)) {
            likeBtn.querySelector('i').classList.remove('far');
            likeBtn.querySelector('i').classList.add('fas');
        }
    }
    
    // Function to load related games (same category)
    function loadRelatedGames(currentGame) {
        if (!relatedGamesContainer) return;
        
        // Get games from the same category
        const related = gamesData
            .filter(game => game.category === currentGame.category && game.id !== currentGame.id)
            .slice(0, 4); // Get up to 4 related games
        
        // If not enough games in same category, add some from other categories
        if (related.length < 4) {
            const otherGames = gamesData
                .filter(game => game.category !== currentGame.category && game.id !== currentGame.id)
                .slice(0, 4 - related.length);
            
            related.push(...otherGames);
        }
        
        // Create game cards
        related.forEach(game => {
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
            
            relatedGamesContainer.appendChild(gameCard);
        });
    }
    
    // Function to set up event listeners
    function setupEventListeners(game) {
        // Fullscreen button
        if (fullscreenBtn && gameFrame) {
            fullscreenBtn.addEventListener('click', function() {
                if (gameFrame.requestFullscreen) {
                    gameFrame.requestFullscreen();
                } else if (gameFrame.mozRequestFullScreen) { /* Firefox */
                    gameFrame.mozRequestFullScreen();
                } else if (gameFrame.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                    gameFrame.webkitRequestFullscreen();
                } else if (gameFrame.msRequestFullscreen) { /* IE/Edge */
                    gameFrame.msRequestFullscreen();
                }
            });
        }
        
        // Refresh button
        if (refreshBtn && gameFrame) {
            refreshBtn.addEventListener('click', function() {
                gameFrame.src = game.gameUrl;
            });
        }
        
        // Like button
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    // Like the game
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    addLike(game.id);
                } else {
                    // Unlike the game
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    removeLike(game.id);
                }
                
                // Update like count
                if (likeCount) {
                    likeCount.textContent = getLikeCount(game.id);
                }
            });
        }
    }
    
    // Functions for handling likes
    function getLikeCount(gameId) {
        const likes = localStorage.getItem(`game_likes_${gameId}`);
        return likes ? parseInt(likes) : 0;
    }
    
    function isGameLiked(gameId) {
        return localStorage.getItem(`game_liked_${gameId}`) === 'true';
    }
    
    function addLike(gameId) {
        let likes = getLikeCount(gameId);
        likes++;
        localStorage.setItem(`game_likes_${gameId}`, likes);
        localStorage.setItem(`game_liked_${gameId}`, 'true');
    }
    
    function removeLike(gameId) {
        let likes = getLikeCount(gameId);
        if (likes > 0) likes--;
        localStorage.setItem(`game_likes_${gameId}`, likes);
        localStorage.setItem(`game_liked_${gameId}`, 'false');
    }
}); 