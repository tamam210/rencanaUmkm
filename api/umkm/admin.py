from django.contrib import admin

from .models import Kategori, Umkm, UmkmLink


@admin.register(Kategori)
class KategoriAdmin(admin.ModelAdmin):
    list_display = ("nama", "slug")
    search_fields = ("nama",)
    prepopulated_fields = {"slug": ("nama",)}


class UmkmLinkInline(admin.TabularInline):
    model = UmkmLink
    extra = 1


@admin.register(Umkm)
class UmkmAdmin(admin.ModelAdmin):
    list_display = ("nama", "kategori", "kota", "provinsi", "range_harga", "status", "pemilik")
    list_filter = ("status", "kategori", "provinsi", "range_harga")
    search_fields = ("nama", "alamat", "kota", "kelurahan", "kecamatan")
    prepopulated_fields = {"slug": ("nama",)}
    list_select_related = ("kategori", "pemilik")
    inlines = [UmkmLinkInline]
    actions = ("tandai_terverifikasi", "tandai_ditolak")

    @admin.action(description="Tandai sebagai terverifikasi")
    def tandai_terverifikasi(self, request, queryset):
        jumlah = queryset.update(status=Umkm.Status.TERVERIFIKASI)
        self.message_user(request, f"{jumlah} UMKM ditandai terverifikasi.")

    @admin.action(description="Tandai sebagai ditolak")
    def tandai_ditolak(self, request, queryset):
        jumlah = queryset.update(status=Umkm.Status.DITOLAK)
        self.message_user(request, f"{jumlah} UMKM ditandai ditolak.")
