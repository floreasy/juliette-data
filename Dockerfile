# juliettedata.fr — le site statique servi par nginx (Coolify, build pack Dockerfile).
# Liste explicite : README, Dockerfile, sources et .git ne sont jamais servis.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html robots.txt sitemap.xml favicon.svg styles.css site.js consent.js /srv/site/
COPY fonts/  /srv/site/fonts/
COPY images/ /srv/site/images/

EXPOSE 80
