const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1').replace(/\/api\/v1\/?$/, '');
const KEY = 'idsc-admin-session';
export const adminSession = {
  token: () => sessionStorage.getItem(KEY),
  set: value => sessionStorage.setItem(KEY,value),
  clear: () => sessionStorage.removeItem(KEY),
};
async function call(path, options={}) {
  const token=adminSession.token();
  let response;
  try {response=await fetch(`${API_BASE}/api/admin${path}`,{
    ...options,
    headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},
    cache:'no-store',
  });}
  catch{throw Error('Admin API cannot be reached. Check the backend server.');}
  if(!response.ok){
    const body=await response.json().catch(()=>({}));
    if(response.status===401 && path!=='/login') adminSession.clear();
    throw Error(body.detail || `Admin API error ${response.status}`);
  }
  return response.status===204?null:response.json();
}
export const adminApi={
  login:(email,password)=>call('/login',{method:'POST',body:JSON.stringify({email,password})}),
  session:()=>call('/session'),
  logout:()=>call('/logout',{method:'POST'}),
  getState:()=>call('/state'),
  notifications:(search='')=>call(`/notifications?search=${encodeURIComponent(search)}`),
  saveState:value=>call('/state',{method:'PUT',body:JSON.stringify(value)}),
};

// Public data, excludes credentials, drafts, history and private Admin settings.
export async function getPublicContent() {
  const response=await fetch(`${API_BASE}/api/public/content`);
  if(!response.ok) throw Error('Could not load published page content');
  return response.json();
}
