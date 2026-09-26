# SportSub — landing de pré-lancement

Page d'accueil publique de SportSub : elle explique le projet, invite à rejoindre la liste
de lancement et ouvre une porte aux partenaires et sponsors.

Site **statique** : du HTML, du CSS et un fichier JavaScript. Aucune compilation, aucune
dépendance, aucun `npm install`. Tu peux double-cliquer sur `index.html` pour le voir.

Le code de l'application elle-même (carte, comptes, parties) vit dans un autre dépôt :
`sportsub`. Les deux sont volontairement séparés — la landing doit pouvoir être mise en
ligne, modifiée et partagée sans toucher à l'app.

---

## 1. Ce qu'il y a dans le dépôt

```
index.html               la landing complète
mentions-legales.html    obligatoire dès qu'on collecte une adresse e-mail
404.html                 page d'erreur
assets/css/styles.css    tout le style, avec thème clair et thème sombre
assets/js/main.js        formulaire, champs conditionnels, test A/B
assets/img/              favicon et image de partage (réseaux sociaux)
robots.txt               autorise l'indexation, pointe vers le sitemap
sitemap.xml              liste des pages pour Google
site.webmanifest         nom et couleurs de l'app si quelqu'un l'épingle
.github/workflows/       mise en ligne automatique sur GitHub Pages
```

---

## 2. Pousser le dépôt sur GitHub

L'historique Git est déjà initialisé avec un premier commit. Dans **GitHub Desktop** :

1. `File` → `Add local repository…`
2. Choisis le dossier `sportsub-landing`
3. Bouton **Publish repository** en haut à droite
4. Nom : `sportsub-landing`. **Décoche** « Keep this code private » si tu veux que la page
   soit visible sur GitHub Pages sans compte payant.
5. `Publish repository`

---

## 3. Mettre la page en ligne (gratuit)

### Option A — GitHub Pages, recommandée pour démarrer

Le workflow `.github/workflows/deploy-pages.yml` fait tout. Une seule chose à activer :

1. Sur github.com, ouvre le dépôt → `Settings` → `Pages`
2. **Source** : choisis `GitHub Actions`
3. C'est fini. Chaque `Push origin` remet la page en ligne en une minute.

Ton adresse sera :
`https://robertinho-devfront.github.io/sportsub-landing/`

### Option B — Netlify ou Vercel

Glisse le dossier sur netlify.com, ou importe le dépôt sur vercel.com.
Aucune commande de build à renseigner, aucun dossier de sortie : c'est déjà du statique.

### Ton propre nom de domaine

Quand tu auras `sportsub.fr` (ou autre) :

1. Crée un fichier `CNAME` à la racine, contenant seulement `sportsub.fr`
2. Chez ton registrar, pointe le domaine vers GitHub Pages
3. **Important** : remplace toutes les occurrences de
   `https://robertinho-devfront.github.io/sportsub-landing/` par `https://sportsub.fr/`
   dans `index.html`, `mentions-legales.html`, `robots.txt` et `sitemap.xml`.
   Ces adresses servent au référencement et au partage sur les réseaux — une mauvaise
   adresse canonique coûte cher en SEO.

---

## 4. Brancher le formulaire

Par défaut, le formulaire **ouvre ton logiciel de mail** avec le message pré-rempli.
Ça marche tout de suite, mais tu perds les gens qui n'ont pas de client mail configuré.

Pour recevoir les inscriptions directement, ouvre `assets/js/main.js` et remplis la
première ligne de configuration :

```js
var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
var CONTACT_EMAIL = "bonjour@sportsub.fr";
```

Comment obtenir cette adresse, avec **Formspree** (50 envois/mois gratuits) :

1. Crée un compte sur formspree.io
2. `New form` → donne-lui un nom → copie l'URL qui ressemble à `https://formspree.io/f/abcdwxyz`
3. Colle-la dans `FORM_ENDPOINT`, commit, push

Les alternatives équivalentes : Getform, Basin, Netlify Forms (si tu héberges chez Netlify).

Un champ piège invisible (`_gotcha`) bloque déjà les robots spammeurs.

---

## 5. Mesurer ce qui se passe

Aucun cookie n'est déposé, donc **aucun bandeau de consentement n'est nécessaire**.
Pour avoir des statistiques dans le même esprit, décommente le bloc Plausible dans
le `<head>` de `index.html` et remplace le domaine.

Le fichier `main.js` envoie déjà un évènement `Inscription` à Plausible s'il est chargé,
avec le profil et la variante de titre. Tu sauras donc **quel titre convertit le mieux**.

### Le test A/B déjà en place

La page affiche au hasard l'un des deux titres, et le retient pour le visiteur :

- **Variante A** — « Il manque un joueur. » : raconte une situation.
- **Variante B** — « Trouve ton partenaire dans le 17e. » : décrit un service.

Mon pari : A convertit mieux parce qu'elle décrit un problème vécu plutôt qu'une
fonctionnalité. Mais c'est un pari — laisse tourner jusqu'à une centaine d'inscriptions
avant de trancher, sinon tu lis du bruit.

Pour forcer une variante et la regarder : ajoute `?` puis ouvre la console et tape
`localStorage.setItem("sportsub_ab_headline","b")`, puis recharge.

---

## 6. À compléter avant de communiquer

- [ ] `mentions-legales.html` : forme juridique, adresse, SIREN, directeur de publication
- [ ] Une adresse e-mail professionnelle à la place de l'adresse personnelle
- [ ] Vérifier sur place les trois lieux du 17e cités dans la section « Le quartier »
- [ ] Le 3e terrain public manquant (nom, adresse, horaires)
- [ ] `FORM_ENDPOINT` pour recevoir les inscriptions sans passer par le client mail
- [ ] Déclarer le site dans la Google Search Console et y soumettre `sitemap.xml`

---

## 7. Ce qui a été pensé pour toi

**Référencement.** Titre et description uniques, adresse canonique, données structurées
(Organisation, Site, FAQ), sitemap, robots.txt, un seul `<h1>`, hiérarchie de titres
propre, contenu réel en HTML — pas de texte injecté par JavaScript.

**Accessibilité.** Lien d'évitement, contrastes vérifiés dans les deux thèmes, focus
visible, formulaire étiqueté avec messages d'erreur reliés aux champs (`aria-describedby`),
police Atkinson Hyperlegible dessinée pour la lisibilité, `prefers-reduced-motion`
respecté.

**Performance.** Aucune bibliothèque, aucun framework, une seule feuille de style, un seul
script chargé en `defer`. Les polices sont préconnectées et en `display=swap`. La page
tient en quelques dizaines de kilo-octets.

**Conversion.** Un seul objectif par écran, l'appel à l'action répété à trois moments
(haut de page, section partenaires, formulaire), la preuve avant la demande, et la
réassurance RGPD juste sous le champ e-mail — là où naît l'hésitation.
