import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

function SEO({ title, description, name = 'S&S Kids Furniture', type = 'website', image = '/favicon-round.png' }) {
  const { settings } = useSettings();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sns-kids-furniture.vercel.app/';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": name,
    "description": description,
    "url": "https://sns-kids-furniture.vercel.app/",
    "logo": "https://sns-kids-furniture.vercel.app/favicon-round.png",
    "image": "https://sns-kids-furniture.vercel.app/favicon-round.png",
    "telephone": "+923001234567",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "priceRange": "PKR"
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | {name}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Favicon */}
      {settings?.settings?.favicon && (
        <link rel="icon" href={settings.settings.favicon} />
      )}
      {settings?.settings?.favicon && (
        <link rel="apple-touch-icon" href={settings.settings.favicon} />
      )}
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={`${title} | ${name}`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${name}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}

export default SEO;
