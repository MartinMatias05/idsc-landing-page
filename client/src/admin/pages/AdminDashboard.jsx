import { Link } from 'react-router-dom';
import LiveStatisticsGraph from '../components/LiveStatisticsGraph';
import { useEffect } from 'react';
import { GraduationCap, UsersRound, ChartNoAxesColumnIncreasing, Pencil, Trash2, Upload, FileText, ArrowUpRight } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { useAdmin } from '../state/AdminStore';
import { PageHeading, Panel, Status } from '../components/AdminShell';
const getValue=(items,id)=> items?.find(v=>v.id===id)?.value;
function KPI({ label, icon: Icon, value, source }) {return <div className="adm-kpi"><div className="adm-kpi-head"><Icon size={25}/><span>{label}</span></div><strong>{typeof value==='number'?value.toLocaleString():'—'}</strong><small>{source}</small></div>}
export default function AdminDashboard() {
 const {posts,history}=useAdmin();const state=useApi(api.getStatistics);const stats=state.data?.items;
 useEffect(() => { const interval = window.setInterval(() => { if (!document.hidden) state.reload(); }, 15000); return () => window.clearInterval(interval); }, [state.reload]);
 const visitors=getValue(stats,'site-visitors');const students=getValue(stats,'students-enrolled');const faculty=getValue(stats,'faculty-fulltime');
 return <>
 <section className="adm-banner"><small>WEBSITE CONTENT AND UPDATES</small><h2>Keeping the IDSC community informed.</h2><p>Publish school announcements or update important website information.</p></section>
 <div className="adm-dashboard-top"><div className="adm-kpis"><KPI label="Student Enrolled" value={students} icon={GraduationCap} source="Registrar API · 0 when not connected"/><KPI label="Full-time Faculty" value={faculty} icon={UsersRound} source="Faculty API · 0 when not connected"/><KPI label="Site Visitors" value={visitors} icon={ChartNoAxesColumnIncreasing} source="Landing Page visit counter"/></div><div className="adm-view-buttons"><Link to="/admin/view-user">View Page User <ArrowUpRight size={17}/></Link><Link to="/admin/view-admin">View Page Admin <Pencil size={17}/></Link></div></div>
 <div className="adm-dashboard-lower"><Panel title="Website Statistics Overview" ><LiveStatisticsGraph status={state.status} error={state.error} visitors={visitors} students={students} faculty={faculty}/></Panel>
 <Panel title="Recent History" aside={<Link to="/admin/history" className="adm-green-link">View all ›</Link>}><div className="adm-history-list">{history.length ? history.slice(0,5).map(h=><div className="adm-history-row" key={h.id}><span className={`adm-history-icon ${h.type.toLowerCase()}`}>{h.type==='Deleted'?<Trash2 size={18}/>:h.type==='Edited'?<Pencil size={18}/>:<Upload size={18}/>}</span><span className="adm-history-text"><b>{h.type}: {h.target}</b><small>{h.when}</small></span><Status>{h.type}</Status></div>) : <div className="adm-empty"><FileText size={30}/><strong>No content changes yet</strong><p>Drafts, updates and deleted cards will appear here during this prototype session.</p></div>}</div></Panel></div>
 <div className="adm-note">Current counts come from the Landing Page API. Admin edits are saved by the backend after the save indicator confirms success.</div>
 </>;
}
