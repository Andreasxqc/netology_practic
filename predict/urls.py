from django.urls import path
from .views import TextPredictionView, FilePredictionView

urlpatterns = [
    path('predict/text/', TextPredictionView.as_view(), name='predict_text'),
    path('predict/file/', FilePredictionView.as_view(), name='predict_file'),
]