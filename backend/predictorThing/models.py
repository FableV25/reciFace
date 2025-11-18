from django.db import models
from django.utils import timezone

class FaceAnalysis(models.Model):
    # image
    image = models.ImageField(upload_to='face_images/%Y/%m/%d/')
    
    # prediction results
    sex = models.CharField(max_length=20)
    sex_confidence = models.FloatField()
    
    eyes = models.CharField(max_length=50)
    eyes_confidence = models.FloatField()
    
    race = models.CharField(max_length=50)
    race_confidence = models.FloatField()
    
    hair = models.CharField(max_length=50)
    hair_confidence = models.FloatField()
    
    # metadata and sh
    created_at = models.DateTimeField(default=timezone.now)
    image_name = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'face_analysis'
        ordering = ['-created_at']
        verbose_name = 'Analisis facial'
        verbose_name_plural = 'Analisis faciales'
    
    def __str__(self):
        return f"Analisis {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def has_low_confidence(self):
        """regresa "True" si la prediccion tiene  < 70% de certeza"""
        return any([
            self.sex_confidence < 70,
            self.eyes_confidence < 70,
            self.race_confidence < 70,
            self.hair_confidence < 70
        ])
    
    @property
    def average_confidence(self):
        """saca el promedio de certeza de todas las predicciones"""
        return (
            self.sex_confidence + 
            self.eyes_confidence + 
            self.race_confidence + 
            self.hair_confidence
        ) / 4