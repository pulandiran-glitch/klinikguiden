import fs from "node:fs";

const sourceSets = {
  prevention: [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["NHS", "Take care of your teeth and gums", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/take-care-of-your-teeth-and-gums/"],
    ["Cochrane", "Fluoride toothpastes of different concentrations for preventing tooth decay", "https://www.cochrane.org/CD007868/ORAL_fluoride-toothpastes-different-concentrations-preventing-tooth-decay-children-adolescents-and-adults"]
  ],
  gum: [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["NHS", "Gum disease", "https://www.nhs.uk/conditions/gum-disease/"],
    ["European Federation of Periodontology", "Patient resources on gum health", "https://www.efp.org/for-patients/"]
  ],
  treatment: [
    ["NHS", "Dental treatments", "https://www.nhs.uk/nhs-services/dentists/dental-treatments/"],
    ["NHS", "Tooth decay", "https://www.nhs.uk/conditions/tooth-decay/"],
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"]
  ],
  price: [
    ["NHS", "Dental treatments", "https://www.nhs.uk/nhs-services/dentists/dental-treatments/"],
    ["NICE", "Dental recall: recall interval between routine dental examinations", "https://www.nice.org.uk/guidance/cg19"],
    ["KlinikGuiden", "Forstå din tandlægeregning", "https://klinikguiden.com/regningen.html"]
  ],
  anxiety: [
    ["NHS", "Fear of the dentist", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/fear-of-the-dentist/"],
    ["NICE", "Patient experience in adult NHS services", "https://www.nice.org.uk/guidance/cg138"],
    ["KlinikGuiden", "Tandlægeangst - hvad hjælper faktisk?", "https://klinikguiden.com/tandlaegeangst.html"]
  ],
  children: [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["NHS", "Children's teeth", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/taking-care-of-childrens-teeth/"],
    ["NHS", "Take care of your teeth and gums", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/take-care-of-your-teeth-and-gums/"]
  ]
};

const guideMeta = {
  "rodbehandling": { source: "treatment", related: ["hvad-koster-en-rodbehandling", "hvad-er-en-tandkrone", "hvad-er-en-fyldning", "bedoevelse"] },
  "regningen": { source: "price", related: ["hvordan-laeser-man-et-tandlaegeoverslag", "hvad-daekker-sygesikringen-hos-tandlaegen", "hvad-koster-en-tandrensning", "hvad-koster-en-rodbehandling"] },
  "tandlaegeangst": { source: "anxiety", related: ["hvad-gor-man-ved-tandlaegeskraek", "gor-det-ondt-at-fa-lavet-et-hul", "bedoevelse", "hvad-sker-der-ved-foerste-tandlaegebesoeg"] },
  "boern": { source: "children", related: ["hvad-sker-der-ved-foerste-tandlaegebesoeg", "hvornaar-skal-boern-foerste-gang-til-tandlaege", "hvorfor-far-boern-huller-i-taenderne", "hvad-er-fluor"] },
  "besoegsfrekvens": { source: "prevention", related: ["hvor-ofte-skal-man-ga-til-tandlaege", "hvad-er-tandsten", "hvad-er-tandrensning", "hvordan-undgar-man-huller"] },
  "bedoevelse": { source: "treatment", related: ["gor-det-ondt-at-fa-lavet-et-hul", "gor-det-ondt-at-fa-en-tand-trukket-ud", "rodbehandling", "hvad-gor-man-ved-tandlaegeskraek"] },
  "hvor-ofte-skal-man-ga-til-tandlaege": { source: "prevention", related: ["hvad-er-tandsten", "hvad-er-tandrensning", "hvordan-undgar-man-huller", "hvad-er-paradentose"] },
  "hvor-ofte-skal-man-borste-taender": { source: "prevention", related: ["hvilken-tandpasta-er-bedst", "hvad-er-fluor", "er-tandtrad-nodvendigt", "hvad-er-plak"] },
  "hvilken-tandpasta-er-bedst": { source: "prevention", related: ["hvad-er-fluor", "hvor-ofte-skal-man-borste-taender", "hvordan-undgar-man-huller", "hvorfor-isner-mine-taender"] },
  "er-tandtrad-nodvendigt": { source: "prevention", related: ["hvad-er-plak", "hvad-er-gingivitis", "hvorfor-bloder-tandkodet", "hvad-er-tandsten"] },
  "hvordan-undgar-man-huller": { source: "prevention", related: ["hvad-er-caries", "hvorfor-far-man-huller", "hvad-er-fluor", "hvilken-tandpasta-er-bedst"] },
  "hvad-er-paradentose": { source: "gum", related: ["kan-paradentose-helbredes", "hvorfor-bloder-tandkodet", "hvad-er-tandsten", "hvad-er-tandrensning"] },
  "kan-paradentose-helbredes": { source: "gum", related: ["hvad-er-paradentose", "hvorfor-bloder-tandkodet", "hvad-er-tandsten", "hvad-er-tandrensning"] },
  "hvad-er-tandsten": { source: "prevention", related: ["hvad-er-plak", "hvad-er-tandrensning", "hvad-er-tandkoedsbetaendelse", "hvad-er-paradentose"] },
  "hvorfor-far-man-huller": { source: "prevention", related: ["hvad-er-caries", "hvad-er-fluor", "hvilken-tandpasta-er-bedst", "hvad-er-en-fyldning"] },
  "hvad-er-fluor": { source: "prevention", related: ["hvilken-tandpasta-er-bedst", "hvordan-undgar-man-huller", "hvorfor-far-man-huller", "hvor-ofte-skal-man-borste-taender"] },
  "hvad-koster-en-rodbehandling": { source: "price", related: ["rodbehandling", "hvad-er-en-tandkrone", "hvad-koster-en-tandkrone", "regningen"] },
  "hvad-koster-en-krone": { source: "price", related: ["hvad-koster-en-tandkrone", "hvad-er-en-tandkrone", "hvornaar-skal-man-have-en-krone", "regningen"] },
  "hvad-er-tandrensning": { source: "treatment", related: ["hvad-koster-en-tandrensning", "hvad-er-tandsten", "hvad-er-tandkoedsbetaendelse", "hvad-er-paradentose"] },
  "hvad-er-tandkoedsbetaendelse": { source: "gum", related: ["hvad-er-gingivitis", "hvorfor-bloder-tandkodet", "hvad-er-tandsten", "hvad-er-paradentose"] },
  "hvorfor-bloder-tandkodet": { source: "gum", related: ["hvad-er-gingivitis", "hvad-er-tandkoedsbetaendelse", "hvad-er-tandsten", "kan-paradentose-helbredes"] },
  "hvad-er-visdomstaender": { source: "treatment", related: ["hvornaar-skal-visdomstaender-fjernes", "hvad-maa-man-spise-efter-fjernelse-af-visdomstand", "gor-det-ondt-at-fa-en-tand-trukket-ud"] },
  "gor-det-ondt-at-fa-en-tand-trukket-ud": { source: "treatment", related: ["hvad-koster-en-tandudtraekning", "hvor-lang-tid-tager-heling-efter-tandudtraekning", "bedoevelse"] },
  "hvad-er-en-plastfyldning": { source: "treatment", related: ["hvad-er-en-fyldning", "hvor-laenge-holder-en-fyldning", "hvad-er-forskellen-pa-plast-og-porcelaen"] },
  "hvad-er-forskellen-pa-plast-og-porcelaen": { source: "treatment", related: ["hvad-er-en-plastfyldning", "hvad-er-en-tandkrone", "hvad-koster-en-tandkrone"] },
  "hvad-gor-man-ved-tandlaegeskraek": { source: "anxiety", related: ["tandlaegeangst", "bedoevelse", "gor-det-ondt-at-fa-lavet-et-hul", "hvad-sker-der-ved-foerste-tandlaegebesoeg"] }
};

function titleFor(slug) {
  const file = `${slug}.html`;
  if (!fs.existsSync(file)) return slug;
  const html = fs.readFileSync(file, "utf8");
  const h1 = html.match(/<h1>(.*?)<\/h1>/);
  return h1 ? h1[1].replace(/<[^>]+>/g, "") : slug;
}

function renderRelated(slugs) {
  return `<section class="related-guides">
      <h2>Relaterede guides</h2>
      <ul>
${slugs.filter((slug) => fs.existsSync(`${slug}.html`)).slice(0, 5).map((slug) => `        <li><a href="/${slug}.html">${titleFor(slug)}</a></li>`).join("\n")}
      </ul>
    </section>`;
}

function renderSources(source) {
  return `<section class="source-list">
      <h2>Kilder og fagligt grundlag</h2>
      <p>Guiden er skrevet som generel patientinformation og er faktatjekket mod nedenstående kilder. Den erstatter ikke undersøgelse, diagnose eller konkret rådgivning hos din egen tandlæge.</p>
      <ul>
${sourceSets[source].map(([org, title, url]) => `        <li><a href="${url}" rel="noopener" target="_blank">${org}: ${title}</a></li>`).join("\n")}
      </ul>
    </section>`;
}

function ensureCss(html) {
  if (html.includes(".source-list")) return html;
  const css = `
    .related-guides, .source-list { background: white; border: 1px solid var(--border); border-radius: 12px; margin-top: 2rem; padding: 1.2rem; }
    .related-guides ul, .source-list ul { margin-left: 1.1rem; margin-top: 0.75rem; }
    .related-guides li, .source-list li { margin-bottom: 0.45rem; }
`;
  return html.replace("</style>", `${css}  </style>`);
}

for (const [slug, meta] of Object.entries(guideMeta)) {
  const file = `${slug}.html`;
  if (!fs.existsSync(file)) continue;
  let html = ensureCss(fs.readFileSync(file, "utf8"));
  const sections = `${renderRelated(meta.related)}\n    ${renderSources(meta.source)}\n`;
  html = html.replace(/<section class="related-guides">[\s\S]*?<\/section>\s*/g, "");
  html = html.replace(/<section class="source-list">[\s\S]*?<\/section>\s*/g, "");
  if (html.includes('<div class="cta-panel">')) {
    html = html.replace('<div class="cta-panel">', `${sections}        <div class="cta-panel">`);
  } else if (html.includes('<a class="button"')) {
    html = html.replace(/    <a class="button"[\s\S]*?<\/a>/, `${sections}    $&`);
  } else {
    html = html.replace("</main>", `${sections}</main>`);
  }
  fs.writeFileSync(file, html);
}

console.log(`Repaired ${Object.keys(guideMeta).length} existing guide pages.`);
