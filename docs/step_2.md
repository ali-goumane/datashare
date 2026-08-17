Tu es un développeur frontend senior. Tu finalises DataShare : interface React complète branchée sur l’API Nest
déjà en place.
CONTEXTE
- frontend/ est un projet React 19 + Vite + TypeScript DÉJÀ initialisé. NE le régénère PAS.
- backend/ existe et l’API suit les contrats ci-dessous. NE réécris PAS le backend sauf bug de typage/contrat
bloquant, et dans ce cas dis-le avant.
- J’ai joint : PNG Figma regroupant TOUTES les pages, éventuellement d’autres maquettes, logo img.png, tokens
couleurs.
- Le PNG Figma est la SOURCE DE VÉRITÉ visuelle. Reproduis layout, hiérarchie, labels FR, boutons, cards.
INTERDIT (NON NÉGOCIABLE)
- AUCUN test : pas de Cypress, Playwright, Jest, Testing Library, Vitest, k6, stories de test.
- Ne crée pas, ne modifie pas et ne lance pas les tests existants.
- PAS de lib UI lourde (pas de MUI, Chakra, Ant, Bootstrap). CSS modules ou CSS simple.
- PAS de commit Git sauf si je le demande.
- Ne remplace pas ma police par Inter/Roboto/Arial si le brief/maquette indique autre chose.
- N’ajoute pas de librairie uniquement pour éviter quelques lignes de code.
POLICE UI
- "DM Sans" ou "Outfit" si la maquette confirme ce choix.
STACK FRONT
- React 19, Vite, TypeScript, react-router-dom
- API base : VITE_API_URL ou proxy Vite /api → http://localhost:3000
- JWT dans localStorage (clé du type datashare_token)
- AuthProvider (token, user, login, logout, register, loading)
ROUTES
- / Upload (anonyme OK)
- /login Connexion + lien inscription
- /register Inscription
- /download/:token Métadonnées + download
- /espace Historique protégé → redirect /login si pas de JWT
- * → /
PAGES / COMPOSANTS À CRÉER
src/components/ : Logo, Button, Input, Select, Card, FileDropzone, Header, Callout, BottomNav (si maquette)
src/layouts/AppLayout.tsx : fond dégradé + header src/pages/ : UploadPage, LoginPage, RegisterPage, DownloadPage,
EspacePage src/services/api.ts : seuls fetch vers l’API src/hooks/useAuth.tsx src/types/index.ts
src/constants/designSystem.ts src/constants/index.ts src/styles/theme.css index.html : lang=fr, title DataShare,
Google Fonts vite.config.ts : proxy /api → http://localhost:3000 Copier img.png → frontend/public/logo.png
DESIGN SYSTEM — OBLIGATOIRE
Crée un petit Design System dans frontend/src/constants/designSystem.ts.
Il doit centraliser les constantes visuelles réutilisées :
- couleurs
- tailles de texte
- poids de police
- espacements
- rayons de bordure
- ombres
- tailles de boutons et champs
- éventuellement les largeurs/hauteurs récurrentes si la maquette les impose
Exemple de structure simple :
export const colors = {
primary: "...", primaryDark: "...", background: "...", surface: "...", text: "...", textMuted: "...", border:
"...", success: "...", error: "..."
};
export const fontSizes = {
small: "...", body: "...", medium: "...", title: "...", heading: "..."
};
export const spacing = {
xs: "...", sm: "...", md: "...", lg: "...", xl: "..."
};
export const radius = {
small: "...", medium: "...", large: "..."
};
export const shadows = {
card: "..."
};
N’invente pas une architecture de Design System complexe. Pas de classes abstraites, pas de tokens imbriqués sur
plusieurs niveaux, pas de thème générique. Quelques objets simples exportés suffisent.
RÈGLE IMPORTANTE
- Une valeur visuelle répétée ne doit pas être recopiée dans plusieurs composants.
- Si une couleur, taille de texte, marge, rayon ou ombre est réutilisée, elle doit venir de
src/constants/designSystem.ts.
- Les composants doivent rester lisibles. On doit comprendre le style en lisant le composant.
- Si une valeur n’est utilisée qu’une seule fois et n’a pas vocation à devenir un token, ne crée pas un token
inutile.
- theme.css doit rester simple. Utilise-le principalement pour les styles globaux et les variables CSS nécessaires
au
navigateur.
- Ne transforme pas le Design System en framework interne.
CODE SIMPLE ET JUNIOR-FRIENDLY — NON NÉGOCIABLE
Le code final doit être stupide, explicite et facile à comprendre.
- Préfère 20 lignes évidentes à 5 lignes très abstraites.
- Pas de factory, builder, generic TypeScript complexe, HOC, pattern avancé ou helper magique sans nécessité.
- Pas de composants qui font trop de choses.
- Pas de logique métier cachée dans des utilitaires génériques.
- Les noms de variables et fonctions doivent être explicites.
- Les composants doivent être courts et prévisibles.
- N’ajoute pas une abstraction simplement parce qu’elle est "plus propre" sur le papier.
- Avant de terminer, relis le code et supprime les abstractions inutiles.
DESIGN
- Suis le PNG Figma en priorité.
- Fond : dégradé chaud orange → corail/rose si confirmé par la maquette.
- Cards blanches, coins arrondis, ombre douce.
- Bouton primaire : orange/corail, texte blanc, coins arrondis.
- Bouton secondaire : blanc + bordure.
- Labels FR Figma : Connexion, Téléverser, Télécharger, Mon espace, Se connecter, Déconnexion…
COMPORTEMENT PAR PAGE
Upload
- Dropzone + liste fichier, password optionnel (≥ 6), expire 1–7 j (slider ou select), tags virgules
- Succès : lien {origin}/download/{token} + bouton Copier
- Auth optionnelle (envoyer Bearer si connecté)
- Limite 1 Go, refuser exécutables côté UX aussi
Login / Register
- email + password (compte ≥ 8)
- messages d’erreur FR inline
- après succès → /espace
Download
- GET metadata : nom, taille formatée (B/KB/MB/GB), type, expire_at, hasPassword, expired
- si expired : message, pas de download
- si hasPassword : champ mot de passe
- POST download → blob + <a download>
Mon espace (protégé)
- liste : nom, taille, dates, tags, statut Valide/Expiré
- copier le lien, supprimer avec window.confirm
- empty state + CTA « Partager un fichier »
UX
- états loading sur submit
- toasts ou Callout FR (erreur / succès)
- labels accessibles, boutons type="button"|"submit", clavier
- mobile + desktop d’après le PNG (header, éventuellement bottom nav si connecté)
CONTRATS API À RESPECTER
POST /api/auth/register|login → { access_token, user:{ userId, email } } GET /api/auth/me POST /api/files/upload
multipart file, password?, expireDays?, tags? GET /api/files → tableau + status GET /api/files/token/:token →
expire_at, hasPassword, expired POST /api/files/token/:token/download { password? } blob DELETE /api/files/:id
LANCEMENT EN ARRIÈRE-PLAN — OBLIGATOIRE
À la fin, ajoute à la racine du dépôt un petit script Node sans dépendance supplémentaire :
- scripts/start-dev.js
- éventuellement scripts/stop-dev.js si cela reste simple
Le script de démarrage doit :
1. lancer le backend avec "npm run start:dev" depuis backend/ 2. lancer le frontend avec "npm run dev" depuis
frontend/ 3. écrire les sorties dans logs/backend.log et logs/frontend.log 4. détacher les deux processus pour que
la commande rende immédiatement la main au terminal 5. fonctionner sur Windows, macOS et Linux autant que possible
avec les API Node natives 6. ne pas utiliser Docker, PM2 ou une autre infrastructure supplémentaire
Ajoute un script racine :
"dev:background": "node scripts/start-dev.js"
Le README doit expliquer simplement :
- npm run dev:background
- où regarder les logs
- comment arrêter les processus si un script stop-dev est fourni
- Front : http://localhost:5173
- API : http://localhost:3000/api
- Swagger : http://localhost:3000/api/docs
Ne lance pas le serveur en mode interactif dans ta réponse. Le but est que "npm run dev:background" rende la main
immédiatement.
PREUVE DE FIN
- npm run build du frontend DOIT passer.
- Vérifie uniquement la compilation/build. N’écris, ne modifie et ne lance AUCUN test.
- Résume les pages, les commandes de lancement en arrière-plan, l’emplacement des logs et ce qui reste hors scope.
- Vérifie que toutes les constantes visuelles réutilisées sont centralisées dans src/constants/designSystem.ts.
- Vérifie que le code est lisible par un junior et supprime les abstractions inutiles avant de terminer.

