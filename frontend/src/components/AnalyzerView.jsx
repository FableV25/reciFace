import { Sparkles, Loader2 } from 'lucide-react';
import UploadArea from './UploadArea';
import ResultsSection from './ResultsSection';

export default function AnalyzerView({
  // File handling
  dragActive,
  handleDrag,
  handleDrop,
  fileInputRef,
  handleFileSelect,
  selectedFile,
  preview,
  
  // Analysis
  loading,
  handleSubmit,
  error,
  results,
  
  // Results props
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <p className="text-my-Lazul text-lg">
          Carga una imagen para extraer sus rasgos faciales
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        {/* Upload Area */}
        <UploadArea
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />

        {/* Preview */}
        {preview && (
          <div className="mt-6">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-80 rounded-xl shadow-lg mx-auto object-contain"
            />
          </div>
        )}

        {/* Analyze Button */}
        {selectedFile && !results && !loading && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-gradient-to-r from-my-azul to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Analizar Imagen
            </span>
          </button>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center mt-6 py-8">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-my-azul animate-spin" />
            <p className="text-my-Dazul font-semibold text-lg">
              Procesando la imagen...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Esto puede tomar unos segundos
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-xl">❌</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <ResultsSection
            results={results}
            attributes={attributes}
            attributeOptions={attributeOptions}
            shouldShowWarning={shouldShowWarning}
            editingField={editingField}
            manualValues={manualValues}
            setEditingField={setEditingField}
            setManualValues={setManualValues}
            handleManualEdit={handleManualEdit}
            saveManualEdit={saveManualEdit}
            cancelEdit={cancelEdit}
            getDisplayValue={getDisplayValue}
            handleReset={handleReset}
            handleSaveAnalysis={handleSaveAnalysis}
            saving={saving}
            saved={saved}
          />
        )}
      </div>
    </div>
  );
}