# Dhanush S — Data × Intelligence Portfolio

A creative, responsive personal portfolio built with **HTML, CSS and vanilla JavaScript**. It needs no framework, package installation or build step, so it can be deployed directly as a static site on Vercel.

## Design direction

- Dark editorial interface with a restrained lime, blue and violet accent palette.
- Oversized typographic hero, profile-card composition, floating skill chips and scrolling skill marquee.
- Python-style profile panel with a working copy-to-clipboard interaction.
- Project cards with image previews, live-app links and GitHub repositories where supplied.
- Custom RAG workflow diagram, categorized tech arsenal, learning roadmap and internship timeline.
- Certificate gallery with a full-size preview modal.
- Responsive mobile navigation, keyboard focus styles, reduced-motion support and scroll progress indicator.
- Content remains visible if JavaScript fails; animations are progressively enabled only when supported.

## Folder structure

```text
dhanush-premium-portfolio/
├── index.html
├── README.md
├── vercel.json
├── css/style.css
├── js/main.js
└── assets/
    ├── favicon.svg
    ├── dhanush-profile.png
    ├── resume.pdf
    ├── projects/
    │   ├── agri-predict-preview.png
    │   └── ai-health-chatbot-preview.png
    └── certificates/
        ├── be10x-ai-tools.jpg
        ├── cit-orange-data-analytics.jpg
        ├── gateway-internship.jpg
        ├── ibm-ai-fundamentals.jpg
        └── infosys-data-science-python.jpg
```

## Run locally on Windows

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open `index.html` directly, or use the Live Server extension.
4. Keep `assets`, `css` and `js` next to `index.html`; the site uses relative paths.

## Deploy to Vercel

1. Push the **contents** of this folder to the GitHub repository connected to Vercel.
2. In Vercel, import the repository or trigger a new deployment.
3. Set the Root Directory to the folder containing `index.html`.
4. Select the static/Other framework preset and leave build and install commands empty.
5. Deploy, then hard-refresh the live page with `Ctrl + F5`.

## Project links

- AgriPredict: https://weatheragripredict.streamlit.app/
- AI Health Chatbot: https://disawachatbot.streamlit.app/
- GitHub: https://github.com/dhanush0823-git
- LinkedIn: https://www.linkedin.com/in/dhanush-s-784190358/

## Content note

Content and metrics were based on the supplied resume and GitHub README. The resume lists graduation in 2026 and CGPA 8.05. Where a public project repository or deployment URL was not supplied, the card is presented as a project summary rather than inventing a link. Review dates and contact information before publishing.
