# myapp/serializers.py
from rest_framework import serializers

class TextInputSerializer(serializers.Serializer):
    field1 = serializers.CharField(max_length=100)
    field2 = serializers.CharField(max_length=100)
    # Добавьте другие поля по необходимости

class FileInputSerializer(serializers.Serializer):
    file = serializers.FileField()
