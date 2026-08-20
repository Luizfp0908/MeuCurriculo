/* =============================================================
   Luiz Francisco Pucci Neto
   Sem dependências externas.
   ============================================================= */

(function () {
  'use strict';

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Topo fixo e barra de progresso ----------
     Um único listener, com requestAnimationFrame, em vez de
     recalcular estilo centenas de vezes por segundo.          */

  var topo = document.querySelector('.topo');
  var barra = document.querySelector('.progresso span');
  var aguardando = false;

  function aoRolar() {
    var y = window.scrollY;

    if (topo) topo.classList.toggle('is-fixo', y > 24);

    if (barra) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (total > 0 ? Math.min(y / total, 1) * 100 : 0) + '%';
    }

    aguardando = false;
  }

  window.addEventListener('scroll', function () {
    if (!aguardando) { aguardando = true; window.requestAnimationFrame(aoRolar); }
  }, { passive: true });

  window.addEventListener('resize', aoRolar, { passive: true });
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

  /* ---------- 3. Esquema do processo ----------
     Padrão de abas: clique, setas do teclado, Home e End.     */

  var abas = Array.prototype.slice.call(document.querySelectorAll('.no'));
  var painel = document.querySelector('.esquema__painel');

  if (abas.length && painel) {
    var pNum = painel.querySelector('.esquema__num');
    var pTitulo = painel.querySelector('.esquema__titulo');
    var pTexto = painel.querySelector('.esquema__texto');

    function selecionar(aba, focar) {
      abas.forEach(function (a) {
        var ativa = a === aba;
        a.setAttribute('aria-selected', String(ativa));
        a.setAttribute('tabindex', ativa ? '0' : '-1');
      });

      var indice = abas.indexOf(aba) + 1;
      var num = (indice < 10 ? '0' : '') + indice;

      function pintar() {
        if (pNum) pNum.textContent = num;
        pTitulo.textContent = aba.dataset.titulo;
        pTexto.textContent = aba.dataset.texto;
        painel.setAttribute('aria-labelledby', aba.id);
        painel.classList.remove('is-trocando');
      }

      if (menosMovimento) {
        pintar();
      } else {
        painel.classList.add('is-trocando');
        window.setTimeout(pintar, 130);
      }

      if (focar) aba.focus();
    }

    abas.forEach(function (aba) {
      aba.addEventListener('click', function () { selecionar(aba, false); });

      aba.addEventListener('keydown', function (e) {
        var i = abas.indexOf(aba);
        var destino = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = abas[(i + 1) % abas.length];
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = abas[(i - 1 + abas.length) % abas.length];
        else if (e.key === 'Home') destino = abas[0];
        else if (e.key === 'End') destino = abas[abas.length - 1];

        if (destino) { e.preventDefault(); selecionar(destino, true); }
      });
    });
  }

  /* ---------- 4. Revelar blocos ao entrar na tela ---------- */

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

  /* ---------- 5. Marcar no menu a seção visível ---------- */

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

  /* ---------- 6. Data do carimbo ---------- */

  var carimbo = document.querySelector('[data-atualizado]');
  if (carimbo) {
    var d = new Date();
    var meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    carimbo.textContent = meses[d.getMonth()] + '. ' + d.getFullYear();
  }

})();
