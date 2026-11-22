import './styles/admin.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminProvider } from './state/AdminStore';
import AdminShell from './components/AdminShell';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import {AdminPosts, AdminPostEditor} from './pages/AdminPosts';
import {AdminPages, AdminPageEditor} from './pages/AdminPages';
import AdminSystems from './pages/AdminSystems';
import AdminSettings from './pages/AdminSettings';
import AdminView, {AdminHistory} from './pages/AdminViews';
export default function AdminRoutes(){return <AdminProvider><Routes>
  <Route path="login" element={<AdminLogin/>}/>
  <Route path="view-user" element={<AdminView/>}/>
  <Route path="view-admin" element={<AdminView editing/>}/>
  <Route element={<AdminShell/>}>
    <Route index element={<Navigate to="dashboard" replace/>}/>
    <Route path="dashboard" element={<AdminDashboard/>}/>
    <Route path="posts" element={<AdminPosts/>}/>
    <Route path="posts/new" element={<AdminPostEditor/>}/>
    <Route path="posts/edit/:id" element={<AdminPostEditor/>}/>
    <Route path="pages" element={<AdminPages/>}/>
    <Route path="pages/edit/:index" element={<AdminPageEditor/>}/>
    <Route path="systems" element={<AdminSystems/>}/>
    <Route path="settings" element={<AdminSettings/>}/>
    <Route path="history" element={<AdminHistory/>}/>
    <Route path="*" element={<Navigate to="dashboard" replace/>}/>
  </Route>
</Routes></AdminProvider>}
