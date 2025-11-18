from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from .predictor import get_predictor
from .models import FaceAnalysis
from PIL import Image
import io
import traceback
import json
import base64

def predict_face_view(request):
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            # get te image form the request
            image_file = request.FILES['image']
            image = Image.open(io.BytesIO(image_file.read()))
            
            # Hacer la predicción
            predictor = get_predictor()
            results = predictor.predict(image)
            
            return JsonResponse({
                'success': True,
                'predictions': results
            })
        
        except Exception as e:
            print("❌ ERROR en predicción:")
            print(traceback.format_exc())
            
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return render(request, 'predictor/upload.html')


@csrf_exempt
def api_predict(request):
    """Endpoint para predecir sin guardar"""
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
            print("API ERROR:")
            print(traceback.format_exc())
            
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'error': 'No image provided'
    }, status=400)


@csrf_exempt
def save_analysis(request):
    """Endpoint para guardar los resultados del análisis en la BD"""
    if request.method == 'POST':
        try:
            # Obtener la imagen
            image_file = request.FILES.get('image')
            if not image_file:
                return JsonResponse({
                    'success': False,
                    'error': 'No se proporcionó imagen'
                }, status=400)
            
            # procesar imagen
            image_data = image_file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # prediccion
            predictor = get_predictor()
            results = predictor.predict(image)
            
            # verifica si hay valores manuales (para campos con baja confianza)
            manual_values = {}
            if 'manual_values' in request.POST:
                try:
                    manual_values = json.loads(request.POST['manual_values'])
                except json.JSONDecodeError:
                    pass
            
            # aplicar valores manuales si existen
            final_results = {}
            for key in ['sex', 'eyes', 'race', 'hair']:
                if key in manual_values and manual_values[key].strip():
                    # Usar el valor manual
                    final_results[key] = manual_values[key].strip()
                    final_results[f'{key}_confidence'] = results[key]['confidence']
                else:
                    # Usar el valor de la predicción
                    final_results[key] = results[key]['prediction']
                    final_results[f'{key}_confidence'] = results[key]['confidence']
            
            # Crear el registro en la base de datos
            analysis = FaceAnalysis.objects.create(
                sex=final_results['sex'],
                sex_confidence=final_results['sex_confidence'],
                eyes=final_results['eyes'],
                eyes_confidence=final_results['eyes_confidence'],
                race=final_results['race'],
                race_confidence=final_results['race_confidence'],
                hair=final_results['hair'],
                hair_confidence=final_results['hair_confidence'],
                image_name=image_file.name
            )
            
            # Guardar la imagen
            analysis.image.save(
                image_file.name,
                ContentFile(image_data),
                save=True
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Análisis guardado exitosamente',
                'analysis_id': analysis.id,
                'data': {
                    'sex': final_results['sex'],
                    'sex_confidence': final_results['sex_confidence'],
                    'eyes': final_results['eyes'],
                    'eyes_confidence': final_results['eyes_confidence'],
                    'race': final_results['race'],
                    'race_confidence': final_results['race_confidence'],
                    'hair': final_results['hair'],
                    'hair_confidence': final_results['hair_confidence']
                }
            })
        
        except Exception as e:
            print("ERROR al guardar análisis:")
            print(traceback.format_exc())
            
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    }, status=405)


@csrf_exempt
def get_all_analyses(request):
    """Endpoint para obtener todos los análisis guardados"""
    if request.method == 'GET':
        try:
            analyses = FaceAnalysis.objects.all()
            
            data = [{
                'id': analysis.id,
                'image_url': request.build_absolute_uri(analysis.image.url) if analysis.image else None,
                'image_name': analysis.image_name,
                'sex': analysis.sex,
                'sex_confidence': analysis.sex_confidence,
                'eyes': analysis.eyes,
                'eyes_confidence': analysis.eyes_confidence,
                'race': analysis.race,
                'race_confidence': analysis.race_confidence,
                'hair': analysis.hair,
                'hair_confidence': analysis.hair_confidence,
                'created_at': analysis.created_at.isoformat(),
                'average_confidence': round(analysis.average_confidence, 2),
                'has_low_confidence': analysis.has_low_confidence
            } for analysis in analyses]
            
            return JsonResponse({
                'success': True,
                'count': len(data),
                'data': data
            })
        
        except Exception as e:
            print("❌ ERROR al obtener análisis:")
            print(traceback.format_exc())
            
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    }, status=405)


@csrf_exempt
def delete_analysis(request, analysis_id):
    """Endpoint para eliminar un análisis"""
    if request.method == 'DELETE':
        try:
            analysis = FaceAnalysis.objects.get(id=analysis_id)
            
            # eliminar imagen del sistema de archivos
            if analysis.image:
                analysis.image.delete(save=False)
            
            # eliminar el registro
            analysis.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Análisis eliminado exitosamente'
            })
        
        except FaceAnalysis.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Análisis no encontrado'
            }, status=404)
        
        except Exception as e:
            print("ERROR al eliminar análisis:")
            print(traceback.format_exc())
            
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
    
    return JsonResponse({
        'success': False,
        'error': 'Método no permitido'
    }, status=405)