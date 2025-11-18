import { Camera, ScanFace, History } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, analysesCount }) {
  return (
    <nav className="bg-white shadow-lg mb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-my-azul" />
            <span className="text-2xl font-bold text-my-azul">Analizador Facial IA</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('analyzer')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === 'analyzer'
                  ? 'bg-my-azul text-white shadow-md'
                  : 'text-my-Lazul hover:bg-gray-100'
              }`}
            >
              <ScanFace className="w-5 h-5" />
              Analizador
            </button>
            
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                currentView === 'history'
                  ? 'bg-my-azul text-white shadow-md'
                  : 'text-my-Lazul hover:bg-gray-100'
              }`}
            >
              <History className="w-5 h-5" />
              Historial
              {analysesCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {analysesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}