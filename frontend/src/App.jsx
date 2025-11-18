import { useState, useRef, useEffect } from 'react';
import { User, Eye, Globe, Sparkles } from 'lucide-react';
import Navbar from './components/navbar'; // i know about the name, puting it on caps is killing the whole thing somehow, again 
import AnalyzerView from './components/AnalyzerView';
import HistoryView from './components/HistoryView';

export default function FacePredictor() {
  // Estados de navegación
  const [currentView, setCurrentView] = useState('analyzer');
  
  // Estados del analizador
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [manualValues, setManualValues] = useState({});
  const fileInputRef = useRef(null);
  
  // Estados del historial
  const [analyses, setAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Configuración de atributos
  const attributeOptions = {
    sex: ['Hombre', 'Mujer'],
    eyes: ['Café', 'Azul', 'Verde', 'Gris', 'Negro', 'Avellana'],
    race: ['Blanco', 'Negro', 'Asiático', 'Hispano', 'Indio', 'Medio Oriente', 'Otro'],
    hair: ['Negro', 'Café', 'Rubio', 'Rojo', 'Gris', 'Blanco', 'Calvo']
  };

  const attributes = [
    { key: 'sex', icon: User, label: 'Sexo', color: 'bg-blue-500' },
    { key: 'eyes', icon: Eye, label: 'Ojos', color: 'bg-green-500' },
    { key: 'race', icon: Globe, label: 'Etnia', color: 'bg-orange-500' },
    { key: 'hair', icon: Sparkles, label: 'Cabello', color: 'bg-pink-500' }
  ];

  // Cargar historial cuando se cambia a la vista de historial
  useEffect(() => {
    if (currentView === 'history') {
      loadAnalyses();
    }
  }, [currentView]);

  // Funciones del historial
  const loadAnalyses = async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/analyses/');
      const data = await response.json();
      
      if (data.success) {
        setAnalyses(data.data);
      } else {
        setHistoryError(data.error || 'Error al cargar el historial');
      }
    } catch (err) {
      console.error('Error:', err);
      setHistoryError('Error de conexión al cargar historial');
    } finally {
      setLoadingHistory(false);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este análisis?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/analyses/${id}/delete/`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalyses(analyses.filter(a => a.id !== id));
        alert('✅ Análisis eliminado exitosamente');
      } else {
        alert('❌ Error al eliminar: ' + data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Error de conexión al eliminar');
    }
  };

  // Funciones del analizador 
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setResults(null);
      setSaved(false);
      
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
    setSaved(false);

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
      setError('Error de conexión. Asegúrate de que el servidor Django esté corriendo');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!selectedFile || !results) {
      setError('No hay resultados para guardar');
      return;
    }

    if (editingField) {
      setError('Por favor guarda o cancela la edición antes de guardar el análisis');
      return;
    }

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    
    if (Object.keys(manualValues).length > 0) {
      formData.append('manual_values', JSON.stringify(manualValues));
    }

    try {
      const response = await fetch('http://localhost:8000/api/save/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSaved(true);
        alert(`✅ Análisis guardado exitosamente!\nID: ${data.analysis_id}`);
      } else {
        setError(data.error || 'Error al guardar el análisis');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    setSaved(false);
    setEditingField(null);
    setManualValues({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualEdit = (key, value) => {
    setManualValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveManualEdit = (key) => {
    if (manualValues[key]?.trim()) {
      setResults(prev => ({
        ...prev,
        [key]: manualValues[key].trim()
      }));
      setEditingField(null);
    } else {
      alert('⚠️ Por favor selecciona una opción válida');
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setManualValues({});
  };

  const getDisplayValue = (key) => {
    return manualValues[key] !== undefined ? manualValues[key] : results[key];
  };

  const shouldShowWarning = (confidence) => confidence < 70;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-main-bg">
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        analysesCount={analyses.length}
      />

      {currentView === 'analyzer' ? (
        <AnalyzerView
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          preview={preview}
          loading={loading}
          handleSubmit={handleSubmit}
          error={error}
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
      ) : (
        <HistoryView
          analyses={analyses}
          loadingHistory={loadingHistory}
          historyError={historyError}
          loadAnalyses={loadAnalyses}
          deleteAnalysis={deleteAnalysis}
          setCurrentView={setCurrentView}
          formatDate={formatDate}
          shouldShowWarning={shouldShowWarning}
        />
      )}

      {/* Footer */}
      <div className="text-center mt-8 pb-6 text-my-Lazul text-sm">
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          sample footer idk
        </p>
      </div>
    </div>
  );
}