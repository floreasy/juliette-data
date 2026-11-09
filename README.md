# juliette.data

Site de Juliette Spinnato, consultante en Science des données et IA à Marseille.
En ligne sur **https://juliettedata.fr**.

Site statique : une page HTML par page du site, une feuille `styles.css`, un
script `site.js`, le consentement et Google Analytics dans `consent.js`, les
polices dans `fonts/`, le portrait dans `images/`. Aucune étape de construction.

## Déploiement (Coolify)

Une application Coolify depuis ce dépôt, branche `main`, build pack
**Dockerfile** (`Dockerfile` + `nginx.conf`), port **80**.

- Domaines : `https://juliettedata.fr,https://www.juliettedata.fr`. Les deux
  sont déclarés pour que Coolify émette les deux certificats ; c'est nginx qui
  redirige `www` vers l'apex en 301, rien à régler dans Coolify.
- `/index.html` redirige vers `/` ; la page 404 est servie pour toute adresse
  inconnue (chemins absolus dans `404.html`).
- Le `Dockerfile` copie une liste explicite de fichiers : un nouveau fichier à
  la racine qui doit être servi s'y ajoute.

## DNS (zone OVH)

`A` de `juliettedata.fr` et de `www.juliettedata.fr` vers le serveur Coolify.
**Ne pas toucher aux `MX` ni au SPF** : la messagerie de la zone est chez OVH.

## SEO

Canoniques et `og:url` sur `https://juliettedata.fr/…`, `sitemap.xml` à mettre à
jour quand une page s'ajoute, `noindex` seulement sur `merci.html` et `404.html`.

Charte, maquettes, fiche et journal : `~/dev/marieetflowsites/clients/juliette-data/`.
