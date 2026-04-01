// Inicializar AOS
AOS.init({ duration: 1000, once: true });

// Navbar Scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Parallax Hero
window.addEventListener("scroll", function () {
    const textoHome = document.getElementById("TextoHome");
    const scrollPos = window.scrollY;
    if (textoHome && scrollPos < 600) {
        textoHome.style.opacity = 1 - (scrollPos / 500);
        textoHome.style.transform = `translateY(${scrollPos * 0.2}px)`;
    }
});