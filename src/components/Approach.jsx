import {useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {config} from '../data/config';
import {Reveal,Arrow} from './UI';
export default function Approach(){
 const [active,setActive]=useState(0);const reduced=useReducedMotion();
 const stage=config.stages[active];
 function key(event,i){const map={ArrowRight:(i+1)%4,ArrowLeft:(i+3)%4,Home:0,End:3};if(event.key in map){event.preventDefault();setActive(map[event.key]);document.getElementById(`stage-${map[event.key]}`).focus();}}
 return <section className="approach section"><Reveal><span className="eyebrow">How we work</span><h2>From understanding<br/>to implementation.</h2></Reveal><div className="process-tabs" role="tablist" aria-label="How we work">{config.stages.map((s,i)=><button key={s[0]} id={`stage-${i}`} role="tab" aria-controls="stage-panel" aria-selected={active===i} tabIndex={active===i?0:-1} onKeyDown={e=>key(e,i)} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span>{s[0]}<Arrow/>{active===i&&<motion.i layoutId="stage-underline" transition={{duration:reduced?0:.3}}/>}</button>)}</div><div id="stage-panel" role="tabpanel" aria-labelledby={`stage-${active}`} tabIndex="0"><AnimatePresence mode="wait"><motion.div key={active} className="stage-content" initial={{opacity:0,y:reduced?0:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reduced?0:.2}}><span className="step-number">{String(active+1).padStart(2,'0')}</span><div><h3>{stage[1]}</h3><p>{stage[2]}</p></div></motion.div></AnimatePresence></div></section>;
}
