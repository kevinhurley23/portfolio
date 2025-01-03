export const projects = [
  {
    title: "Finance Tracker",
    tags: ["Svelte", "PHP", "MySQL"],
    buildLink: "https://kevinhurley23.github.io/finance-tracker/",
    srcLink: "https://github.com/kevinhurley23/finance-tracker",
    description:
      "My wife and I used to track our finances with a spreadsheet, but I became annoyed with the limitations and decided to build a more elegant, custom solution. I wanted to create a tool that would allow me to input my income and expenses and see a summary of my financial situation. I created this project using Svelte for the front end, PHP for the back end, and MySQL for the database. I host the app we actually use on my own desktop, so for security reasons the publically-viewable version linked here does not connect to my back end, but rather uses placeholder data.",
  },
  {
    title: "Vision 2030",
    tags: ["Drupal"],
    buildLink: "https://vision2030.bryant.edu",
    description:
      "In the fall of 2023 I was tasked with implementing a complete redesign of Bryant University's Vision 2030 website. This involved templating 5 new content types and a new, animated navigation design.",
  },
  {
    title: "Academic Program",
    tags: ["Drupal"],
    buildLink:
      "https://www.bryant.edu/academics/program-finder/graduate-certificate/graduate-certificate-business-analytics",
    description:
      "In the summer of 2023 I built the redesign of the content type used to display Bryant University's various academic programs.",
  },
  {
    title: "World Trade Day",
    tags: ["WordPress"],
    buildLink: "https://worldtradeday.bryant.edu/",
    description:
      "One of my accomplishments at Bryant University has been to create a new custom WordPress theme for the school's four event websites. This new theme works with WordPress's full site editor and enables the university's content editors to make more changes on their own. World Trade Day is one of the sites using my new event theme.",
  },
  {
    title: "Green Valley Crossing",
    tags: ["Astro", "Strapi"],
    buildLink: "https://kevinhurley23.github.io/Green-Valley-Crossing/",
    srcLink: "https://github.com/kevinhurley23/Green-Valley-Crossing",
    description:
      "This is the church I attend. When they learned that I became a web developer, they asked me to create a new website to replace the church's existing SquareSpace site. My plan was to create a Strapi headless CMS to make it easier for church administrative assistants to update content on the site, and a sleek Astro site to consume and display the data from the CMS. Unfortunately the church couldn't afford to pay me for the work, so the project was never finished. This version removes the Strapi integration and showcases what I had already built in Astro.",
  },
  {
    title: "Find and Replace",
    tags: ["jQuery"],
    buildLink: "https://kevinhurley23.github.io/Online-Find-and-Replace-Tool/",
    srcLink: "https://github.com/kevinhurley23/Online-Find-and-Replace-Tool",
    description:
      "The moment I felt like had really become a software developer was when I found myself needing a tool to speed up a repetetive task and decided to build it myself. There are certainly many places to do find and replace operations on text, but I found myself needing to save a sequence of specific find and replace operations to perform on many different pieces of text, and I couldn't find an app or website that did what I was looking for, so I made it.",
  },
  {
    title: "Drum Machine",
    tags: ["React"],
    buildLink: "https://kevinhurley23.github.io/drum-machine/",
    srcLink: "https://github.com/kevinhurley23/drum-machine/tree/master",
    description:
      "This was one of my certification projects for freeCodeCamp. As a musician, this project really appealed to me. I created this drum machine using React. I improved on freeCodeCamp's example design in a few ways. Firstly, rather than using the sounds they provided, I created my own sounds using Native Instruments software. I also made it so that holding down a key does not retrigger the sounds, and I added text on either side of the toggle buttons to clarify their functions. Also, I think mine looks better!",
  },
  {
    title: "Javascript Calculator",
    tags: ["React"],
    buildLink: "https://kevinhurley23.github.io/javascript-calculator/",
    srcLink:
      "https://github.com/kevinhurley23/javascript-calculator/tree/master",
    description:
      "This is another certification project for freeCodeCamp, and I think I improved on their example design. My calculator has a backspace button in addition to the all clear button. The backspace button returns the last number to the display if an operator gets cleared. My calculator also doesn't allow the user to input an operator as the first character, expect for the negative sign. I created it using React.",
  },
  {
    title: "Pomodoro Clock",
    tags: ["jQuery"],
    buildLink: "https://kevinhurley23.github.io/pomodoro-clock",
    srcLink: "https://github.com/kevinhurley23/pomodoro-clock/tree/master",
    description:
      "If you aren't familiar with a Pomodoro Clock (aka 25 + 5 clock), it facilitates alternating between periods of work and periods of rest by letting you set how long you want your work session to be and how long your break session will be. My app was created with jQuery. One way I improved on freeCodeCamp's design was to make the reset button return the clock to the values the user sets for session and break lengths, rather than returning to 25 minutes and 5 minutes respectively.",
  },
];
