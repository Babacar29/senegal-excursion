#!/bin/bash

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

NEW_DOMAIN="senegaldecouvertexcursions.com"
OLD_DOMAIN="senegal-excursion.com"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  POST-DEPLOYMENT SEO TEST${NC}"
echo -e "${BLUE}  À exécuter après publication en production${NC}"
echo -e "${BLUE}================================================${NC}\n"

if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage:${NC} ./SEO_POST_DEPLOYMENT_TEST.sh <domain>"
  echo -e "Exemple: ./SEO_POST_DEPLOYMENT_TEST.sh senegaldecouvertexcursions.com\n"
  echo "Tests à exécuter après déploiement:"
  return 2>/dev/null || exit 1
fi

DOMAIN=$1
PROTOCOL="https://"

echo -e "${YELLOW}Tests sur: ${PROTOCOL}${DOMAIN}${NC}\n"

# Test 1: Homepage accessible
echo -e "${YELLOW}[1/10] Homepage accessibility...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "${PROTOCOL}${DOMAIN}/")
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓${NC} Homepage accessible (HTTP $response)\n"
else
  echo -e "${RED}✗${NC} Homepage error (HTTP $response)\n"
fi

# Test 2: robots.txt
echo -e "${YELLOW}[2/10] robots.txt availability${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "${PROTOCOL}${DOMAIN}/robots.txt")
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓${NC} robots.txt accessible (HTTP $response)"
  
  sitemap_url=$(curl -s "${PROTOCOL}${DOMAIN}/robots.txt" | grep Sitemap)
  echo -e "   $sitemap_url\n"
else
  echo -e "${RED}✗${NC} robots.txt error (HTTP $response)\n"
fi

# Test 3: sitemap.xml
echo -e "${YELLOW}[3/10] sitemap.xml availability${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "${PROTOCOL}${DOMAIN}/sitemap.xml")
if [ "$response" = "200" ]; then
  echo -e "${GREEN}✓${NC} sitemap.xml accessible (HTTP $response)"
  
  url_count=$(curl -s "${PROTOCOL}${DOMAIN}/sitemap.xml" | grep -c "<url>")
  echo -e "   URLs found: $url_count\n"
else
  echo -e "${RED}✗${NC} sitemap.xml error (HTTP $response)\n"
fi

# Test 4: Canonical tag
echo -e "${YELLOW}[4/10] Canonical tag check${NC}"
canonical=$(curl -s "${PROTOCOL}${DOMAIN}/" | grep -o 'rel="canonical"[^>]*href="[^"]*' | sed 's/.*href="\([^"]*\).*/\1/')
if [[ "$canonical" == *"$DOMAIN"* ]]; then
  echo -e "${GREEN}✓${NC} Canonical tag correct"
  echo -e "   $canonical\n"
else
  echo -e "${RED}✗${NC} Canonical tag ERROR or missing\n"
fi

# Test 5: Redirect old domain
echo -e "${YELLOW}[5/10] Old domain redirect (301)${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "https://${OLD_DOMAIN}/" -L)
redirect=$(curl -sI "https://${OLD_DOMAIN}/" 2>/dev/null | grep -i "location")
if [[ "$redirect" == *"$NEW_DOMAIN"* ]] || [ "$response" = "200" ]; then
  echo -e "${GREEN}✓${NC} Old domain redirects to new domain"
  echo -e "   Location: $redirect\n"
else
  echo -e "${YELLOW}⚠${NC} Old domain redirect may not be working"
  echo -e "   (Check if DNS is pointing correctly)\n"
fi

# Test 6: /tarifs redirect
echo -e "${YELLOW}[6/10] /tarifs endpoint redirect${NC}"
response=$(curl -sI "${PROTOCOL}${DOMAIN}/tarifs" 2>/dev/null | head -1)
location=$(curl -sI "${PROTOCOL}${DOMAIN}/tarifs" 2>/dev/null | grep -i "location")
if [[ "$response" == *"301"* ]] || [[ "$response" == *"302"* ]] || [[ "$response" == *"307"* ]]; then
  echo -e "${GREEN}✓${NC} /tarifs redirects (301/302/307)"
  echo -e "   $location\n"
else
  echo -e "${YELLOW}⚠${NC} /tarifs may not be configured"
  echo -e "   Response: $response\n"
fi

# Test 7: Security headers
echo -e "${YELLOW}[7/10] Security headers${NC}"
headers=$(curl -sI "${PROTOCOL}${DOMAIN}/" 2>/dev/null)

# X-Content-Type-Options
if echo "$headers" | grep -q "X-Content-Type-Options"; then
  echo -e "${GREEN}✓${NC} X-Content-Type-Options present"
else
  echo -e "${YELLOW}⚠${NC} X-Content-Type-Options missing"
fi

# X-Frame-Options
if echo "$headers" | grep -q "X-Frame-Options"; then
  echo -e "${GREEN}✓${NC} X-Frame-Options present"
else
  echo -e "${YELLOW}⚠${NC} X-Frame-Options missing"
fi

# HTTPS
if echo "$headers" | grep -q "Content-Security-Policy\|Strict-Transport-Security"; then
  echo -e "${GREEN}✓${NC} HTTPS security headers present"
else
  echo -e "${YELLOW}⚠${NC} Consider adding HTTPS-only headers\n"
fi

echo ""

# Test 8: GZIP compression
echo -e "${YELLOW}[8/10] GZIP compression${NC}"
encoding=$(curl -sI "${PROTOCOL}${DOMAIN}/" 2>/dev/null | grep -i "content-encoding")
if [[ "$encoding" == *"gzip"* ]]; then
  echo -e "${GREEN}✓${NC} GZIP compression enabled"
  echo -e "   $encoding\n"
else
  echo -e "${YELLOW}⚠${NC} GZIP compression may not be enabled\n"
fi

# Test 9: Cache headers
echo -e "${YELLOW}[9/10] Browser cache headers${NC}"
cache=$(curl -sI "${PROTOCOL}${DOMAIN}/" 2>/dev/null | grep -i "cache-control\|expires")
if [ -n "$cache" ]; then
  echo -e "${GREEN}✓${NC} Cache headers present"
  echo -e "   $cache\n"
else
  echo -e "${YELLOW}⚠${NC} Cache headers may not be configured\n"
fi

# Test 10: Meta tags
echo -e "${YELLOW}[10/10] SEO meta tags${NC}"
page=$(curl -s "${PROTOCOL}${DOMAIN}/")

if echo "$page" | grep -q 'name="description"'; then
  echo -e "${GREEN}✓${NC} Description meta tag present"
fi

if echo "$page" | grep -q 'name="keywords"'; then
  echo -e "${GREEN}✓${NC} Keywords meta tag present"
fi

if echo "$page" | grep -q 'property="og:title"'; then
  echo -e "${GREEN}✓${NC} Open Graph tags present"
fi

if echo "$page" | grep -q '"@type": "TravelAgency"'; then
  echo -e "${GREEN}✓${NC} TravelAgency schema present"
fi

if echo "$page" | grep -q 'lang="fr"'; then
  echo -e "${GREEN}✓${NC} Language attribute correct (fr)\n"
fi

# Summary
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  NEXT STEPS${NC}"
echo -e "${BLUE}================================================${NC}\n"

echo -e "${YELLOW}1. Google Search Console:${NC}"
echo "   • Go to: https://search.google.com/search-console"
echo "   • Add property: https://$NEW_DOMAIN"
echo "   • Verify ownership (DNS/HTML/GSC)"
echo "   • Submit sitemap: /sitemap.xml"
echo "   • Request indexation of pages\n"

echo -e "${YELLOW}2. Domain change notification:${NC}"
echo "   • In GSC old domain, use Settings > Address change"
echo "   • Point to new domain to migrate ranking signals\n"

echo -e "${YELLOW}3. Bing Webmaster Tools:${NC}"
echo "   • https://www.bing.com/webmasters"
echo "   • Submit your site and sitemap\n"

echo -e "${YELLOW}4. Monitor for 4-12 weeks:${NC}"
echo "   • Check GSC for crawl errors"
echo "   • Monitor 404s and redirects"
echo "   • Track ranking changes"
echo "   • Monitor traffic in Analytics\n"

echo -e "${BLUE}================================================${NC}\n"
