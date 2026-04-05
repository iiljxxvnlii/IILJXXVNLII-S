let games = [];

// Initialize Lucide icons
lucide.createIcons();

// Fetch games data
async function loadGames() {
    try {
        const response = await fetch('games.json');
        games = await response.json();
        renderGames(games);
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function renderGames(gamesToRender) {
    const grid = document.getElementById('games-grid');
    const count = document.getElementById('game-count');
    const noResults = document.getElementById('no-results');

    grid.innerHTML = '';
    count.textContent = gamesToRender.length;

    if (gamesToRender.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        gamesToRender.forEach(game => {
            const card = document.createElement('div');
            card.className = 'anime-card group cursor-pointer transition-all';
            card.innerHTML = `
                <div class="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 border border-pink-500/20 transition-all group-hover:border-pink-500/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                    <img src="${game.thumbnail}" 
                         alt="${game.title}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         referrerpolicy="no-referrer"
                         onerror="this.src='https://picsum.photos/seed/${game.id}/400/300?blur=2'; this.onerror=null;">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                        <h4 class="text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">${game.title}</h4>
                        <p class="text-sm text-pink-100/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">${game.description}</p>
                    </div>
                    <div class="absolute top-4 right-4 bg-pink-500 p-3 rounded-2xl scale-0 group-hover:scale-100 transition-all shadow-lg rotate-12 group-hover:rotate-0">
                        <i data-lucide="play" class="w-5 h-5 text-white fill-current"></i>
                    </div>
                </div>
            `;
            card.onclick = () => openGame(game);
            grid.appendChild(card);
        });
        lucide.createIcons();
    }
}

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const hero = document.getElementById('hero');
    const gridTitle = document.getElementById('grid-title');

    if (query) {
        hero.classList.add('hidden');
        gridTitle.innerHTML = `<i data-lucide="search" class="w-6 h-6 text-pink-500"></i> Results for "${query}"`;
    } else {
        hero.classList.remove('hidden');
        gridTitle.innerHTML = `<i data-lucide="flame" class="w-6 h-6 text-pink-500"></i> Trending Now`;
    }
    lucide.createIcons();

    const filtered = games.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query)
    );
    renderGames(filtered);
});

// Modal logic
function openGame(game) {
    const modal = document.getElementById('game-modal');
    const iframe = document.getElementById('game-iframe');
    const title = document.getElementById('modal-title');
    const thumb = document.getElementById('modal-thumb');

    iframe.src = game.iframeUrl;
    title.textContent = game.title;
    thumb.src = game.thumbnail;
    
    modal.classList.remove('hidden');
    document.body.classList.add('modal-active');
}

document.getElementById('close-modal').onclick = () => {
    const modal = document.getElementById('game-modal');
    const iframe = document.getElementById('game-iframe');
    
    iframe.src = '';
    modal.classList.add('hidden');
    document.body.classList.remove('modal-active');
};

// Fullscreen logic
document.getElementById('fullscreen-btn').onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

// Start the app
loadGames();
