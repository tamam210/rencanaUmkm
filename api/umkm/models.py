from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Kategori(models.Model):
    """Jenis usaha, mis. Kuliner, Fashion, Jasa."""

    nama = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        verbose_name = "Kategori"
        verbose_name_plural = "Kategori"
        ordering = ["nama"]

    def __str__(self):
        return self.nama

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nama)
        super().save(*args, **kwargs)


class Umkm(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        TERVERIFIKASI = "terverifikasi", "Terverifikasi"
        DITOLAK = "ditolak", "Ditolak"

    class RangeHarga(models.TextChoices):
        MURAH = "murah", "Murah"
        SEDANG = "sedang", "Sedang"
        MAHAL = "mahal", "Mahal"

    nama = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    kategori = models.ForeignKey(
        Kategori,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="umkm",
    )
    deskripsi = models.TextField(blank=True)

    # Lokasi (dipisah biar bisa difilter per wilayah)
    alamat = models.CharField(max_length=255, blank=True)
    kelurahan = models.CharField(max_length=100, blank=True)
    kecamatan = models.CharField(max_length=100, blank=True)
    kota = models.CharField(max_length=100, blank=True)
    provinsi = models.CharField(max_length=100, blank=True)

    range_harga = models.CharField(
        max_length=10, choices=RangeHarga.choices, blank=True
    )
    tahun_mulai = models.PositiveIntegerField(null=True, blank=True)
    jumlah_karyawan = models.PositiveIntegerField(null=True, blank=True)

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    pemilik = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="umkm",
    )
    # Asal data, mis. "dataset:pontianak" atau "submission"
    sumber = models.CharField(max_length=100, blank=True)

    dibuat = models.DateTimeField(auto_now_add=True)
    diperbarui = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "UMKM"
        verbose_name_plural = "UMKM"
        ordering = ["nama"]

    def __str__(self):
        return self.nama

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._buat_slug_unik()
        super().save(*args, **kwargs)

    def _buat_slug_unik(self) -> str:
        dasar = slugify(self.nama)[:200] or "umkm"
        slug = dasar
        nomor = 1
        while Umkm.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            nomor += 1
            slug = f"{dasar}-{nomor}"
        return slug


class UmkmLink(models.Model):
    """Link keluar UMKM: toko online, media sosial, WhatsApp, dsb."""

    class Tipe(models.TextChoices):
        SHOPEE = "shopee", "Shopee"
        TOKOPEDIA = "tokopedia", "Tokopedia"
        TIKTOK = "tiktok", "TikTok"
        INSTAGRAM = "instagram", "Instagram"
        FACEBOOK = "facebook", "Facebook"
        WHATSAPP = "whatsapp", "WhatsApp"
        WEBSITE = "website", "Website"
        LAINNYA = "lainnya", "Lainnya"

    umkm = models.ForeignKey(Umkm, on_delete=models.CASCADE, related_name="links")
    tipe = models.CharField(max_length=20, choices=Tipe.choices, default=Tipe.LAINNYA)
    url = models.URLField(max_length=500)
    label = models.CharField(max_length=100, blank=True)
    jumlah_klik = models.PositiveIntegerField(default=0)
    dibuat = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["tipe"]

    def __str__(self):
        return f"{self.get_tipe_display()} — {self.umkm.nama}"
