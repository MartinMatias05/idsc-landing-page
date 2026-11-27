import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminRoutes from './admin/AdminRoutes';
import PolicyPage from './pages/PolicyPage';
import InformationPage, { infoPages } from './pages/InformationPage';

export default function App() {
  return <BrowserRouter><ErrorBoundary><Routes>
    {/* Never ship an unauthenticated admin interface in production. */}
    {(import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === "true") && <Route path="/admin/*" element={<AdminRoutes/>}/>}
    <Route element={<Layout/>}>
      <Route index element={<HomePage/>}/>
      {Object.entries(infoPages).map(([path,name]) => <Route key={path} path={path.slice(1)} element={<InformationPage name={name}/>}/>)}
      <Route path="privacy" element={<PolicyPage type="privacy"/>}/>
      <Route path="accessibility" element={<PolicyPage type="accessibility"/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  </Routes></ErrorBoundary></BrowserRouter>;
}
