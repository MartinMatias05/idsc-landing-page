import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import Footer from './Footer';
import Header from './Header';

/** Shared shell. Site and navigation load once here; both are optional so the page survives API errors. */
export default function Layout() {
  const site = useApi(api.getSite);
  const navigation = useApi(api.getNavigation);
  const { pathname } = useLocation();

  // Block body on purpose: an effect must return nothing or a cleanup function, never the result of a call.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header site={site.data} navigation={navigation.data} />
      <main id="main">
        <Outlet />
      </main>
      <Footer site={site.data} navigation={navigation.data} />
    </>
  );
}
