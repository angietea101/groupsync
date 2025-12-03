import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to "/", reset scroll to top
    if (pathname === '/' && !hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // If a hash exists (#features etc)
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 50); // small delay to allow Home page to load
      }
    }
  }, [pathname, hash]);

  return null;
}
