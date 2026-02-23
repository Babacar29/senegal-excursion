#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  SÉNÉGAL EXCURSION - SEO DIAGNOSTIC SCRIPT${NC}"
echo -e "${BLUE}================================================${NC}\n"

# Configuration
NEW_DOMAIN="senegaldecouvertexcursions.com"
OLD_DOMAIN="senegal-excursion.com"

# 1. Check local files
echo -e "${YELLOW}[1/7] Vérification des fichiers SEO locaux...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

files_to_check=(
  "public/.htaccess"
  "public/robots.txt"
  "public/sitemap.xml"
  "public/manifest.json"
  "index.html"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file existe"
  else
    echo -e "${RED}✗${NC} $file MANQUANT"
    all_files_exist=false
  fi
done

echo ""

# 2. Check .htaccess syntax
echo -e "${YELLOW}[2/7] Vérification du contenu .htaccess...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "RewriteEngine On" public/.htaccess; then
  echo -e "${GREEN}✓${NC} RewriteEngine activé"
else
  echo -e "${RED}✗${NC} RewriteEngine NON activé"
fi

if grep -q "mod_deflate" public/.htaccess; then
  echo -e "${GREEN}✓${NC} GZIP compression configurée"
else
  echo -e "${YELLOW}⚠${NC} GZIP compression non trouvée"
fi

if grep -q "mod_expires" public/.htaccess; then
  echo -e "${GREEN}✓${NC} Browser caching configuré"
else
  echo -e "${YELLOW}⚠${NC} Browser caching non trouvé"
fi

if grep -q "senegaldecouvertexcursions.com" public/.htaccess; then
  echo -e "${GREEN}✓${NC} Nouveau domaine configuré"
else
  echo -e "${RED}✗${NC} Nouveau domaine NON trouvé dans .htaccess"
fi

if grep -q "senegal-excursion" public/.htaccess; then
  echo -e "${GREEN}✓${NC} Ancien domaine reconnu pour redirection"
else
  echo -e "${YELLOW}⚠${NC} Ancien domaine non trouvé (redirect peut ne pas fonctionner)"
fi

if grep -q "tarifs" public/.htaccess; then
  echo -e "${GREEN}✓${NC} /tarifs redirect configuré"
else
  echo -e "${RED}✗${NC} /tarifs redirect manquant"
fi

echo ""

# 3. Check robots.txt
echo -e "${YELLOW}[3/7] Vérification du robots.txt...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "senegaldecouvertexcursions.com" public/robots.txt; then
  echo -e "${GREEN}✓${NC} Domaine correct dans robots.txt"
else
  echo -e "${RED}✗${NC} Domaine INCORRECT dans robots.txt"
fi

if grep -q "Disallow: /admin" public/robots.txt; then
  echo -e "${GREEN}✓${NC} Admin routes bloquées"
else
  echo -e "${YELLOW}⚠${NC} Admin routes non bloquées"
fi

if grep -q "Sitemap:" public/robots.txt; then
  echo -e "${GREEN}✓${NC} Sitemap déclarée"
else
  echo -e "${RED}✗${NC} Sitemap NON déclarée"
fi

echo ""

# 4. Check sitemap.xml
echo -e "${YELLOW}[4/7] Vérification du sitemap.xml...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sitemap_urls=$(grep -c "senegaldecouvertexcursions.com" public/sitemap.xml)
echo -e "${GREEN}✓${NC} URLs trouvées: $sitemap_urls"

if grep -q '<lastmod>' public/sitemap.xml; then
  echo -e "${GREEN}✓${NC} lastmod dates présentes"
else
  echo -e "${YELLOW}⚠${NC} lastmod dates manquantes"
fi

if grep -q '<priority>' public/sitemap.xml; then
  echo -e "${GREEN}✓${NC} Priorités configurées"
else
  echo -e "${YELLOW}⚠${NC} Priorités manquantes"
fi

echo ""

# 5. Check index.html SEO tags
echo -e "${YELLOW}[5/7] Vérification des meta tags index.html...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q 'canonical.*senegaldecouvertexcursions.com' index.html; then
  echo -e "${GREEN}✓${NC} Canonical URL correcte"
else
  echo -e "${RED}✗${NC} Canonical URL INCORRECTE"
fi

if grep -q 'og:url.*senegaldecouvertexcursions.com' index.html; then
  echo -e "${GREEN}✓${NC} Open Graph URL correcte"
else
  echo -e "${RED}✗${NC} Open Graph URL INCORRECTE"
fi

if grep -q 'twitter:url.*senegaldecouvertexcursions.com' index.html; then
  echo -e "${GREEN}✓${NC} Twitter Card URL correcte"
else
  echo -e "${RED}✗${NC} Twitter Card URL INCORRECTE"
fi

if grep -q 'keywords' index.html; then
  echo -e "${GREEN}✓${NC} Keywords meta tag présente"
else
  echo -e "${RED}✗${NC} Keywords meta tag MANQUANTE"
fi

if grep -q 'robots.*index.*follow' index.html; then
  echo -e "${GREEN}✓${NC} Robots meta tag correct"
else
  echo -e "${YELLOW}⚠${NC} Robots meta tag non optimisé"
fi

if grep -q '"TravelAgency"' index.html; then
  echo -e "${GREEN}✓${NC} TravelAgency schema présent"
else
  echo -e "${RED}✗${NC} TravelAgency schema MANQUANT"
fi

echo ""

# 6. Component files check
echo -e "${YELLOW}[6/7] Vérification des fichiers composants...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q 'senegaldecouvertexcursions.com' hooks/usePageSEO.ts; then
  echo -e "${GREEN}✓${NC} usePageSEO.ts actualisé"
else
  echo -e "${RED}✗${NC} usePageSEO.ts non actualisé"
fi

components=("Home" "Services" "Gallery" "Contact")
for comp in "${components[@]}"; do
  if grep -q "usePageSEO" "components/${comp}.tsx"; then
    echo -e "${GREEN}✓${NC} ${comp}.tsx utilise usePageSEO"
  else
    echo -e "${YELLOW}⚠${NC} ${comp}.tsx n'utilise pas usePageSEO"
  fi
done

echo ""

# 7. Network tests (if curl available)
echo -e "${YELLOW}[7/7] Tests de connectivité réseau...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v curl &> /dev/null; then
  
  # Test robots.txt accessibility
  echo "Testing robots.txt accessibility..."
  response=$(curl -s -o /dev/null -w "%{http_code}" "https://$NEW_DOMAIN/robots.txt" 2>/dev/null)
  if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC} robots.txt accessible (HTTP $response)"
  elif [ "$response" = "000" ]; then
    echo -e "${YELLOW}⚠${NC} À tester après déploiement (sitio non accessible)"
  else
    echo -e "${YELLOW}⚠${NC} robots.txt HTTP $response"
  fi

  # Test sitemap.xml accessibility
  echo "Testing sitemap.xml accessibility..."
  response=$(curl -s -o /dev/null -w "%{http_code}" "https://$NEW_DOMAIN/sitemap.xml" 2>/dev/null)
  if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC} sitemap.xml accessible (HTTP $response)"
  elif [ "$response" = "000" ]; then
    echo -e "${YELLOW}⚠${NC} À tester après déploiement (site non accessible)"
  else
    echo -e "${YELLOW}⚠${NC} sitemap.xml HTTP $response"
  fi

else
  echo -e "${YELLOW}⚠${NC} curl non disponible - tests réseau ignorés"
  echo "   Pour tester manuellement:"
  echo "   curl -I https://$NEW_DOMAIN/robots.txt"
  echo "   curl -I https://$NEW_DOMAIN/sitemap.xml"
  echo "   curl -I https://$NEW_DOMAIN/"
fi

echo ""

# Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  RÉSUMÉ & PROCHAINES ÉTAPES${NC}"
echo -e "${BLUE}================================================${NC}\n"

echo -e "${YELLOW}✓ Fichiers SEO locaux:${NC}"
echo "   • .htaccess avec redirections 301"
echo "   • robots.txt avec sitemap"
echo "   • sitemap.xml avec toutes les URL"
echo "   • Meta tags optimisés dans index.html"
echo ""

echo -e "${YELLOW}⚠ Avant publication:${NC}"
echo "   1. Vérifier que l'hébergement supporte .htaccess"
echo "   2. Activer mod_rewrite sur le serveur"
echo "   3. Tester les redirections après déploiement"
echo ""

echo -e "${YELLOW}📋 Après déploiement (URGENT):${NC}"
echo "   1. Google Search Console"
echo "      → Ajouter propriété: https://senegaldecouvertexcursions.com"
echo "      → Soumettre sitemap.xml"
echo "      → Demander suppression ancien domaine"
echo ""
echo "   2. Tester les URLs"
echo "      → https://senegaldecouvertexcursions.com/robots.txt"
echo "      → https://senegaldecouvertexcursions.com/sitemap.xml"
echo "      → https://senegaldecouvertexcursions.com/#/tarifs (redirect test)"
echo ""
echo "   3. Vérifier redirections"
echo "      curl -I https://senegaldecouvertexcursions.com/tarifs"
echo "      curl -I https://senegal-excursion.com/"
echo ""

echo -e "${BLUE}================================================${NC}\n"
