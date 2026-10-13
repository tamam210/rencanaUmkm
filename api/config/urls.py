"""URL utama project sensory.id."""

from django.contrib import admin
from django.urls import path

from core.views import health

admin.site.site_header = "RencanaUMKM Admin"
admin.site.site_title = "RencanaUMKM"
admin.site.index_title = "Panel Pengelolaan"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health, name="health"),
]
