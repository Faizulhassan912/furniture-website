import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import useScrollToTop from '../../hooks/useScrollToTop';
import { useSettings } from '../../context/SettingsContext';
import InstallPrompt from '../ui/InstallPrompt';

function Layout() {
  useScrollToTop();
  const { settings } = useSettings();
  const whatsappNumber = settings?.contact?.whatsapp || '923000000000';

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-1 pt-16 sm:pt-20 lg:pt-24">
        <Outlet />
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  );
}

export default Layout;
