# myapp/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TextInputSerializer, FileInputSerializer
from .ml_model import model
import pandas as pd
from sklearn.preprocessing import StandardScaler
import io
from django.http import HttpResponse

class TextPredictionView(APIView):
    def post(self, request):
        serializer = TextInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            # Преобразуем данные в формат, подходящий для модели
            df = pd.DataFrame([data])
            # Получаем предсказание
            prediction = model.predict(df)
            # Формируем ответ
            return Response({'prediction': prediction[0]}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FilePredictionView(APIView):
    def post(self, request):
        serializer = FileInputSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            file_extension = file.name.split('.')[-1]

            response_type = request.query_params.get('response_type', 'file')

            try:
                # Обработка разных типов файлов
                if file_extension == 'csv':
                    df = pd.read_csv(file)
                elif file_extension in ['xls', 'xlsx']:
                    df = pd.read_excel(file)
                else:
                    return Response({'error': 'Unsupported file type'}, status=status.HTTP_400_BAD_REQUEST)

                ss = StandardScaler()
                ss.fit(df)
                scaled = ss.transform(df)

                predictions = model.predict(scaled)

                df['Prediction'] = predictions

                if response_type == 'list':
                    predictions_list = predictions.tolist()
                    print(predictions_list)
                    return Response({'predictions': predictions_list}, status=status.HTTP_200_OK)

                elif response_type == 'file':
                    # Создание Excel файла в памяти
                    output = io.BytesIO()
                    with pd.ExcelWriter(output, engine='openpyxl') as writer:
                        df.to_excel(writer, index=False)

                    # Возвращаем файл в ответе
                    response = HttpResponse(output.getvalue(),
                                            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    response['Content-Disposition'] = f'attachment; filename="predictions.xlsx"'
                    return response

                else:
                    return Response({'error': 'Invalid response_type parameter'}, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
