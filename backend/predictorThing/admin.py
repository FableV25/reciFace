from django.contrib import admin
from .models import FaceAnalysis

@admin.register(FaceAnalysis)
class FaceAnalysisAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'image_name', 
        'sex', 
        'eyes', 
        'race', 
        'hair',
        'average_confidence',
        'created_at'
    ]
    list_filter = ['sex', 'eyes', 'race', 'hair', 'created_at']
    search_fields = ['image_name', 'sex', 'eyes', 'race', 'hair']
    readonly_fields = ['created_at', 'average_confidence', 'has_low_confidence']
    
    fieldsets = (
        ('Información de la Imagen', {
            'fields': ('image', 'image_name', 'created_at')
        }),
        ('Resultados - Sexo', {
            'fields': ('sex', 'sex_confidence')
        }),
        ('Resultados - Ojos', {
            'fields': ('eyes', 'eyes_confidence')
        }),
        ('Resultados - Etnia', {
            'fields': ('race', 'race_confidence')
        }),
        ('Resultados - Cabello', {
            'fields': ('hair', 'hair_confidence')
        }),
        ('Estadísticas', {
            'fields': ('average_confidence', 'has_low_confidence')
        }),
    )
    
    def average_confidence(self, obj):
        return f"{obj.average_confidence:.2f}%"
    average_confidence.short_description = 'Confianza Promedio'