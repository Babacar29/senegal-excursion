#!/bin/bash

# Commandes Utiles pour Firebase Migration
# Sauvegardez ce fichier comme `scripts/useful-commands.sh`

echo "=== Senegal Excursion - Firebase Migration Utilities ==="

# ============================================================
# DÉVELOPPEMENT
# ============================================================

# Démarrer le serveur de dev
npm run dev
# → http://localhost:3001/

# Compiler la production
npm run build

# Vérifier la compilation
npm run build --dry-run

# Prévisualiser la production locale
npm run preview

# ============================================================
# BASE DE DONNÉES - Firestore
# ============================================================

# Consulter les données (via Firebase Console):
# 1. https://console.firebase.google.com
# 2. Sélectionner le projet "senegal-excursion"
# 3. Firestore Database → collection "gallery"

# Exemple de structure d'un document:
cat << 'EOF'
{
  "id": "auto-generated",
  "title": "Titre de la photo",
  "location": "Dakar / Gorée",
  "description": "Description optionnelle",
  "image": "https://firebasestorage.googleapis.com/v0/b/...",
  "created": Timestamp(2026, 2, 20),
  "updated": Timestamp(2026, 2, 20)
}
EOF

# ============================================================
# STOCKAGE - Firebase Storage
# ============================================================

# Consulter les fichiers (via Firebase Console):
# 1. https://console.firebase.google.com
# 2. Sélectionner le projet "senegal-excursion"
# 3. Storage → gsutil commands (ou interface web)

# Télécharger tous les fichiers:
gsutil -m cp -r gs://senegal-excursion.firebasestorage.app/gallery ./backup/

# Supprimer un fichier:
gsutil rm gs://senegal-excursion.firebasestorage.app/gallery/1708383600000_image.jpg

# Lister tous les fichiers:
gsutil ls -r gs://senegal-excursion.firebasestorage.app/gallery/

# ============================================================
# AUTHENTIFICATION
# ============================================================

# Créer un utilisateur admin:
# 1. https://console.firebase.google.com
# 2. Authentication → Créer un utilisateur
# 3. Email: admin@senegal-excursion.com
# 4. Password: (votre mot de passe sécurisé)

# Réinitialiser le mot de passe d'un utilisateur:
# 1. Firebase Console → Authentication
# 2. Cliquez l'utilisateur
# 3. Cliquez "Réinitialiser le mot de passe"
# 4. Un email sera envoyé

# ============================================================
# DÉPLOIEMENT
# ============================================================

# Option 1: Vercel (recommandé)
npm install -g vercel
vercel
# Suivez les instructions

# Option 2: Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy

# Option 3: Netlify
npm install -g netlify-cli
netlify deploy

# ============================================================
# MONITORING ET DEBUGGING
# ============================================================

# Vérifier les erreurs Firestore en temps réel:
# 1. Firebase Console → Firestore → Onglet "Requêtes"
# 2. Voir les erreurs et le rate limiting

# Vérifier les erreurs Storage:
# 1. Firebase Console → Storage → Onglet "Requêtes"

# Checker les logs du navigateur:
# 1. F12 → Console
# 2. Chercher les erreurs Firebase

# Importer des données depuis PocketBase:
cat > import-data.js << 'SCRIPT'
const admin = require('firebase-admin');
const fs = require('fs');

// Initialiser Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Lire les données PocketBase (exportées en JSON)
const pbData = JSON.parse(fs.readFileSync('pocketbase-export.json', 'utf8'));

// Importer dans Firestore
(async () => {
  for (const item of pbData.gallery) {
    await db.collection('gallery').doc(item.id).set({
      title: item.title,
      location: item.location,
      description: item.description,
      image: item.imageUrl, // Supposant que c'est une URL
      created: new Date(item.created),
      updated: new Date(item.updated)
    });
    console.log(`Imported: ${item.title}`);
  }
  console.log('Import completed!');
})();
SCRIPT

# ============================================================
# MAINTENANCE
# ============================================================

# Nettoyer les dépendances
npm prune

# Auditer les vulnérabilités
npm audit

# Créer une sauvegarde Firestore:
# 1. Firebase Console → Firestore → Onglet "Sauvegardes"
# 2. Cliquez "Créer une sauvegarde"

# Exporter les données Firestore:
gcloud firestore export gs://senegal-excursion-backups/export-$(date +%Y%m%d)

# ============================================================
# VARIABLES D'ENVIRONNEMENT
# ============================================================

# Vérifier que .env.local contient:
cat .env.local
# Devrait afficher:
# GEMINI_API_KEY=...
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# etc.

# Ne JAMAIS commiter .env.local
grep ".env.local" .gitignore

# ============================================================
# TESTS
# ============================================================

# Tester l'authentification
curl -X POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@senegal-excursion.com",
    "password": "yourpassword",
    "returnSecureToken": true
  }'

# Lister les utilisateurs (via Firebase Admin SDK)
node -e "
const admin = require('firebase-admin');
admin.auth().listUsers(100).then(result => {
  result.users.forEach(user => {
    console.log(user.email, user.uid);
  });
});
"

# ============================================================
# NETTOYAGE
# ============================================================

# Supprimer tout et recommencer:
# ⚠️  ATTENTION: Ceci est destructif!

# 1. Supprimer la collection Firestore
gcloud firestore databases delete-collection gallery --quiet

# 2. Vider Storage
gsutil -m rm -r gs://senegal-excursion.firebasestorage.app/gallery

# 3. Supprimer tous les utilisateurs (sauf vous)
# → Firebase Console → Authentication → supprimer manuellement

# ============================================================
# RESSOURCES
# ============================================================

cat << 'EOF'
Documentation Utile:
- https://firebase.google.com/docs
- https://cloud.google.com/firestore/docs
- https://firebase.google.com/docs/storage
- https://firebase.google.com/docs/auth

Tools:
- Firebase Console: https://console.firebase.google.com
- GCloud CLI: gcloud CLI
- Firebase CLI: firebase-tools

Fichiers Importants:
- .env.local (variables Firebase)
- services/firebase.ts (SDK Firebase)
- FIREBASE_SETUP.md (configuration)
- MIGRATION_GUIDE.md (guide complet)

Ports:
- Dev Server: http://localhost:3001
- Admin: http://localhost:3001/admin
- Accueil: http://localhost:3001/
EOF

echo ""
echo "=== Besoin d'aide? Consultez les fichiers .md ==="
