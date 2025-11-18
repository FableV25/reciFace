import { AlertTriangle, Edit3, Check, X } from 'lucide-react';

export default function ResultItem({
  attribute,
  results,
  editingField,
  manualValues,
  shouldShowWarning,
  attributeOptions,
  setEditingField,
  setManualValues,
  handleManualEdit,
  saveManualEdit,
  cancelEdit,
  getDisplayValue
}) {
  const { key, icon: Icon, label, color } = attribute;
  const confidence = results[`${key}_confidence`];
  const showWarning = shouldShowWarning(confidence);
  const isEditing = editingField === key;
  const currentValue = getDisplayValue(key);

  return (
    <div
      className={`p-4 rounded-xl transition-all ${
        showWarning
          ? 'bg-yellow-50 border-2 border-yellow-300'
          : 'bg-gradient-to-r from-blue-100 to-indigo-50 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1">
          <div className={`${showWarning ? 'bg-yellow-500' : color} p-2 rounded-lg`}>
            {showWarning ? (
              <AlertTriangle className="w-5 h-5 text-white" />
            ) : (
              <Icon className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1">
            <span className="font-semibold text-gray-600 text-sm">
              {label}
            </span>
            
            {showWarning ? (
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={manualValues[key] || ''}
                      onChange={(e) => handleManualEdit(key, e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-yellow-600 text-sm bg-white"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveManualEdit(key);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    >
                      <option value="">-- Seleccionar {label} --</option>
                      {attributeOptions[key]?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => saveManualEdit(key)}
                      disabled={!manualValues[key]}
                      className={`p-2 rounded-lg transition-all ${
                        manualValues[key]
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      title="Guardar"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-all"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`font-bold text-sm ${
                      currentValue ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {currentValue ? (
                        <span className="flex items-center gap-1">
                          ✓ {currentValue}
                          <span className="text-xs text-gray-500 font-normal">(corregido)</span>
                        </span>
                      ) : (
                        'No se pudo detectar con certeza'
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setEditingField(key);
                        setManualValues(prev => ({
                          ...prev,
                          [key]: currentValue || ''
                        }));
                      }}
                      className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-100 rounded transition-all"
                      title="Editar manualmente"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Confianza: {confidence}%
                </p>
              </div>
            ) : (
              <p className="text-gray-900 font-bold text-lg">
                {currentValue}
              </p>
            )}
          </div>
        </div>

        {!showWarning && (
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className={`${color} h-2 rounded-full transition-all`}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="bg-my-azul text-white px-3 py-1 rounded-full text-xs font-bold min-w-[55px] text-center">
              {confidence}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}