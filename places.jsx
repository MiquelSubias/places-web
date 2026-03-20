import { useState, useEffect } from "react";
import { Bookmark, Plus, Home, ChevronLeft, X, MapPin, LogOut, Check } from "lucide-react";

const C = {
  cream: '#F8F4EE', white: '#FFFFFF', ink: '#1A1512', brown: '#6B5744',
  terra: '#C4603E', terraLight: '#FFF0EB', sage: '#4A7A54', sageLt: '#E8EFE8',
  muted: '#9B8E82', ghost: '#B5A99A', border: '#EDE7DE', surface: '#FDFBF8',
};

const USERS = [
  { id:'u1', username:'mariabcn', name:'Maria García', bio:'BCN food explorer 🍴 Always hungry', avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', posts:24, followers:1204, following:89 },
  { id:'u2', username:'alexchef', name:'Alex Martín', bio:'Chef · Food lover · Always at the market', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', posts:41, followers:3820, following:142 },
  { id:'u3', username:'sofiatravel', name:'Sofia Ruiz', bio:'✈️ Eating my way around the world', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', posts:88, followers:9400, following:312 },
  { id:'u4', username:'lucacoffee', name:'Luca Romano', bio:'Coffee nerd ☕ Specialty only', avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', posts:15, followers:672, following:44 },
  { id:'u5', username:'ninaeats', name:'Nina Petit', bio:'Brunch first, decisions later 🥂', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', posts:33, followers:2180, following:201 },
];

const POSTS = [
  { id:'p1', uid:'u1', place:'Bar Cañete', loc:'El Raval, Barcelona', img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&fit=crop', rating:5, tags:['dinner','fancy','date'], caption:'The patatas bravas here are absolutely insane. Best kept secret in El Raval.', at: Date.now()-2*3600000 },
  { id:'p2', uid:'u5', place:'Federal Café', loc:'Sant Antoni, Barcelona', img:'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&fit=crop', rating:5, tags:['brunch','coffee'], caption:"Sunday brunch goals. Their avocado toast hits different when you're hungover.", at: Date.now()-5*3600000 },
  { id:'p3', uid:'u4', place:'Nomad Coffee Lab', loc:'Poblenou, Barcelona', img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&fit=crop', rating:5, tags:['coffee','quick'], caption:'If you care about coffee at all, this is your place. Best espresso in the city. Full stop.', at: Date.now()-8*3600000 },
  { id:'p4', uid:'u2', place:'Parking Pizza', loc:'Eixample, Barcelona', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&fit=crop', rating:4, tags:['dinner','cheap'], caption:"Neapolitan-style that actually tastes like Naples. Been coming here for 3 years.", at: Date.now()-24*3600000 },
  { id:'p5', uid:'u3', place:'Bar Brutal', loc:'El Born, Barcelona', img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&fit=crop', rating:5, tags:['dinner','drinks','date'], caption:'Natural wine bar with insane small plates. Go at 7pm before it fills up. Worth every euro.', at: Date.now()-30*3600000 },
  { id:'p6', uid:'u1', place:'Granja Petitbo', loc:'Eixample, Barcelona', img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&fit=crop', rating:4, tags:['brunch','family'], caption:'Best French toast in BCN. Come early or expect a wait.', at: Date.now()-2*86400000 },
  { id:'p7', uid:'u2', place:'Bodega Sepúlveda', loc:'Eixample, Barcelona', img:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&fit=crop', rating:5, tags:['lunch','cheap'], caption:"Lunch menu €12. The kind of place locals don't want you to find.", at: Date.now()-3*86400000 },
  { id:'p8', uid:'u5', place:'Boca Grande', loc:'Passeig de Gràcia', img:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&fit=crop', rating:4, tags:['lunch','fancy','date'], caption:'Gorgeous terrace, fresh seafood. A little pricey but worth it for a special occasion.', at: Date.now()-4*86400000 },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&fit=crop',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&fit=crop',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&fit=crop',
];

const TAGS = ['brunch','dinner','lunch','coffee','cheap','fancy','date','family','takeaway','quick','drinks','dessert'];

const RATE = { 5:{e:'🔥',l:'Must go'}, 4:{e:'✨',l:'Really good'}, 3:{e:'👍',l:'Worth it'}, 2:{e:'😐',l:"It's okay"}, 1:{e:'👎',l:'Skip'} };

const ago = (ts) => {
  const d = Date.now() - ts, m = Math.floor(d/60000), h = Math.floor(d/3600000);
  if (m<1) return 'now'; if (m<60) return `${m}m`; if (h<24) return `${h}h`;
  return `${Math.floor(h/24)}d`;
};

const inp = { display:'block', width:'100%', padding:'12px 14px', border:`1.5px solid ${C.border}`, borderRadius:12, fontSize:15, color:C.ink, background:C.white, fontFamily:'inherit', marginBottom:16, boxSizing:'border-box' };

function Label({ children }) {
  return <div style={{ fontSize:12, fontWeight:600, color:C.muted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>{children}</div>;
}

function Tag({ t }) {
  return <span style={{ background:C.sageLt, color:C.sage, fontSize:12, fontWeight:600, padding:'3px 10px', borderRadius:20 }}>{t}</span>;
}

function Avatar({ src, size=36, border }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden', border: border||`2px solid ${C.cream}`, flexShrink:0, background:C.border }}>
      {!err && <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={()=>setErr(true)} />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const lk = document.createElement('link');
    lk.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@300;400;500;600&display=swap';
    lk.rel = 'stylesheet'; document.head.appendChild(lk);
    const st = document.createElement('style');
    st.textContent = `
      *{box-sizing:border-box}
      .serif{font-family:'Cormorant Garamond',serif!important}
      .noscr::-webkit-scrollbar{display:none}
      .noscr{-ms-overflow-style:none;scrollbar-width:none}
      @keyframes sup{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes fin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .sup{animation:sup 0.38s cubic-bezier(0.16,1,0.3,1) both}
      .fin{animation:fin 0.45s ease both}
      input,textarea,button{font-family:inherit}
      input:focus,textarea:focus{outline:none;border-color:${C.terra}!important}
      textarea{outline:none}
    `;
    document.head.appendChild(st);
  }, []);

  const [scr, setScr] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState(POSTS);
  const [following, setFollowing] = useState([]);
  const [saved, setSaved] = useState([]);
  const [viewUid, setViewUid] = useState(null);
  const [profTab, setProfTab] = useState('posts');
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const [authErr, setAuthErr] = useState('');

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({ img:null, place:'', loc:'', caption:'', rating:5, tags:[] });

  const feedPosts = [...posts]
    .filter(p => following.includes(p.uid) || p.uid === 'me')
    .sort((a,b) => b.at - a.at);

  const getUser = (id) => id === 'me' ? me : USERS.find(u => u.id === id);

  const doLogin = () => {
    const u = { id:'me', username: form.username||'you', name: form.username||'You',
      bio:'Discovering places through people I trust 🍴',
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(form.username||'You')}&background=C4603E&color=fff&size=200`,
      posts:0, followers:0, following: USERS.length };
    setMe(u); setFollowing(USERS.map(u=>u.id)); setScr('feed');
  };

  const doSignup = () => {
    if (!form.username.trim()) { setAuthErr('Please enter a username'); return; }
    doLogin();
  };

  const toggleSave = (id) => setSaved(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const toggleFollow = (id) => setFollowing(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const goProfile = (uid) => { setViewUid(uid); setProfTab('posts'); setScr('profile'); };

  const publish = () => {
    if (!draft.place || !draft.img) return;
    setPosts(p => [{ id:`m${Date.now()}`, uid:'me', place:draft.place, loc:draft.loc||'Barcelona',
      img:draft.img, rating:draft.rating, tags:draft.tags, caption:draft.caption, at:Date.now() }, ...p]);
    setDraft({ img:null, place:'', loc:'', caption:'', rating:5, tags:[] });
    setStep(1); setScr('feed');
  };

  const logout = () => { setMe(null); setFollowing([]); setSaved([]); setScr('auth'); setForm({username:'',email:'',password:''}); };

  // ── AUTH ──────────────────────────────────────────────
  if (!me) return (
    <div style={{ minHeight:'100vh', background:C.cream, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', fontFamily:"'Outfit',sans-serif" }}>
      <div className="fin" style={{ textAlign:'center', marginBottom:52 }}>
        <div className="serif" style={{ fontSize:58, fontWeight:600, color:C.ink, letterSpacing:'-2px', lineHeight:0.9 }}>places</div>
        <div style={{ fontSize:14, color:C.muted, marginTop:14, fontWeight:300, letterSpacing:'0.04em' }}>discover through people you trust</div>
      </div>

      <div className="fin" style={{ width:'100%', maxWidth:360, background:C.white, borderRadius:24, padding:'32px 28px', boxShadow:'0 4px 40px rgba(26,21,18,0.09)', animationDelay:'0.1s' }}>
        <h2 style={{ fontSize:20, fontWeight:600, color:C.ink, margin:'0 0 24px', letterSpacing:'-0.3px' }}>
          {authMode==='login' ? 'Welcome back' : 'Get started'}
        </h2>
        {authMode==='signup' && (
          <input value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="Choose a username" style={inp} />
        )}
        <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email address" style={inp} />
        <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Password" style={{ ...inp, marginBottom: authErr?6:0 }} />
        {authErr && <div style={{ fontSize:13, color:C.terra, marginBottom:14 }}>{authErr}</div>}
        <button onClick={authMode==='login'?doLogin:doSignup} style={{ display:'block', width:'100%', padding:'14px', background:C.ink, color:C.cream, border:'none', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer', marginTop:18 }}>
          {authMode==='login' ? 'Sign in' : 'Create account'}
        </button>
        <div style={{ textAlign:'center', marginTop:18, fontSize:14, color:C.muted }}>
          {authMode==='login' ? "New here? " : "Already have an account? "}
          <span onClick={()=>{setAuthMode(m=>m==='login'?'signup':'login');setAuthErr('');}} style={{ color:C.terra, fontWeight:500, cursor:'pointer' }}>
            {authMode==='login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
        {authMode==='login' && (
          <div style={{ textAlign:'center', marginTop:24, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
            <div style={{ fontSize:12, color:C.ghost, marginBottom:10 }}>Just want to explore?</div>
            <button onClick={doLogin} style={{ padding:'10px 28px', background:'#F2E8E0', color:'#8A7968', border:'none', borderRadius:10, fontSize:14, fontWeight:500, cursor:'pointer' }}>
              Enter as guest →
            </button>
          </div>
        )}
      </div>

      <div className="fin" style={{ marginTop:32, display:'flex', alignItems:'center', gap:8, opacity:0.6, animationDelay:'0.2s' }}>
        {USERS.slice(0,3).map(u=>(
          <Avatar key={u.id} src={u.avatar} size={30} border={`2px solid ${C.border}`} />
        ))}
        <span style={{ fontSize:13, color:C.muted }}>5 people waiting for you</span>
      </div>
    </div>
  );

  // ── BOTTOM NAV ────────────────────────────────────────
  const BNav = () => (
    <div style={{ background:C.white, borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-around', padding:'10px 16px 20px', flexShrink:0 }}>
      <NavBtn icon={<Home size={22} strokeWidth={scr==='feed'?2.2:1.6}/>} label="Home" active={scr==='feed'} onClick={()=>setScr('feed')} />
      <button onClick={()=>{setStep(1);setScr('create');}} style={{ width:50, height:50, borderRadius:'50%', background:C.ink, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 20px rgba(26,21,18,0.28)', transform:'translateY(-10px)' }}>
        <Plus size={22} color={C.cream} strokeWidth={2.5} />
      </button>
      <NavBtn icon={<Bookmark size={22} strokeWidth={scr==='saved'?2.2:1.6}/>} label="Saved" active={scr==='saved'} onClick={()=>setScr('saved')} />
      <button onClick={()=>goProfile('me')} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', padding:'4px 12px' }}>
        <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', border: scr==='profile'?`2.5px solid ${C.terra}`:`2px solid transparent`, background:C.border, flexShrink:0 }}>
          <img src={me.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={()=>{}} />
        </div>
        <span style={{ fontSize:10, color:scr==='profile'?C.terra:C.muted, fontWeight:scr==='profile'?600:400 }}>Me</span>
      </button>
    </div>
  );

  // ── CREATE ────────────────────────────────────────────
  if (scr === 'create') return (
    <div className="sup" style={{ height:'100vh', background:C.cream, display:'flex', flexDirection:'column', fontFamily:"'Outfit',sans-serif", maxWidth:430, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 20px 16px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <button onClick={()=>setScr('feed')} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><X size={22} color={C.ink}/></button>
        <div style={{ fontSize:16, fontWeight:600, color:C.ink }}>{step===1?'Choose a photo':'Add details'}</div>
        {step===1
          ? <button onClick={()=>draft.img&&setStep(2)} style={{ fontSize:15, fontWeight:600, color:draft.img?C.terra:C.ghost, background:'none', border:'none', cursor:draft.img?'pointer':'default' }}>Next →</button>
          : <button onClick={publish} disabled={!draft.place} style={{ fontSize:15, fontWeight:600, color:draft.place?C.terra:C.ghost, background:'none', border:'none', cursor:draft.place?'pointer':'default' }}>Post</button>}
      </div>

      {step===1 && (
        <div className="noscr" style={{ flex:1, overflowY:'auto', padding:16 }}>
          {draft.img && <img src={draft.img} alt="" style={{ width:'100%', height:200, objectFit:'cover', borderRadius:16, marginBottom:16, border:`3px solid ${C.terra}` }}/>}
          <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>Tap a photo to select it</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {GALLERY.map((img,i)=>(
              <div key={i} onClick={()=>setDraft(d=>({...d,img}))} style={{ aspectRatio:'1', borderRadius:12, overflow:'hidden', cursor:'pointer', border:draft.img===img?`3px solid ${C.terra}`:'3px solid transparent', position:'relative' }}>
                <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                {draft.img===img && <div style={{ position:'absolute', top:6, right:6, width:22, height:22, background:C.terra, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}><Check size={13} color="white" strokeWidth={2.5}/></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {step===2 && (
        <div className="noscr" style={{ flex:1, overflowY:'auto', padding:16 }}>
          {draft.img && <img src={draft.img} alt="" style={{ width:'100%', height:180, objectFit:'cover', borderRadius:16, marginBottom:16 }}/>}
          <button onClick={()=>setStep(1)} style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:13, marginBottom:20, padding:0 }}>
            <ChevronLeft size={16}/> Change photo
          </button>
          <Label>Place name *</Label>
          <input value={draft.place} onChange={e=>setDraft(d=>({...d,place:e.target.value}))} placeholder="e.g. Bar Cañete" style={inp}/>
          <Label>Location</Label>
          <input value={draft.loc} onChange={e=>setDraft(d=>({...d,loc:e.target.value}))} placeholder="e.g. El Born, Barcelona" style={{ ...inp, marginBottom:20 }}/>
          <Label>Caption</Label>
          <textarea value={draft.caption} onChange={e=>setDraft(d=>({...d,caption:e.target.value.slice(0,200)}))} placeholder="Quick take on this place..." rows={3} style={{ ...inp, resize:'none', lineHeight:1.55, marginBottom:4 }}/>
          <div style={{ fontSize:12, color:C.ghost, textAlign:'right', marginBottom:20 }}>{draft.caption.length}/200</div>
          <Label>Rating</Label>
          <div style={{ display:'flex', gap:6, marginBottom:20 }}>
            {[5,4,3,2,1].map(v=>{
              const r=RATE[v];
              return (
                <button key={v} onClick={()=>setDraft(d=>({...d,rating:v}))} style={{ flex:1, padding:'10px 4px', borderRadius:12, border:draft.rating===v?`2px solid ${C.terra}`:`2px solid ${C.border}`, background:draft.rating===v?C.terraLight:C.white, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                  <span style={{ fontSize:20 }}>{r.e}</span>
                  <span style={{ fontSize:9, color:C.muted, fontWeight:500 }}>{r.l}</span>
                </button>
              );
            })}
          </div>
          <Label>Tags</Label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:40 }}>
            {TAGS.map(t=>{
              const sel=draft.tags.includes(t);
              return (
                <button key={t} onClick={()=>setDraft(d=>({...d,tags:sel?d.tags.filter(x=>x!==t):[...d.tags,t]}))} style={{ padding:'7px 14px', borderRadius:20, border:sel?`2px solid ${C.sage}`:`2px solid ${C.border}`, background:sel?C.sageLt:C.white, color:sel?C.sage:C.muted, fontSize:13, fontWeight:sel?600:400, cursor:'pointer' }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── FEED ──────────────────────────────────────────────
  if (scr === 'feed') return (
    <div style={{ height:'100vh', background:C.cream, display:'flex', flexDirection:'column', maxWidth:430, margin:'0 auto', fontFamily:"'Outfit',sans-serif" }}>
      <div style={{ padding:'16px 20px 12px', borderBottom:`1px solid ${C.border}`, background:C.cream, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div className="serif" style={{ fontSize:30, fontWeight:600, color:C.ink, letterSpacing:'-1px' }}>places</div>
          <div style={{ fontSize:12, color:C.muted, background:'#F2E8E0', padding:'5px 12px', borderRadius:20 }}>
            {following.length} following
          </div>
        </div>
      </div>

      <div className="noscr fin" style={{ flex:1, overflowY:'auto', padding:'12px 14px' }}>
        {feedPosts.length===0 ? (
          <div style={{ padding:'24px 0' }}>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{ fontSize:32, marginBottom:12 }}>👋</div>
              <div style={{ fontSize:18, fontWeight:600, color:C.ink, marginBottom:6 }}>Follow people to see their places</div>
              <div style={{ fontSize:14, color:C.muted }}>Your feed is personal and chronological</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {USERS.map(u=>(
                <div key={u.id} style={{ background:C.white, borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 8px rgba(26,21,18,0.05)' }}>
                  <div onClick={()=>goProfile(u.id)} style={{ cursor:'pointer' }}><Avatar src={u.avatar} size={44}/></div>
                  <div style={{ flex:1, cursor:'pointer' }} onClick={()=>goProfile(u.id)}>
                    <div style={{ fontSize:15, fontWeight:600, color:C.ink }}>{u.name}</div>
                    <div style={{ fontSize:13, color:C.muted }}>@{u.username} · {u.posts} places</div>
                  </div>
                  <button onClick={()=>toggleFollow(u.id)} style={{ padding:'8px 16px', borderRadius:20, border:`2px solid ${C.ink}`, background:following.includes(u.id)?'transparent':C.ink, color:following.includes(u.id)?C.ink:C.white, fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0 }}>
                    {following.includes(u.id)?'Following':'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : feedPosts.map((p,i)=>{
          const u=getUser(p.uid), r=RATE[p.rating]||RATE[3], sv=saved.includes(p.id);
          if(!u) return null;
          return (
            <div key={p.id} className="fin" style={{ animationDelay:`${i*0.05}s`, background:C.white, borderRadius:20, overflow:'hidden', marginBottom:16, boxShadow:'0 1px 12px rgba(26,21,18,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px 10px' }}>
                <div onClick={()=>goProfile(p.uid)} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <Avatar src={u.avatar} size={36}/>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.ink, lineHeight:1.2 }}>{u.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>@{u.username}</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.ghost }}>{ago(p.at)}</div>
              </div>

              <div style={{ position:'relative' }}>
                <img src={p.img} alt={p.place} style={{ width:'100%', height:260, objectFit:'cover', display:'block' }} onError={e=>e.target.src=GALLERY[0]}/>
                <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(8px)', borderRadius:20, padding:'5px 10px', display:'flex', alignItems:'center', gap:5, boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
                  <span style={{ fontSize:15 }}>{r.e}</span>
                  <span style={{ fontSize:12, fontWeight:500, color:C.ink }}>{r.l}</span>
                </div>
              </div>

              <div style={{ padding:'13px 14px 14px' }}>
                <div className="serif" style={{ fontSize:26, fontWeight:600, color:C.ink, lineHeight:1.15, marginBottom:4 }}>{p.place}</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:C.muted, marginBottom:10 }}>
                  <MapPin size={12} strokeWidth={2}/>{p.loc}
                </div>
                {p.tags.length>0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    {p.tags.map(t=><Tag key={t} t={t}/>)}
                  </div>
                )}
                {p.caption && <div style={{ fontSize:14, color:'#5A4E46', lineHeight:1.55, marginBottom:12 }}>{p.caption}</div>}
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button onClick={()=>toggleSave(p.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px', display:'flex', alignItems:'center', gap:5 }}>
                    <Bookmark size={20} strokeWidth={1.8} fill={sv?C.terra:'none'} color={sv?C.terra:C.muted}/>
                    {sv && <span style={{ fontSize:12, color:C.terra, fontWeight:500 }}>Saved</span>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ height:90 }}/>
      </div>
      <BNav/>
    </div>
  );

  // ── PROFILE ───────────────────────────────────────────
  if (scr === 'profile') {
    const isOwn = viewUid==='me';
    const pu = isOwn ? me : getUser(viewUid);
    const pposts = posts.filter(p=>p.uid===(isOwn?'me':viewUid));
    const sposts = posts.filter(p=>saved.includes(p.id));
    const isF = following.includes(viewUid);
    const disp = isOwn && profTab==='saved' ? sposts : pposts;
    if(!pu) return null;

    return (
      <div style={{ height:'100vh', background:C.cream, display:'flex', flexDirection:'column', maxWidth:430, margin:'0 auto', fontFamily:"'Outfit',sans-serif" }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${C.border}`, background:C.cream, flexShrink:0 }}>
          {!isOwn
            ? <button onClick={()=>setScr('feed')} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><ChevronLeft size={24} color={C.ink}/></button>
            : <div style={{ width:32 }}/>}
          <div style={{ fontSize:15, fontWeight:600, color:C.ink }}>@{pu.username}</div>
          {isOwn
            ? <button onClick={logout} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><LogOut size={20} color={C.muted}/></button>
            : <div style={{ width:32 }}/>}
        </div>

        <div className="noscr" style={{ flex:1, overflowY:'auto' }}>
          <div style={{ padding:'28px 20px 20px', textAlign:'center' }}>
            <Avatar src={pu.avatar} size={84} border={`3px solid ${C.border}`}/>
            <div style={{ marginTop:14, fontSize:20, fontWeight:700, color:C.ink }}>{pu.name}</div>
            {pu.bio && <div style={{ fontSize:14, color:C.muted, lineHeight:1.5, maxWidth:260, margin:'6px auto 18px' }}>{pu.bio}</div>}
            <div style={{ display:'flex', justifyContent:'center', gap:40, marginBottom:20 }}>
              {[{v:pposts.length,l:'places'},{v:pu.followers||0,l:'followers'},{v:isOwn?following.length:(pu.following||0),l:'following'}].map(s=>(
                <div key={s.l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:700, color:C.ink, lineHeight:1 }}>{s.v}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
            {!isOwn && (
              <button onClick={()=>toggleFollow(viewUid)} style={{ padding:'10px 32px', borderRadius:24, border:`2px solid ${C.ink}`, background:isF?'transparent':C.ink, color:isF?C.ink:C.white, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                {isF?'Following':'Follow'}
              </button>
            )}
          </div>

          {isOwn && (
            <div style={{ display:'flex', borderBottom:`1px solid ${C.border}` }}>
              {['posts','saved'].map(t=>(
                <button key={t} onClick={()=>setProfTab(t)} style={{ flex:1, padding:'12px', background:'none', border:'none', borderBottom:profTab===t?`2.5px solid ${C.terra}`:'2.5px solid transparent', color:profTab===t?C.ink:C.muted, fontSize:14, fontWeight:600, cursor:'pointer', textTransform:'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {disp.length===0 ? (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px 20px', color:C.muted, fontSize:14 }}>
                {isOwn&&profTab==='saved' ? 'Tap 🔖 on any post to save it' : 'No places shared yet'}
              </div>
            ) : disp.map(p=>(
              <div key={p.id} style={{ borderRadius:14, overflow:'hidden', background:C.white, boxShadow:'0 1px 8px rgba(26,21,18,0.06)' }}>
                <img src={p.img} alt="" style={{ width:'100%', height:130, objectFit:'cover' }} onError={e=>e.target.src=GALLERY[0]}/>
                <div style={{ padding:'8px 10px 10px' }}>
                  <div className="serif" style={{ fontSize:15, fontWeight:600, color:C.ink, lineHeight:1.2 }}>{p.place}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{p.loc}</div>
                  <div style={{ fontSize:11, color:C.ghost, marginTop:3 }}>{RATE[p.rating]?.e} {RATE[p.rating]?.l}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height:90 }}/>
        </div>
        <BNav/>
      </div>
    );
  }

  // ── SAVED ─────────────────────────────────────────────
  if (scr === 'saved') {
    const sp = posts.filter(p=>saved.includes(p.id));
    return (
      <div style={{ height:'100vh', background:C.cream, display:'flex', flexDirection:'column', maxWidth:430, margin:'0 auto', fontFamily:"'Outfit',sans-serif" }}>
        <div style={{ padding:'18px 20px 14px', borderBottom:`1px solid ${C.border}`, background:C.cream, flexShrink:0 }}>
          <div className="serif" style={{ fontSize:28, fontWeight:600, color:C.ink, letterSpacing:'-0.5px' }}>Saved</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{sp.length} place{sp.length!==1?'s':''}</div>
        </div>

        <div className="noscr fin" style={{ flex:1, overflowY:'auto', padding:14 }}>
          {sp.length===0 ? (
            <div style={{ textAlign:'center', padding:'80px 20px' }}>
              <div style={{ fontSize:44, marginBottom:16 }}>🔖</div>
              <div style={{ fontSize:17, fontWeight:600, color:C.ink, marginBottom:8 }}>Nothing saved yet</div>
              <div style={{ fontSize:14, color:C.muted, lineHeight:1.6, maxWidth:230, margin:'0 auto' }}>Tap the bookmark icon on any post to save it</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {sp.map(p=>{
                const u=getUser(p.uid);
                return (
                  <div key={p.id} style={{ borderRadius:14, overflow:'hidden', background:C.white, boxShadow:'0 1px 8px rgba(26,21,18,0.06)' }}>
                    <div style={{ position:'relative' }}>
                      <img src={p.img} alt="" style={{ width:'100%', height:130, objectFit:'cover' }} onError={e=>e.target.src=GALLERY[0]}/>
                      <button onClick={()=>toggleSave(p.id)} style={{ position:'absolute', top:8, right:8, width:28, height:28, background:'rgba(255,255,255,0.92)', border:'none', borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <X size={14} color={C.muted}/>
                      </button>
                    </div>
                    <div style={{ padding:'8px 10px 10px' }}>
                      <div className="serif" style={{ fontSize:15, fontWeight:600, color:C.ink }}>{p.place}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{p.loc}</div>
                      <div style={{ fontSize:11, color:C.ghost, marginTop:4 }}>by @{u?.username}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ height:90 }}/>
        </div>
        <BNav/>
      </div>
    );
  }

  return null;
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', padding:'4px 12px' }}>
      <div style={{ color: active?'#C4603E':'#9B8E82' }}>{icon}</div>
      <span style={{ fontSize:10, color:active?'#C4603E':'#9B8E82', fontWeight:active?600:400 }}>{label}</span>
    </button>
  );
}
