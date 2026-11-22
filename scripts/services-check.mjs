import {chromium} from '@playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import {services} from '../src/data/catalog.js';
import {serviceDetails} from '../src/data/service-details.js';
import assert from 'node:assert/strict';
assert.equal(services.length,18);
assert.deepEqual(Object.keys(serviceDetails).sort(),services.map(s=>s.slug).sort());
assert(!services.some(s=>s.slug==='supply-chain'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await mkdir('.test-results',{recursive:true});
 for(const service of services){
  const detail=serviceDetails[service.slug];
  await page.goto(`http://127.0.0.1:5173/${service.slug}.html`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').innerText(),detail.headline);
  assert.equal(await page.title(),`${service.name} | CorpBridge`);
  assert.equal(await page.locator('meta[name="description"]').getAttribute('content'),detail.overview);
  assert(await page.locator('.service-hero img').evaluate(img=>img.complete&&img.naturalWidth>=960),`${service.slug}: hero loaded`);
  for(const id of ['overview','capabilities','approach','solutions','applications','outcomes'])assert.equal(await page.locator(`#${id}`).count(),1);
  assert.equal(await page.locator('.challenge-list article').count(),3);
  assert.equal(await page.locator('.solution-card').count(),3);
  assert.equal(await page.locator('.application-list article').count(),3);
  assert.equal(await page.locator('.outcome-list article').count(),3);
  assert.equal(await page.locator('.related-card').count(),3);
  for(const slug of detail.related)assert(services.some(s=>s.slug===slug),`${service.slug}: related route exists`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${service.slug}: desktop width`);
  const built=await readFile(`dist/${service.slug}.html`,'utf8');
  assert(built.includes('application/ld+json')&&built.includes('og:description'));
  if(['cloud','strategy','digital-engineering-and-manufacturing'].includes(service.slug)){
   await page.screenshot({path:`.test-results/service-${service.slug}-desktop.png`});
   await page.locator('.related-card img').evaluateAll(images=>images.forEach(img=>{img.loading='eager';}));
   await page.waitForFunction(()=>[...document.querySelectorAll('.related-card img')].every(img=>img.complete&&img.naturalWidth>0));
   await page.screenshot({path:`.test-results/service-${service.slug}-full.png`,fullPage:true});
  }
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${service.slug}: mobile width`);
  if(service.slug==='cloud')await page.screenshot({path:'.test-results/service-cloud-mobile.png'});
  await page.getByRole('link',{name:'Discuss your project',exact:true}).click();
  assert.equal(await page.locator('select[name="service"]').inputValue(),service.name);
  await page.setViewportSize({width:1440,height:900});
  console.log(`PASS ${service.name}: content, image, metadata, responsive layout, related links, preselected enquiry`);
 }
 await page.goto('http://127.0.0.1:5173/services.html',{waitUntil:'networkidle'});
 assert.equal(await page.locator('.catalog-card').count(),18);
 await page.locator('.catalog-card img').evaluateAll(images=>images.forEach(img=>{img.loading='eager';}));
 await page.waitForFunction(()=>[...document.querySelectorAll('.catalog-card img')].every(img=>img.complete&&img.naturalWidth>0));
 await page.getByRole('searchbox').fill('cloud');assert.equal(await page.locator('.catalog-card').count(),1);
 await page.getByRole('searchbox').fill('');await page.getByRole('button',{name:'Industry & infrastructure',exact:true}).click();assert.equal(await page.locator('.catalog-card').count(),3);
 await page.getByRole('button',{name:'Services',exact:true}).click();assert.equal(await page.locator('#services-menu li a').count(),18);
 await page.getByRole('button',{name:'Close services menu'}).click();await page.waitForFunction(()=>!document.getElementById('services-menu'));
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS catalog filters, 18 image cards, explicit menu close, and no runtime errors');
} finally {await browser.close();}
