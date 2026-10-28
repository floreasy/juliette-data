/* juliette.data — consentement (RGPD / CNIL) et Google Analytics.
   - GA n'est chargé qu'après un « Accepter » explicite, et seulement sur le
     domaine en ligne ; le choix est gardé dans le navigateur (localStorage).
   - Le lien « Cookies » du pied de page (data-gestion-cookies) rouvre le choix.
   - GA_ID : à renseigner quand la propriété GA4 existe (G-XXXXXXXXXX).
   Styles du bandeau : .consentement dans styles.css. */
(function () {
  'use strict';
  var GA_ID = '';
  var HOTES_GA = ['juliettedata.fr', 'www.juliettedata.fr'];
  var HOTES_BANDEAU = HOTES_GA.concat(['floreasy.github.io', 'localhost', '127.0.0.1']);
  var EN_LIGNE = HOTES_GA.indexOf(location.hostname) >= 0 && /^G-[A-Z0-9]+$/.test(GA_ID);
  var AVEC_BANDEAU = HOTES_BANDEAU.indexOf(location.hostname) >= 0;
  var CLE = 'jd-consentement'; // "accepte" | "refuse"

  function lire() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) {} }

  var charge = false;
  function chargerGA() {
    if (charge || !EN_LIGNE) return;
    charge = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  var bandeau = null;
  function fermer() { if (bandeau) bandeau.remove(); bandeau = null; }
  function ouvrir() {
    if (bandeau) return;
    bandeau = document.createElement('div');
    bandeau.className = 'consentement';
    bandeau.setAttribute('role', 'dialog');
    bandeau.setAttribute('aria-label', 'Mesure d’audience');
    bandeau.innerHTML =
      '<p class="mono">( Cookies )</p>' +
      '<p>Ce site mesure sa fréquentation avec Google Analytics. Aucun cookie de mesure n’est déposé sans votre accord.</p>' +
      '<div class="consentement__actions">' +
      '<button type="button" class="btn" data-choix="accepte">Accepter</button>' +
      '<button type="button" class="btn btn--discret" data-choix="refuse">Refuser</button>' +
      '</div>';
    bandeau.addEventListener('click', function (e) {
      var choix = e.target.getAttribute && e.target.getAttribute('data-choix');
      if (!choix) return;
      ecrire(choix);
      if (choix === 'accepte') chargerGA();
      fermer();
    });
    document.body.appendChild(bandeau);
  }

  document.addEventListener('click', function (e) {
    var lien = e.target.closest && e.target.closest('[data-gestion-cookies]');
    if (!lien) return;
    e.preventDefault();
    ouvrir();
  });

  if (!AVEC_BANDEAU) return;
  var choix = lire();
  if (choix === 'accepte') chargerGA();
  else if (choix !== 'refuse') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ouvrir);
    else ouvrir();
  }
})();
