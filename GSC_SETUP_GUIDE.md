# Google Search Console - Configuration Checklist
# À effectuer immédiatement après déploiement en production

## 🚀 ÉTAPE 1: AJOUTER NOUVELLE PROPRIÉTÉ (15 min)

### 1.1 Aller sur Google Search Console
```
URL: https://search.google.com/search-console
```

### 1.2 Ajouter une nouvelle propriété
- Cliquer sur "Ajouter une propriété"
- Choisir "URL prefix"
- Entrer: `https://senegaldecouvertexcursions.com`
- Cliquer "Continuer"

### 1.3 Vérifier la propriété (choisir UNE méthode)

**Option A: Balise meta HTML** (RECOMMANDÉ)
1. Copier la balise meta fournie par Google
2. Ajouter dans `<head>` de index.html
3. Sauvegarder et déployer
4. Cliquer "Vérifier" dans GSC
5. ✓ Status changera à "Propriété vérifiée"

**Option B: Fichier HTML**
1. Télécharger le fichier HTML de vérification
2. Placer dans le répertoire `public/`
3. Vérifier accès: https://senegaldecouvertexcursions.com/google[xyz].html
4. Cliquer "Vérifier" dans GSC

**Option C: DNS (Advanced)**
1. Ajouter enregistrement TXT au DNS
2. Vérifier propagation DNS (peut prendre 24-48h)
3. Cliquer "Vérifier" dans GSC

---

## 📋 ÉTAPE 2: SOUMETTRE SITEMAP (5 min)

### 2.1 Accéder au menu Sitemap
- Dans GSC, aller à "Sitemaps" (menu gauche)

### 2.2 Ajouter le sitemap
- URL du sitemap: `sitemap.xml`
- Cliquer "Envoyer"
- Status: "Succès" ✓

### 2.3 Vérifier l'indexation
- Attendre 5-10 minutes
- Rafraîchir la page
- Voir: "4 URLs trouvées"
- Voir: "4 envoyées, 4 indexées"

---

## 🔄 ÉTAPE 3: SIGNALER CHANGEMENT DE DOMAINE (5 min)

⚠️ **IMPORTANT**: Cette étape est CRITIQUE pour préserver le SEO ranking

### 3.1 Accéder à l'ancienne propriété
1. Si vous aviez `senegal-excursion.com` dans GSC:
   - Aller à Settings > Address change
   
2. Si NON enregistree:
   - Ajouter `senegal-excursion.com` comme propriété
   - Vérifier rapidement (balise meta)
   - Puis aller à Settings > Address change

### 3.2 Configurer le changement d'adresse
1. Cliquer "Address change"
2. Sélectionner nouveau domaine: `senegaldecouvertexcursions.com`
3. Cliquer "Valider"
4. Google va transférer les signals de ranking! 🎯

---

## 📊 ÉTAPE 4: VÉRIFIER INDEXATION (24-48h)

### 4.1 Coverage report
- Menu: "Coverage" (Couverture)
- Vérifier: "4 pages indexed"
- Pas de "Errors"
- Pas de "Excluded"

### 4.2 URL Inspection
- Tester chaque URL individuellement:
  - https://senegaldecouvertexcursions.com/
  - https://senegaldecouvertexcursions.com/#/services
  - https://senegaldecouvertexcursions.com/#/destinations
  - https://senegaldecouvertexcursions.com/#/contact

Pour chaque URL:
1. Copier dans "URL inspection"
2. Vérifier: "URL is on Google"
3. Vérifier: "Last crawled: [aujourd'hui]"
4. Cliquer "View indexed version"

### 4.3 Mobile usability
- Vérifier: "No issues found"
- Tous les checkmarks ✓

---

## 🔍 ÉTAPE 5: CONFIGURATION AVANCÉE (optionnel mais recommandé)

### 5.1 Search appearance
- Vérifier "Appearance in search results"
- Voir votre titre et description correctes

### 5.2 Links report
- Menu: "Links" (Liens)
- Verifier: "Top linking sites"
- Verifier: "Top linked pages"

### 5.3 Manual actions
- Menu: "Manual actions"
- Vérifier: "No manual actions detected"

### 5.4 Security issues
- Menu: "Security & Manual Actions"
- Vérifier: "No security issues"

---

## 📈 ÉTAPE 6: MONITORING CONTINU (hebdomadaire)

### 6.1 Vérifier Coverage
- Chaque lundi: refresh Coverage
- Alertes si "Errors" > 0

### 6.2 Performance rapport
- Menu: "Performance"
- Vérifier clickthrough rate (CTR)
- Vérifier average position
- Vérifier impressions

### 6.3 Requêtes de recherche
- Performance > Queries
- Voir quels mots-clés ramènent du trafic
- Optimiser le contenu en conséquence

### 6.4 Crawl stats
- Menu: "Settings" > "Crawl stats"
- Vérifier: "Request rate" normal
- Verifier: "Crawl budget" pas épuisé

---

## 🚨 ÉTAPE 7: BLOCKERS À VÉRIFIER

### 7.1 Si pas d'indexation après 48h
```
Causes possibles:
1. robots.txt bloque Googlebot
   → Vérifier: robots.txt contient "Allow: /"
   
2. Meta tag noindex
   → Vérifier: pas de 'content="noindex"' dans index.html
   
3. .htaccess bloque Googlebot
   → Vérifier: pas de "Disallow Googlebot" dans .htaccess
   
4. Canonical pointe ailleurs
   → Vérifier: canonical = https://senegaldecouvertexcursions.com/
   
5. Redirections cassées
   → Tester: curl -I https://senegaldecouvertexcursions.com/
```

### 7.2 Si trop de 404s ou erreurs de crawl
1. Vérifier structure URLs
2. Vérifier redirections (301, 302, 307)
3. Vérifier que .htaccess est correct
4. Vérifier webserver logs pour erreurs

---

## 📋 CHECKLIST FINALE

Avant de déployer en production:

- [ ] Tous les fichiers SEO locaux OK (script passed)
- [ ] Domaine enregistré et DNS configuré
- [ ] SSL/HTTPS activé et fonctionnel
- [ ] .htaccess configuré ET uploadé
- [ ] robots.txt accessible sur https://domain/robots.txt
- [ ] sitemap.xml accessible sur https://domain/sitemap.xml
- [ ] index.html contient les meta tags
- [ ] Manifest.json uploadé
- [ ] Tests de redirect fonctionnent

Après déploiement:

- [ ] Tester robots.txt HTTP 200
- [ ] Tester sitemap.xml HTTP 200
- [ ] Tester homepage HTTP 200
- [ ] Ajouter property Google Search Console
- [ ] Vérifier propriété GSC
- [ ] Soumettre sitemap dans GSC
- [ ] Signaler changement de domaine dans GSC
- [ ] Attendre 24-48h pour indexation
- [ ] Vérifier Coverage report
- [ ] Vérifier Mobile usability
- [ ] Commencer monitoring

---

## ⏱️ TIMELINE RÉALISTE

```
T+0h:    Déploiement
T+1h:    Vérifier fichiers (robots, sitemap)
T+2h:    Ajouter propriété GSC + vérifier
T+6h:    Soumettre sitemap
T+24h:   Vérifier Coverage (rechercher "indexed")
T+48h:   Vérifier Mobile usability et erreurs crawl
T+1w:    Vérifier Performance (peut voir impressions)
T+2-4w:  Vérifier classement improved
T+4-12w: Position final dans résultats
```

---

## 📞 SUPPORT

Si vous avez des problèmes:

1. **Google Search Console Help**
   https://support.google.com/webmasters

2. **Structured Data Testing Tool**
   https://search.google.com/test/rich-results

3. **Mobile-Friendly Test**
   https://search.google.com/test/mobile-friendly

4. **PageSpeed Insights**
   https://pagespeed.web.dev

---

**Dernière mise à jour**: 23 février 2026
**Domaine**: https://senegaldecouvertexcursions.com
**Ancien domaine**: https://senegal-excursion.com (redirecté avec 301)
