import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, X, Maximize2, Search, Info } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              Unblocked<span className="text-indigo-500">Games</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
            />
          </div>

          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {!searchQuery && (
          <section className="mb-12">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-12">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
                  Play Your Favorite Games Anywhere.
                </h2>
                <p className="text-indigo-100 text-lg mb-8 opacity-90">
                  Access a curated collection of unblocked web games. No downloads, no signups, just pure fun.
                </p>
                <button 
                  onClick={() => document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg"
                >
                  Start Playing
                </button>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent blur-3xl"></div>
              </div>
            </div>
          </section>
        )}

        {/* Games Grid */}
        <section id="games-grid">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Games'}
              <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md">
                {filteredGames.length}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-lg font-bold text-white mb-1">{game.title}</h4>
                      <p className="text-xs text-zinc-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {game.description}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 bg-indigo-600 p-2 rounded-full scale-0 group-hover:scale-100 transition-transform">
                      <Gamepad2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-500">No games found matching your search.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-500" />
            <span className="font-bold">Unblocked Games Hub</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Unblocked Games. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800"
            >
              {/* Modal Header */}
              <div className="absolute top-0 left-0 right-0 h-14 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-3">
                  <img src={selectedGame.thumbnail} className="w-8 h-8 rounded-md object-cover" referrerPolicy="no-referrer" />
                  <h2 className="font-bold text-lg">{selectedGame.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="w-full h-full pt-14">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Info Overlay (Optional) */}
              <div className="absolute bottom-4 left-4 group">
                <div className="bg-black/50 backdrop-blur-md p-2 rounded-full cursor-help">
                  <Info className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-zinc-800 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs shadow-xl border border-zinc-700">
                  <p className="font-bold mb-1">{selectedGame.title}</p>
                  <p className="text-zinc-400 leading-relaxed">{selectedGame.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
