import { History, RotateCcw, Loader2, Camera, Trash2, Calendar, TrendingUp, User, Eye, Globe, Sparkles } from 'lucide-react';

export default function HistoryView({
  analyses,
  loadingHistory,
  historyError,
  loadAnalyses,
  deleteAnalysis,
  setCurrentView,
  formatDate,
  shouldShowWarning
}) {
  const attributes = [
    { key: 'sex', icon: User, label: 'Sexo', color: 'bg-blue-500' },
    { key: 'eyes', icon: Eye, label: 'Ojos', color: 'bg-green-500' },
    { key: 'race', icon: Globe, label: 'Etnia', color: 'bg-orange-500' },
    { key: 'hair', icon: Sparkles, label: 'Cabello', color: 'bg-pink-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-my-azul flex items-center gap-3">
            <History className="w-8 h-8" />
            Historial de Análisis
          </h2>
          <p className="text-my-Lazul mt-2">
            {analyses.length} análisis guardados
          </p>
        </div>
        
        <button
          onClick={loadAnalyses}
          disabled={loadingHistory}
          className="bg-my-azul hover:bg-my-Dazul text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
        >
          <RotateCcw className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Loading State */}
      {loadingHistory && (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-my-azul animate-spin" />
          <p className="text-my-Lazul">Cargando historial...</p>
        </div>
      )}

      {/* Error State */}
      {historyError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-semibold">Error al cargar historial</p>
          <p className="text-sm mt-1">{historyError}</p>
        </div>
      )}

      {/* Empty State */}
      {!loadingHistory && analyses.length === 0 && !historyError && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <History className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay análisis guardados
          </h3>
          <p className="text-gray-500 mb-6">
            Los análisis que guardes aparecerán aquí
          </p>
          <button
            onClick={() => setCurrentView('analyzer')}
            className="bg-my-azul hover:bg-my-Dazul text-white font-semibold py-3 px-8 rounded-lg transition-all"
          >
            Ir al Analizador
          </button>
        </div>
      )}

      {/* amalisis grid */}
      {!loadingHistory && analyses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gray-200">
                {analysis.image_url ? (
                  <img
                    src={analysis.image_url}
                    alt={`Análisis ${analysis.id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* conficence badge  */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                  analysis.has_low_confidence
                    ? 'bg-yellow-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                  {analysis.has_low_confidence ? '⚠️ Baja confianza' : '✓ Alta confianza'}
                </div>
              </div>

              {/* contents */}
              <div className="p-4">
                {/* date and percentage */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(analysis.created_at)}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-my-azul">
                    <TrendingUp className="w-4 h-4" />
                    {analysis.average_confidence}%
                  </div>
                </div>

                {/* results */}
                <div className="space-y-2 mb-4">
                  {attributes.map(({ key, icon: Icon, label, color }) => {
                    const confidence = analysis[`${key}_confidence`];
                    const showWarning = shouldShowWarning(confidence);
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`${showWarning ? 'bg-yellow-500' : color} p-1 rounded`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-600">{label}:</span>
                          <span className="text-sm font-semibold">
                            {showWarning ? '?' : analysis[key]}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{confidence}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* delete button */}
                <button
                  onClick={() => deleteAnalysis(analysis.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}