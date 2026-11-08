// Fungsi umum
const toNumber = value => typeof value === "number" ? value : Number(String(value ?? "").replace(/[^0-9]/g, "")) || 0;
const rupiah = n => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(toNumber(n));
const bookCode = b => b.kodeBarang ?? b.kode;
const bookTitle = b => b.namaBarang ?? b.judul;
const bookAuthor = b => b.penulis ?? "—";
const bookCategory = b => b.jenisBarang ?? b.kategori ?? "Buku";
const bookPrice = b => toNumber(b.harga);
const getOrders = () => JSON.parse(localStorage.getItem("bk_orders") || "[]");
const saveOrders = orders => localStorage.setItem("bk_orders", JSON.stringify(orders));
const getBooks = () => JSON.parse(localStorage.getItem("bk_books") || "null") || dataKatalogBuku;
const saveBooks = books => localStorage.setItem("bk_books", JSON.stringify(books));
function toast(message) { const el = document.getElementById("toast"); if (!el) { alert(message); return; } el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2800); }
function makeDo() { return "DO-2026-" + String(Date.now()).slice(-6); }
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }

// Login dan modal
document.querySelectorAll("[data-modal]").forEach(btn => btn.addEventListener("click", () => document.getElementById(btn.dataset.modal)?.classList.add("active")));
document.querySelectorAll(".modal-close, .modal-backdrop").forEach(el => el.addEventListener("click", e => { if (e.target === el || el.classList.contains("modal-close")) el.closest(".modal-backdrop")?.classList.remove("active"); }));
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim(), pass = document.getElementById("loginPassword").value;
  const usersTambahan = JSON.parse(localStorage.getItem("bk_users") || "[]");
  const user = [...dataPengguna, ...usersTambahan].find(u => u.email === email && u.password === pass);
  if (!user) { alert("email/password yang anda masukkan salah"); return; }
  sessionStorage.setItem("bk_logged_in", "true");
  sessionStorage.setItem("bk_user", JSON.stringify({ nama: user.nama || user.name, role: user.role || "User" }));
  location.href = "dashboard.html";
});
document.getElementById("forgotForm")?.addEventListener("submit", e => { e.preventDefault(); toast("Jika email terdaftar, instruksi reset akan dikirim. (Simulasi)"); document.getElementById("forgotModal").classList.remove("active"); });
document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault(); const users = JSON.parse(localStorage.getItem("bk_users") || "[]");
  const email = document.getElementById("regEmail").value.trim();
  if (dataPengguna.some(u => u.email === email) || users.some(u => u.email === email)) { alert("Email sudah terdaftar."); return; }
  users.push({ nama: document.getElementById("regName").value.trim(), email, password: document.getElementById("regPassword").value, role: "User" }); localStorage.setItem("bk_users", JSON.stringify(users));
  document.getElementById("registerModal").classList.remove("active"); toast("Pendaftaran berhasil. Silakan login.");
});
document.querySelectorAll("[data-logout]").forEach(b => b.addEventListener("click", () => { sessionStorage.removeItem("bk_logged_in"); location.href = "login.html"; }));

// Dashboard: greeting memakai waktu lokal perangkat
if (document.getElementById("greeting")) {
  const h = new Date().getHours(); document.getElementById("greeting").textContent = h < 11 ? "Selamat pagi, Admin!" : h < 15 ? "Selamat siang, Admin!" : h < 18 ? "Selamat sore, Admin!" : "Selamat malam, Admin!";
  document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date());
  const books = getBooks(), orders = getOrders();
  const currentUser = JSON.parse(sessionStorage.getItem("bk_user") || "{}");
  if (currentUser.nama) document.getElementById("greeting").textContent = document.getElementById("greeting").textContent.replace("Admin", escapeHTML(currentUser.nama));
  document.getElementById("statBooks").textContent = books.length; document.getElementById("statOrders").textContent = orders.length;
  document.getElementById("statLow").textContent = books.filter(b => Number(b.stok) <= 5).length;
  document.getElementById("statRevenue").textContent = rupiah(orders.reduce((s,o) => s + o.total, 0));
}

// Katalog: render dan tambah baris melalui DOM
function renderCatalog(filter = "") {
  const body = document.getElementById("catalogBody"); if (!body) return;
  const books = getBooks().filter(b => (bookTitle(b) + " " + bookAuthor(b) + " " + bookCategory(b) + " " + bookCode(b)).toLowerCase().includes(filter.toLowerCase()));
  body.innerHTML = books.map(b => `<tr><td><img class="book-thumb" src="${escapeHTML(b.cover || "")}" alt="Sampul ${escapeHTML(bookTitle(b))}"></td><td><span class="code-tag">${escapeHTML(bookCode(b))}</span></td><td><strong>${escapeHTML(bookTitle(b))}</strong></td><td>${escapeHTML(bookAuthor(b))}</td><td>${escapeHTML(bookCategory(b))}${b.edisi ? " · Ed. " + escapeHTML(b.edisi) : ""}</td><td>${rupiah(bookPrice(b))}</td><td>${b.stok}</td><td><span class="status ${b.stok <= 5 ? "warning" : "success"}">${b.stok <= 5 ? "Menipis" : "Tersedia"}</span></td></tr>`).join("") || '<tr><td colspan="8" class="empty-cell">Buku tidak ditemukan.</td></tr>';
  document.getElementById("catalogCount").textContent = `${books.length} buku ditemukan`;
}
if (document.getElementById("catalogBody")) {
  renderCatalog(); document.getElementById("catalogSearch").addEventListener("input", e => renderCatalog(e.target.value));
  document.getElementById("openAddBook").addEventListener("click", () => document.getElementById("addBookModal").classList.add("active"));
  document.getElementById("addBookForm").addEventListener("submit", e => {
    e.preventDefault(); const books = getBooks();
    books.push({ kodeBarang: "BK" + String(Date.now()).slice(-5), namaBarang: document.getElementById("bookTitle").value.trim(), penulis: document.getElementById("bookAuthor").value.trim(), jenisBarang: document.getElementById("bookCategory").value.trim(), edisi: "1", stok: Number(document.getElementById("bookStock").value), harga: Number(document.getElementById("bookPrice").value), cover: "" });
    saveBooks(books); renderCatalog(document.getElementById("catalogSearch").value); e.target.reset(); document.getElementById("addBookModal").classList.remove("active"); toast("Buku berhasil ditambahkan ke katalog.");
  });
}

// Checkout: keranjang interaktif, ubah jumlah/hapus item, validasi form
let cart = {};
function renderCheckout() {
  const list = document.getElementById("checkoutBooks"); if (!list) return;
  list.innerHTML = getBooks().map(b => `<div class="pick-row"><div><strong>${escapeHTML(bookTitle(b))}</strong><small>${escapeHTML(bookAuthor(b))} · Stok ${b.stok}</small><b>${rupiah(bookPrice(b))}</b></div><button class="btn btn-small btn-outline" data-add="${escapeHTML(bookCode(b))}" ${b.stok < 1 ? "disabled" : ""}>＋ Tambah</button></div>`).join("");
  list.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => { const book = getBooks().find(b => bookCode(b) === btn.dataset.add); const key = bookCode(book), qty = cart[key] || 0; if (qty >= book.stok) { toast("Jumlah melebihi stok yang tersedia."); return; } cart[key] = qty + 1; renderCart(); }));
  renderCart();
}
function renderCart() {
  const wrap = document.getElementById("cartItems"); if (!wrap) return;
  const books = getBooks(), chosen = books.filter(b => cart[bookCode(b)]);
  wrap.innerHTML = chosen.length ? chosen.map(b => { const k = bookCode(b); return `<div class="cart-row"><div><strong>${escapeHTML(bookTitle(b))}</strong><small>${rupiah(bookPrice(b))} / buku</small></div><div class="qty-control"><button data-minus="${k}">−</button><span>${cart[k]}</span><button data-plus="${k}">＋</button></div><button class="remove-btn" data-remove="${k}" aria-label="Hapus">×</button></div>`; }).join("") : '<p class="muted">Belum ada buku dipilih.</p>';
  wrap.querySelectorAll("[data-minus]").forEach(b => b.addEventListener("click", () => { const k=b.dataset.minus; cart[k]--; if (!cart[k]) delete cart[k]; renderCart(); }));
  wrap.querySelectorAll("[data-plus]").forEach(b => b.addEventListener("click", () => { const k=b.dataset.plus, book=books.find(x=>bookCode(x)===k); if(cart[k] < book.stok) cart[k]++; else toast("Stok tidak mencukupi."); renderCart(); }));
  wrap.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => { delete cart[b.dataset.remove]; renderCart(); }));
  document.getElementById("cartTotal").textContent = rupiah(chosen.reduce((s,b)=>s+bookPrice(b)*cart[bookCode(b)],0));
}
if (document.getElementById("checkoutBooks")) {
  renderCheckout();
  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault(); const books=getBooks(), chosen=books.filter(b=>cart[bookCode(b)]);
    if (!chosen.length) { alert("Pilih minimal satu buku sebelum menyimpan pesanan."); return; }
    const total=chosen.reduce((s,b)=>s+bookPrice(b)*cart[bookCode(b)],0), doNumber=makeDo();
    const order={ do:doNumber, nama:document.getElementById("buyerName").value.trim(), email:document.getElementById("buyerEmail").value.trim(), alamat:document.getElementById("buyerAddress").value.trim(), ekspedisi:document.getElementById("courier").value, payment:document.getElementById("payment").value, tanggal:new Date().toLocaleDateString("id-ID"), total, items:chosen.map(b=>({kode:bookCode(b),judul:bookTitle(b),qty:cart[bookCode(b)],harga:bookPrice(b)})), status:"Diproses", progress:20 };
    chosen.forEach(b=>b.stok-=cart[bookCode(b)]); saveBooks(books); const orders=getOrders(); orders.unshift(order); saveOrders(orders);
    
    alert("Pesanan berhasil disimpan!\nNomor Delivery Order: "+doNumber); cart={}; e.target.reset(); renderCheckout();
  });
}

// Tracking: cari data contoh atau transaksi yang dibuat
document.getElementById("trackingForm")?.addEventListener("submit", e => {
  e.preventDefault(); const id=document.getElementById("trackingInput").value.trim().toUpperCase();
  const order=getOrders().find(o=>o.do.toUpperCase()===id); const demo=dataTracking[id]; const item=order || demo;
  const result=document.getElementById("trackingResult");
  if (!item) { result.innerHTML='<div class="empty-state">Nomor Delivery Order tidak ditemukan. Periksa kembali nomor yang dimasukkan.</div>'; return; }
  const progress=item.progress ?? (item.status === "Dikirim" ? 100 : 65);
  const timeline = item.perjalanan?.length ? `<div class="timeline">${item.perjalanan.map(p => `<div class="timeline-item"><span class="timeline-dot"></span><div><strong>${escapeHTML(p.keterangan)}</strong><small>${escapeHTML(p.waktu)}</small></div></div>`).join("")}</div>` : "";
  result.innerHTML=`<div class="table-card tracking-card"><div class="tracking-head"><div><span class="eyebrow">DETAIL PENGIRIMAN</span><h2>${escapeHTML(item.do || item.nomorDO)}</h2></div><span class="status ${progress>=100?"success":"info"}">${escapeHTML(item.status || "Dalam perjalanan")}</span></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><div class="progress-labels"><span>Pesanan dibuat</span><span>Dikirim</span><span>Diterima</span></div><div class="detail-grid"><div><small>NAMA PEMESAN</small><strong>${escapeHTML(item.nama)}</strong></div><div><small>EKSPEDISI</small><strong>${escapeHTML(item.ekspedisi)}</strong></div><div><small>TANGGAL KIRIM / PESAN</small><strong>${escapeHTML(item.tanggal || item.tanggalKirim)}</strong></div><div><small>JENIS PAKET</small><strong>${escapeHTML(item.paket || "Reguler")}</strong></div><div><small>ALAMAT</small><strong>${escapeHTML(item.alamat || "-")}</strong></div><div><small>TOTAL PEMBAYARAN</small><strong>${typeof item.total === "string" ? escapeHTML(item.total) : rupiah(item.total)}</strong></div></div>${timeline}</div>`;
});

// Histori transaksi dan laporan
function renderTransactions(filter="") {
  const body=document.getElementById("transactionBody"); if(!body)return;
  const orders=getOrders().filter(o=>(o.do+" "+o.nama).toLowerCase().includes(filter.toLowerCase()));
  document.getElementById("transactionCount").textContent=orders.length+" TRANSAKSI";
  body.innerHTML=orders.map(o=>`<tr><td><strong>${escapeHTML(o.do)}</strong></td><td>${escapeHTML(o.nama)}</td><td>${escapeHTML(o.tanggal)}</td><td>${escapeHTML(o.payment)}</td><td><strong>${rupiah(o.total)}</strong></td><td><span class="status info">${escapeHTML(o.status)}</span></td></tr>`).join("") || '<tr><td colspan="6" class="empty-cell">Belum ada transaksi. Buat pesanan pertama melalui menu Pemesanan.</td></tr>';
}
if(document.getElementById("transactionBody")) { renderTransactions(); document.getElementById("transactionSearch").addEventListener("input",e=>renderTransactions(e.target.value)); }
if(document.getElementById("reportOrders")) {
  const orders=getOrders(), books=getBooks();
  document.getElementById("reportOrders").textContent=orders.length;
  document.getElementById("reportRevenue").textContent=rupiah(orders.reduce((s,o)=>s+o.total,0));
  document.getElementById("reportTitles").textContent=books.length;
  document.getElementById("reportUnits").textContent=orders.reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0);
  document.getElementById("reportBody").innerHTML=orders.slice(0,5).map(o=>`<tr><td>${escapeHTML(o.do)}</td><td>${escapeHTML(o.nama)}</td><td>${escapeHTML(o.tanggal)}</td><td>${escapeHTML(o.ekspedisi)}</td><td><strong>${rupiah(o.total)}</strong></td></tr>`).join("") || '<tr><td colspan="5" class="empty-cell">Belum ada data pemesanan.</td></tr>';
}
