# type: ignore
from rest_framework import serializers

class SummarizeSerializer(serializers.Serializer):
    lecture_text = serializers.CharField()
    style = serializers.ChoiceField(
        choices=[
            ('formal', 'Formal'),
            ('creative', 'Creative'),
        ],
        default='formal'
    )
    summary_length = serializers.IntegerField(default=200)
