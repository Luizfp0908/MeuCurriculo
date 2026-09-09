/* =============================================================
   Luiz Francisco Pucci Neto
   Sem dependências externas.

   Regra que vale para o arquivo inteiro: tudo que se move aqui
   se move como uma plotter — a linha é traçada, não some nem
   aparece de repente.
   ============================================================= */

(function () {
  'use strict';

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Topo fixo, barra de progresso e tinta da linha do tempo ----------
     Um único listener de rolagem, com requestAnimationFrame, em
     vez de recalcular estilo centenas de vezes por segundo.      */

  var topo    = document.querySelector('.topo');
  var barra   = document.querySelector('.progresso span');
  var trilho  = document.querySelector('.linha-tempo__trilho');
  var tinta   = trilho ? trilho.querySelector('[data-tinta]') : null;
  var aguardando = false;

  function pintarLinhaTempo() {
    if (!tinta || !trilho) return;

    var caixa = trilho.getBoundingClientRect();
    if (caixa.height <= 0) return;

    /* a tinta acompanha a altura da leitura, não o topo da tela */
    var leitura = window.innerHeight * 0.62;
    var avanco  = (leitura - caixa.top) / caixa.height;

    tinta.style.height = Math.max(0, Math.min(1, avanco)) * 100 + '%';
  }

  function aoRolar() {
    var y = window.scrollY;

    if (topo) topo.classList.toggle('is-fixo', y > 24);

    if (barra) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (total > 0 ? Math.min(y / total, 1) * 100 : 0) + '%';
    }

    pintarLinhaTempo();
    aguardando = false;
  }

  window.addEventListener('scroll', function () {
    if (!aguardando) { aguardando = true; window.requestAnimationFrame(aoRolar); }
  }, { passive: true });

  window.addEventListener('resize', aoRolar, { passive: true });
  aoRolar();

  /* ---------- 2. Menu no celular ---------- */

  var botao = document.querySelector('.menu-btn');
  var menu  = document.getElementById('menu');

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
      if (e.target.closest('a')) fecharMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharMenu();
    });
  }

  /* ---------- 3. Esquema do processo ----------
     Padrão de abas: clique, setas do teclado, Home e End.
     A caneta desliza até o nó escolhido; o painel apaga e
     redesenha o texto.                                          */

  var abas   = Array.prototype.slice.call(document.querySelectorAll('.no'));
  var painel = document.querySelector('.esquema__painel');
  var caneta = document.querySelector('.esquema__caneta');
  var conta  = document.querySelector('[data-conta]');

  if (abas.length && painel) {
    var pNum    = painel.querySelector('.esquema__num');
    var pTitulo = painel.querySelector('.esquema__titulo');
    var pTexto  = painel.querySelector('.esquema__texto');
    var pRisco  = painel.querySelector('.nota__texto');
    var ativa   = abas[0];

    function moverCaneta(aba) {
      if (!caneta || !aba) return;
      caneta.style.setProperty('--y', (aba.offsetTop + aba.offsetHeight / 2) + 'px');
    }

    function selecionar(aba, focar) {
      ativa = aba;

      abas.forEach(function (a) {
        var escolhida = a === aba;
        a.setAttribute('aria-selected', String(escolhida));
        a.setAttribute('tabindex', escolhida ? '0' : '-1');
      });

      var indice = abas.indexOf(aba) + 1;
      var num = (indice < 10 ? '0' : '') + indice;

      moverCaneta(aba);
      if (conta) conta.textContent = num;

      function redesenhar() {
        if (pNum)   pNum.textContent   = num;
        if (pTexto) pTexto.textContent = aba.dataset.texto;
        if (pRisco) pRisco.textContent = aba.dataset.risco;
        pTitulo.textContent = aba.dataset.titulo;
        painel.setAttribute('aria-labelledby', aba.id);
        painel.classList.remove('is-trocando');
      }

      if (menosMovimento) {
        redesenhar();
      } else {
        painel.classList.add('is-trocando');
        window.setTimeout(redesenhar, 150);
      }

      if (focar) aba.focus();
    }

    abas.forEach(function (aba) {
      aba.addEventListener('click', function () { selecionar(aba, false); });

      aba.addEventListener('keydown', function (e) {
        var i = abas.indexOf(aba);
        var destino = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight')    destino = abas[(i + 1) % abas.length];
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')  destino = abas[(i - 1 + abas.length) % abas.length];
        else if (e.key === 'Home')                              destino = abas[0];
        else if (e.key === 'End')                               destino = abas[abas.length - 1];

        if (destino) { e.preventDefault(); selecionar(destino, true); }
      });
    });

    /* a posição da caneta depende da altura real dos nós, que muda
       quando a fonte carrega ou a tela é redimensionada           */
    moverCaneta(ativa);
    window.addEventListener('load', function () { moverCaneta(ativa); });
    window.addEventListener('resize', function () { moverCaneta(ativa); }, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { moverCaneta(ativa); });
    }
  }

  /* ---------- 4. Revelar ao entrar na tela ---------- */

  var alvos = document.querySelectorAll('[data-reveal], [data-traco]');

  if (menosMovimento || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add('is-visivel'); });
  } else {
    /* escalona só o que é linha de lista — nada de cascata geral */
    var emFila = '.registro__linha, .peca, .canais li, .stack__item, .marco';

    Array.prototype.forEach.call(alvos, function (el) {
      if (!el.matches(emFila) || !el.parentElement) return;

      var irmaos = Array.prototype.filter.call(el.parentElement.children, function (n) {
        return n.matches(emFila);
      });

      el.style.setProperty('--fila', Math.min(irmaos.indexOf(el), 6) * 55 + 'ms');
    });

    var revelador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visivel');
        revelador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(alvos, function (el) { revelador.observe(el); });
  }

  /* ---------- 5. Marcar no menu a seção visível ---------- */

  var secoes = document.querySelectorAll('main section[id]');
  var links = {};

  Array.prototype.forEach.call(document.querySelectorAll('.menu a[href^="#"]'), function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && secoes.length) {
    var visiveis = new Set();

    var espiao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) visiveis.add(entrada.target.id);
        else visiveis.delete(entrada.target.id);
      });

      var atual = null;
      Array.prototype.forEach.call(secoes, function (s) {
        if (atual === null && visiveis.has(s.id)) atual = s.id;
      });

      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle('is-ativo', id === atual);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Array.prototype.forEach.call(secoes, function (s) { espiao.observe(s); });
  }

  /* ---------- 6. Cruz de mira no hero ----------
     Só onde existe ponteiro de verdade. Em toque, não aparece.  */

  var hero = document.querySelector('.hero');
  var mira = document.querySelector('.mira');
  var pontEiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hero && mira && pontEiroFino && !menosMovimento) {
    var px = 0, py = 0, marcado = false;

    function desenharMira() {
      mira.style.setProperty('--mx', px + 'px');
      mira.style.setProperty('--my', py + 'px');
      marcado = false;
    }

    hero.addEventListener('pointermove', function (e) {
      var caixa = hero.getBoundingClientRect();
      px = e.clientX - caixa.left;
      py = e.clientY - caixa.top;

      hero.classList.add('is-mirando');
      if (!marcado) { marcado = true; window.requestAnimationFrame(desenharMira); }
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
      hero.classList.remove('is-mirando');
    });
  }

  /* ---------- 7. Data do carimbo ---------- */

  var carimbo = document.querySelector('[data-atualizado]');
  if (carimbo) {
    var d = new Date();
    var meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    carimbo.textContent = meses[d.getMonth()] + '. ' + d.getFullYear();
  }

})();
