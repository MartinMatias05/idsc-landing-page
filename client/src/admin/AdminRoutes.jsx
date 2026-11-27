import './styles/admin.css';
import {useEffect,useState} from 'react';
import {adminSession,adminApi} from '../services/adminApi';
import './styles/admin-pages.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminProvider } from './state/AdminStore';
import AdminShell from './components/AdminShell';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import {AdminPosts, AdminPostEditor} from './pages/AdminPosts';
import {AdminPages, AdminPageEditor} from './pages/AdminPages';
import AdminSystems from './pages/AdminSystems';
import AdminSettings from './pages/AdminSettings';
import AdminNotifications from './pages/AdminNotifications';
import AdminView, {AdminHistory} from './pages/AdminViews';
function Protected({children}){
  const [status,setStatus]=useState('checking');
  useEffect(()=>{if(!adminSession.token()){setStatus('denied');return;}let active=true;adminApi.session().then(()=>{if(active)setStatus('ok')}).catch(()=>{if(active)setStatus('denied')});return()=>{active=false}},[]);
  if(status==='checking')return <p role="status" style={{padding:24}}>Checking Admin session…</p>;
  return status==='ok'?children:<Navigate to="/admin/login" replace/>;
}
export default function AdminRoutes(){return <AdminProvider><Routes>
  <Route path="login" element={<AdminLogin/>}/>
  <Route path="view-user" element={<AdminView/>}/>
  <Route path="view-admin" element={<Protected><AdminView editing/></Protected>}/>
  <Route element={<Protected><AdminShell/></Protected>}>
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
    <Route path="notifications" element={<AdminNotifications/>}/>
    <Route path="*" element={<Navigate to="dashboard" replace/>}/>
  </Route>
</Routes></AdminProvider>}
