# Backend Node.js du site ASEETS

Ce dépôt contient un petit serveur Express qui sert les pages statiques du site ASEETS et expose quelques API pour la collecte et la consultation des messages envoyés via le formulaire de contact.

## Prérequis
- Node.js 18+ recommandé

## Installation et lancement
```bash
npm install
npm start
```
Le serveur écoute par défaut sur `http://localhost:3000`. Vous pouvez changer le port en définissant la variable d'environnement `PORT`.

## Structure
- `server.js` : serveur Express et routes API.
- `data/messages.json` : stockage persistant des messages reçus.
- `assets/` et fichiers `.html` : contenu statique servi par Express.

## API disponibles
### `GET /api/health`
Permet de vérifier que le serveur répond. Retourne `{ "status": "ok" }`.

### `POST /api/contact`
Enregistre un message de contact.
- Corps JSON ou `application/x-www-form-urlencoded` requis
  - `name` (string, obligatoire)
  - `email` (string, doit contenir un format d'email valide)
  - `message` (string, obligatoire)
- Réponse `201` en cas de succès avec le message enregistré.

Exemple de requête :
```bash
curl -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ami","email":"ami@example.com","message":"Bonjour ASEETS"}'
```

### `GET /api/messages`
Récupère l'ensemble des messages persistés.
- Réponse `200` avec `{ count, messages }`.
- Réponse `500` si la lecture du fichier échoue.

## Notes de conception
- Le stockage repose sur un simple fichier JSON local. La fonction `ensureStorage()` crée le dossier et le fichier au démarrage pour éviter les erreurs d'E/S.
- Les entrées sont validées côté serveur pour éviter les enregistrements incomplets ou les emails mal formés.
- Les assets statiques (CSS, JS, images et pages HTML) sont servis directement depuis le dossier du projet.
