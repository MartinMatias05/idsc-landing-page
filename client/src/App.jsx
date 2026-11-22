import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AdminRoutes from './admin/AdminRoutes';

export default function App() {
  return <BrowserRouter><ErrorBoundary><Routes>
    {/* Never ship an unauthenticated admin interface in production. */}
    {import.meta.env.DEV && <Route path="/admin/*" element={<AdminRoutes/>}/>}
    <Route element={<Layout/>}>
      <Route index element={<HomePage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  </Routes></ErrorBoundary></BrowserRouter>;
}
