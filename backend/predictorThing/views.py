from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .predictor import get_predictor
from PIL import Image
import io

def predict_face_view(request):
    """Vista para predecir atributos faciales"""
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            # Obtén la imagen del request
            image_file = request.FILES['image']
            image = Image.open(io.BytesIO(image_file.read()))
            
            # Haz la predicción
            predictor = get_predictor()
            results = predictor.predict(image)
            
            # Retorna JSON
            return JsonResponse({
                'success': True,
                'predictions': results
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return render(request, 'predictor/upload.html')


# API endpoint (opcional)
@csrf_exempt
def api_predict(request):
    """Endpoint de API para predicciones"""
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            image_file = request.FILES['image']
            image = Image.open(io.BytesIO(image_file.read()))
            
            predictor = get_predictor()
            results = predictor.predict(image)
            
            return JsonResponse({
                'success': True,
                'data': {
                    'sex': results['sex']['prediction'],
                    'sex_confidence': results['sex']['confidence'],
                    'eyes': results['eyes']['prediction'],
                    'eyes_confidence': results['eyes']['confidence'],
                    'race': results['race']['prediction'],
                    'race_confidence': results['race']['confidence'],
                    'hair': results['hair']['prediction'],
                    'hair_confidence': results['hair']['confidence']
                }
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'error': 'No image provided'
    }, status=400)