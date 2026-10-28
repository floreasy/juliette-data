/* juliette.data — menu, filtre des références (brouillage), rien d'autre. */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu derrière le + */
  var bouton = document.querySelector('.plus');
  var menu = document.getElementById('menu');
  function fermer() { if (!menu) return; menu.classList.remove('ouvert'); bouton.classList.remove('ouvert'); bouton.setAttribute('aria-expanded', 'false'); }
  if (bouton && menu) {
    bouton.addEventListener('click', function () {
      var ouvert = menu.classList.toggle('ouvert');
      bouton.classList.toggle('ouvert', ouvert);
      bouton.setAttribute('aria-expanded', String(ouvert));
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fermer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
  }

  /* Références : tri par domaine, apparition en brouillage une carte après l'autre */
  var grille = document.getElementById('references');
  if (!grille) return;
  var cartes = Array.prototype.slice.call(grille.querySelectorAll('.carte'));
  var filtres = Array.prototype.slice.call(document.querySelectorAll('.filtre'));
  var compteur = document.getElementById('compteur');
  var DOMAINES = ['structurer', 'rd', 'diag'];
  var GLYPHES = '01<>/{}[]#%&*=+-';
  var raf = null;
  cartes.forEach(function (c) {
    Array.prototype.forEach.call(c.querySelectorAll('[data-texte]'), function (el) { el.dataset.texte = el.textContent; });
  });
  function brouille(txt, p) {
    if (p >= 1) return txt;
    var n = Math.max(0, Math.floor(p * txt.length)), s = '';
    for (var k = 0; k < txt.length; k++) {
      var ch = txt.charAt(k);
      s += (k < n || ch === ' ') ? ch : GLYPHES.charAt(Math.floor(Math.random() * GLYPHES.length));
    }
    return s;
  }
  function jouer(visibles) {
    if (reduit) return;
    if (raf) window.cancelAnimationFrame(raf);
    var t0 = window.performance.now();
    function tick() {
      var ecoule = window.performance.now() - t0, fini = true;
      visibles.forEach(function (c, i) {
        var p = (ecoule - i * 220) / 180;
        Array.prototype.forEach.call(c.querySelectorAll('[data-texte]'), function (el) {
          var q = p + parseFloat(el.dataset.decalage || 0);
          el.textContent = brouille(el.dataset.texte, q);
          if (q < 1) fini = false;
        });
      });
      if (!fini) raf = window.requestAnimationFrame(tick);
    }
    raf = window.requestAnimationFrame(tick);
  }
  function trier(d, pousser) {
    var visibles = [];
    cartes.forEach(function (c) {
      var garde = d === 'tous' || c.dataset.d === d;
      c.hidden = !garde;
      if (garde) {
        c.style.setProperty('--i', visibles.length);
        visibles.push(c);
        c.classList.remove('entre'); void c.offsetWidth; c.classList.add('entre');
      }
    });
    filtres.forEach(function (f) { var actif = f.dataset.d === d; f.classList.toggle('actif', actif); f.setAttribute('aria-pressed', String(actif)); });
    if (compteur) compteur.textContent = '( ' + visibles.length + ' / ' + cartes.length + ' )';
    if (pousser) window.history.replaceState(null, '', d === 'tous' ? window.location.pathname : '#' + d);
    jouer(visibles);
  }
  function depuisAncre() {
    var h = window.location.hash.replace('#', '');
    trier(DOMAINES.indexOf(h) >= 0 ? h : 'tous', false);
  }
  filtres.forEach(function (f) { f.addEventListener('click', function () { trier(f.dataset.d, true); }); });
  window.addEventListener('hashchange', depuisAncre);
  depuisAncre();
})();
