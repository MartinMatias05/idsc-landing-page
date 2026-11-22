import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, FileText, Files, ExternalLink, Settings, LogOut, ChevronRight, Menu, UserCircle2, Bell } from 'lucide-react';
import { useAdmin } from '../state/AdminStore';
const links = [
  ['/admin/dashboard', 'Dashboard', LayoutDashboard],
  ['/admin/posts', 'Posts', FileText],
  ['/admin/pages', 'Page Management', Files],
  ['/admin/systems', 'External Systems', ExternalLink],
  ['/admin/settings', 'Settings', Settings],
];
export default function AdminShell() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { profile, history } = useAdmin();
  return <div className={`adm-app ${expanded ? '' : 'adm-compact'}`}>
    <aside className="adm-side" aria-label="Admin navigation">
      <Link to="/admin/dashboard" className="adm-brand"><span className="adm-mark">IDSC</span>{expanded && <span><b>IDSC</b><small>WEBSITE ADMIN</small></span>}</Link>
      {expanded && <div className="adm-side-label">WORKSPACE</div>}
      <button className="adm-expand" onClick={() => setExpanded(v => !v)} aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}><Menu size={18}/>{expanded && <span>Collapse menu</span>}</button>
      <nav>{links.map(([to,label,Icon]) => <NavLink key={to} to={to} title={label} className={({isActive}) => `adm-side-link ${isActive?'active':''}`}><Icon size={19} strokeWidth={1.8}/>{expanded && <span>{label}</span>}</NavLink>)}</nav>
      <div className="adm-side-bottom">
        <button className="adm-side-link" onClick={() => navigate('/admin/login')}><LogOut size={19}/>{expanded && 'Log out'}</button></div>
    </aside>
    <div className="adm-main">
      <header className="adm-top"><div className="adm-user"><div><b>{profile.name || 'Administrator'}</b><small>Website admin</small></div><Link to="/admin/history" title="Recent history"><Bell size={19}/>{history.length>0&&<i className="adm-bell-dot"/>}</Link><Link to="/admin/settings" aria-label="Account Settings"><UserCircle2 size={27}/></Link></div></header>
      <main className="adm-workspace"><Outlet/></main>
    </div>
  </div>;
}
export function PageHeading({ title, subtitle, actions }) { return <div className="adm-pageheading"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions}</div>; }
export function Panel({ title, children, aside, className='' }) { return <section className={`adm-panel ${className}`}><div className="adm-panel-head"><h2>{title}</h2>{aside}</div>{children}</section>; }
export function Status({ children }) { return <span className={`adm-status ${String(children).toLowerCase().replaceAll(' ','-')}`}>{children}</span>; }
export function ActionButton({children, kind='primary',...rest}) { return <button type="button" className={`adm-button adm-button--${kind}`} {...rest}>{children}</button>; }
