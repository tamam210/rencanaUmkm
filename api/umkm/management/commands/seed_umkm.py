from django.core.management.base import BaseCommand

from umkm.models import Kategori, Umkm, UmkmLink

# Data contoh buat testing (berlatar Kota Pontianak biar nyesuain dataset pilot)
DATA = [
    {
        "nama": "Warung Kopi Sari",
        "kategori": "Kuliner",
        "deskripsi": "Kopi robusta lokal, gorengan hangat, dan nasi kuning pagi.",
        "alamat": "Jl. Merdeka No. 10",
        "kelurahan": "Sungai Bangkong",
        "kecamatan": "Pontianak Kota",
        "kota": "Pontianak",
        "provinsi": "Kalimantan Barat",
        "range_harga": "murah",
        "tahun_mulai": 2018,
        "jumlah_karyawan": 3,
        "links": [
            ("instagram", "https://instagram.com/warungkopisari", "Instagram"),
            ("whatsapp", "https://wa.me/6281200000001", "Pesan via WhatsApp"),
        ],
    },
    {
        "nama": "Batik Cap Khatulistiwa",
        "kategori": "Fashion",
        "deskripsi": "Batik cap motif khas Kalimantan, bisa custom pesanan.",
        "alamat": "Jl. Gajahmada No. 45",
        "kelurahan": "Tanjung Hulu",
        "kecamatan": "Pontianak Timur",
        "kota": "Pontianak",
        "provinsi": "Kalimantan Barat",
        "range_harga": "sedang",
        "tahun_mulai": 2015,
        "jumlah_karyawan": 8,
        "links": [
            ("shopee", "https://shopee.co.id/batikcapkhatulistiwa", "Toko Shopee"),
            ("instagram", "https://instagram.com/batikcapkhatulistiwa", "Instagram"),
        ],
    },
    {
        "nama": "Jasa Servis AC Sejuk Selalu",
        "kategori": "Jasa",
        "deskripsi": "Servis, cuci, dan pasang AC untuk rumah dan kantor.",
        "alamat": "Jl. Ahmad Yani No. 88",
        "kelurahan": "Bangka Belitung",
        "kecamatan": "Pontianak Kota",
        "kota": "Pontianak",
        "provinsi": "Kalimantan Barat",
        "range_harga": "sedang",
        "tahun_mulai": 2020,
        "jumlah_karyawan": 4,
        "links": [
            ("whatsapp", "https://wa.me/6281200000002", "Hubungi kami"),
        ],
    },
    {
        "nama": "Kerajinan Anyaman Rotan Melayu",
        "kategori": "Kerajinan",
        "deskripsi": "Anyaman rotan: kursi, keranjang, dan hiasan rumah.",
        "alamat": "Jl. Karet No. 12",
        "kelurahan": "Dalam Bugis",
        "kecamatan": "Pontianak Timur",
        "kota": "Pontianak",
        "provinsi": "Kalimantan Barat",
        "range_harga": "sedang",
        "tahun_mulai": 2012,
        "jumlah_karyawan": 6,
        "links": [
            ("website", "https://example.com/anyaman-rotan", "Katalog"),
        ],
    },
    {
        "nama": "Kue Basah Bu Yanti",
        "kategori": "Kuliner",
        "deskripsi": "Aneka kue basah tradisional, bisa pesan untuk hajatan.",
        "alamat": "Jl. Siam No. 7",
        "kelurahan": "Bansir Laut",
        "kecamatan": "Pontianak Tenggara",
        "kota": "Pontianak",
        "provinsi": "Kalimantan Barat",
        "range_harga": "murah",
        "tahun_mulai": 2016,
        "jumlah_karyawan": 5,
        "links": [
            ("whatsapp", "https://wa.me/6281200000003", "Pesan kue"),
            ("instagram", "https://instagram.com/kuebasahbuyanti", "Instagram"),
        ],
    },
    {
        "nama": "Kopi Bubuk Robusta Kapuas",
        "kategori": "Kuliner",
        "deskripsi": "Produsen kopi bubuk robusta, jual grosir dan eceran.",
        "alamat": "Jl. Pak Kasih No. 3",
        "kelurahan": "Parit Tokaya",
        "kecamatan": "Pontianak Selatan",
        "kota": "Pontianak",
        "provinsi": "Kalimantan Barat",
        "range_harga": "sedang",
        "tahun_mulai": 2019,
        "jumlah_karyawan": 7,
        "links": [
            ("shopee", "https://shopee.co.id/kopikapuas", "Toko Shopee"),
            ("tiktok", "https://tiktok.com/@kopikapuas", "TikTok"),
        ],
    },
]


class Command(BaseCommand):
    help = "Isi data contoh UMKM untuk testing (aman dijalankan berkali-kali)."

    def handle(self, *args, **options):
        dibuat = 0
        diperbarui = 0

        for baris in DATA:
            item = dict(baris)
            links = item.pop("links", [])
            nama_kategori = item.pop("kategori", "")

            kategori = None
            if nama_kategori:
                kategori, _ = Kategori.objects.get_or_create(nama=nama_kategori)

            umkm, created = Umkm.objects.update_or_create(
                nama=item["nama"],
                defaults={
                    **item,
                    "kategori": kategori,
                    "status": Umkm.Status.TERVERIFIKASI,
                    "sumber": "seed",
                },
            )

            for tipe, url, label in links:
                UmkmLink.objects.get_or_create(
                    umkm=umkm,
                    url=url,
                    defaults={"tipe": tipe, "label": label},
                )

            if created:
                dibuat += 1
            else:
                diperbarui += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Selesai. {dibuat} UMKM baru, {diperbarui} diperbarui."
            )
        )
