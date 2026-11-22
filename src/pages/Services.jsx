import {useState} from 'react';
import {groups,services} from '../data/catalog';
import {Reveal,Link,image,Closing,Arrow} from '../components/UI';
import {serviceDetails} from '../data/service-details';
import {ServiceHero,ServiceJumpNav,ServiceOverview,ServiceCapabilities,ServiceDelivery,ServiceSolutions,ServiceApplications,ServiceOutcomes,RelatedServices,ServiceCTA,ServiceImage} from '../components/ServiceSections';
export function PageHero({eyebrow,title,description,photo='industrial-production.png'}){return <section className="page-hero"><img className="cover" src={image(photo)} alt=""/><div className="page-hero-shade"/><Reveal className="page-hero-copy"><span className="eyebrow accent">{eyebrow}</span><h1>{title}</h1><p>{description}</p></Reveal></section>;}
export function Services(){const [query,setQuery]=useState(''),[filter,setFilter]=useState('all');const matches=services.filter(s=>(filter==='all'||s.group===filter)&&`${s.name} ${s.description}`.toLowerCase().includes(query.toLowerCase().trim()));return <><PageHero eyebrow="Our services" title="Connected expertise. Practical possibilities." description="Explore 18 service areas across technology, business, industry and people."/><section className="section catalog"><div className="catalog-tools"><h2>Find your next move.</h2><label>Search services<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try cloud, strategy or learning"/></label></div><div className="filters">{[{id:'all',name:'All services'},...groups].map(g=><button key={g.id} aria-pressed={filter===g.id} onClick={()=>setFilter(g.id)}>{g.name}</button>)}</div><p role="status">{matches.length} {matches.length===1?'service':'services'}</p>{groups.map(g=>{const items=matches.filter(s=>s.group===g.id);return items.length>0&&<section className="catalog-group" id={g.id} key={g.id}><div className="group-heading"><img className="cover" src={image(g.image)} alt="" loading="lazy"/><h2>{g.name}</h2></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(s=><a className="catalog-card" key={s.slug} href={`/${s.slug}.html`}><div className="catalog-card-image"><ServiceImage slug={s.slug} alt={serviceDetails[s.slug].imageAlt}/></div><div className="catalog-card-content"><h3>{s.name}</h3><p>{s.description}</p><span>Explore service<Arrow/></span></div></a>)}</div></section>;})}{!matches.length&&<p className="empty">No services found. Try another search or category.</p>}</section><Closing/></>;}
export function ServiceDetail({service}) {
 const detail=serviceDetails[service.slug];
 return <div className={`service-detail service-detail--${service.group}`}>
  <ServiceHero service={service} detail={detail}/>
  <ServiceJumpNav/>
  <ServiceOverview detail={detail}/>
  <ServiceCapabilities service={service}/>
  <ServiceDelivery detail={detail}/>
  <ServiceSolutions detail={detail} service={service}/>
  <ServiceApplications service={service} detail={detail}/>
  <ServiceOutcomes detail={detail}/>
  <RelatedServices detail={detail}/>
  <ServiceCTA service={service} detail={detail}/>
 </div>;
}
