import { useEffect } from 'react';

export const usePageSEO = (title: string, description: string) => {
  useEffect(() => {
    // Update Document Title
    document.title = `${title} | Senegal Excursion`;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [title, description]);
};