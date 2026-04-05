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
    const hero = document.getElementById('hero');
    const gridTitle = document.getElementById('grid-title');

    grid.innerHTML = '';
    count.textContent = gamesToRender.length;

    if (gamesToRender.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        gamesToRender.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card group cursor-pointer transition-all hover:-translate-y-1';
            card.innerHTML = `
                <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                    <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerpolicy="no-referrer">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                        <h4 class="text-lg font-bold text-white mb-1">${game.title}</h4>
                        <p class="text-xs text-zinc-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">${game.description}</p>
                    </div>
                    <div class="play-btn absolute top-3 right-3 bg-indigo-600 p-2 rounded-full scale-0 transition-transform opacity-0">
                        <i data-lucide="gamepad-2" class="w-4 h-4 text-white"></i>
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
        gridTitle.textContent = `Search Results for "${query}"`;
    } else {
        hero.classList.remove('hidden');
        gridTitle.textContent = 'Popular Games';
    }

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
