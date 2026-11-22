# CorpBridge Consulting

React website styled with Tailwind CSS and custom responsive styles, with Framer Motion animations. The homepage follows the supplied screenshots and uses the supplied video and five images.

## Run locally

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173/**. This React project needs the dev server; do not open `index.html` as a local file.

```sh
npm run build      # Production output in dist/, including all 24 page URLs
npm run preview    # Preview production build at http://127.0.0.1:4173/
npm test           # Chrome browser checks against the running dev server
```

The browser checks use an installed Google Chrome. Screenshots are saved in `.test-results/`.

## Files

- `src/components/Header.jsx`: responsive full-width mega menu, backdrop, focus handling and scroll lock.
- `src/components/UI.jsx`: logo, links, animated text wrappers and closing section.
- `src/components/Approach.jsx`: animated, keyboard-accessible process tabs.
- `src/components/Footer.jsx`: shared footer.
- `src/pages/`: home, service catalog, service detail, about and contact pages.
- `src/data/catalog.js`: all 18 services and four categories.
- `src/data/config.js`: approach descriptions and optional contact endpoint.
- `src/styles.css`: Tailwind import and screenshot-based design styles.
- `public/assets/`: video, images, video poster and logo.
- `scripts/create-routes.mjs`: generates production entry pages for existing `.html` URLs.
- `scripts/browser-check.mjs`: interaction and responsive browser checks.
- `archive/static/`: previous static HTML implementation retained for reference.

The root `css/`, `js/`, and `assets/` folders belong to the previous static implementation and are not loaded by React. Edit the files under `src/` and `public/` for this version. The old Python generator is archived; npm is now the build workflow.

## Visuals and behavior

The blue geometric logo in `public/assets/icons/corpbridge.svg` is traced from the supplied logo reference with a transparent background. The name reveals on logo hover or keyboard focus; touch devices show it without requiring hover.

The homepage uses the supplied MP4 as its full-screen background, with a still frame from the video as its poster. Video playback respects reduced-motion and data-saving preferences. Text uses Framer Motion entrance animations and a restrained floating accent. Image cards reveal related services on hover and focus. Main descriptions remain visible for touch users.

Services opens a full-width charcoal panel with four categories and all 18 links. It animates with Framer Motion, dims the underlying page, locks background scrolling, and closes on outside click, Escape, or a second Services click. Background content is inert while navigation is open. Layouts adapt to desktop, tablet, and mobile.

## Contact delivery

The form downloads an enquiry text file by default and clearly states that it has not been sent. To enable online delivery, configure `contactEndpoint` in `src/data/config.js` with an HTTPS endpoint accepting a JSON POST containing `name`, `email`, `organization`, `service`, and `message`. The server must allow the website origin through CORS, validate submitted data, apply abuse protection, and return success only after accepting the enquiry.

## Hosting

Deploy the generated `dist/` directory to a static host. The existing 24 HTML entry URLs are generated during the build. This task runs the site locally and does not change the previously hosted website.


## The 18-service experience

The service catalog remains restricted to the original 18 services. Supply Chain is not included.

Each service has a unique headline, introduction, three business challenges, three capabilities, a tailored delivery method, three solution areas with relevant methods, three industry applications, measurable outcome objectives, three related services, and a dedicated consultation CTA. Technology and people pages use capability tiles; industry and cybersecurity use accordions; business solution sections use editorial rows.

- `src/data/service-details.js`: service-specific content and image scene descriptions.
- `src/components/ServiceSections.jsx`: reusable service page sections and responsive images.
- `src/data/service-media.json`: actual image dimensions and responsive source files.
- `public/assets/images/services/`: 18 original hero concepts served as optimized WebP files, with 960px and 1600px variants.
- `output/service-images/originals/`: all 18 original generated PNGs.
- `output/service-images/prompts.json`: the exact prompt set and generation mode (built-in image_gen).
- `scripts/prepare-service-images.py`: reproducible image optimization using Pillow.

The generator returned 1672 × 941 originals. These are cinematic, photographic-style images, not native 4K files, and have not been upscaled. The image collection is AI-generated and does not represent actual CorpBridge staff, premises or completed client engagements.

Enquiry links preselect the relevant service. Production pages include unique descriptions, social metadata, Service structured data and a no-JavaScript service summary. Set an absolute deployment origin for social-image URLs when configuring production hosting.

Run `npm run build` and then `npm run test:services` with the dev server running to check every service route, hero image, metadata, desktop/mobile width, related links, and preselected enquiry. The original `npm test` covers homepage navigation, interaction, and motion behavior.
