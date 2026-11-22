import {useEffect} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import {Services,ServiceDetail} from './pages/Services';
import {services} from './data/catalog';
import {serviceDetails} from './data/service-details';
const aliases={'ai-and-data':'artificial-intelligence-and-data','software-and-technology':'technology-transformation'};
export default function App(){let slug=location.pathname.split('/').filter(Boolean).at(-1)?.replace(/\.html$/,'')||'index';slug=aliases[slug]||slug;const service=services.find(s=>s.slug===slug);const home=slug==='index';useEffect(()=>{document.title=home?'CorpBridge — Intelligence that moves business forward':`${service?.name||({services:'Services',about:'About CorpBridge',contact:'Let’s talk'}[slug]||'Page not found')} | CorpBridge`;const description=service?serviceDetails[service.slug].overview:'Explore technology, business, industry and people services for meaningful change.';
const setMeta=(key,value,attribute='name')=>{let tag=document.head.querySelector(`meta[${attribute}="${key}"]`);if(!tag){tag=document.createElement('meta');tag.setAttribute(attribute,key);document.head.appendChild(tag);}tag.content=value;};
setMeta('description',description);setMeta('og:title',document.title,'property');setMeta('og:description',description,'property');setMeta('og:type','website','property');setMeta('og:image',service?`/assets/images/services/${service.slug}.webp`:'/assets/images/workshop.png','property');setMeta('twitter:card','summary_large_image');
if(location.hash){const id=decodeURIComponent(location.hash.slice(1));requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView());}},[slug]);return <><a className="skip" href="#main">Skip to content</a><div id="top"/><Header home={home}/><main id="main">{home?<Home/>:slug==='services'?<Services/>:slug==='about'?<About/>:slug==='contact'?<Contact/>:service?<ServiceDetail service={service}/>:<section className="section not-found"><h1>Page not found.</h1><a className="text-link" href="/">Return home</a></section>}</main><Footer/></>;}
