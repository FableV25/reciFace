import { Sparkles, Edit3, RotateCcw, Save, Check, Loader2, AlertTriangle } from 'lucide-react';
import ResultItem from './ResultItem';

export default function ResultsSection({
  results,
  attributes,
  attributeOptions,
  shouldShowWarning,
  editingField,
  manualValues,
  setEditingField,
  setManualValues,
  handleManualEdit,
  saveManualEdit,
  cancelEdit,
  getDisplayValue,
  handleReset,
  handleSaveAnalysis,
  saving,
  saved
}) {
  return (
    <div className="mt-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-my-Lazul" />
        Resultados del Analisis
      </h2>
      
      {/* Info de edición manual */}
      {Object.values(results).some((_, idx) => 
        shouldShowWarning(results[`${attributes[Math.floor(idx/2)]?.key}_confidence`])
      ) && (
        <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Edit3 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-900 font-semibold text-sm">
                Corrección manual disponible
              </p>
              <p className="text-blue-700 text-xs mt-1">
                Se recomienda correguir los campos con baja confianza (&lt;70%). 
                Haz clic en <Edit3 className="w-3 h-3 inline" /> y selecciona el valor correcto.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {attributes.map((attribute) => (
          <ResultItem
            key={attribute.key}
            attribute={attribute}
            results={results}
            editingField={editingField}
            manualValues={manualValues}
            shouldShowWarning={shouldShowWarning}
            attributeOptions={attributeOptions}
            setEditingField={setEditingField}
            setManualValues={setManualValues}
            handleManualEdit={handleManualEdit}
            saveManualEdit={saveManualEdit}
            cancelEdit={cancelEdit}
            getDisplayValue={getDisplayValue}
          />
        ))}
      </div>

      {/* Botones de acción */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Analizar otra
        </button>

        <button
          onClick={handleSaveAnalysis}
          disabled={saving || saved || editingField}
          className={`font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-600 text-white cursor-not-allowed'
              : saving
              ? 'bg-blue-400 text-white cursor-wait'
              : editingField
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-my-azul to-indigo-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <Check className="w-5 h-5" />
              Guardado ✓
            </>
          ) : editingField ? (
            <>
              <AlertTriangle className="w-5 h-5" />
              Completa la edicion
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar analisis
              {Object.keys(manualValues).length > 0 && (
                <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full">
                  {Object.keys(manualValues).length} editado(s)
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}