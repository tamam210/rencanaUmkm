from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """Cek apakah API hidup dan bisa nyambung ke database."""
    db_ok = True
    error = ""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception as exc:  # noqa: BLE001 - sengaja nampilin pesan error apa pun
        db_ok = False
        error = str(exc)

    payload = {
        "status": "ok" if db_ok else "degraded",
        "service": "RencanaUMKM api",
        "database": "ok" if db_ok else "error",
    }
    if error:
        payload["error"] = error

    code = status.HTTP_200_OK if db_ok else status.HTTP_503_SERVICE_UNAVAILABLE
    return Response(payload, status=code)
