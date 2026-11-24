# Astro Migration Plan — Portfolio v2

## Overview

Migrate this portfolio from **Create React App (CRA)** to **Astro** with **MDX** content collections. This plan is designed to work in-place within the existing repo. No temporary repos or directories.

---

## Current State

### React Components (8 files)
| File | Purpose |
|------|---------|
| `src/App.jsx` | Root app — navbar, progress bar, hero, about, projects, contact, dark mode toggle |
| `src/components/About.jsx` | About section — profile pic, prose text, technical approach, experience list |
| `src/components/ProjectGrid.jsx` | Project grid with framer-motion animations, modal open/close logic |
| `src/components/ProjectCard.jsx` | Individual project card with image fallbacks, modal trigger |
| `src/components/Contact.jsx` | Contact section — static email, GitHub, LinkedIn links |
| `src/components/Switch.jsx` | Toggle switch component using framer-motion `layout` animation |
| `src/components/TextCircle.jsx` | Single text circle — CSS rotation animation, no React needed |
| `src/components/TextCircles.jsx` | Container for TextCircles, viewport resize handling, framer-motion wrapper |

### Content Files
| Path | Content |
|------|---------|
| `src/content/aboutMe.md` | Introduction paragraph |
| `src/content/technicalApproach.md` | Technical philosophy (4 paragraphs with bold headings) |
| `src/content/experience/bryant.md` | Work experience description |
| `src/content/projects/web2024.md` | Bryant University website project |
| `src/content/projects/financeTracker.md` | Finance Tracker project |
| `src/content/projects/gvc.md` | Green Valley Crossing project |
| `src/content/projects/findAndReplace.md` | Find and Replace tool project |
| `src/content/projects/drumMachine.md` | Drum Machine project |

### Data Files
| Path | Purpose |
|------|---------|
| `src/content/projects/projects.js` | Array of 5 project objects with `title`, `id`, `tags`, `buildLink`, `srcLink`, `description` (relative path to .md) |
| `src/content/experience/experience.js` | Array of 1 experience object with `id`, `employer`, `title`, `start`, `description` (relative path to .md) |

### CSS Files (7 files)
| Path | Purpose |
|------|---------|
| `src/styles/global.css` | Theme variables, resets, typography, layout helpers |
| `src/styles/navbar.css` | Progress bar, navbar, toggle switch styling |
| `src/styles/hero.css` | Hero section, text circles, rotation keyframes |
| `src/styles/about.css` | About section layout, profile pic, job styling |
| `src/styles/projects.css` | Project grid, card hover, modal styling |
| `src/styles/contact.css` | Contact section layout, icon links |
| `src/index.css` | Font family, browser defaults |

### Images
| Path | Count |
|------|-------|
| `src/img/Portrait-Photo-9-7-24_03.jpg` | 1 portrait |
| `src/img/project-thumb/*.jpg` | 9 thumbnails |
| `src/img/project-large/*.jpg` | 9 large images |
| `src/img/code-300.png`, `code-500.png` | 2 fallback images |

### Dependencies to Remove
- `react`, `react-dom`, `react-scripts`, `web-vitals`, `@testing-library/*`, `@babel/plugin-proposal-private-property-in-object`

### Dependencies to Add
- `astro`
- `motion`

---

## Step-by-Step Plan

### Phase 1: Scaffold Astro & Clean CRA

#### 1.1 Install Astro
Run from the repo root:
```bash
npm create astro@latest . -- --template minimal
```
This scaffolds Astro files **in-place**. When prompted, choose **No** for:
- TypeScript? No
- ESLint? No
- prettier? No (already have CRA conventions)

#### 1.2 Key Files Created by Astro
After scaffolding, you'll have:
- `astro.config.mjs` (config)
- `public/` (already exists — keep it, Astro uses it for static assets)
- `src/` (already exists — Astro will use it)
- `src/pages/index.astro` (new — this is your new homepage)
- `src/styles/global.css` (new — Astro convention)

#### 1.3 Remove CRA Entry Point Files
Delete these files (they are CRA-specific):
- `src/index.js`
- `src/reportWebVitals.js`
- `src/setupTests.js`
- `src/index.css` (merged into global styles)

Keep:
- `public/index.html` — **rename to `src/pages/index.astro`** (see Phase 2)
- `public/manifest.json` — move to `public/` root (Astro serves `public/` as-is)
- `public/favicon.ico` — stays in `public/`
- `public/robots.txt` — stays in `public/`

#### 1.4 Update package.json
**Remove** these dependencies:
```json
"react", "react-dom", "react-scripts", "web-vitals",
"@babel/plugin-proposal-private-property-in-object",
"@testing-library/jest-dom", "@testing-library/react", "@testing-library/user-event"
```

**Add** these dependencies:
```json
"astro": "^4.x",
"motion": "^11.x",
```

**Replace** the scripts:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist --cname kevinhurley.dev"
}
```

Note: `gh-pages` deploy target changes from `build` to `dist` (Astro's output directory).

#### 1.5 Run
```bash
npm install
npm run dev
```
Verify Astro dev server starts on port 4321.

---

### Phase 2: Set Up Content Collections & MDX

#### 2.1 Install MDX Support
```bash
npm install -D @astrojs/mdx
```

#### 2.2 Update `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://kevinhurley.dev',
  integrations: [sitemap(), mdx()],
  contentCollections: {
    projects: {
      type: 'content',
      schema: ({ z }) => z.object({
        title: z.string(),
        tags: z.array(z.string()),
        buildLink: z.string().url(),
        srcLink: z.string().url().optional(),
        thumb: z.string().optional(),
        large: z.string().optional(),
      }),
    },
    experience: {
      type: 'content',
      schema: ({ z }) => z.object({
        employer: z.string(),
        title: z.string(),
        start: z.string(),
        end: z.string().optional(),
      }),
    },
  },
});
```

#### 2.3 Create `src/content.config.ts`
This file is required for Astro content collections:
```ts
import { defineCollection, z } from 'astro:content';
import { mdx } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    buildLink: z.string().url(),
    srcLink: z.string().url().optional(),
    thumb: z.string().optional(),
    large: z.string().optional(),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    employer: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string().optional(),
  }),
});

export const collections = { projects, experience };
```

---

### Phase 3: Convert Markdown Files to MDX

#### 3.1 Project MDX Files

Convert each `src/content/projects/*.md` to `.mdx` and add frontmatter.

**`src/content/projects/web2024.mdx`**
```mdx
---
title: "Web2024 Theme"
tags: ["Drupal"]
buildLink: "https://www.bryant.edu"
thumb: "web2024.jpg"
large: "web2024.jpg"
---

The web2024 project was a complete redesign and rebuild of Bryant University's flagship website, and I served as the lead developer. The project addressed three major challenges: delivering a complex, modern visual design; empowering content authors with flexible page-building tools; and eliminating technical debt from the previous stack.

**A reusable component library.** I built a comprehensive design system of reusable components — including heroes, accordions, various card types, profile cards with flyouts, checkerboard layouts, and tab interfaces — each designed to be composed into complex page layouts. Content authors can now drag and drop these components in any order, replacing the old system of rigid, single-purpose fields arranged in fixed sequences.

**A flexible content model.** I restructured the Drupal backend around a paragraph-based content system, consolidating numerous content types into a more manageable structure. This gives authors the freedom to build pages from a palette of pre-styled UI components while maintaining visual consistency across the entire site.

**Vanilla CSS architecture.** I replaced the previous SCSS and Bootstrap stack with a modern, framework-free CSS approach. This includes a custom CSS Grid–based content grid with breakout capabilities for full-width and gutter-spanning elements, custom properties for consistent theming, and a modular stylesheet organization that mirrors the component architecture. The result is a leaner, faster codebase that's easier to maintain and extend.
```

**`src/content/projects/finance-tracker.mdx`**
```mdx
---
title: "Finance Tracker"
tags: ["Svelte", "PHP", "MySQL"]
buildLink: "https://kevinhurley23.github.io/finance-tracker/"
srcLink: "https://github.com/kevinhurley23/finance-tracker"
thumb: "finance-tracker.jpg"
large: "finance-tracker.jpg"
---

My wife and I used to track our finances with a spreadsheet, but I became annoyed with the limitations and decided to build a more elegant, custom solution. I wanted to create a tool that would allow me to input my income and expenses and see a summary of my financial situation. I created this project using Svelte for the front end, PHP for the back end, and MySQL for the database. I host the app we actually use on my own desktop, so for security reasons the publically-viewable version linked here does not connect to my back end, but rather uses placeholder data.
```

**`src/content/projects/green-valley-crossing.mdx`**
```mdx
---
title: "Green Valley Crossing"
tags: ["Astro", "Strapi"]
buildLink: "https://kevinhurley23.github.io/Green-Valley-Crossing/"
srcLink: "https://github.com/kevinhurley23/Green-Valley-Crossing"
thumb: "green-valley-crossing.jpg"
large: "green-valley-crossing.jpg"
---

This is a church I used to attend. When they learned that I became a web developer, they asked me to create a new website to replace the church's existing SquareSpace site. My plan was to create a Strapi headless CMS to make it easier for church administrative assistants to update content on the site, and a sleek Astro site to consume and display the data from the CMS. Unfortunately the church couldn't afford to pay me for the work, so the project was never finished. This version removes the Strapi integration and showcases what I had already built in Astro.
```

**`src/content/projects/find-and-replace.mdx`**
```mdx
---
title: "Find and Replace"
tags: ["jQuery"]
buildLink: "https://kevinhurley23.github.io/Online-Find-and-Replace-Tool/"
srcLink: "https://github.com/kevinhurley23/Online-Find-and-Replace-Tool"
thumb: "find-and-replace.jpg"
large: "find-and-replace.jpg"
---

The moment I felt like had really become a software developer was when I found myself needing a tool to speed up a repetetive task and decided to build it myself. There are certainly many places to do find and replace operations on text, but I found myself needing to save a sequence of specific find and replace operations to perform on many different pieces of text, and I couldn't find an app or website that did what I was looking for, so I made it.
```

**`src/content/projects/drum-machine.mdx`**
```mdx
---
title: "Drum Machine"
tags: ["React"]
buildLink: "https://kevinhurley23.github.io/drum-machine/"
srcLink: "https://github.com/kevinhurley23/drum-machine/tree/master"
thumb: "drum-machine.jpg"
large: "drum-machine.jpg"
---

This was one of my certification projects I made when I first started learning web development on freeCodeCamp. As a musician, this project really appealed to me. I created this drum machine using React. I improved on freeCodeCamp's example design in a few ways. Firstly, rather than using the sounds they provided, I created my own sounds using Native Instruments software. I also made it so that holding down a key does not retrigger the sounds, and I added text on either side of the toggle buttons to clarify their functions. Also, I think mine looks better!
```

**Delete the old files:**
- `src/content/projects/projects.js` — no longer needed
- `src/content/projects/web2024.md` — replaced by `.mdx`
- `src/content/projects/financeTracker.md` — replaced by `.mdx`
- `src/content/projects/gvc.md` — replaced by `.mdx`
- `src/content/projects/findAndReplace.md` — replaced by `.mdx`
- `src/content/projects/drumMachine.md` — replaced by `.mdx`

#### 3.2 Experience MDX Files

**`src/content/experience/bryant.mdx`**
```mdx
---
employer: "Bryant University"
title: "Drupal Web Developer"
start: "February 2023"
end: ""
---

I maintain and develop the university's Drupal websites, working across HTML, Twig, vanilla CSS, PHP, and JavaScript. I led the development of a new theme for the flagship site using component-based design principles, creating a system that gives content authors significant flexibility in how they assemble page layouts.

On the infrastructure side, I implemented a robust configuration management workflow — importing and exporting configuration, staging changes through version control, and using Configuration Split with Config Ignore to manage environment-specific overrides across the deployment pipeline.

I've also authored several custom Drupal modules to solve specific institutional needs, including a module for custom Twig filters that streamline template logic, and an accessibility module that ensures every page maintains a proper heading hierarchy by automatically promoting the first heading on pages that lack an h1.
```

**Delete the old file:**
- `src/content/experience/experience.js` — no longer needed

#### 3.3 About Section MDX Files

**`src/content/about-intro.mdx`**
```mdx
---
---
I began my career as a music teacher before pivoting to web development in 2022. What started as a side project during vacation time quickly became a full career change — within a year, I landed my first development role. Today, I build and maintain enterprise-level Drupal websites full-time for Bryant University, and I'm available for select freelance engagements. If you're looking for a developer who brings both technical rigor and creative problem-solving to every project, let's talk.
---
```

**`src/content/about-technical-approach.mdx`**
```mdx
---
---
I believe great web development sits at the intersection of clean code and thoughtful user experience. My work is guided by several core principles:

**Component-based architecture.** I design and build reusable component libraries that give content authors flexibility while maintaining visual consistency across the site. Each component is self-contained, documented, and designed to be composed into complex page layouts.

**Modern CSS without frameworks.** I work with vanilla CSS — custom properties, CSS Grid, Flexbox, container queries, and subgrid — to build responsive, performant layouts. I avoid heavy frameworks like Bootstrap in favor of purpose-built styles that keep the codebase lean and maintainable.

**Configuration-driven development.** I use Drupal's configuration management extensively, with Config Split and Config Ignore for environment-specific overrides. This enables safe, auditable deployments and makes it easy to stage and promote changes across dev, test, and production.

**Accessibility and semantic HTML.** Every project starts with accessibility in mind. I write semantic markup, ensure proper heading hierarchy, and build patterns that work for all users — not just as an afterthought, but as a foundation.
---
```

**Delete the old files:**
- `src/content/aboutMe.md` — replaced by `.mdx` files
- `src/content/technicalApproach.md` — replaced by `.mdx` files

---

### Phase 4: Create Astro Components

#### 4.1 `src/components/Navbar.astro`
Replaces the navbar portion of `App.jsx`. Uses `motion.js` for the progress bar and entrance animation.

```astro
---
import { motion } from 'motion';
---
<motion.div
  id="progress-bar"
  class="progress-bar"
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ duration: 0.5 }}
/>
<motion.nav
  id="navbar"
  class="navbar"
  initial={{ opacity: 0, y: -70 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div id="animation-toggle" class="toggle-container">
    <slot name="animation-toggle" />
    <div class="transition">Animations</div>
  </div>
  <div class="nav-links">
    <a href="#about" class="transition">About</a>
    <a href="#projects" class="transition">Projects</a>
    <a href="#contact" class="transition">Contact</a>
  </div>
  <div id="dark-mode-toggle" class="toggle-container">
    <div>
      <i class="fa-solid fa-sun transition" />
    </div>
    <slot name="dark-mode-switch" />
    <div>
      <i class="fa-solid fa-moon transition" />
    </div>
  </div>
</motion.nav>
```

#### 4.2 `src/components/Switch.astro`
Replaces `Switch.jsx`. Uses `motion.js` with `layout` animation.

```astro
---
import { motion } from 'motion';
const { state } = Astro.props;
---
<div class="switch" data-ison={state}>
  <motion.div
    class="handle"
    layout
    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
  />
</div>
```

#### 4.3 `src/components/TextCircle.astro`
Replaces `TextCircle.jsx`. Pure Astro/HTML — no React needed. All animation is CSS.

```astro
---
const { index, line, diameter, numCircles } = Astro.props;
const lineLength = line.length;
const radius = diameter / 2;
const direction = index % 2 ? 'clockwise' : 'counterclockwise';
const duration = (index + 2) * 10;
const opacity = 1 - index * (1 / numCircles);
---
<div
  class={`circle ${direction}`}
  style={`height: ${diameter}px; width: ${diameter}px; animation-duration: ${duration}s; opacity: ${opacity};`}
>
  {line.split('').map((char, i) => (
    <span
      style={`transform: rotate(${i * (360 / lineLength)}deg); transform-origin: 0 ${radius}px;`}
    >
      {char}
    </span>
  ))}
</div>
```

#### 4.4 `src/components/TextCircles.astro`
Replaces `TextCircles.jsx`. Uses `motion.js` for the fade-in wrapper. The circles themselves are pure CSS animations.

```astro
---
import { motion } from 'motion';
import TextCircle from './TextCircle.astro';
const { animationsOn } = Astro.props;

const textLines = [
  `!function    {"use strict"} document`,
  `  module&&"object"  =typeof   module.exports  `,
  `e.document?t(e,!0):    function(e)   {if(!e.document)`,
  `t(e)}    ("undefined"!=typeof window?window:this,function   {"use strict";`,
  `   r=Object.getPrototypeOf,   s=t.slice,g=t.flat?    function(e){return t.call   :function  `,
  `constructor:   length:0,toArray:   function()   {return s.call(this)}    :function(e){return   null==e?s`,
  `e<0?this[e+this.length]     ,pushStack:function(e{   var t=S.merge   (constructor(),e);return t.prevObject    `,
  `   r=Object    .getPrototypeOf,s=t.   slice,g=t.flat?function    {return t.flat.call(e)}   :function{return t.concat`,
  `constructor:S,length:0,    toArray:function()    {return s.call(this)},get:   function(e)   {return null==e?s`,
  `e<0?this[e+this.length],pushStack:    function(e)   {var t=S.merge  (this.constructor(),e)   t.prevObject=this,t}`,
  `constructor:S,    0,toArray:function(){return     (this)},get:function    (e){return   null==e?s.call(this)`,
  `e<0?this[e+this.length]    :this[e]},  pushStack:function(e){var    t=S.merge(this.constructor(),e);return    each:function(e)`,
  `r=Object   .getPrototypeOf,   s=t.slice,g=t.flat?   function(e){return   t.flat.call(e)}:function(e)    {return t.concat.apply`,
  `constructor:S,length   toArray:function(){return s.call    ,get:function(e){return   null==e?s.call(this)`,
  `e<0?this[e+this.length]    :this[e]},  pushStack:function(e){var    t=S.merge(this.constructor()    ,e);return t.prevObject=this,t}`,
  `e<0?this    [length]:this[e]},pushStack:function    {var t=S  (this.constructor();return   prevObject=this,t},each:function`,
];
---
<motion.div
  id="text-circles"
  class="flex-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5, duration: 4, ease: 'easeIn' }}
>
  {textLines.map((line, index) => (
    <TextCircle
      index={index}
      line={line}
      numCircles={textLines.length}
      diameter={300 * (1 + index / 3.5)}
      animationsOn={animationsOn}
    />
  ))}
</motion.div>
```

#### 4.5 `src/components/ProjectCard.astro`
Replaces `ProjectCard.jsx`. Takes a content collection item as a prop.

```astro
---
const { project } = Astro.props;
const { title, id, tags, buildLink, srcLink } = project.data;

// Image paths — all images live in public/
const thumbPath = `/img/project-thumb/${project.slug}.jpg`;
const largePath = `/img/project-large/${project.slug}.jpg`;
---
<motion.div
  id={id}
  class={`project-card ${tags.join(' ')}`}
  onclick={(e) => {
    document.querySelector(`.project-details[data-id="${id}"]`)?.setAttribute('data-slug', project.slug);
    openModal(e.currentTarget, id);
  }}
>
  <img src={thumbPath} alt={title} loading="lazy" />
  <div class="project-title">
    <h3>{title}</h3>
  </div>
</motion.div>
```

#### 4.6 `src/components/ProjectGrid.astro`
Replaces `ProjectGrid.jsx`. Uses `getCollection` to fetch projects.

```astro
---
import { getCollection } from 'astro:content';
import { motion } from 'motion';
import ProjectCard from './ProjectCard.astro';

const projects = await getCollection('projects');
---
<motion.div
  id="project-grid"
  class="project-grid"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: '-300px 0px' }}
  variants={{
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }}
>
  {projects.map(project => (
    <ProjectCard project={project} />
  ))}
</motion.div>
```

#### 4.7 `src/components/About.astro`
Replaces `About.jsx`. Uses MDX content and experience collection.

```astro
---
import { getCollection } from 'astro:content';
import { MDX } from 'astro:content';
import aboutIntro from '../content/about-intro.mdx';
import aboutTechnical from '../content/about-technical-approach.mdx';

const experience = await getCollection('experience');
---
<section id="about">
  <h2>About Me</h2>
  <div class="row">
    <div class="left">
      <img src="/img/Portrait-Photo-9-7-24_03.jpg" alt="Kevin Hurley portrait" />
    </div>
    <div class="middle">
      <div class="prose">
        <MDX {...aboutIntro} />
      </div>
      <h3>Technical Approach</h3>
      <div class="prose">
        <MDX {...aboutTechnical} />
      </div>
      <h3 class="experience">Experience</h3>
      {experience.map(role => (
        <div class="job">
          <div class="job-title">{role.data.title} — {role.data.employer}</div>
          <div class="job-length">{role.data.start} — {role.data.end || 'Present'}</div>
          <div class="prose">
            <MDX {...role} />
          </div>
        </div>
      ))}
    </div>
    <div class="right">
      <h3>Skills</h3>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>Sass</li>
        <li>Bootstrap</li>
        <li>JavaScript</li>
        <li>jQuery</li>
        <li>React</li>
        <li>Svelte</li>
        <li>Astro</li>
        <li>PHP</li>
        <li>Drupal</li>
        <li>WordPress</li>
        <li>Git</li>
      </ul>
    </div>
  </div>
</section>
```

#### 4.8 `src/components/Contact.astro`
Replaces `Contact.jsx`. Static content — no changes needed beyond syntax.

```astro
<section id="contact" class="flex-center">
  <h2>Contact Me</h2>
  <p>
    Looking for someone capable to join your web team? Need a freelance
    developer to create a bespoke website for your business?
    <br />
    Let's get in touch.
  </p>
  <div id="contact-buttons" class="flex-center">
    <a href="mailto:kevinhurley23@gmail.com" target="_blank" rel="noopener">
      <i class="fa-regular fa-envelope" />
      <span class="contact-label">Email</span>
    </a>
    <a href="https://github.com/kevinhurley23" target="_blank" rel="noopener">
      <i class="fa-brands fa-github" />
      <span class="contact-label">GitHub</span>
    </a>
    <a href="https://linkedin.com/in/kevin-hurley-35a23843" target="_blank" rel="noopener">
      <i class="fa-brands fa-linkedin-in" />
      <span class="contact-label">LinkedIn</span>
    </a>
  </div>
</section>
```

---

### Phase 5: Create the Homepage

#### 5.1 `src/pages/index.astro`
This replaces `App.jsx` + `public/index.html`. Combines the HTML shell with all components.

```astro
---
import { motion } from 'motion';
import Navbar from '../components/Navbar.astro';
import Switch from '../components/Switch.astro';
import TextCircles from '../components/TextCircles.astro';
import About from '../components/About.astro';
import ProjectGrid from '../components/ProjectGrid.astro';
import Contact from '../components/Contact.astro';
import '../styles/global.css';
import '../styles/navbar.css';
import '../styles/hero.css';
import '../styles/about.css';
import '../styles/projects.css';
import '../styles/contact.css';
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <script
      src="https://kit.fontawesome.com/86e474c9b5.js"
      crossorigin="anonymous"
    ></script>
    <link rel="manifest" href="/manifest.json" />
    <title>Kevin Hurley Portfolio</title>
  </head>
  <body>
    <div class="App transition" data-theme="dark">
      <Navbar>
        <Switch slot="animation-toggle" state="true" />
        <Switch slot="dark-mode-switch" state="true" />
      </Navbar>

      <section id="hero">
        <TextCircles animationsOn={animationsOn} />
        <div id="hero-text" class="flex-center">
          <motion.h1
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Kevin Hurley
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            class="transition"
          >
            Web Developer
          </motion.h2>
        </div>
      </section>

      <main>
        <div class="container">
          <About />
          <section id="projects">
            <h2>Projects</h2>
            <ProjectGrid animationsOn={animationsOn} />
          </section>
          <Contact />
        </div>
      </main>
    </div>
  </body>
</html>
```

---

### Phase 6: Migrate Interactivity (Motion.js + Vanilla JS)

#### 6.1 Replace framer-motion with motion.js

```bash
npm uninstall framer-motion
npm install motion
```

**Key import change:**
- Import from `'motion'` (not `'motion/react'` — that's React-only)
- No React hooks available — use vanilla JS for state management
- `useScroll` → vanilla scroll listener (see interactivity.js below)
- `useSpring` → use `motion`'s `useSpring` (same API, different import)
- `useReducedMotion` → use `motion`'s `useReducedMotion` (same API, different import)
- `useInView` from `react-intersection-observer` → use a small vanilla JS IntersectionObserver hook

**Important Astro template differences from JSX:**
- `onClick` → `onclick` (lowercase)
- `className` → `class`
- `htmlFor` → `for`
- No `{children}` — use `<slot />` instead

#### 6.2 Create `src/assets/js/interactivity.js`
Move all vanilla JS logic here (modal open/close, scroll progress bar, viewport resize for TextCircles):

```js
// Scroll progress bar
const createProgressBar = () => {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  let lastScrollY = 0;
  const updateBar = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
};

// Modal open/close
const openModal = (card, id) => {
  const modal = document.querySelector(`.project-details[data-id="${id}"]`);
  const backdrop = document.querySelector('.modal-backdrop');
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const cardRect = card.getBoundingClientRect();

  card.style.opacity = '0';
  backdrop.style.zIndex = '2';
  backdrop.style.opacity = '100';

  // Set initial modal position to card position
  modal.style.display = 'block';
  modal.style.width = cardWidth + 'px';
  modal.style.height = cardHeight + 'px';
  modal.style.left = cardRect.left + 'px';
  modal.style.top = cardRect.top + 'px';
  modal.style.transform = 'translate(0)';
  modal.style.transition = '0s';

  requestAnimationFrame(() => {
    modal.classList.add('expanded');
    setTimeout(() => {
      modal.removeAttribute('style');
    }, 50);
  });
};

const closeModal = () => {
  const modal = document.querySelector('.project-details.expanded');
  if (!modal) return;

  const id = modal.dataset.id;
  const card = document.getElementById(id);
  const backdrop = document.querySelector('.modal-backdrop');
  const transition = getComputedStyle(document.querySelector('.project-details')).transitionDuration;
  const duration = parseFloat(transition) * 1000;

  const cardRect = card.getBoundingClientRect();
  modal.style.display = 'block';
  modal.style.width = cardRect.width + 'px';
  modal.style.height = cardRect.height + 'px';
  modal.style.left = cardRect.left + 'px';
  modal.style.top = cardRect.top + 'px';
  modal.style.transform = 'translate(0)';
  modal.style.transition = 'none';

  modal.classList.remove('expanded');
  backdrop.style.opacity = '0';

  setTimeout(() => {
    card.style.opacity = '1';
    backdrop.style.zIndex = '';
  }, duration - 150);

  setTimeout(() => {
    modal.style.display = 'none';
  }, duration);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createProgressBar();

  // Attach modal handlers to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => openModal(card, card.id));
  });
  document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

  // Close modal button
  document.querySelectorAll('.project-details button').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
});

export { openModal, closeModal };
```

#### 6.3 Wire up the JS in `index.astro`
Add at the bottom of the `<body>` in `src/pages/index.astro`:
```html
<script type="module" src="/assets/js/interactivity.js"></script>
```

#### 6.4 Add Dark Mode & Animation Toggle Logic
Add to the end of `interactivity.js`:
```js
// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const app = document.querySelector('.App');
    const current = app?.getAttribute('data-theme');
    app?.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    // Update switch visual
    const switchEl = darkModeToggle.querySelector('.switch');
    if (switchEl) {
      const isOn = switchEl.getAttribute('data-ison');
      switchEl.setAttribute('data-ison', isOn === 'true' ? 'false' : 'true');
    }
  });
}

// Animation toggle
const animToggle = document.getElementById('animation-toggle');
if (animToggle) {
  animToggle.addEventListener('click', () => {
    const app = document.querySelector('.App');
    const current = app?.getAttribute('data-animations');
    app?.setAttribute('data-animations', current === 'on' ? 'off' : 'on');
    // Update switch visual
    const switchEl = animToggle.querySelector('.switch');
    if (switchEl) {
      const isOn = switchEl.getAttribute('data-ison');
      switchEl.setAttribute('data-ison', isOn === 'true' ? 'false' : 'true');
    }
  });
}
```

---

### Phase 7: Migrate CSS

#### 7.1 Consolidate into Astro's `src/styles/` directory
Move all CSS files into `src/styles/` (they're already there). Astro will import and bundle them.

In `src/pages/index.astro`, import all stylesheets:
```astro
import '../styles/global.css';
import '../styles/navbar.css';
import '../styles/hero.css';
import '../styles/about.css';
import '../styles/projects.css';
import '../styles/contact.css';
```

#### 7.2 CSS Considerations
- **Nesting**: Your CSS uses nesting (e.g., `#navbar nav a`). Astro's CSS bundler supports nesting natively (via Lightning CSS). No changes needed.
- **CSS Variables**: Theme variables in `global.css` work as-is. The `data-theme` attribute approach is unchanged.
- **`@media` queries**: Work as-is.
- **`clamp()` functions**: Work as-is.

---

### Phase 8: Handle Images — All Images to `public/img/`

Astro serves `public/` as static assets. Move the entire `src/img/` directory to `public/img/`:

```
public/img/
  code-300.png
  code-500.png
  Portrait-Photo-9-7-24_03.jpg
  project-thumb/
    drum-machine.jpg
    finance-tracker.jpg
    find-and-replace.jpg
    green-valley-crossing.jpg
    javascript-calculator.jpg
    pomodoro-clock.jpg
    vision-2030.jpg
    web2024.jpg
    world-trade-day.jpg
  project-large/
    drum-machine.jpg
    finance-tracker.jpg
    find-and-replace.jpg
    green-valley-crossing.jpg
    javascript-calculator.jpg
    pomodoro-clock.jpg
    vision-2030.jpg
    web2024.jpg
    world-trade-day.jpg
```

All images are referenced as `/img/...` paths:
```html
<img src="/img/Portrait-Photo-9-7-24_03.jpg" alt="Portrait" />
<img src="/img/project-thumb/drum-machine.jpg" alt="Drum Machine" />
```

#### 8.1 Image Migration Steps
1. Move `src/img/` → `public/img/` (preserving subdirectory structure)
2. Update all image references in components to use `/img/...` paths
3. Delete `src/img/` after verifying everything works

---

### Phase 9: Clean Up

#### 9.1 Files to Delete
- `src/App.jsx`
- `src/index.js`
- `src/reportWebVitals.js`
- `src/setupTests.js`
- `src/index.css`
- `src/components/About.jsx`
- `src/components/ProjectGrid.jsx`
- `src/components/ProjectCard.jsx`
- `src/components/Contact.jsx`
- `src/components/Switch.jsx`
- `src/components/TextCircle.jsx`
- `src/components/TextCircles.jsx`
- `src/content/projects/projects.js`
- `src/content/experience/experience.js`
- `src/content/aboutMe.md`
- `src/content/technicalApproach.md`
- All old `.md` files in `src/content/projects/` and `src/content/experience/`

#### 9.2 Files to Keep
- `public/` (entire directory — favicon, manifest, robots.txt, and all `img/`)
- `src/styles/` (all CSS files)
- `src/content/projects/*.mdx` (new)
- `src/content/experience/*.mdx` (new)
- `src/content/about-intro.mdx` (new)
- `src/content/about-technical-approach.mdx` (new)
- `src/content.config.ts` (new)
- `src/pages/index.astro` (new)
- `src/components/*.astro` (new)
- `astro.config.mjs` (new)

---

### Phase 10: Build & Deploy

#### 10.1 Test Locally
```bash
npm run dev
```
Check:
- All pages render correctly
- Markdown content displays properly
- Images load
- Animations work (progress bar, entrance, text circles)
- Modal opens/closes
- Dark mode toggle works
- Animation toggle works
- Mobile responsiveness

#### 10.2 Build
```bash
npm run build
```
Output goes to `dist/`.

#### 10.3 Deploy
```bash
npm run deploy
```
Uses `gh-pages` to push `dist/` to GitHub Pages.

---

## Summary of Key Changes

| Aspect | Before (CRA) | After (Astro) |
|--------|-------------|---------------|
| Build tool | `react-scripts` | `astro dev` / `astro build` |
| Entry point | `src/index.js` → `App.jsx` | `src/pages/index.astro` |
| Components | `.jsx` files | `.astro` files |
| Content | `.js` data files + `.md` files | `.mdx` files with frontmatter |
| Content API | Manual imports | `getCollection()` API |
| Animations | `framer-motion` | `motion` (framework-agnostic) |
| CSS | Multiple imports in JS | Imports in `.astro` files |
| Images | `require()` / `import` | All moved to `public/img/`, referenced as `/img/...` |
| Output | `build/` | `dist/` |
| Deploy target | `gh-pages -d build` | `gh-pages -d dist` |

## Estimated Complexity by Phase

| Phase | Effort | Risk |
|-------|--------|------|
| 1: Scaffold + clean | Low | Low |
| 2: Content collections | Low | Low |
| 3: MDX conversion | Medium | Low |
| 4: Astro components | Medium | Low (syntax is straightforward) |
| 5: Homepage | Medium | Medium (combining everything) |
| 6: Interactivity | **High** | **High** (modal animation logic is complex) |
| 7: CSS | Low | Low |
| 8: Images | Low | Low |
| 9: Cleanup | Low | Low |
| 10: Build/deploy | Low | Low |

**Biggest risk**: Phase 6 — the modal open/close animation uses `getComputedStyle` and dynamic positioning. This needs careful recreation in vanilla JS or with motion.js. The rest is largely mechanical.