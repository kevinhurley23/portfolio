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
- `react-scripts`, `web-vitals`, `@testing-library/*`, `@babel/plugin-proposal-private-property-in-object`, `react-intersection-observer`, `framer-motion`

> **Note:** `react` and `react-dom` are **kept** (via `@astrojs/react` integration). We add them back selectively to power the interactive components.

### Dependencies to Add
- `astro`
- `motion`
- `@astrojs/react`
- `@astrojs/sitemap`
- `@astrojs/mdx`

---

## Step-by-Step Plan

### Phase 1: Scaffold Astro & Clean CRA

#### 1.1 Install Dependencies
Run from the repo root:
```bash
npm uninstall react react-dom framer-motion
npm install astro motion @astrojs/react @astrojs/sitemap @astrojs/mdx
```

> **Import path note:** Use `motion/react` (not `motion`) for all framer-motion imports. This is the correct path for the `motion` package (framer-motion v11+). Using `motion` without `/react` will cause import errors.

> **Why keep `react` and `react-dom`?** Several components need React hooks (`useScroll`, `useSpring`, `useInView`, `useReducedMotion`, `useState`, `useEffect`). The `@astrojs/react` integration lets us use them selectively without a full SPA. See Phase 4 for the component split.

#### 1.2 Create Astro Config Manually
Create `astro.config.mjs` (do **not** use `npm create astro` — it conflicts with existing files):

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://kevinhurley.dev',
  integrations: [sitemap(), mdx(), react()],
});
```

> **Important:** `contentCollections` is **not** in this file. It lives in `src/content.config.ts` (Phase 2.3). Astro 4+ deprecated the `contentCollections` config option.

Create `src/pages/index.astro` (empty for now — Phase 5 fills it in).

Keep `public/` as-is for now. We'll clean it up in Phase 8.

#### 1.3 Remove CRA Entry Point Files
Delete these files (they are CRA-specific):
- `src/index.js`
- `src/reportWebVitals.js`
- `src/setupTests.js`
- `src/index.css` (merged into global styles)
- `public/index.html` (Astro does **not** use CRA's HTML template)

Keep:
- `public/manifest.json` — Astro serves `public/` as-is
- `public/favicon.ico` — stays in `public/`
- `public/robots.txt` — stays in `public/`

#### 1.4 Update package.json

**Remove** these dependencies:
```json
"react-scripts", "web-vitals",
"@babel/plugin-proposal-private-property-in-object",
"@testing-library/jest-dom", "@testing-library/react", "@testing-library/user-event",
"react-intersection-observer"
```

> **`react` and `react-dom` stay.** They are installed via `@astrojs/react`.

**Replace** the scripts:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist --cname kevinhurley.dev -r https://github.com/kevinhurley/portfolio-v2.git"
}
```

> **Why keep `gh-pages` in `devDependencies`?** `gh-pages` is a deployment CLI tool, not a runtime dependency. Keeping it in `devDependencies` is the standard npm pattern. We use the `-r` flag in the deploy script to specify the remote explicitly, avoiding the need for a `homepage` field that ties the repo to a specific deployment target.

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

#### 2.2 `astro.config.mjs` (already created in Phase 1.2)

The config from Phase 1.2 is already correct. No changes needed here.

#### 2.3 Create `src/content.config.ts`
This file is required for Astro content collections:
```ts
import { defineCollection, z } from 'astro:content';

const about = defineCollection({
  type: 'content',
  schema: z.object({
    intro: z.string(),
    technicalApproach: z.string(),
  }),
});

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

export const collections = { about, projects, experience };
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

#### 3.3 About Section Files

Convert these to `.mdx` files and store in a new `src/content/about/` directory. This gives them the same content collection treatment as projects and experience, ensuring consistent rendering across the entire site.

> **Note:** The about collection uses `type: 'content'` (not `type: 'data'`). The frontmatter fields (`intro`, `technicalApproach`) are used by the About component for the short text snippets. The body content is formatted markdown that can be rendered with Astro's `<Content>` component if you later want rich formatting (bold, links, lists) in the About section.

**`src/content/about/intro.mdx`**
```mdx
---
intro: "I began my career as a music teacher before pivoting to web development in 2022. What started as a side project during vacation time quickly became a full career change — within a year, I landed my first development role. Today, I build and maintain enterprise-level Drupal websites full-time for Bryant University, and I'm available for select freelance engagements. If you're looking for a developer who brings both technical rigor and creative problem-solving to every project, let's talk."
---

I began my career as a music teacher before pivoting to web development in 2022. What started as a side project during vacation time quickly became a full career change — within a year, I landed my first development role. Today, I build and maintain enterprise-level Drupal websites full-time for Bryant University, and I'm available for select freelance engagements. If you're looking for a developer who brings both technical rigor and creative problem-solving to every project, let's talk.
```

**`src/content/about/technical-approach.mdx`**
```mdx
---
technicalApproach: "I believe great web development sits at the intersection of clean code and thoughtful user experience. My work is guided by several core principles:"
---

I believe great web development sits at the intersection of clean code and thoughtful user experience. My work is guided by several core principles:

**Component-based architecture.** I design and build reusable component libraries that give content authors flexibility while maintaining visual consistency across the site. Each component is self-contained, documented, and designed to be composed into complex page layouts.

**Modern CSS without frameworks.** I work with vanilla CSS — custom properties, CSS Grid, Flexbox, container queries, and subgrid — to build responsive, performant layouts. I avoid heavy frameworks like Bootstrap in favor of purpose-built styles that keep the codebase lean and maintainable.

**Configuration-driven development.** I use Drupal's configuration management extensively, with Config Split and Config Ignore for environment-specific overrides. This enables safe, auditable deployments and makes it easy to stage and promote changes across dev, test, and production.

**Accessibility and semantic HTML.** Every project starts with accessibility in mind. I write semantic markup, ensure proper heading hierarchy, and build patterns that work for all users — not just as an afterthought, but as a foundation.
```

**Delete the old files:**
- `src/content/aboutMe.md` — replaced by `about/intro.mdx`
- `src/content/technicalApproach.md` — replaced by `about/technical-approach.mdx`

---

### Phase 4: Create Components (React + Astro)

Since we're using `@astrojs/react`, we use **React** for interactive components (need hooks/state) and **Astro** for static ones.

| Component | Type | Why |
|-----------|------|-----|
| `AnimationsProvider.jsx` | React | Manages `animationsOn` + `darkMode` state with `useReducedMotion` |
| `Navbar.jsx` | React | Uses `useScroll` + `useSpring` for progress bar |
| `HeroText.jsx` | React | Uses `motion.h1`/`motion.h2` for entrance animation |
| `Switch.jsx` | React | Uses `motion` `layout` animation |
| `TextCircles.jsx` | React | Needs viewport resize handling + `useInView` |
| `TextCircle.jsx` | Astro | Pure CSS rotation, no JS needed |
| `ProjectGrid.jsx` | React | Uses `IntersectionObserver` + `getCollection` |
| `ProjectCard.jsx` | React | Manages modal open/close state |
| `About.jsx` | React | Renders MDX + `getCollection` |
| `Contact.jsx` | Astro | Static content, no interactivity |

#### 4.1 `src/components/AnimationsProvider.jsx` (UPDATED)

Manages **both** `animationsOn` and `darkMode` state. This is the **only** place app-level state is defined — shared via React Context. Dark mode is fully React-managed to eliminate the React/vanilla JS race condition.

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

const AnimationsContext = createContext(null);

export function useAnimations() {
  const ctx = useContext(AnimationsContext);
  if (!ctx) throw new Error('useAnimations must be used within AnimationsProvider');
  return ctx;
}

export function AnimationsProvider({ children }) {
  const prefersReduced = useReducedMotion();
  const [animationsOn, setAnimationsOn] = useState(!prefersReduced);
  const [darkMode, setDarkMode] = useState(true);

  // Sync with document for CSS custom property --transition
  useEffect(() => {
    const projects = document.querySelector('#projects');
    if (projects) {
      projects.style.setProperty('--transition', animationsOn ? '600ms' : '0ms');
    }
    document.documentElement.setAttribute('data-animations', animationsOn ? 'on' : 'off');
  }, [animationsOn]);

  // Sync dark mode to the DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleAnimations = () => setAnimationsOn((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AnimationsContext.Provider value={{ animationsOn, toggleAnimations, darkMode, toggleDarkMode }}>
      {children}
    </AnimationsContext.Provider>
  );
}
```

#### 4.2 `src/components/Navbar.jsx`
Replaces the navbar portion of `App.jsx`. Uses `motion/react` for the progress bar and entrance animation. Gets `darkMode` from context instead of props.

```jsx
import { motion, useScroll, useSpring } from 'motion/react';
import Switch from './Switch';
import './styles/navbar.css';
import { useAnimations } from './AnimationsProvider';

export default function Navbar() {
  const { animationsOn, toggleAnimations, darkMode, toggleDarkMode } = useAnimations();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        id="progress-bar"
        class="progress-bar"
        style={{ scaleX }}
      />
      <motion.nav
        id="navbar"
        class="navbar"
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div id="animation-toggle" class="toggle-container">
          <Switch state={animationsOn} func={toggleAnimations} />
          <div class="transition" style={animationsOn ? { color: 'var(--primary)' } : {}}>
            Animations
          </div>
        </div>
        <nav class="flex-center">
          <a href="#about" class="transition">About</a>
          <a href="#projects" class="transition">Projects</a>
          <a href="#contact" class="transition">Contact</a>
        </nav>
        <div id="dark-mode-toggle" class="toggle-container">
          <div>
            <i class="fa-solid fa-sun transition" />
          </div>
          <Switch state={darkMode} func={toggleDarkMode} />
          <div>
            <i class="fa-solid fa-moon transition" />
          </div>
        </div>
      </motion.nav>
    </>
  );
}
```

> **Note:** All state comes from the `AnimationsProvider` context. No props are needed from the parent.

#### 4.3 `src/components/HeroText.jsx` (NEW)
Wraps the hero `<h1>`/`<h2>` in `motion.h1`/`motion.h2` for entrance animation. This component respects the `animationsOn` toggle from context, ensuring the hero animation can be disabled when the user prefers reduced motion.

```jsx
import { motion } from 'motion/react';
import { useAnimations } from './AnimationsProvider';

export default function HeroText() {
  const { animationsOn } = useAnimations();

  return (
    <div id="hero-text" className="flex-center">
      <motion.h1
        initial={animationsOn ? { opacity: 0, y: 200 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Kevin Hurley
      </motion.h1>
      <motion.h2
        initial={animationsOn ? { opacity: 0, y: 200 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        Web Developer
      </motion.h2>
    </div>
  );
}
```

> **Note:** The animation is still applied even when `animationsOn` is `false` — but `motion` respects `prefers-reduced-motion` natively. The `useReducedMotion` hook in `AnimationsProvider` already sets `animationsOn` based on the user's system preference. The conditional `animate` prop is a belt-and-suspenders approach.

#### 4.4 `src/components/Switch.jsx`
Replaces `Switch.jsx`. Uses `motion/react` with `layout` animation.

```jsx
import { motion } from 'motion/react';

export default function Switch({ state, func }) {
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  };

  return (
    <div class="switch" data-ison={state} onClick={func}>
      <motion.div
        class="handle"
        layout
        transition={spring}
      />
    </div>
  );
}
```

#### 4.6 `src/components/TextCircle.jsx` (Astro)
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

#### 4.7 `src/components/TextCircles.jsx` (React)
Replaces `TextCircles.jsx`. Uses `motion/react` for the fade-in wrapper. **React is needed here** because the original dynamically calculates `numCircles` based on viewport width via `useState`/`useEffect`.

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import TextCircle from './TextCircle.astro';

export default function TextCircles({ animationsOn }) {
  const [numCircles, setNumCircles] = useState(18);

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

  useEffect(() => {
    const update = () => {
      const viewport = Math.max(window.innerWidth, window.innerHeight);
      setNumCircles(viewport < 1600 ? Math.floor(viewport / 100) : 18);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <motion.div
      id="text-circles"
      class="flex-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 4, ease: 'easeIn' }}
    >
      {textLines.slice(0, numCircles).map((line, index) => (
        <TextCircle
          key={index}
          index={index}
          line={line}
          numCircles={numCircles}
          diameter={300 * (1 + index / 3.5)}
          animationsOn={animationsOn}
        />
      ))}
    </motion.div>
  );
}
```

#### 4.8 `src/components/ProjectCard.jsx` (UPDATED — Full Modal Animation System)
Replaces `ProjectCard.jsx`. Takes a content collection item as a prop. **React is needed** for the modal open/close state. **This ports the full card-to-modal expansion animation from the original** — the modal expands from the clicked card's exact position to fill the viewport.

```jsx
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Content } from 'astro:content';

export default function ProjectCard({ project }) {
  const { title, tags, buildLink, srcLink } = project.data;
  const [isOpen, setIsOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({ display: 'none' });
  const [transitionTime, setTransitionTime] = useState(0);
  const cardRef = useRef(null);

  const thumbPath = `/img/project-thumb/${project.slug}.jpg`;
  const largePath = `/img/project-large/${project.slug}.jpg`;

  // Calculate card position and set modal to match
  const setModalStyles = (card, modal, opening) => {
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const cardXPos = card.getBoundingClientRect().left;
    const cardYPos = card.getBoundingClientRect().top;

    const styles = {
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
      left: `${cardXPos}px`,
      top: `${cardYPos}px`,
      transform: 'translate(0)',
    };

    if (opening) {
      styles.display = 'block';
      styles.transition = '0s';
    }

    setModalStyle(styles);
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    const card = e.currentTarget;
    const detailsModal = document.querySelector(`.project-details[data-id="${id}"]`);

    setModalStyles(card, detailsModal, true);
    card.style.opacity = 0;
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.style.zIndex = '2';
      backdrop.style.opacity = '100';
    }

    // After a brief delay, remove inline styles and let CSS handle the animation
    setTimeout(() => {
      setModalStyle({});
      detailsModal.classList.add('expanded');
      setIsOpen(true);
    }, 20);
  };

  const handleClose = () => {
    const detailsModal = document.querySelector('.project-details.expanded');
    const card = cardRef.current;
    if (!detailsModal || !card) return;

    setModalStyles(card, detailsModal, false);
    detailsModal.classList.remove('expanded');

    // Calculate transition duration from computed styles
    const computedStyle = window.getComputedStyle(detailsModal);
    const duration = parseFloat(computedStyle.transitionDuration || '0') * 1000;
    setTransitionTime(duration || 600);

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.style.opacity = '';

    setTimeout(() => {
      card.style.opacity = 1;
      if (backdrop) backdrop.style.zIndex = '';
    }, Math.max(0, transitionTime - 150));

    setTimeout(() => {
      setModalStyle({ display: 'none' });
      setIsOpen(false);
    }, transitionTime);
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 200 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        id={id}
        class={`project-card ${tags.join(' ')}`}
        variants={gridVariants}
        onClick={handleOpen}
      >
        <img src={thumbPath} alt={title} loading="lazy" />
        <div class="project-title">
          <h3>{title}</h3>
        </div>
      </motion.div>
      <div
        class="project-details"
        data-id={id}
        style={Object.keys(modalStyle).length ? modalStyle : undefined}
      >
        <button onClick={handleClose}>
          <i class="fa-solid fa-x"></i>
        </button>
        <div class="image">
          <img class="large-img" src={largePath} />
          <img class="thumb" src={thumbPath} />
        </div>
        <div class="project-title">
          <h3>{title}</h3>
        </div>
        <div class="detail-text">
          {/* Render the MDX content from the collection item using Astro's Content component */}
          <Content data={project} />
        </div>
        <div class="project-title">
          <a href={buildLink} target="_blank" rel="noopener noreferrer">
            <h3>{title}</h3>
          </a>
          {srcLink && (
            <a href={srcLink} target="_blank" rel="noopener noreferrer">
              Source Code
            </a>
          )}
        </div>
      </div>
    </>
  );
}
```

> **Note:** This ports the full `setModalStyles`, `openDetailsModal`, and `closeDetailsModal` system from the original `ProjectGrid.jsx`. The modal expands from the clicked card's exact position using calculated pixel values, then CSS transitions handle the rest.
>
> **Note:** The `modal-backdrop` element is now rendered by `ProjectGrid` (see Phase 4.7) rather than being a separate element.
>
> **Note:** `project.body` is no longer used directly. Astro's `<Content>` component renders the MDX content from the collection item, providing full markdown/MDX support (bold, italic, links, lists, code blocks) without a custom parser.

#### 4.9 `src/components/ProjectGrid.jsx` (UPDATED — with client:load)
Replaces `ProjectGrid.jsx`. Uses `getCollection` to fetch projects and `IntersectionObserver` for the staggered entrance animation. **Includes the `modal-backdrop` element** (moved from the original ProjectGrid).

```jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import ProjectCard from './ProjectCard';
import { getCollection } from 'astro:content';

export default function ProjectGrid({ animationsOn }) {
  const [projects, setProjects] = useState([]);
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  // Native IntersectionObserver (replaces react-intersection-observer)
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { triggerOnce: true, rootMargin: '-300px 0px' }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    getCollection('projects').then((result) => {
      setProjects(result.sort((a, b) => a.data.title.localeCompare(b.data.title)));
    });
  }, []);

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <>
      <div className="modal-backdrop"></div>
      <motion.div
        id="project-grid"
        ref={setRef}
        variants={gridVariants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </motion.div>
    </>
  );
}
```

> **Note:** The original used `react-intersection-observer` (`useInView`). This package is **no longer needed** — the plan uses the native `IntersectionObserver` API instead.
>
> **Important:** In `index.astro`, this component must use `client:load` to ensure hydration happens before the user can interact with the project grid.

#### 4.10 `src/components/About.jsx` (UPDATED — uses content collections for about content)
Replaces `About.jsx`. Uses `getCollection` for experience **and** about content (intro + technical approach). All content is now in `src/content/` with consistent rendering.

```jsx
import { getCollection } from 'astro:content';
import { useEffect, useState } from 'react';

// Full markdown-to-HTML converter (handles **bold**, *italic*, links, lists)
const renderMarkdown = (md) => {
  if (!md) return '';
  return md
    .split('\n\n')
    .map(p => {
      let html = p
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return `<p>${html}</p>`;
    })
    .join('');
};

export default function About() {
  const [experience, setExperience] = useState([]);
  const [aboutData, setAboutData] = useState({ intro: '', technicalApproach: '' });

  useEffect(() => {
    Promise.all([
      getCollection('experience'),
      getCollection('about'),
    ]).then(([exp, about]) => {
      setExperience(exp);
      // about is an array of about/intro.mdx and about/technical-approach.mdx
      const intro = about.find(a => a.slug === 'intro');
      const technical = about.find(a => a.slug === 'technical-approach');
      setAboutData({
        intro: intro ? intro.data.intro : '',
        technicalApproach: technical ? technical.data.technicalApproach : '',
      });
    });
  }, []);

  return (
    <section id="about">
      <h2>About Me</h2>
      <div class="row">
        <div class="left">
          <img src="/img/Portrait-Photo-9-7-24_03.jpg" alt="Kevin Hurley portrait" />
        </div>
        <div class="middle">
          <div class="prose" dangerouslySetInnerHTML={{ __html: aboutData.intro }} />
          <h3>Technical Approach</h3>
          <div class="prose" dangerouslySetInnerHTML={{ __html: aboutData.technicalApproach }} />
          <h3 class="experience">Experience</h3>
          {experience.map(role => (
            <div class="job">
              <div class="job-title">{role.data.title} — {role.data.employer}</div>
              <div class="job-length">{role.data.start} — {role.data.end || 'Present'}</div>
              <div class="prose">
                {/* Render the MDX content from the collection item using Astro's Content component */}
                <Content data={role} />
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
  );
}
```

> **Note:** `role.body` is the rendered HTML from the MDX content collection. The about intro and technical approach are stored in `about/intro.mdx` and `about/technical-approach.mdx` with frontmatter fields `intro` and `technicalApproach`. All content uses the same `getCollection()` API for consistency.

#### 4.11 `src/components/Contact.jsx` (Astro)
Replaces `Contact.jsx`. Static content — no changes needed beyond syntax.

```astro
---
---
<section id="contact" class="flex-center">
  <h2>Contact Me</h2>
  <p>
    Looking for someone capable to join your web team? Need a freelance
    developer to create a bespoke website for your business?
    <br />
    Let's get in touch.
  </p>
  <div id="contact-buttons" class="flex-center">
    <a href="mailto:kevinhurley23@gmail.com" target="_blank" rel="noopener noreferrer">
      <i class="fa-regular fa-envelope"></i>
      <span class="contact-label">Email</span>
    </a>
    <a href="https://github.com/kevinhurley23" target="_blank" rel="noopener noreferrer">
      <i class="fa-brands fa-github"></i>
      <span class="contact-label">GitHub</span>
    </a>
    <a href="https://linkedin.com/in/kevin-hurley-35a23843" target="_blank" rel="noopener noreferrer">
      <i class="fa-brands fa-linkedin-in"></i>
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
import { AnimationsProvider } from '../components/AnimationsProvider';
import Navbar from '../components/Navbar';
import HeroText from '../components/HeroText';
import TextCircles from '../components/TextCircles';
import About from '../components/About';
import ProjectGrid from '../components/ProjectGrid';
import Contact from '../components/Contact';
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
    {/* Prevent flash of wrong theme: set data-theme before React hydrates */}
    <script>
      (function() {
        const stored = localStorage.getItem('data-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  </head>
  <body>
    <AnimationsProvider>
      <div class="App transition" data-theme="dark">
        <Navbar client:load />

        <section id="hero">
          <TextCircles client:load />
          <HeroText client:load />
        </section>

        <main>
          <div class="container">
            <About client:load />
            <section id="projects">
              <h2>Projects</h2>
              <ProjectGrid client:load />
            </section>
            <Contact />
          </div>
        </main>
      </div>
    </AnimationsProvider>
  </body>
</html>
```

> **Key changes from the original plan:**
> - `AnimationsProvider` wraps the entire app (React context for `animationsOn` **and** `darkMode`)
> - **`client:load` is used explicitly** on `ProjectGrid` to ensure hydration happens before user interaction. This avoids SSR mismatches with browser-API-dependent hooks (`useScroll`, `useSpring`, `useReducedMotion`). All other interactive components (`Navbar`, `TextCircles`, `About`) also need `client:load` — see the note below.
> - `HeroText` is a new React component wrapping `<h1>`/`<h2>` in `motion.h1`/`motion.h2` for entrance animation
> - `Navbar` no longer receives `darkMode`/`toggleDarkMode` props — it gets them from context
> - `TextCircles` no longer receives `animationsOn` prop — it gets it from context
> - `Contact` stays as an Astro component (static)
>
> **Important:** `@astrojs/react` auto-hydration can cause SSR mismatches with browser-API-dependent hooks. **Use `client:load` on all interactive components:**
> ```astro
> <Navbar client:load />
> <TextCircles client:load />
> <About client:load />
> <ProjectGrid client:load />
> ```

---

### Phase 6: Migrate Interactivity (Hero Animation Only)

Since React handles all animation state (`animationsOn`, `darkMode`, `scrollYProgress`), the vanilla JS is now **minimal** — only the hero entrance animation remains (handled by the `HeroText` React component, so actually **zero** vanilla JS is needed).

#### 6.1 About content files

The about intro and technical approach are now `.mdx` files in `src/content/about/` (created in Phase 3.3). No additional setup needed.

#### 6.2 Hero entrance animation

The `HeroText` component (Phase 4.3) uses `motion.h1`/`motion.h2` for the entrance animation. **No vanilla JS is needed.** The animation respects `animationsOn` from the `AnimationsProvider` context.

#### 6.3 Dark mode

Dark mode is fully React-managed via `AnimationsProvider` (Phase 4.1). **No vanilla JS is needed.** The `useEffect` in `AnimationsProvider` syncs `darkMode` to `data-theme` on the document root.

#### 6.4 Client-side JS

No `interactivity.js` file is needed. All interactivity is handled by React components.

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
- **CSS Architecture**: The portfolio uses global stylesheets (one per section). This is appropriate for a small site. As the codebase grows, consider migrating to scoped CSS (Astro's `:global()` or CSS modules) to prevent style leakage between components. Document the chosen approach in this section before adding new component styles.

---

### Phase 8: Handle Images

Astro serves `public/` as static assets. Move `src/img/` to `public/img/`:

```bash
mv src/img public/img
```

This preserves the subdirectory structure:
```
public/img/
  code-300.png
  code-500.png
  Portrait-Photo-9-7-24_03.jpg
  project-thumb/*.jpg
  project-large/*.jpg
```

All image references in components already use `/img/...` paths (e.g., `/img/project-thumb/drum-machine.jpg`). No code changes needed.

**Verify** everything works, then delete `src/img/`.

#### 8.1 Delete Unused Project Images

The build directory contains **9 project image sets** but only **5 projects** are in this migration. The following project image sets are from old/freeCodeCamp-era work and are **not included in this migration**:

- `javascript-calculator` — delete `project-thumb/javascript-calculator.jpg` and `project-large/javascript-calculator.jpg`
- `pomodoro-clock` — delete `project-thumb/pomodoro-clock.jpg` and `project-large/pomodoro-clock.jpg`
- `vision-2030` — delete `project-thumb/vision-2030.jpg` and `project-large/vision-2030.jpg`
- `world-trade-day` — delete `project-thumb/world-trade-day.jpg` and `project-large/world-trade-day.jpg`

These projects are not part of the portfolio as migrated. If you later decide to add them back, create MDX files in `src/content/projects/` following the same pattern.

---

### Phase 9: Clean Up

#### 9.1 Files to Delete
- `src/App.jsx`
- `src/index.js`
- `src/reportWebVitals.js`
- `src/setupTests.js`
- `src/index.css`
- `src/components/About.jsx` — replaced by new React version
- `src/components/ProjectGrid.jsx` — replaced by new React version
- `src/components/ProjectCard.jsx` — replaced by new React version
- `src/components/Switch.jsx` — replaced by new React version
- `src/components/TextCircles.jsx` — replaced by new React version
- `src/content/projects/projects.js`
- `src/content/experience/experience.js`
- `src/content/aboutMe.md` — replaced by `about/intro.mdx`
- `src/content/technicalApproach.md` — replaced by `about/technical-approach.mdx`
- All old `.md` files in `src/content/projects/` and `src/content/experience/`
- `public/index.html` (Astro doesn't use CRA's HTML template)
- Unused project images (see Phase 8.1): `project-thumb/javascript-calculator.jpg`, `project-thumb/pomodoro-clock.jpg`, `project-thumb/vision-2030.jpg`, `project-thumb/world-trade-day.jpg` and their `project-large/` counterparts

#### 9.2 Files to Keep
- `public/` (entire directory — favicon, manifest, robots.txt, and all `img/`)
- `src/styles/` (all CSS files)
- `src/content/projects/*.mdx` (new)
- `src/content/experience/*.mdx` (new)
- `src/content/about/intro.mdx` (new — MDX with frontmatter)
- `src/content/about/technical-approach.mdx` (new — MDX with frontmatter)
- `src/content.config.ts` (new)
- `src/pages/index.astro` (new)
- `src/components/*.jsx` (new React versions)
- `src/components/TextCircle.astro` (Astro version — pure CSS)
- `src/components/Contact.astro` (Astro version — static)
- `src/components/HeroText.jsx` (NEW — hero entrance animation)
- `astro.config.mjs` (new)
- `src/components/AnimationsProvider.jsx` (NEW — manages animationsOn + darkMode state)

#### 9.3 Pre-flight Checklist

Before proceeding to Phase 10, verify:
- [ ] `build/` is in `.gitignore` (add it if not)
- [ ] `body` styles from `src/index.css` (margin, font family, font-smoothing) are merged into `src/styles/global.css`
- [ ] No stale file references remain (grep for `require(`, `import.*from.*framer-motion`, `import.*from.*react-intersection-observer`)
- [ ] All 5 project images exist in `public/img/project-thumb/` and `public/img/project-large/`
- [ ] Portrait photo exists in `public/img/`
- [ ] `public/.nojekyll` exists

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
- `prefers-reduced-motion` is respected
- Mobile responsiveness

#### 10.2 Build
```bash
npm run build
```
Output goes to `dist/`.

#### 10.3 Deploy

First, create a `.nojekyll` file in `public/` (Astro copies it to `dist/`):
```bash
touch public/.nojekyll
```
This prevents GitHub Pages from trying to process the site as a Jekyll project.

Then deploy:
```bash
npm run deploy
```
Uses `gh-pages` to push `dist/` to GitHub Pages. The `-r` flag in the deploy script specifies the remote explicitly, so no `homepage` field is needed in `package.json`. > **Note:** If you later switch deployment targets (Netlify, Vercel, etc.), the deploy script can be changed without touching `package.json`'s `homepage` field.

---

## Adding a New Project

To add a new project to the portfolio:

1. **Create the MDX file** in `src/content/projects/` (slug is derived from the filename):
   ```bash
   cp src/content/projects/web2024.mdx src/content/projects/my-new-project.mdx
   ```

2. **Edit the frontmatter** in `my-new-project.mdx`:
   ```mdx
   ---
   title: "My New Project"
   tags: ["Astro", "React"]
   buildLink: "https://example.com"
   srcLink: "https://github.com/username/repo"
   thumb: "my-new-project.jpg"
   large: "my-new-project.jpg"
   ---
   ```

3. **Add images** to `public/img/project-thumb/` and `public/img/project-large/`:
   - `my-new-project.jpg` in both directories

   > **Important:** The image filenames must match the `.mdx` filename (slug) exactly. The `<Content>` component renders the MDX body, and the image paths are derived from `project.slug`. If the slug is `my-new-project`, the images must be `my-new-project.jpg` (not `MyNewProject.jpg` or `my_new_project.jpg`).

4. **Edit the content body** with your project description (markdown supported).

That's it. `getCollection('projects')` will automatically include the new project, sorted alphabetically by title.

---

## Summary of Key Changes

| Aspect | Before (CRA) | After (Astro) |
|--------|-------------|---------------|
| Build tool | `react-scripts` | `astro dev` / `astro build` |
| Entry point | `src/index.js` → `App.jsx` | `src/pages/index.astro` |
| Components | `.jsx` files | `.jsx` (interactive) + `.astro` (static) |
| Content | `.js` data files + `.md` files | `.mdx` files with frontmatter |
| Content API | Manual imports | `getCollection()` API |
| Animations | `framer-motion` | `motion/react` (via `@astrojs/react`) |
| CSS | Multiple imports in JS | Imports in `.astro` files |
| Images | `require()` / `import` | All moved to `public/img/`, referenced as `/img/...` |
| Output | `build/` | `dist/` |
| Deploy target | `gh-pages -d build` | `gh-pages -d dist` |
| React | Full SPA | Selective hydration (`@astrojs/react`) |

## Estimated Complexity by Phase

| Phase | Effort | Risk |
|-------|--------|------|
| 1: Install + config | Low | Low |
| 2: Content collections | Low | Low |
| 3: MDX conversion | Medium | Low |
| 4: React components | Medium | **Medium** (modal animation system needs careful testing) |
| 5: Homepage | Medium | Low (client:load + HeroText are straightforward) |
| 6: Interactivity | Low | **Low** (all handled by React; no vanilla JS needed) |
| 7: CSS | Low | Low |
| 8: Images | Low | Low |
| 9: Cleanup | Low | Low |
| 10: Build/deploy | Low | Low |

**Biggest risk**: Phase 4 — the modal animation system (ported from the original) requires careful testing to ensure the card-to-modal expansion works across all viewport sizes. Test on mobile and desktop. The content collections are well-defined and low-risk.

## Component Split Summary

| Component | Type | Reason |
|-----------|------|--------|
| `AnimationsProvider.jsx` | React | `useReducedMotion` + context (`animationsOn` + `darkMode`) |
| `Navbar.jsx` | React | `useScroll` + `useSpring` |
| `HeroText.jsx` | React | `motion.h1`/`motion.h2` entrance animation |
| `Switch.jsx` | React | `motion` `layout` animation |
| `TextCircles.jsx` | React | `useState`/`useEffect` for viewport |
| `TextCircle.jsx` | Astro | Pure CSS, no JS needed |
| `ProjectGrid.jsx` | React | `IntersectionObserver` + state |
| `ProjectCard.jsx` | React | Modal open/close + card-to-modal animation |
| `About.jsx` | React | `getCollection` + MDX rendering |
| `Contact.jsx` | Astro | Static, no interactivity |