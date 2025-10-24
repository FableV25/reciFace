# predictor/predictor.py
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm
import pickle
import json
import os
from pathlib import Path

class MultiTaskFaceModel(nn.Module):
    """Misma arquitectura que usaste en Kaggle"""
    def __init__(self, num_classes_dict):
        super(MultiTaskFaceModel, self).__init__()
        
        self.backbone = timm.create_model('efficientnet_b0', pretrained=False)
        num_features = self.backbone.classifier.in_features
        self.backbone.classifier = nn.Identity()
        
        self.sex_classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_features, num_classes_dict['sex'])
        )
        
        self.eyes_classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_features, num_classes_dict['eyes'])
        )
        
        self.race_classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_features, num_classes_dict['race'])
        )
        
        self.hair_classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_features, num_classes_dict['hair'])
        )
    
    def forward(self, x):
        features = self.backbone(x)
        
        return {
            'sex': self.sex_classifier(features),
            'eyes': self.eyes_classifier(features),
            'race': self.race_classifier(features),
            'hair': self.hair_classifier(features)
        }


class FaceAttributePredictor:
    """Clase para hacer predicciones en Django"""
    
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.encoders = None
        self.transform = None
        self._load_model()
    
    def _load_model(self):
        """Carga el modelo y los encoders"""
        # Rutas a los archivos
        base_path = Path(__file__).parent.parent / 'ml_models'
        model_path = base_path / 'face_model_for_django.pth'
        encoders_path = base_path / 'label_encoders.pkl'
        
        # Carga el modelo
        checkpoint = torch.load(model_path, map_location=self.device)
        self.model = MultiTaskFaceModel(checkpoint['num_classes'])
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()
        
        # Carga los encoders
        with open(encoders_path, 'rb') as f:
            self.encoders = pickle.load(f)
        
        # Define las transformaciones
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        print(f"✅ Modelo cargado en {self.device}")
    
    def predict(self, image_path_or_pil):
        """
        Predice los atributos faciales de una imagen
        
        Args:
            image_path_or_pil: Ruta a la imagen o objeto PIL.Image
        
        Returns:
            dict con las predicciones y confianzas
        """
        # Carga la imagen
        if isinstance(image_path_or_pil, str):
            image = Image.open(image_path_or_pil).convert('RGB')
        else:
            image = image_path_or_pil.convert('RGB')
        
        # Preprocesa
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Predicción
        with torch.no_grad():
            outputs = self.model(image_tensor)
        
        # Procesa resultados
        results = {}
        
        for task in ['sex', 'eyes', 'race', 'hair']:
            probs = torch.softmax(outputs[task], dim=1)
            pred_idx = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred_idx].item() * 100
            
            results[task] = {
                'prediction': self.encoders[task].inverse_transform([pred_idx])[0],
                'confidence': round(confidence, 2)
            }
        
        return results
    
    def predict_batch(self, image_paths):
        """Predice múltiples imágenes de forma eficiente"""
        results = []
        for img_path in image_paths:
            results.append(self.predict(img_path))
        return results


# Instancia global (se carga una sola vez cuando Django arranca)
predictor = None

def get_predictor():
    """Obtiene la instancia del predictor (Singleton pattern)"""
    global predictor
    if predictor is None:
        predictor = FaceAttributePredictor()
    return predictor