from rest_framework.routers import DefaultRouter

from .views import KategoriViewSet, UmkmViewSet

router = DefaultRouter()
router.register("umkm", UmkmViewSet, basename="umkm")
router.register("kategori", KategoriViewSet, basename="kategori")

urlpatterns = router.urls
