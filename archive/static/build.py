"""Generate the static website from the shared service catalog. Run from any directory."""
from pathlib import Path
from html import escape
import ast
import re

ROOT = Path(__file__).resolve().parent.parent
catalog = (ROOT / 'js/catalog.js').read_text()
rows = ast.literal_eval('[' + catalog.split('window.CORPBRIDGE.services = [', 1)[1].split('].map(', 1)[0] + ']')
groups = [('technology', 'Technology & trust', 'data-center.png'), ('business', 'Business & experience', 'workshop.png'), ('industry', 'Industry & infrastructure', 'robotics.png'), ('people', 'People & possibility', 'workshop.png')]
images = {g: image for g, _, image in groups}
def photo(file, alt, eager=False):
    return f'<picture><img src="assets/images/{file}" alt="{escape(alt)}" width="1672" height="941" loading="{"eager" if eager else "lazy"}"></picture>'
def link(url, text, cls='button'):
    return f'<a class="{cls}" href="{url}">{escape(text)}</a>'
def header(page):
    menu = ''.join(f'<div class="mega-group"><a class="mega-group-title" href="services.html#{g}">{name}</a><ul>' + ''.join(f'<li><a href="{s[0]}.html">{s[1]}</a></li>' for s in rows if s[2] == g) + '</ul></div>' for g, name, _ in groups)
    return f'''<a class="skip" href="#main">Skip to content</a><header><a class="brand" href="index.html" aria-label="CorpBridge home"><span class="brand-wordmark"><strong>CorpBridge<em>.</em></strong></span></a><button class="menu-toggle" aria-controls="navigation" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button><nav id="navigation" aria-label="Main navigation"><div class="service-menu"><button id="services-toggle" aria-expanded="false" aria-controls="services-menu">Services <span class="chevron" aria-hidden="true">⌄</span></button><div id="services-menu" class="mega-menu" hidden><div class="mega-intro"><div><h2>Find your next move.</h2><p>18 connected service areas.</p></div>{link('services.html', 'Explore all services', 'mega-overview')}</div><div class="mega-columns">{menu}</div></div><a href="about.html" {'aria-current="page"' if page == 'about' else ''}>About us</a>{link('contact.html', 'Let’s talk', 'nav-cta')}</nav></header>'''
def footer():
    return '<footer><div class="footer-top"><div><a class="footer-brand" href="index.html">CorpBridge<em>.</em></a><p>INTELLIGENCE THAT MOVES BUSINESS FORWARD</p></div><div><span class="eyebrow">Explore</span><a href="services.html">Our services</a><a href="about.html">About us</a></div><div><span class="eyebrow">Connect</span><a href="contact.html">Let’s talk</a></div><a class="back-top" href="#top">Back to top</a></div><div class="footer-bottom"><span>© <span data-year></span> CorpBridge</span><span>Technology. Business. People.</span></div></footer>'
def closing():
    return '<section class="closing">' + photo('industrial-production.png', 'Blue industrial production line') + '<div class="closing-content"><span class="eyebrow">Your next chapter</span><h2>Let’s build<br>what comes next.</h2><p>Bring your business challenge. Together, we can shape a practical way forward.</p>' + link('contact.html', 'Start a conversation') + '</div></section>'
def approach():
    return '<section class="section approach"><span class="eyebrow">Our approach</span><h2>Progress, one clear step at a time.</h2><div class="process-tabs" role="tablist" aria-label="Our approach">' + ''.join(f'<button role="tab" id="stage-{i}" aria-controls="stage-panel" aria-selected="{str(i == 0).lower()}" tabindex="{0 if i == 0 else -1}" data-stage="{i}">{name}</button>' for i,name in enumerate(['Discover','Define','Build','Improve'])) + '</div><div id="stage-panel" role="tabpanel" aria-labelledby="stage-0" tabindex="0"><span class="step-number" aria-hidden="true">01</span><div><h3>Understand what matters.</h3><p>Explore your goals, workflows, users, and existing systems. Identify the problem worth solving before choosing the technology.</p></div></div></section>'
def hero(title, description, image, eyebrow='CorpBridge'):
    return f'<section class="inner-hero"><div class="inner-art">{photo(image, eyebrow, True)}</div><div class="inner-shade"></div><div class="inner-content"><a class="breadcrumb" href="services.html">Explore our services</a><span class="eyebrow">{escape(eyebrow)}</span><h1>{escape(title)}</h1><p>{escape(description)}</p>{link("contact.html", "Let’s talk")}</div></section>'
def home():
    panels = ''.join(f'<a class="service-panel" href="services.html#{g}">{photo(image,name)}<div class="panel-content"><span class="eyebrow">Our services</span><h3>{name}</h3><p>{len([s for s in rows if s[2]==g])} connected service areas to move your organization forward.</p><span class="panel-link">Explore {name.lower()}</span></div></a>' for g,name,image in groups)
    return '''<section class="hero"><video id="hero-video" muted loop playsinline preload="none" poster="assets/images/industrial-production.png" aria-label="Industrial background video"><source src="assets/videos/hero.mp4" type="video/mp4"></video><div class="hero-shade"></div><div class="hero-content"><span class="eyebrow hero-kicker">Technology. Business. People.</span><h1>Intelligence that<br>moves business<br><em>forward.</em></h1><div class="hero-bottom"><p>Connect ideas, technology and people to turn your next business challenge into meaningful progress.</p><div class="hero-actions">''' + link('services.html','Explore our services') + link('about.html','Meet CorpBridge','text-link') + '</div></div></div><div class="hero-foot"><a href="#services">Discover what’s possible</a><button id="video-toggle" type="button">Play video</button></div></section><section class="section services" id="services"><div class="section-heading"><span class="eyebrow">Connected expertise</span><h2>A bridge to<br>what’s next.</h2></div><div class="service-panels category-panels">' + panels + '</div></section><section class="section spotlight">' + '<div class="spotlight-art">' + photo('cybersecurity.png','Cybersecurity specialists monitoring operations') + '</div><div class="spotlight-copy"><span class="eyebrow">Security with purpose</span><h2>Confidence in a<br>connected world.</h2><p>Protect systems, information and people through practical security design and response planning.</p>' + link('cybersecurity.html','Explore cybersecurity','text-link') + '</div></section>' + approach() + closing()
def services():
    content = hero('Connected expertise. Practical possibilities.', 'Explore 18 service areas across technology, business, industry and people.', 'industrial-production.png', 'Our services')
    content += '<section class="section catalog-section"><div class="catalog-tools"><h2>Find your next move.</h2><label class="catalog-search">Search services<input id="service-search" type="search" placeholder="Try cloud, strategy or learning"></label></div><div class="filter-list" aria-label="Filter services"><button data-filter="all" class="active" aria-pressed="true">All services</button>' + ''.join(f'<button data-filter="{g}" aria-pressed="false">{n}</button>' for g,n,_ in groups) + '</div><p class="catalog-status" role="status">18 services</p>'
    for g, name, image in groups:
        content += f'<section class="catalog-group" id="{g}"><div class="catalog-group-heading">{photo(image,name)}<div><h3>{name}</h3></div></div><div class="catalog-grid">'
        for slug, name, group, description, *_ in rows:
            if group == g:
                content += f'<a class="catalog-card" data-group="{g}" href="{slug}.html"><span class="catalog-card-name">{name}</span><p>{description}</p><span class="catalog-card-link">Explore service</span></a>'
        content += '</div></section>'
    return content + '<p class="catalog-empty" hidden>No services found. Try another search or category.</p></section>' + closing()
def detail(row):
    slug, name, group, description, *capabilities = row
    image = 'cybersecurity.png' if slug == 'cybersecurity' else images[group]
    return hero(name,description,image,dict((g,n) for g,n,_ in groups)[group]) + '<section class="section capabilities"><div><span class="eyebrow">How we can help</span><h2>From possibility<br>to practical progress.</h2><p class="intro">Start with the challenge that matters to your business and build a focused plan.</p></div><div>' + ''.join(f'<details {"open" if i==0 else ""}><summary><h3>{escape(c.split("|")[0])}</h3><span class="plus" aria-hidden="true">+</span></summary><p>{escape(c.split("|")[1])}</p></details>' for i,c in enumerate(capabilities)) + '</div></section>' + approach() + closing()
def about():
    return hero('A bridge to what’s next.', 'We connect technology, business and people around a practical path to progress.', 'workshop.png', 'About CorpBridge') + '<section class="section about-intro"><span class="eyebrow">Our focus</span><h2>Clear thinking.<br>Connected possibilities.</h2><div class="about-columns"><p>Every organization has its own ambitions, challenges and starting point. We begin by understanding yours.</p><p>Our proposed approach brings discovery, planning, delivery and improvement together, keeping the people who use the solution at the center.</p></div></section>' + approach() + closing()
def contact():
    return '<section class="section contact-page"><div class="contact-intro"><span class="eyebrow">Let’s talk</span><h1>What’s your<br>next move?</h1><p>Tell us about your business challenge and what you want to achieve.</p>' + photo('workshop.png','Team collaborating in a modern office') + '</div><form id="contact-form"><h2>Start a conversation</h2><p id="contact-notice" class="form-notice">Prepare your enquiry and download a copy. Online delivery is not configured yet.</p><div class="form-row"><label>Your name<input name="name" autocomplete="name" required maxlength="120"></label><label>Email address<input name="email" type="email" autocomplete="email" required></label></div><label>Organization <span class="optional">(optional)</span><input name="organization" autocomplete="organization" maxlength="200"></label><label>Service of interest<select name="service"><option value="">Not sure yet</option>' + ''.join(f'<option>{s[1]}</option>' for s in rows) + '</select></label><label>How can we help?<textarea name="message" required minlength="10" maxlength="5000"></textarea></label><button class="button" id="contact-submit" type="submit">Download enquiry</button><p id="form-status" role="status"></p></form></section>'
def write_page(slug, title, description, content):
    html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#030817">
  <title>{escape(title)}</title>
  <meta name="description" content="{escape(description, quote=True)}">
  <meta property="og:title" content="{escape(title, quote=True)}">
  <meta property="og:description" content="{escape(description, quote=True)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/images/workshop.png">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/site.css">
  <script src="js/config.js" defer></script>
  <script src="js/app.js" defer></script>
</head>
<body id="top" class="{'video-header' if slug=='index' else ''}">
{header(slug)}
<main id="main">{content}</main>
{footer()}
</body>
</html>
'''
    (ROOT / f'{slug}.html').write_text(html)
for slug,title,description,content in [('index','CorpBridge — Intelligence that moves business forward','Explore technology, business, industry and people services for meaningful change.',home()),('services','Services | CorpBridge','Explore 18 connected service areas.',services()),('about','About | CorpBridge','A bridge to what’s next.',about()),('contact','Let’s talk | CorpBridge','Start a conversation about your next business or technology challenge.',contact())]:
    write_page(slug,title,description,content)
for row in rows:
    write_page(row[0],row[1]+' | CorpBridge',row[3],detail(row))
for old,new in [('ai-and-data','artificial-intelligence-and-data'),('software-and-technology','technology-transformation')]:
    (ROOT/f'{old}.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url={new}.html"><title>Moved | CorpBridge</title></head><body><a href="{new}.html">Continue to {new.replace("-"," ")}</a></body></html>')
print(f'Built {len(rows)+4} pages and 2 redirects.')
