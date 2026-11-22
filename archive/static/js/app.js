'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const nav = $('#navigation');
const menuToggle = $('.menu-toggle');
const servicesToggle = $('#services-toggle');
const servicesMenu = $('#services-menu');
function closeServices() { servicesToggle.setAttribute('aria-expanded', 'false'); servicesMenu.hidden = true; }
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  $('header').classList.toggle('menu-open', open);
  if (!open) closeServices();
});
servicesToggle.addEventListener('click', () => {
  const open = servicesToggle.getAttribute('aria-expanded') !== 'true';
  servicesToggle.setAttribute('aria-expanded', String(open));
  servicesMenu.hidden = !open;
});
document.addEventListener('click', event => { if (!event.target.closest('.service-menu')) closeServices(); });
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!servicesMenu.hidden) { closeServices(); servicesToggle.focus(); }
  else if (nav.classList.contains('open')) { menuToggle.click(); menuToggle.focus(); }
});
const onScroll = () => $('header').classList.toggle('is-scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
$$('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
const video = $('#hero-video');
if (video) {
  const control = $('#video-toggle');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => { control.textContent = video.paused ? 'Play video' : 'Pause video'; };
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  const play = () => video.play().catch(sync);
  control.addEventListener('click', () => video.paused ? play() : video.pause());
  motion.addEventListener('change', () => { if (motion.matches) video.pause(); });
  if (!motion.matches && !navigator.connection?.saveData) play();
}
const tabs = $$('[data-stage]');
function selectStage(tab) {
  const i = Number(tab.dataset.stage);
  const stage = window.CORPBRIDGE.stages[i];
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  const panel = $('#stage-panel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.querySelector('.step-number').textContent = String(i + 1).padStart(2, '0');
  panel.querySelector('h3').textContent = stage[1];
  panel.querySelector('p').textContent = stage[2];
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectStage(tab));
  tab.addEventListener('keydown', event => {
    const targets = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const target = tabs[targets[event.key]];
    selectStage(target); target.focus();
  });
});
const search = $('#service-search');
if (search) {
  let filter = 'all';
  function update() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    $$('.catalog-card').forEach(card => {
      card.hidden = !((filter === 'all' || card.dataset.group === filter) && card.textContent.toLowerCase().includes(query));
      if (!card.hidden) count++;
    });
    $$('.catalog-group').forEach(group => { group.hidden = ![...group.querySelectorAll('.catalog-card')].some(card => !card.hidden); });
    $('.catalog-status').textContent = `${count} ${count === 1 ? 'service' : 'services'}`;
    $('.catalog-empty').hidden = count > 0;
  }
  search.addEventListener('input', update);
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    $$('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    update();
  }));
}
const form = $('#contact-form');
if (form) {
  const endpoint = window.CORPBRIDGE.contactEndpoint;
  if (endpoint) { $('#contact-notice').textContent = 'Send your enquiry to our team.'; $('#contact-submit').textContent = 'Send enquiry'; }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const status = $('#form-status');
    const submit = $('#contact-submit');
    if (!endpoint) {
      const text = Object.entries(data).map(([key,value]) => `${key}: ${value}`).join('\n\n');
      const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'corpbridge-enquiry.txt'; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Your enquiry copy has been downloaded. It has not been sent.';
      return;
    }
    submit.disabled = true;
    status.textContent = 'Sending your enquiry…';
    try {
      if (new URL(endpoint).protocol !== 'https:') throw new Error('HTTPS required');
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('Request failed');
      status.textContent = 'Your enquiry has been sent.'; form.reset();
    } catch { status.textContent = 'Your enquiry could not be sent. Please try again later.'; }
    finally { submit.disabled = false; }
  });
}
