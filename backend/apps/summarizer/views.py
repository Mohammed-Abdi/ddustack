# type: ignore
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import SummarizeSerializer

GEMINI_URL = settings.GEMINI_URL

@api_view(['POST'])
def summarize_lecture(request):
    serializer = SummarizeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    lecture_text = serializer.validated_data['lecture_text']
    style = serializer.validated_data['style']
    summary_length = serializer.validated_data['summary_length']

    if style == 'formal':
        formatting_instructions = (
            "Write in a formal, objective, and informative tone.\n"
            "Use plain text only.\n"
            "Separate paragraphs with real line breaks.\n"
            "Keep sentences clear, concise, and precise.\n"
        )
    elif style == 'creative':
        formatting_instructions = (
            "Write in a creative, engaging, and vivid tone.\n"
            "Use plain text only.\n"
            "Separate paragraphs with real line breaks.\n"
            "Make the text natural, storytelling-like, and expressive.\n"
        )

    CUSTOM_PROMPT = f"""
You are an expert educator and summarizer.
Read the lecture text carefully and produce a high-quality summary in a {style} style.

Your summary must:
1. Capture main topics, subtopics, and key points
2. Highlight important concepts and examples
3. Be clear, accurate, and structured
4. Use plain text only — no bold, no bullets, no Markdown
5. Separate paragraphs with real line breaks (Enter key)
6. Be under {summary_length} words
6. Use {formatting_instructions}

Do not add phrases like "Here's a summary" or "In conclusion".
Return only the summary text.

Lecture text:
{lecture_text}
"""

    payload = {"contents": [{"parts": [{"text": CUSTOM_PROMPT}]}]}

    try:
        response = requests.post(
            f"{GEMINI_URL}?key={settings.GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        summary = (
            data.get("candidates", [])[0]
            .get("content", {})
            .get("parts", [])[0]
            .get("text", "")
        )
        return Response({"summary": summary})

    except requests.exceptions.RequestException as e:
        return Response(
            {"error": f"Request failed: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
