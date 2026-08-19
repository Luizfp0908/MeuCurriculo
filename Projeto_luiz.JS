/* =============================================================
   Luiz Francisco Pucci Neto — portfólio
   Sem dependências externas.
   ============================================================= */

(function () {
  'use strict';

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Topo fixo ganha fundo ao rolar ---------------
     Usa requestAnimationFrame para não rodar em todo evento de
     scroll (o código antigo recalculava estilo centenas de vezes
     por segundo e travava no celular).                          */

  var topo = document.querySelector('.topo');
  var aguardando = false;

  function aoRolar() {
    if (topo) topo.classList.toggle('is-fixo', window.scrollY > 24);
    aguardando = false;
  }

  window.addEventListener('scroll', function () {
    if (!aguardando) {
      aguardando = true;
      window.requestAnimationFrame(aoRolar);
    }
  }, { passive: true });

  aoRolar();

  /* ---------- 2. Menu no celular ---------- */

  var botao = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');

  function fecharMenu() {
    if (!botao || !menu) return;
    menu.classList.remove('is-aberto');
    botao.setAttribute('aria-expanded', 'false');
  }

  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('is-aberto');
      botao.setAttribute('aria-expanded', String(aberto));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') fecharMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharMenu();
    });
  }

  /* ---------- 3. Revelar blocos ao entrar na tela ----------
     Substitui a biblioteca AOS: mesmo efeito, zero download.  */

  var alvos = document.querySelectorAll('[data-reveal]');

  if (menosMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('is-visivel'); });
  } else {
    var revelador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visivel');
          revelador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    alvos.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      revelador.observe(el);
    });
  }

  /* ---------- 4. Marcar no menu a seção visível ---------- */

  var secoes = document.querySelectorAll('main section[id]');
  var links = {};

  document.querySelectorAll('.menu a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && secoes.length) {
    var visiveis = new Set();

    var espiao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) visiveis.add(entrada.target.id);
        else visiveis.delete(entrada.target.id);
      });

      // marca a primeira seção visível na ordem do documento;
      // no topo da página nenhuma fica marcada.
      var ativo = null;
      secoes.forEach(function (s) {
        if (ativo === null && visiveis.has(s.id)) ativo = s.id;
      });

      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle('is-ativo', id === ativo);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secoes.forEach(function (s) { espiao.observe(s); });
  }

  /* ---------- 5. Ano do rodapé sempre atual ---------- */

  var ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();

})();
