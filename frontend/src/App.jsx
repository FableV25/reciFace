import { useState, useRef } from 'react';

export default function FacePredictor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResults(null);
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Por favor selecciona una imagen válida');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/predict/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Error al procesar la imagen');
      }
    } catch (err) {
      setError('Error de conexión con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const attributes = [
    { key: 'sex', icon: '👤', label: 'Sexo' },
    { key: 'eyes', icon: '👁️', label: 'Ojos' },
    { key: 'race', icon: '🌍', label: 'Etnia' },
    { key: 'hair', icon: '💇', label: 'Cabello' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔮 Face Attribute Predictor
          </h1>
          <p className="text-purple-200">
            Sube una imagen facial y descubre sus características
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div
            className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-purple-600 bg-purple-50'
                : 'border-purple-400 hover:border-purple-600 hover:bg-purple-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-6xl mb-4">📸</div>
            <div className="text-gray-600 mb-2">
              <strong>Click para seleccionar</strong> o arrastra una imagen aquí
            </div>
            {selectedFile && (
              <div className="text-purple-600 font-semibold mt-2">
                ✓ {selectedFile.name}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {preview && (
            <div className="mt-6 text-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-80 rounded-xl shadow-lg mx-auto"
              />
            </div>
          )}

          {selectedFile && !results && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analizando...
                </span>
              ) : (
                'Analizar Imagen'
              )}
            </button>
          )}

          {loading && (
            <div className="text-center mt-6">
              <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-purple-600 mt-4 font-semibold">
                Analizando imagen...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-semibold">❌ Error</p>
              <p>{error}</p>
            </div>
          )}

          {results && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ✨ Resultados del Análisis
              </h2>
              <div className="space-y-3">
                {attributes.map(({ key, icon, label }) => (
                  <div
                    key={key}
                    className="bg-purple-50 p-4 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-purple-600">
                        {icon} {label}:
                      </span>
                      <span className="text-gray-800 ml-2">
                        {results[key]}
                      </span>
                    </div>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {results[`${key}_confidence`]}%
                    </span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleReset}
                className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Analizar otra imagen
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-purple-200 text-sm">
          <p>Powered by EfficientNet-B0 & Django</p>
        </div>
      </div>
    </div>
  );
}