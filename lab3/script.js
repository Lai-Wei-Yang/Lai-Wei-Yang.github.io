// GeoHome multi-page interactions
document.addEventListener("DOMContentLoaded", () => {
  // Welcome intro: shown once per browser tab, then cleanly fades away.
  const welcomeSeenKey = "geohomeWelcomeSeen";
  if (!sessionStorage.getItem(welcomeSeenKey)) {
    sessionStorage.setItem(welcomeSeenKey, "1");

    const welcome = document.createElement("div");
    welcome.className = "welcome-screen";
    welcome.setAttribute("role", "status");
    welcome.setAttribute("aria-label", "Selamat datang ke GeoHome");
    welcome.innerHTML = `
      <div class="welcome-content">
        <div class="welcome-logo-wrap">
          <img src="geohome-logo.png" alt="GeoHome" class="welcome-logo">
        </div>
        <span class="welcome-kicker">KEDAH · MALAYSIA</span>
        <h1>Selamat Datang</h1>
        <p>Jiwa di Sawah, Tenang di GeoHome.</p>
        <div class="welcome-loader" aria-hidden="true"><span></span></div>
      </div>
      <div class="welcome-decoration welcome-decoration-one"></div>
      <div class="welcome-decoration welcome-decoration-two"></div>
    `;
    document.body.prepend(welcome);

    const dismissWelcome = () => {
      welcome.classList.add("welcome-screen-hide");
      window.setTimeout(() => welcome.remove(), 850);
    };

    // Keep the intro brief; the fallback also prevents a stuck overlay.
    window.setTimeout(dismissWelcome, 2400);
    welcome.addEventListener("click", dismissWelcome, { once: true });
  }

  // Mobile navigation
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Highlight the current page in the navigation
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Reveal selected content as it enters the viewport
  const revealItems = document.querySelectorAll(
    ".section-title, .highlight-card, .room-detail-card, .nature-feature, .activity-grid article, .values-grid article, .chapter-grid article, .booking-form-card"
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => {
      item.classList.add("reveal-fade-up");
      observer.observe(item);
    });
  }

  // Preselect room when arriving from a room card
  const roomSelect = document.getElementById("guest-room");
  if (roomSelect) {
    const selectedRoom = new URLSearchParams(window.location.search).get("room");
    const roomMap = {
      "suite-utama": "Suite Utama Bendang — RM180/malam",
      "suite-gunung": "Suite Panorama Gunung — RM160/malam",
      "deluxe-kayu": "Bilik Deluxe Kayu — RM140/malam",
      "deluxe-tenang": "Bilik Deluxe Tenang — RM140/malam",
      "standard-desa": "Bilik Standard Desa — RM120/malam"
    };
    if (selectedRoom && roomMap[selectedRoom]) roomSelect.value = roomMap[selectedRoom];
  }

  // Prevent selecting a check-out date earlier than check-in
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  if (checkin && checkout) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    checkin.min = localToday;
    checkout.min = localToday;
    checkin.addEventListener("change", () => {
      checkout.min = checkin.value || localToday;
      if (checkout.value && checkout.value <= checkin.value) checkout.value = "";
    });
  }

  // Send booking enquiry details to WhatsApp
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;
      const data = new FormData(bookingForm);
      const message = [
        "Hai GeoHome, saya ingin membuat pertanyaan tempahan.",
        "",
        `Nama: ${data.get("guestName")}`,
        `Pilihan bilik: ${data.get("room")}`,
        `Tarikh masuk: ${data.get("checkin")}`,
        `Tarikh keluar: ${data.get("checkout")}`,
        `Bilangan tetamu: ${data.get("guests")}`,
        `Nombor telefon: ${data.get("phone")}`,
        `Catatan: ${data.get("note") || "Tiada"}`
      ].join("\n");
      window.open(`https://wa.me/60123456789?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    });
  }
});
