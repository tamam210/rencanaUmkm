from django.db.models import Q
from rest_framework import viewsets

from .models import Kategori, Umkm
from .serializers import (
    KategoriSerializer,
    UmkmDetailSerializer,
    UmkmListSerializer,
)


class KategoriViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    lookup_field = "slug"


class UmkmViewSet(viewsets.ReadOnlyModelViewSet):
    """Hanya menampilkan UMKM yang sudah terverifikasi (buat publik)."""

    lookup_field = "slug"
    queryset = (
        Umkm.objects.filter(status=Umkm.Status.TERVERIFIKASI)
        .select_related("kategori")
        .prefetch_related("links")
    )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UmkmDetailSerializer
        return UmkmListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        kategori = params.get("kategori")
        if kategori:
            qs = qs.filter(kategori__slug=kategori)

        kota = params.get("kota")
        if kota:
            qs = qs.filter(kota__iexact=kota)

        provinsi = params.get("provinsi")
        if provinsi:
            qs = qs.filter(provinsi__iexact=provinsi)

        harga = params.get("harga")
        if harga:
            qs = qs.filter(range_harga=harga)

        cari = params.get("q")
        if cari:
            qs = qs.filter(
                Q(nama__icontains=cari)
                | Q(deskripsi__icontains=cari)
                | Q(kota__icontains=cari)
                | Q(kecamatan__icontains=cari)
            )

        return qs
