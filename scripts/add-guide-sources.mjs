import fs from "node:fs";

const guideSources = {
  "hvor-ofte-skal-man-ga-til-tandlaege.html": [
    ["NICE", "Dental recall: recall interval between routine dental examinations", "https://www.nice.org.uk/guidance/cg19"],
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
  ],
  "hvorfor-far-man-huller.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["WHO", "Sugars and dental caries", "https://www.who.int/news/item/04-03-2015-who-calls-on-countries-to-reduce-sugars-intake-among-adults-and-children"],
  ],
  "kan-paradentose-helbredes.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["European Federation of Periodontology", "S3-level clinical practice guideline for periodontitis treatment", "https://www.efp.org/publications/projects/s3-level-clinical-practice-guideline/"]
  ],
  "hvad-koster-en-rodbehandling.html": [
    ["KlinikGuiden", "Forstå din tandlægeregning", "https://klinikguiden.com/regningen.html"]
  ],
  "er-tandtrad-nodvendigt.html": [
    ["Cochrane", "Home use of interdental cleaning devices, in addition to toothbrushing", "https://www.cochrane.org/CD012018/ORAL_home-use-interdental-cleaning-devices-addition-toothbrushing-preventing-and-controlling-periodontal"],
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"]
  ],
  "hvorfor-bloder-tandkodet.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["European Federation of Periodontology", "Patient resources on gum health", "https://www.efp.org/for-patients/"]
  ],
  "hvad-er-tandsten.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["Cochrane", "Home use of interdental cleaning devices, in addition to toothbrushing", "https://www.cochrane.org/CD012018/ORAL_home-use-interdental-cleaning-devices-addition-toothbrushing-preventing-and-controlling-periodontal"]
  ],
  "hvor-ofte-skal-man-borste-taender.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"]
  ],
  "hvilken-tandpasta-er-bedst.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"]
  ],
  "hvad-er-fluor.html": [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
  ]
};

const sourceCss = `
    .source-list { background: white; border: 1px solid var(--border); border-radius: 12px; margin-top: 2rem; padding: 1.2rem; }
    .source-list h2 { margin-top: 0; }
    .source-list p { font-size: 0.86rem; margin-bottom: 0.8rem; }
    .source-list ul { margin-left: 1.1rem; }
    .source-list li { margin-bottom: 0.45rem; }
`;

function renderSources(sources) {
  return `
        <section class="source-list">
          <h2>Kilder og fagligt grundlag</h2>
          <p>Guiden er skrevet som generel patientinformation og er faktatjekket mod nedenstående kilder. Den erstatter ikke en konkret vurdering hos din egen tandlæge.</p>
          <ul>
${sources.map(([org, title, url]) => `            <li><a href="${url}" rel="noopener" target="_blank">${org}: ${title}</a></li>`).join("\n")}
          </ul>
        </section>`;
}

for (const [file, sources] of Object.entries(guideSources)) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes(".source-list")) {
    html = html.replace("    footer { border-top: 1px solid var(--border); margin-top: 4rem; padding-top: 1.5rem; }", `${sourceCss}    footer { border-top: 1px solid var(--border); margin-top: 4rem; padding-top: 1.5rem; }`);
  }

  const section = renderSources(sources);
  if (html.includes('<section class="source-list">')) {
    html = html.replace(/        <section class="source-list">[\s\S]*?        <\/section>\n        <div class="cta-panel">/, `${section}\n        <div class="cta-panel">`);
  } else {
    html = html.replace('        <div class="cta-panel">', `${section}\n        <div class="cta-panel">`);
  }

  fs.writeFileSync(file, html);
}

console.log(`Updated ${Object.keys(guideSources).length} guides with source sections.`);
