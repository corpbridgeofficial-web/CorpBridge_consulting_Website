import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {groups,services} from '../data/catalog';
import {Logo,Link,Arrow} from './UI';
export default function Header({home=false}){
 const [open,setOpen]=useState(false),[mobile,setMobile]=useState(false),[scrolled,setScrolled]=useState(false);
 const root=useRef(null),trigger=useRef(null),mobileTrigger=useRef(null);
 const reduced=useReducedMotion();
 const active=open||mobile;
 const close=()=>{setOpen(false);setMobile(false);};
 useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>30);scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);},[]);
 useEffect(()=>{
  if(!active)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  document.querySelector('main')?.setAttribute('inert','');
  document.querySelector('footer')?.setAttribute('inert','');
  const key=e=>{
   if(e.key==='Escape'){close();(mobile?mobileTrigger:trigger).current?.focus();}
   if(e.key==='Tab'){
    const nodes=[...root.current.querySelectorAll('a[href],button')].filter(n=>n.getClientRects().length);
    const first=nodes[0],last=nodes.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
  };
  document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=previous;document.querySelector('main')?.removeAttribute('inert');document.querySelector('footer')?.removeAttribute('inert');document.removeEventListener('keydown',key);};
 },[active,mobile]);
 useEffect(()=>{const resize=()=>{if(window.innerWidth>760)setMobile(false);};window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
 return <>
 <AnimatePresence>{active&&<motion.div className="menu-backdrop" aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.22}} onClick={close}/>}</AnimatePresence>
 <header ref={root} className={`site-header ${home&&!scrolled&&!active?'over-hero':''}`}>
  <div className="nav-bar"><Logo/><button ref={mobileTrigger} className="mobile-toggle" onClick={()=>{setMobile(!mobile);setOpen(false);}} aria-expanded={mobile} aria-controls="primary-nav">{mobile?'Close':'Menu'} <span aria-hidden="true">{mobile?'×':'☰'}</span></button>
  <nav id="primary-nav" className={mobile?'mobile-open':''} aria-label="Main navigation">
   <button ref={trigger} id="services-trigger" className={`services-trigger ${open?'selected':''}`} onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="services-menu">Services <svg className={open?'rotate-180':''} width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true"><path d="m1 1 5.5 6L12 1" stroke="currentColor" strokeWidth="1.5"/></svg></button>
   <a href="/about.html" onClick={close}>About</a><a href="/contact.html" onClick={close}>Contact</a>
  </nav></div>
  <AnimatePresence>{open&&<motion.div id="services-menu" className="mega-menu" aria-labelledby="services-trigger" initial={{opacity:0,y:reduced?0:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-12}} transition={{duration:reduced?0:.28,ease:[.2,.7,.2,1]}}>
   <button className="mega-close" onClick={()=>{close();trigger.current?.focus();}} aria-label="Close services menu">×</button><div className="mega-intro"><div><span className="eyebrow accent">What we do</span><h2>Find your next move.</h2><p>Explore every CorpBridge service in one place.</p></div><Link href="/services.html" variant="text-link accent" onClick={close}>View all 18 services</Link></div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8 mega-columns">{groups.map((group,i)=><motion.section key={group.id} initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} transition={{delay:reduced?0:.06+i*.04}}><h3><a href={`/services.html#${group.id}`} onClick={close}>{group.name}</a></h3><ul>{services.filter(s=>s.group===group.id).map(s=><li key={s.slug}><a href={`/${s.slug}.html`} onClick={close}><span>{s.name}</span><Arrow/></a></li>)}</ul></motion.section>)}</div>
  </motion.div>}</AnimatePresence>
 </header></>;
}
