# DataShare

## Démarrage en arrière-plan

Depuis la racine :

```bash
npm run dev:background
```

Le backend et le frontend sont détachés du terminal. Les logs se trouvent dans `logs/backend.log` et `logs/frontend.log`.

- Front : http://localhost:5173
- API : http://localhost:3000/api
- Swagger : http://localhost:3000/api/docs

Pour arrêter les processus, utilisez les PID affichés par le script : `taskkill /PID <pid> /T` sous Windows ou `kill <pid>` sous macOS/Linux.
