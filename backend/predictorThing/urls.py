# predictor/urls.py
from django.urls import path
from . import views

app_name = 'predictorThing'

urlpatterns = [
    path('', views.predict_face_view, name='home'),
    path('predict/', views.predict_face_view, name='predict'),
    path('api/predict/', views.api_predict, name='api_predict'),
]