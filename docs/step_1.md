Tu es un développeur backend senior. Tu construis UNIQUEMENT le backend NestJS de DataShare (clone WeTransfer pour
freelances / TPE).
CONTEXTE
- Le projet NestJS TypeScript est DÉJÀ initialisé dans backend/ (vide / starter). NE le régénère PAS.
- PostgreSQL est déjà disponible localement et sa configuration est fournie par les variables d’environnement. NE
crée
PAS de configuration d’infrastructure.
- J’ai fourni : init.sql, schémas MCD/MLD, schéma d’architecture, éventuellement les specs US.
- Ces fichiers joints sont la SOURCE DE VÉRITÉ. Respecte les noms de tables/colonnes de init.sql.
OBJECTIF
Implémenter le MVC NestJS complet (modules, controllers, services, entities TypeORM, DTO) pour que l’API soit
utilisable avec Swagger et curl/Postman.
INTERDIT (NON NÉGOCIABLE)
- AUCUN test : pas de Jest, spec.ts, e2e, Cypress, k6, Playwright, Testing Library.
- Ne crée pas, ne mets pas à jour et ne lance pas de fichiers de tests existants.
- Ne crée pas de fichier d’infrastructure ou de déploiement non demandé.
- PAS de frontend React.
- PAS de commit Git sauf si je le demande.
- Ne change pas init.sql ni le schéma SQL (synchronize: false).
- N’ajoute pas de librairie lourde inutile. Reste dans l’écosystème Nest habituel.
STACK IMPOSÉE
- NestJS 11, TypeScript, TypeORM, PostgreSQL 16
- JWT (@nestjs/jwt + passport-jwt)
- bcrypt, class-validator, class-transformer
- @nestjs/config, @nestjs/schedule (cron), helmet, @nestjs/throttler, @nestjs/swagger
- Préfixe global : /api
- ValidationPipe global : whitelist, transform, forbidNonWhitelisted
- CORS : FRONTEND_URL (défaut http://localhost:5173)
- Swagger : /api/docs
ARBORESCENCE CIBLE
backend/src/ main.ts app.module.ts app.controller.ts # GET /api/health app.service.ts auth/ # register, login, me,
JWT strategy, guards users/ # accès utilisateurs files/ # upload, metadata, download, history, delete, cron
database/entities/ # User, FileEntity, Tag (table file_tag N–N)
VARIABLES D’ENV
- Utilise backend/.env.example comme modèle.
- Les vraies valeurs sont lues depuis backend/.env via ConfigService.
- .env.example ne contient aucun secret réel de production.
- Ne crée pas de Docker ou de configuration d’infrastructure.
MODÈLE (ALIGNÉ INIT.SQL)
- "user"(user_id, email UNIQUE, password, created_at, updated_at)
- file(file_id, token UNIQUE, name, type, size, path, access_password, uploaded_at, expire_at, user_id NULLABLE)
- tag(tag_id, tag_name)
- file_tag(file_id, tag_id) PK composite
Relations : User 1-N File (nullable = upload anonyme). File N-N Tag.
CONTRATS API (JSON CAMELCASE CÔTÉ NEST, COLONNES SQL SNAKE_CASE)
1) GET /api/health → { status: "ok", service: "datashare-api" }
2) POST /api/auth/register { email, password }
- email valide, password ≥ 8 caractères, hash bcrypt 10
- 409 "Cet email est déjà utilisé"
- 201/200 { access_token, user: { userId, email, createdAt, updatedAt } }
- JAMAIS renvoyer le hash
3) POST /api/auth/login { email, password }
- 401 "Identifiants invalides" (ne pas révéler si l’email existe)
- même payload que register
4) GET /api/auth/me Authorization: Bearer
- 401 si token absent/invalide
5) POST /api/files/upload multipart/form-data
champs : file (obligatoire), password?, expireDays?, tags? (string virgules)
- JWT OPTIONNEL : si connecté, rattacher user_id ; sinon anonyme OK
- max 1 Go
- interdire : .exe .bat .cmd .sh .msi .com .scr .ps1
- token = UUID v4 ; fichier disque renommé (pas le nom original dans le path public)
- expireDays 1–7, défaut 7
- password lien : si fourni, ≥ 6 caractères, hashé bcrypt (access_password)
- tags : split virgules, trim, pas de doublons, lier file_tag
- si échec après écriture disque : nettoyer le fichier temporaire
Réponse : { fileId, token, name, type, size, expireAt, hasPassword, tags: string[] }
6) GET /api/files JWT obligatoire
- uniquement les fichiers du user connecté, uploadedAt DESC
- chaque item : fileId, token, name, type, size, uploadedAt, expireAt, hasPassword, tags, status: "valid"|"expired"
7) GET /api/files/token/:token public
- 404 "Fichier introuvable"
- { name, type, size, expire_at, hasPassword, expired }
8) POST /api/files/token/:token/download { password? } public → stream binaire
- 404 introuvable, 410 Gone "Ce lien a expiré", 401 si mdp requis/incorrect
- Content-Disposition attachment ; filename UTF-8
- ne jamais servir un path hors STORAGE_PATH
9) DELETE /api/files/:id JWT
- 404 / 403 "Vous n'êtes pas autorisé à supprimer ce fichier"
- supprimer le fichier physique PUIS la ligne BDD
- { message: "Fichier supprimé avec succès" }
CRON
- Tous les jours à 01:00 : purge fichiers expire_at < now (disque + BDD). Logger le nombre.
SÉCURITÉ
- Helmet, throttler (login plus strict que le reste si possible)
- Messages d’erreur en FRANÇAIS, stables, non sensibles
- Pas de secrets dans le code
- .env.example sans secret réel de production
QUALITÉ MVC
- Controller = HTTP uniquement.
- Service = métier.
- Entity = mapping SQL.
- DTO class-validator pour chaque body.
- Code clair, peu de commentaires, TypeScript strict.
RÈGLE DE SIMPLICITÉ
Le code doit être compréhensible par un développeur junior.
- Préfère des fonctions courtes et explicites.
- Évite les abstractions qui ne servent qu’à économiser quelques lignes.
- Pas de factory, generic complexe, métaprogrammation ou helper magique sans besoin réel.
- Une logique métier doit être facile à retrouver en lisant le service concerné.
- N’introduis paTu es un développeur backend senior. Tu construis UNIQUEMENT le backend NestJS de DataShare (clone WeTransfer pour
freelances / TPE).
CONTEXTE
- Le projet NestJS TypeScript est DÉJÀ initialisé dans backend/ (vide / starter). NE le régénère PAS.
- PostgreSQL est déjà disponible localement et sa configuration est fournie par les variables d’environnement. NE
crée
PAS de configuration d’infrastructure.
- J’ai fourni : init.sql, schémas MCD/MLD, schéma d’architecture, éventuellement les specs US.
- Ces fichiers joints sont la SOURCE DE VÉRITÉ. Respecte les noms de tables/colonnes de init.sql.
OBJECTIF
Implémenter le MVC NestJS complet (modules, controllers, services, entities TypeORM, DTO) pour que l’API soit
utilisable avec Swagger et curl/Postman.
INTERDIT (NON NÉGOCIABLE)
- AUCUN test : pas de Jest, spec.ts, e2e, Cypress, k6, Playwright, Testing Library.
- Ne crée pas, ne mets pas à jour et ne lance pas de fichiers de tests existants.
- Ne crée pas de fichier d’infrastructure ou de déploiement non demandé.
- PAS de frontend React.
- PAS de commit Git sauf si je le demande.
- Ne change pas init.sql ni le schéma SQL (synchronize: false).
- N’ajoute pas de librairie lourde inutile. Reste dans l’écosystème Nest habituel.
STACK IMPOSÉE
- NestJS 11, TypeScript, TypeORM, PostgreSQL 16
- JWT (@nestjs/jwt + passport-jwt)
- bcrypt, class-validator, class-transformer
- @nestjs/config, @nestjs/schedule (cron), helmet, @nestjs/throttler, @nestjs/swagger
- Préfixe global : /api
- ValidationPipe global : whitelist, transform, forbidNonWhitelisted
- CORS : FRONTEND_URL (défaut http://localhost:5173)
- Swagger : /api/docs
ARBORESCENCE CIBLE
backend/src/ main.ts app.module.ts app.controller.ts # GET /api/health app.service.ts auth/ # register, login, me,
JWT strategy, guards users/ # accès utilisateurs files/ # upload, metadata, download, history, delete, cron
database/entities/ # User, FileEntity, Tag (table file_tag N–N)
VARIABLES D’ENV
- Utilise backend/.env.example comme modèle.
- Les vraies valeurs sont lues depuis backend/.env via ConfigService.
- .env.example ne contient aucun secret réel de production.
- Ne crée pas de Docker ou de configuration d’infrastructure.
MODÈLE (ALIGNÉ INIT.SQL)
- "user"(user_id, email UNIQUE, password, created_at, updated_at)
- file(file_id, token UNIQUE, name, type, size, path, access_password, uploaded_at, expire_at, user_id NULLABLE)
- tag(tag_id, tag_name)
- file_tag(file_id, tag_id) PK composite
Relations : User 1-N File (nullable = upload anonyme). File N-N Tag.
CONTRATS API (JSON CAMELCASE CÔTÉ NEST, COLONNES SQL SNAKE_CASE)
1) GET /api/health → { status: "ok", service: "datashare-api" }
2) POST /api/auth/register { email, password }
- email valide, password ≥ 8 caractères, hash bcrypt 10
- 409 "Cet email est déjà utilisé"
- 201/200 { access_token, user: { userId, email, createdAt, updatedAt } }
- JAMAIS renvoyer le hash
3) POST /api/auth/login { email, password }
- 401 "Identifiants invalides" (ne pas révéler si l’email existe)
- même payload que register
4) GET /api/auth/me Authorization: Bearer
- 401 si token absent/invalide
5) POST /api/files/upload multipart/form-data
champs : file (obligatoire), password?, expireDays?, tags? (string virgules)
- JWT OPTIONNEL : si connecté, rattacher user_id ; sinon anonyme OK
- max 1 Go
- interdire : .exe .bat .cmd .sh .msi .com .scr .ps1
- token = UUID v4 ; fichier disque renommé (pas le nom original dans le path public)
- expireDays 1–7, défaut 7
- password lien : si fourni, ≥ 6 caractères, hashé bcrypt (access_password)
- tags : split virgules, trim, pas de doublons, lier file_tag
- si échec après écriture disque : nettoyer le fichier temporaire
Réponse : { fileId, token, name, type, size, expireAt, hasPassword, tags: string[] }
6) GET /api/files JWT obligatoire
- uniquement les fichiers du user connecté, uploadedAt DESC
- chaque item : fileId, token, name, type, size, uploadedAt, expireAt, hasPassword, tags, status: "valid"|"expired"
7) GET /api/files/token/:token public
- 404 "Fichier introuvable"
- { name, type, size, expire_at, hasPassword, expired }
8) POST /api/files/token/:token/download { password? } public → stream binaire
- 404 introuvable, 410 Gone "Ce lien a expiré", 401 si mdp requis/incorrect
- Content-Disposition attachment ; filename UTF-8
- ne jamais servir un path hors STORAGE_PATH
9) DELETE /api/files/:id JWT
- 404 / 403 "Vous n'êtes pas autorisé à supprimer ce fichier"
- supprimer le fichier physique PUIS la ligne BDD
- { message: "Fichier supprimé avec succès" }
CRON
- Tous les jours à 01:00 : purge fichiers expire_at < now (disque + BDD). Logger le nombre.
SÉCURITÉ
- Helmet, throttler (login plus strict que le reste si possible)
- Messages d’erreur en FRANÇAIS, stables, non sensibles
- Pas de secrets dans le code
- .env.example sans secret réel de production
QUALITÉ MVC
- Controller = HTTP uniquement.
- Service = métier.
- Entity = mapping SQL.
- DTO class-validator pour chaque body.
- Code clair, peu de commentaires, TypeScript strict.
RÈGLE DE SIMPLICITÉ
Le code doit être compréhensible par un développeur junior.
- Préfère des fonctions courtes et explicites.
- Évite les abstractions qui ne servent qu’à économiser quelques lignes.
- Pas de factory, generic complexe, métaprogrammation ou helper magique sans besoin réel.
- Une logique métier doit être facile à retrouver en lisant le service concerné.
- N’introduis pas de couche supplémentaire si elle n’apporte pas une vraie responsabilité.
- Si deux solutions fonctionnent, choisis la plus simple à lire et à maintenir.
PREUVE DE FIN
- npm run build (backend) doit passer.
- Documente dans ta réponse : routes, variables d’environnement, commande de démarrage et exemples curl
register/login/upload.
- Ne lance aucun test et n’en écris aucun.s de couche supplémentaire si elle n’apporte pas une vraie responsabilité.
- Si deux solutions fonctionnent, choisis la plus simple à lire et à maintenir.
PREUVE DE FIN
- npm run build (backend) doit passer.
- Documente dans ta réponse : routes, variables d’environnement, commande de démarrage et exemples curl
register/login/upload.
- Ne lance aucun test et n’en écris aucun.
