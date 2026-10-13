from rest_framework import serializers

from .models import Kategori, Umkm, UmkmLink


class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = ["id", "nama", "slug"]


class UmkmLinkSerializer(serializers.ModelSerializer):
    tipe_label = serializers.CharField(source="get_tipe_display", read_only=True)

    class Meta:
        model = UmkmLink
        fields = ["id", "tipe", "tipe_label", "url", "label", "jumlah_klik"]


class UmkmListSerializer(serializers.ModelSerializer):
    kategori = KategoriSerializer(read_only=True)

    class Meta:
        model = Umkm
        fields = [
            "id",
            "nama",
            "slug",
            "kategori",
            "deskripsi",
            "kota",
            "provinsi",
            "range_harga",
        ]


class UmkmDetailSerializer(serializers.ModelSerializer):
    kategori = KategoriSerializer(read_only=True)
    links = UmkmLinkSerializer(many=True, read_only=True)

    class Meta:
        model = Umkm
        fields = [
            "id",
            "nama",
            "slug",
            "kategori",
            "deskripsi",
            "alamat",
            "kelurahan",
            "kecamatan",
            "kota",
            "provinsi",
            "range_harga",
            "tahun_mulai",
            "jumlah_karyawan",
            "links",
            "dibuat",
            "diperbarui",
        ]
