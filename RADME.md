# DataShare

## Démarrage en arrière-plan

Depuis la racine du dépôt :

```bash
npm run dev:background
```

La commande rend immédiatement la main. Les sorties sont écrites dans `logs/backend.log` et `logs/frontend.log`.

- Frontend : http://localhost:5173
- API : http://localhost:3000/api
- Swagger : http://localhost:3000/api/docs

Pour arrêter les processus, utilisez les PID affichés par le script (`taskkill /PID <pid> /T` sous Windows ou `kill <pid>` sous macOS/Linux).
