import {readFile,writeFile} from 'node:fs/promises';
import {services} from '../src/data/catalog.js';
import {serviceDetails} from '../src/data/service-details.js';
const html=await readFile('dist/index.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const slug of ['services','about','contact','ai-and-data','software-and-technology',...services.map(s=>s.slug)]){
 const target=({'ai-and-data':'artificial-intelligence-and-data','software-and-technology':'technology-transformation'})[slug]||slug;
 const service=services.find(s=>s.slug===target),detail=serviceDetails[target];
 const title=(service?.name||({services:'Services',about:'About CorpBridge',contact:'Let’s talk'}[slug])||'CorpBridge')+' | CorpBridge';
 const description=detail?.overview||({services:'Explore 18 connected service areas across technology, business, industry and people.',about:'Connect technology, business and people around a practical path to progress.',contact:'Start a conversation about your next business or technology challenge.'}[slug]);
 let page=html.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`);
 page=page.replace(/name="description" content="[^"]*"/,`name="description" content="${escape(description)}"`);
 const photo=service?`/assets/images/services/${service.slug}.webp`:'/assets/images/workshop.png';
 const metadata=`<meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:type" content="website"/><meta property="og:image" content="${photo}"/><meta name="twitter:card" content="summary_large_image"/>`;
 let structured='';
 if(service){
  const data={'@context':'https://schema.org','@type':'Service',name:service.name,description:detail.overview,serviceType:service.name,provider:{'@type':'Organization',name:'CorpBridge'}};
  structured=`<script type="application/ld+json">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`;
 }
 page=page.replace('</head>',metadata+structured+'</head>');
 if(service){
  const fallback=`<noscript><main style="padding:8rem 6vw;color:#f5f7fc;background:#030817;font-family:Arial,sans-serif"><p>${escape(service.name)}</p><h1>${escape(detail.headline)}</h1><p>${escape(detail.overview)}</p><h2>Our capabilities</h2><ul>${service.capabilities.map(([name,body])=>`<li><h3>${escape(name)}</h3><p>${escape(body)}</p></li>`).join('')}</ul><p><a href="/contact.html?service=${service.slug}" style="color:#0099fd">Discuss your project</a></p></main></noscript>`;
  page=page.replace('</body>',fallback+'</body>');
 }
 await writeFile(`dist/${slug}.html`,page);
}
console.log('Created 24 React entry pages with service-specific SEO metadata.');
