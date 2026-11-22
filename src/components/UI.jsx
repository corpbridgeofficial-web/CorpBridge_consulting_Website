import { motion, useReducedMotion } from 'framer-motion';
export const image = (name) => `/assets/images/${name}`;
export function Arrow({className=''}) { return <svg className={`arrow ${className}`} aria-hidden="true" viewBox="0 0 28 28" fill="none"><path d="M5 23 23 5M5 5h18v18" stroke="currentColor" strokeWidth="1.5"/></svg>; }
export function Link({href, children, variant='button', ...props}) {return <a className={variant} href={href} {...props}>{children}<Arrow/></a>;}
export function Reveal({children, className='', direction='up', delay=0}) {
 const reduced=useReducedMotion();
 return <motion.div className={className} initial={reduced?false:{opacity:0,x:direction==='left'?-35:direction==='right'?35:0,y:direction==='up'?30:0}} whileInView={{opacity:1,x:0,y:0}} viewport={{once:true,amount:0.15}} transition={{duration:0.8,delay,ease:[0.2,0.7,0.2,1]}}>{children}</motion.div>;
}
export function Logo({footer=false}) {return <a href="/" className={`logo group ${footer?'footer-logo':''}`} aria-label="CorpBridge home"><img src="/assets/icons/corpbridge.svg" alt=""/><span className="logo-name">CorpBridge</span></a>;}
export function Closing(){return <section className="closing"><img className="cover" src={image('workshop.png')} alt="Team collaborating in a modern office" loading="lazy"/><div className="closing-shade"/><Reveal className="closing-copy"><span className="eyebrow accent">Your next chapter</span><h2>What could your<br/>business do next?</h2><p>Bring your ambition. Let’s explore a useful next step together.</p><Link href="/contact.html">Start a conversation</Link></Reveal></section>;}
