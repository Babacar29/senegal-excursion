import { useEffect } from 'react';

export const usePageSEO = (title: string, description: string, image?: string) => {
  useEffect(() => {
    const siteName = "Sénégal Excursion";
    const fullTitle = `${title} | ${siteName}`;
    const imageUrl = image || "https://senegaldecouvertexcursions.com/chauffeur.png";

    // Update Document Title
    document.title = fullTitle;

    const metaUpdates = [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
    ];

    metaUpdates.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });
  }, [title, description, image]);
};