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
    """clase de predicciones en Django"""
    
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.encoders = None
        self.transform = None
        self._load_model()
    
    def _load_model(self):
        """carga el modelo y los encoders"""
        base_path = Path(__file__).parent / 'ml_models' 
        model_path = base_path / 'face_model_for_django.pth'
        encoders_path = base_path / 'label_encoders.pkl'
        
        # Verificacion de archivos
        if not model_path.exists():
            raise FileNotFoundError(f"no se encontro el modelo en: {model_path}")
        if not encoders_path.exists():
            raise FileNotFoundError(f"no se encontraron los encoders en: {encoders_path}")
        
        print(f"modelo cargado de: {model_path}")
        
        # Carga el modelo
        checkpoint = torch.load(model_path, map_location=self.device)
        self.model = MultiTaskFaceModel(checkpoint['num_classes'])
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()
        
        # encoders
        with open(encoders_path, 'rb') as f:
            self.encoders = pickle.load(f)
        
        # define las transformaciones
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        print(f"modelo cargado en {self.device}")
    
    def predict(self, image_path_or_pil):

        # cargar imagen
        if isinstance(image_path_or_pil, str):
            image = Image.open(image_path_or_pil).convert('RGB')
        else:
            image = image_path_or_pil.convert('RGB')
        
        # preprocesar
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # predicción
        with torch.no_grad():
            outputs = self.model(image_tensor)
        
        # procesar resultados
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
        
        results = []
        for img_path in image_paths:
            results.append(self.predict(img_path))
        return results


# global instance and shi
predictor = None

def get_predictor():
    
    global predictor
    if predictor is None:
        predictor = FaceAttributePredictor()
    return predictor    