// Fungsi umum yang dipakai di beberapa halaman
const rupiah = angka => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(angka)||0);
const penggunaAktif = () => JSON.parse(localStorage.getItem("penggunaAktif") || "null");
function wajibLogin(){
  if(!penggunaAktif()){ location.href="login.html"; return false; }
  return true;
}
function logout(){
  localStorage.removeItem("penggunaAktif");
  location.href="login.html";
}
function renderLayout(judul, aktif){
  const user = penggunaAktif();
  const nav = [
    ["dashboard.html","⌂","Dashboard","dashboard"],
    ["stok.html","▤","Informasi Stok/Katalog","stok"],
    ["checkout.html","＋","Pemesanan Buku","checkout"],
    ["tracking.html","⌖","Tracking Pengiriman","tracking"],
    ["laporan.html","▥","Laporan Pemesanan","laporan"],
    ["transaksi.html","↻","History Transaksi","transaksi"]
  ];
  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">Buku<span>Kita.</span></div>
        <div class="nav-label">Menu utama</div>
        <nav>${nav.map(n=>`<a class="nav-link ${aktif===n[3]?'active':''}" href="${n[0]}"><span class="ico">${n[1]}</span>${n[2]}</a>`).join("")}</nav>
        <div class="sidebar-bottom"><a class="nav-link" href="#" onclick="logout()">↪ Keluar</a></div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div><div class="eyebrow">TOKO BUKU ONLINE / ${judul.toUpperCase()}</div><h1 class="page-title">${judul}</h1></div>
          <div class="user-chip">◉ ${user?.nama || "Pengguna"}</div>
        </header>
        <section id="content"></section>
      </main>
    </div>`;
}
function bukaModal(id){document.getElementById(id)?.classList.add("show")}
function tutupModal(id){document.getElementById(id)?.classList.remove("show")}
function waktuGreeting(){
  const jam=new Date().getHours();
  return jam<11?"Selamat pagi":jam<15?"Selamat siang":jam<18?"Selamat sore":"Selamat malam";
}
function semuaPesanan(){return JSON.parse(localStorage.getItem("dataPesanan")||"[]")}
