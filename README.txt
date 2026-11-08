PROJECT UTS PEMROGRAMAN WEB - BUKUKITA

1. DESKRIPSI
BukuKita adalah simulasi aplikasi toko buku online berbasis front-end menggunakan HTML, CSS, dan JavaScript. Data awal disimpan dalam data.js (array/object JavaScript), sedangkan data pendaftaran dan pesanan disimpan sementara di localStorage browser.

2. CARA MENJALANKAN
- Ekstrak folder TokoBukuOnline.
- Buka folder tersebut di Visual Studio Code.
- Jalankan login.html menggunakan browser (disarankan memakai ekstensi Live Server).
- Login menggunakan akun demo:
  Email    : rina@gmail.com
  Password : rina123
  Alternatif: agus@gmail.com / agus123 atau siti@gmail.com / siti123
- Untuk tracking dummy: 20230012 atau 20230013.

3. DAFTAR HALAMAN
- login.html       : login, modal lupa password, modal daftar.
- dashboard.html   : greeting sesuai waktu dan menu navigasi.
- stok.html        : katalog dinamis, pencarian, tambah stok dengan DOM.
- checkout.html    : pemilihan buku, jumlah, informasi pemesan dan pembayaran.
- tracking.html    : pencarian nomor DO dan timeline pengiriman.
- laporan.html     : ringkasan dan tabel laporan pesanan.
- transaksi.html   : riwayat transaksi.

4. STRUKTUR FOLDER
TokoBukuOnline/
|-- login.html
|-- dashboard.html
|-- stok.html
|-- checkout.html
|-- tracking.html
|-- laporan.html
|-- transaksi.html
|-- data.js
|-- css/
|   `-- style.css
|-- js/
|   `-- app.js
|-- img/
`-- README.txt

5. CATATAN
- Aplikasi ini hanya simulasi front-end dan belum terhubung ke server/database.
- localStorage dipakai agar pesanan dan tambahan buku tetap tersedia saat halaman dimuat ulang pada browser yang sama.
- Data pengguna dan password di data.js hanya untuk demonstrasi tugas, bukan cara aman menyimpan kredensial pada aplikasi nyata.
- Gambar cover belum disertakan. Kolom cover pada data.js disiapkan jika ingin menambahkan gambar sendiri ke folder img.
- Jika ingin mengulang data pesanan, hapus data situs/localStorage browser.

6. KOMPONEN PENILAIAN
HTML semantik: penggunaan header, main, section, nav, aside, form, label, table.
CSS: external stylesheet pada css/style.css dan internal stylesheet di login.html. Contoh inline CSS digunakan pada beberapa elemen tampilan.
JavaScript DOM: render katalog, tambah buku, modal, pencarian, ringkasan checkout, tracking, laporan, dan history.
Validasi: atribut required, type=email, min, pattern, serta validasi JavaScript dan alert.
Modularitas: data.js untuk data, js/app.js untuk fungsi umum, css/style.css untuk tampilan.

7. SARAN DEMO VIDEO
- Perkenalkan tujuan aplikasi dan struktur folder.
- Tunjukkan login berhasil dan login salah.
- Tunjukkan modal lupa password dan daftar.
- Jelaskan greeting dashboard.
- Tambahkan satu buku baru pada halaman katalog.
- Buat pesanan dan jelaskan validasi jumlah stok.
- Lacak DO demo 20230012.
- Tunjukkan laporan dan riwayat transaksi.
- Tutup dengan penjelasan bahwa semua data merupakan dummy/localStorage tanpa backend.
