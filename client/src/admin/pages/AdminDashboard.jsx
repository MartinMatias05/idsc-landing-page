import { Link } from 'react-router-dom';
import { GraduationCap, UsersRound, ChartNoAxesColumnIncreasing, Pencil, Trash2, Upload, FileText, ArrowUpRight } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { useAdmin } from '../state/AdminStore';
import { PageHeading, Panel, Status } from '../components/AdminShell';
const getValue=(items,id)=> items?.find(v=>v.id===id)?.value;
function KPI({ label, icon: Icon, value, source }) {return <div className="adm-kpi"><div className="adm-kpi-head"><Icon size={25}/><span>{label}</span></div><strong>{typeof value==='number'?value.toLocaleString():'—'}</strong><small>{source}</small></div>}
export default function AdminDashboard() {
 const {posts,history}=useAdmin();const state=useApi(api.getStatistics);const stats=state.data?.items;
 const visitors=getValue(stats,'site-visitors');const students=getValue(stats,'students-enrolled');const faculty=getValue(stats,'faculty-fulltime');
 return <>
 <section className="adm-banner"><small>WEBSITE CONTENT AND UPDATES</small><h2>Keeping the IDSC community informed.</h2><p>Publish school announcements or update important website information.</p></section>
 <div className="adm-dashboard-top"><div className="adm-kpis"><KPI label="Student Enrolled" value={students} icon={GraduationCap} source="Registrar API · 0 when not connected"/><KPI label="Full-time Faculty" value={faculty} icon={UsersRound} source="Faculty API · 0 when not connected"/><KPI label="Site Visitors" value={visitors} icon={ChartNoAxesColumnIncreasing} source="Landing Page visit counter"/></div><div className="adm-view-buttons"><Link to="/admin/view-user">View Page User <ArrowUpRight size={17}/></Link><Link to="/admin/view-admin">View Page Admin <Pencil size={17}/></Link></div></div>
 <div className="adm-dashboard-lower"><Panel title="Website Statistics Overview" aside={<span className="adm-select-mock">Current totals</span>}><div className="adm-overview-chart" role="img" aria-label="Current Student Enrolled, Full-time Faculty and Site Visitors, as reported by the existing statistics API"><div className="adm-chart-grid"><span>Live snapshot</span><div className="adm-chart-zero">{state.loading?'Loading statistics…':state.error?'Statistics temporarily unavailable':'Historical trends need stored time-series data'}</div></div></div><div className="adm-chart-legend"><span><i className="adm-dot one"/> Site Visitors: {visitors ?? '—'}</span><span><i className="adm-dot two"/> Student Enrolled: {students ?? '—'}</span><span><i className="adm-dot three"/> Full-time Faculty: {faculty ?? '—'}</span></div></Panel>
 <Panel title="Recent History" aside={<Link to="/admin/history" className="adm-green-link">View all ›</Link>}><div className="adm-history-list">{history.length ? history.slice(0,5).map(h=><div className="adm-history-row" key={h.id}><span className={`adm-history-icon ${h.type.toLowerCase()}`}>{h.type==='Deleted'?<Trash2 size={18}/>:h.type==='Edited'?<Pencil size={18}/>:<Upload size={18}/>}</span><span className="adm-history-text"><b>{h.type}: {h.target}</b><small>{h.when}</small></span><Status>{h.type}</Status></div>) : <div className="adm-empty"><FileText size={30}/><strong>No content changes yet</strong><p>Drafts, updates and deleted cards will appear here during this prototype session.</p></div>}</div></Panel></div>
 <div className="adm-note">Content preview uses your existing API when available. Admin actions in this frontend prototype are not saved to the backend.</div>
 </>;
}
