import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

function SEO({ title, description, name = 'S&S Kids Furniture', type = 'website' }) {
  const { settings } = useSettings();

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | {name}</title>
      <meta name='description' content={description} />
      
      {/* Favicon */}
      {settings?.settings?.favicon && (
        <link rel="icon" href={settings.settings.favicon} />
      )}
      {settings?.settings?.favicon && (
        <link rel="apple-touch-icon" href={settings.settings.favicon} />
      )}
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

export default SEO;
