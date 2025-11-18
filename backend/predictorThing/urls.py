# predictorThing/urls.py
from django.urls import path
from . import views

app_name = 'predictorThing'

urlpatterns = [
    path('', views.predict_face_view, name='home'),
    path('predict/', views.predict_face_view, name='predict'),
    path('api/predict/', views.api_predict, name='api_predict'),
    
    path('api/save/', views.save_analysis, name='save_analysis'),
    path('api/analyses/', views.get_all_analyses, name='get_all_analyses'),
    path('api/analyses/<int:analysis_id>/delete/', views.delete_analysis, name='delete_analysis'),
]