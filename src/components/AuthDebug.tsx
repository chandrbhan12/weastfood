import { useEffect, useState } from "react";

const AuthDebug = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // TODO: Replace with actual auth monitoring
    const log = (msg: string, data?: any) => setEvents((s) => [ `${new Date().toLocaleTimeString()} ${msg}`, ...s ].slice(0, 20));
    log('[AuthDebug] Auth monitoring disabled - Supabase removed');
  }, []);

  return (
    <div style={{position: 'fixed', right: 12, bottom: 12, zIndex:9999, width: 360, maxHeight: '60vh', overflow: 'auto', background: 'rgba(0,0,0,0.7)', color: 'white', padding: 12, borderRadius: 8, fontSize: 12}}>
      <div style={{fontWeight: 700, marginBottom: 8}}>Auth Debug</div>
      <div style={{marginBottom:8}}>Session: <pre style={{whiteSpace:'pre-wrap',maxHeight:120,overflow:'auto'}}>{JSON.stringify(session, null, 2)}</pre></div>
      <div style={{fontWeight:700, marginBottom:6}}>Recent events</div>
      <ul style={{paddingLeft: 12}}>
        {events.map((e,i) => <li key={i} style={{marginBottom:6}}>{e}</li>)}
      </ul>
    </div>
  );
};

export default AuthDebug;
