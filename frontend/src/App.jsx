import { useState, useRef } from 'react';
import { Upload, Camera, User, Eye, Globe, Sparkles, RotateCcw, Loader2 } from 'lucide-react';

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
      setError('Seleccione una imagen valida (JPG o PNG)');
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
      setError('Seleccione una imagen');
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
      console.error('Error:', err);
      setError('Error de conexión. Asegúrate de que el servidor Django esté corriendo en http://localhost:8000');
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
    { key: 'sex', icon: User, label: 'Sexo', color: 'bg-blue-500' },
    { key: 'eyes', icon: Eye, label: 'Ojos', color: 'bg-green-500' },
    { key: 'race', icon: Globe, label: 'Etnia', color: 'bg-orange-500' },
    { key: 'hair', icon: Sparkles, label: 'Cabello', color: 'bg-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-main-bg">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Camera className="w-10 h-10 text-my-Dazul" />
            <h1 className="text-4xl font-bold text-my-azul">
              Titulo app
            </h1>
          </div>
          <p className="text-my-Lazul">
            Carga una imagen para extraer sus rasgos
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Upload Area */}
          <div
            className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-purple-600 bg-purple-50 scale-105'
                : 'border-my-Hobber-Lazul hover:border-my-Hobber-azul hover:bg-blue-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-my-azul" />
            <div className="text-my-azul mb-2">
              <strong>Click para seleccionar</strong> o arrastra una imagen
            </div>
            <p className="text-sm text-my-Lazul">
              Formatos: JPG, PNG, WEBP (máx. 10MB) 
            </p> 
            {selectedFile && (
              <div className="text-blue-400 font-semibold mt-3 flex items-center justify-center gap-2">
                <span className="text-2xl">→</span>
                {selectedFile.name}
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
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-my-azul-600 animate-spin" />
              <p className="text-my-Dazul font-semibold text-lg">
                Analizando imagen con IA...
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
            <div className="mt-8 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-my-Lazul" />
                Resultados del Análisis
              </h2>
              <div className="space-y-3">
                {attributes.map(({ key, icon: Icon, label, color }) => (
                  <div
                    key={key}
                    className="bg-gradient-to-r from-blue-100 to-indigo-50 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${color} p-2 rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 text-sm">
                          {label}
                        </span>
                        <p className="text-gray-900 font-bold text-lg">
                          {results[key]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full transition-all`}
                          style={{ width: `${results[`${key}_confidence`]}%` }}
                        />
                      </div>
                      <span className="bg-my-azul text-white px-3 py-1 rounded-full text-sm font-bold min-w-[60px] text-center">
                        {results[`${key}_confidence`]}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleReset}
                className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Analizar otra imagen
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-200 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Powered by EfficientNet-B0 & Django
          </p>
        </div>
      </div>
    </div>
  );
}