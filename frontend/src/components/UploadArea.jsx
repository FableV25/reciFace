import { Upload } from 'lucide-react';

export default function UploadArea({ 
  dragActive, 
  handleDrag, 
  handleDrop, 
  fileInputRef, 
  handleFileSelect,
  selectedFile 
}) {
  return (
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
  );
}