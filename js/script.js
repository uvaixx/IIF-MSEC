document.addEventListener("DOMContentLoaded", () => {
  /* ================= ELEMENTS ================= */
  const navbar = document.getElementById("main-nav");
  const header = document.getElementById("main-header");
  const marquee = document.querySelector(".marquee-bar");
  const toggle = document.getElementById("menu-toggle");
  const wrapper = document.getElementById("social-wrapper");
  const expandTab = document.getElementById("expand-tab");
  const tabIcon = document.getElementById("tab-icon");
  const applySection = document.getElementById("apply");

  /* ================= NAV & LAYOUT LOGIC ================= */
  function updateLayout() {
    if (!header || !navbar || !marquee) return;

    // Header shrink
    header.classList.toggle("shrink", window.scrollY > 50);

    // Navbar position
    const marqueeBottom = marquee.getBoundingClientRect().bottom;
    if (window.scrollY > marquee.offsetHeight) {
      navbar.style.top = header.offsetHeight + "px";
    } else {
      navbar.style.top = marqueeBottom + "px";
    }

    // Glass effect
    navbar.classList.toggle("glass", window.scrollY > 50);
  }

  function deferredUpdate() {
    requestAnimationFrame(() => {
      requestAnimationFrame(updateLayout);
    });
  }

  window.addEventListener("scroll", updateLayout);
  window.addEventListener("resize", deferredUpdate);
  if (header) header.addEventListener("transitionend", updateLayout);
  deferredUpdate();

  /* ================= MOBILE MENU ================= */
  if (toggle && navbar) {
    toggle.addEventListener("click", () => {
      navbar.classList.toggle("mobile-active");
    });
  }

  /* ================= SLIDER LOGIC ================= */
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const sliderEl = document.querySelector(".slider");

  if (slides.length > 0) {
    let index = 0;
    let interval;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => {
        index = i;
        showSlide(index);
        resetAuto();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dots span");

    function showSlide(i) {
      slides.forEach(s => s.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));
      slides[i].classList.add("active");
      dots[i].classList.add("active");
    }

    const nextSlide = () => { index = (index + 1) % slides.length; showSlide(index); };
    const prevSlide = () => { index = (index - 1 + slides.length) % slides.length; showSlide(index); };
    const startAuto = () => interval = setInterval(nextSlide, 4000);
    const resetAuto = () => { clearInterval(interval); startAuto(); };

    nextBtn?.addEventListener("click", () => { nextSlide(); resetAuto(); });
    prevBtn?.addEventListener("click", () => { prevSlide(); resetAuto(); });

    // Swipe Support
    let startX = 0;
    sliderEl?.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    sliderEl?.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      else if (endX - startX > 50) prevSlide();
      resetAuto();
    });

    showSlide(index);
    startAuto();
  }

  /* ================= SOCIAL SIDEBAR & SCROLL EFFECTS ================= */
  let autoCloseTimer;

  const closeBar = () => {
    if (wrapper?.classList.contains("open")) {
      wrapper.classList.remove("open");
      if (tabIcon) tabIcon.style.transform = "rotate(0deg)";
      clearTimeout(autoCloseTimer);
    }
  };

  const openBar = () => {
    wrapper?.classList.add("open");
    if (tabIcon) tabIcon.style.transform = "rotate(180deg)";
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeBar, 5000);
  };

  expandTab?.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.contains("open") ? closeBar() : openBar();
  });

  window.addEventListener("scroll", () => {
    closeBar(); // Always close sidebar on scroll
    
    // Visibility logic for sidebar
    const hero = document.querySelector(".hero");
    const showPoint = (sliderEl?.offsetHeight || 0) + (hero?.offsetHeight || 0);
    
    let reachedApply = false;
    if (applySection) {
      const rect = applySection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) reachedApply = true;
    }

    if (window.scrollY > showPoint && !reachedApply) {
      wrapper?.classList.add("visible");
    } else {
      wrapper?.classList.remove("visible");
    }
  });

  document.addEventListener("click", (e) => {
    if (wrapper && !wrapper.contains(e.target)) closeBar();
  });

  /* ================= REVEAL & SMOOTH SCROLL ================= */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});