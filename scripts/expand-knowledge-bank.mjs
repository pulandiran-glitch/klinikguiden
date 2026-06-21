import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

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
  emergency: [
    ["NHS", "Toothache", "https://www.nhs.uk/conditions/toothache/"],
    ["NHS", "Broken or knocked-out tooth", "https://www.nhs.uk/conditions/broken-or-knocked-out-tooth/"],
    ["NHS", "Dental abscess", "https://www.nhs.uk/conditions/dental-abscess/"]
  ],
  price: [
    ["NHS", "Dental treatments", "https://www.nhs.uk/nhs-services/dentists/dental-treatments/"],
    ["NICE", "Dental recall: recall interval between routine dental examinations", "https://www.nice.org.uk/guidance/cg19"],
    ["KlinikGuiden", "Forstå din tandlægeregning", "https://klinikguiden.com/regningen.html"]
  ],
  children: [
    ["WHO", "Oral health fact sheet", "https://www.who.int/news-room/fact-sheets/detail/oral-health"],
    ["NHS", "Children's teeth", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/taking-care-of-childrens-teeth/"],
    ["NHS", "Take care of your teeth and gums", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/take-care-of-your-teeth-and-gums/"]
  ],
  anxiety: [
    ["NHS", "Fear of the dentist", "https://www.nhs.uk/live-well/healthy-teeth-and-gums/fear-of-the-dentist/"],
    ["NICE", "Patient experience in adult NHS services", "https://www.nice.org.uk/guidance/cg138"],
    ["KlinikGuiden", "Tandlægeangst - hvad hjælper faktisk?", "https://klinikguiden.com/tandlaegeangst.html"]
  ]
};

const categories = {
  forebyggelse: "Forebyggelse",
  behandlinger: "Tandbehandlinger",
  priser: "Priser og regninger",
  symptomer: "Symptomer",
  tandkod: "Tandkød",
  boern: "Børn og tænder",
  akut: "Akutte tandproblemer",
  tryghed: "Tandlægeskræk"
};

const existingGuides = [
  ["hvor-ofte-skal-man-ga-til-tandlaege", "Hvor ofte skal man gå til tandlæge?", "forebyggelse"],
  ["hvor-ofte-skal-man-borste-taender", "Hvor ofte skal man børste tænder?", "forebyggelse"],
  ["hvilken-tandpasta-er-bedst", "Hvilken tandpasta er bedst?", "forebyggelse"],
  ["er-tandtrad-nodvendigt", "Er tandtråd nødvendigt?", "forebyggelse"],
  ["hvordan-undgar-man-huller", "Hvordan undgår man huller?", "forebyggelse"],
  ["hvad-er-paradentose", "Hvad er paradentose?", "tandkod"],
  ["kan-paradentose-helbredes", "Kan paradentose helbredes?", "tandkod"],
  ["hvad-er-tandsten", "Hvad er tandsten?", "forebyggelse"],
  ["hvorfor-far-man-huller", "Hvorfor får man huller i tænderne?", "forebyggelse"],
  ["hvad-er-fluor", "Hvad gør fluor?", "forebyggelse"],
  ["hvad-koster-en-rodbehandling", "Hvad koster en rodbehandling?", "priser"],
  ["hvad-koster-en-krone", "Hvad koster en krone?", "priser"],
  ["hvad-er-tandrensning", "Hvad er en tandrensning?", "behandlinger"],
  ["hvad-er-tandkoedsbetaendelse", "Hvad er tandkødsbetændelse?", "tandkod"],
  ["hvorfor-bloder-tandkodet", "Hvorfor bløder mit tandkød?", "tandkod"],
  ["hvad-er-visdomstaender", "Hvad er visdomstænder?", "behandlinger"],
  ["gor-det-ondt-at-fa-en-tand-trukket-ud", "Gør det ondt at få en tand trukket ud?", "behandlinger"],
  ["hvad-er-en-plastfyldning", "Hvad er en plastfyldning?", "behandlinger"],
  ["hvad-er-forskellen-pa-plast-og-porcelaen", "Hvad er forskellen på plast og porcelæn?", "behandlinger"],
  ["hvad-gor-man-ved-tandlaegeskraek", "Hvad gør man ved tandlægeskræk?", "tryghed"],
  ["rodbehandling", "Hvad sker der egentlig ved en rodbehandling?", "behandlinger"],
  ["regningen", "Forstå din tandlægeregning", "priser"],
  ["tandlaegeangst", "Tandlægeangst - hvad hjælper faktisk?", "tryghed"],
  ["boern", "Børns første tandlægebesøg", "boern"],
  ["besoegsfrekvens", "Hvornår skal du egentlig til tandlægen?", "forebyggelse"],
  ["bedoevelse", "Bedøvelse - hvad sker der i kroppen?", "behandlinger"]
].map(([slug, title, category]) => ({ slug, title, category }));

const newGuides = [
  {
    slug: "hvad-er-caries",
    title: "Hvad er caries?",
    category: "forebyggelse",
    sourceSet: "prevention",
    description: "Forstå caries, hvorfor det opstår, og hvordan tidlige tegn på huller kan stoppes, før skaden bliver større.",
    intro: "Caries er den faglige betegnelse for huller i tænderne. Det starter som en ubalance mellem syreangreb og tandens mulighed for at reparere sig selv.",
    sections: [
      ["Caries forklaret enkelt", "Caries opstår, når bakterier i plak bruger sukker og andre kulhydrater til at danne syre. Syren trækker mineraler ud af emaljen. Hvis tanden ikke når at remineralisere, kan der efterhånden opstå et hul."],
      ["Tidlige tegn", "Et tidligt cariesangreb kan vise sig som en mat, hvidlig plet i emaljen. Senere kan området blive brunt, følsomt eller udvikle et egentligt hul. Man kan godt have caries uden smerter."],
      ["Hvorfor nogle får flere huller", "Risikoen påvirkes af kost, spyt, mundtørhed, fluor, tandbørstning, tandstilling og gamle fyldninger. Det er derfor ikke kun et spørgsmål om at spise slik."],
      ["Hvad kan stoppe udviklingen?", "Tidlige forandringer kan nogle gange bremses med fluor, bedre rengøring og færre syreangreb. Et egentligt hul kræver ofte behandling hos tandlægen."]
    ],
    related: ["hvorfor-far-man-huller", "hvad-er-fluor", "hvordan-undgar-man-huller", "hvad-er-en-plastfyldning"]
  },
  {
    slug: "hvad-er-en-fyldning",
    title: "Hvad er en fyldning?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Læs hvad en tandfyldning er, hvornår den bruges, og hvad tandlægen typisk gør under behandlingen.",
    intro: "En fyldning reparerer en tand, der har mistet tandsubstans på grund af hul, brud eller slid.",
    sections: [
      ["Hvornår bruger man en fyldning?", "Fyldninger bruges især ved huller, mindre knæk, slidte områder eller udskiftning af gamle utætte fyldninger. Målet er at lukke tanden tæt og genskabe form og funktion."],
      ["Sådan foregår det", "Tandlægen fjerner svækket tandvæv, renser området og bygger tanden op med et materiale, ofte plast. Til sidst tilpasses fyldningen, så biddet føles normalt."],
      ["Fagordet 'flade'", "Når tandlægen taler om en en-, to- eller flerfladet fyldning, handler det om hvor mange sider af tanden fyldningen dækker. Flere flader betyder ofte mere arbejde."],
      ["Efter behandlingen", "Let ømhed eller isninger kan forekomme kortvarigt. Hvis tanden føles for høj, eller smerterne ikke falder til ro, bør klinikken kontaktes."]
    ],
    related: ["hvad-er-en-plastfyldning", "hvor-laenge-holder-en-fyldning", "gor-det-ondt-at-fa-lavet-et-hul", "hvad-er-caries"]
  },
  {
    slug: "hvor-laenge-holder-en-fyldning",
    title: "Hvor længe holder en fyldning?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Forstå hvad der påvirker holdbarheden af en fyldning, og hvornår den bør kontrolleres eller skiftes.",
    intro: "En fyldnings levetid afhænger af størrelse, placering, bid, rengøring og materialevalg.",
    sections: [
      ["Der findes ikke én fast levetid", "Små fyldninger kan holde længe, mens store fyldninger på kindtænder belastes mere. En fyldning er ikke en garanti for, at tanden aldrig får problemer igen."],
      ["Hvad slider på fyldningen?", "Tandskæren, hårdt bid, mange flader, dårlig mundhygiejne og hyppige syreangreb kan forkorte levetiden. Fyldninger kan også blive utætte i kanten."],
      ["Tegn på problemer", "Mad der sætter sig fast, ru kanter, misfarvning langs fyldningen, isninger eller smerter ved tygning bør vurderes."],
      ["Sådan passer du på den", "Hold kanten ren, brug fluor, rens mellem tænderne og få fyldningen kontrolleret ved rutinebesøg."]
    ],
    related: ["hvad-er-en-fyldning", "hvad-er-en-plastfyldning", "hvad-er-forskellen-pa-plast-og-porcelaen", "hvad-koster-en-krone"]
  },
  {
    slug: "gor-det-ondt-at-fa-lavet-et-hul",
    title: "Gør det ondt at få lavet et hul?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Rolig forklaring af bedøvelse, boring og hvad du kan mærke, når tandlægen laver et hul.",
    intro: "Du bør ikke mærke skarp smerte, når et hul laves med effektiv bedøvelse, men du kan mærke tryk, vibration og vand.",
    sections: [
      ["Bedøvelsen er pointen", "Hvis hullet er dybt eller tanden følsom, kan tandlægen lægge bedøvelse. Sig til, hvis du mærker smerte, så der kan gives mere tid eller ekstra bedøvelse."],
      ["Hvad mærker man?", "Mange mærker vibration, lyd, vand og tryk. Det kan føles mærkeligt, men det er ikke det samme som smerte."],
      ["Hvis du er nervøs", "Aftal et stoptegn på forhånd. Du kan også bede tandlægen forklare hvert trin eller omvendt sige, at du helst vil høre så lidt som muligt."],
      ["Efter fyldningen", "Tanden kan være øm eller reagere på kulde i en kort periode. Ved vedvarende smerte skal klinikken kontaktes."]
    ],
    related: ["bedoevelse", "hvad-er-en-fyldning", "hvad-gor-man-ved-tandlaegeskraek", "hvad-er-caries"]
  },
  {
    slug: "kan-et-hul-i-tanden-ga-vaek-af-sig-selv",
    title: "Kan et hul i tanden gå væk af sig selv?",
    category: "forebyggelse",
    sourceSet: "prevention",
    description: "Læs hvornår begyndende caries kan standses, og hvornår et hul i tanden kræver behandling.",
    intro: "En helt tidlig emaljeforandring kan nogle gange standses, men et egentligt hul lukker ikke bare sig selv.",
    sections: [
      ["Tidlig caries kan bremses", "Hvis overfladen stadig er intakt, kan fluor, bedre rengøring og færre sukker-/syreangreb hjælpe tanden med at remineralisere."],
      ["Et rigtigt hul kræver ofte behandling", "Når overfladen er brudt, kan bakterier og madrester sætte sig fast. Så vil tandlægen ofte anbefale en fyldning."],
      ["Hvorfor det ikke altid gør ondt", "Caries kan udvikle sig uden smerter, især i starten. Smerte kommer ofte senere, når skaden nærmer sig nerven."],
      ["Hvad du bør gøre", "Få området vurderet. Jo tidligere det opdages, jo større er chancen for en mindre behandling eller ingen boring."]
    ],
    related: ["hvad-er-caries", "hvorfor-far-man-huller", "hvad-er-fluor", "hvad-er-en-fyldning"]
  },
  {
    slug: "hvad-er-gingivitis",
    title: "Hvad er gingivitis?",
    category: "tandkod",
    sourceSet: "gum",
    description: "Forstå gingivitis, forskellen på tandkødsbetændelse og paradentose, og hvad du kan gøre tidligt.",
    intro: "Gingivitis betyder tandkødsbetændelse. Det er en betændelsestilstand i tandkødet, som ofte kan vendes med bedre rengøring og tandrensning.",
    sections: [
      ["Gingivitis på almindeligt dansk", "Tandkødet reagerer på plak langs tandkødsranden. Det kan blive rødt, hævet og bløde, når du børster eller renser mellem tænderne."],
      ["Forskel på gingivitis og paradentose", "Ved gingivitis er tandens støttevæv ikke nødvendigvis nedbrudt. Ved paradentose er der tab af støtte omkring tanden."],
      ["Hvad hjælper?", "Grundig rengøring langs tandkødsranden, mellemrumsrens og professionel fjernelse af tandsten kan hjælpe tandkødet tilbage mod ro."],
      ["Hvornår skal du reagere?", "Ved vedvarende blødning, hævelse, dårlig smag, pus eller løse tænder bør du bestille tid."]
    ],
    related: ["hvad-er-tandkoedsbetaendelse", "hvorfor-bloder-tandkodet", "hvad-er-paradentose", "hvad-er-tandsten"]
  },
  {
    slug: "hvorfor-traekker-tandkodet-sig-tilbage",
    title: "Hvorfor trækker tandkødet sig tilbage?",
    category: "tandkod",
    sourceSet: "gum",
    description: "Læs om årsager til tilbagetrukket tandkød, isninger og hvornår du bør få tandkødet vurderet.",
    intro: "Tilbagetrukket tandkød kan skyldes børsteteknik, tandstilling, inflammation, paradentose eller slid over tid.",
    sections: [
      ["Hvad betyder det?", "Når tandkødet trækker sig tilbage, bliver en del af roden mere synlig. Det kan få tanden til at se længere ud og give isninger."],
      ["Almindelige årsager", "Hård tandbørstning, en hård børste, tandkødsbetændelse, paradentose, piercinger, tandstilling og alder kan spille ind."],
      ["Kan det vokse tilbage?", "Tandkød kommer sjældent bare tilbage af sig selv. Behandlingen handler ofte om at stoppe udviklingen og beskytte rodoverfladen."],
      ["Hvornår skal du spørge tandlægen?", "Hvis tilbagetrækningen udvikler sig, gør ondt, giver isninger eller sidder ved flere tænder, bør det vurderes."]
    ],
    related: ["hvorfor-isner-mine-taender", "hvad-er-paradentose", "hvorfor-bloder-tandkodet", "hvad-er-gingivitis"]
  },
  {
    slug: "hvad-koster-en-tandrensning",
    title: "Hvad koster en tandrensning?",
    category: "priser",
    sourceSet: "price",
    description: "Få overblik over prisen på tandrensning, hvad der kan påvirke regningen, og hvad du bør spørge klinikken om.",
    intro: "Prisen afhænger af ydelse, behov, tandsten, tandkødets tilstand og om der laves andet ved samme besøg.",
    sections: [
      ["Hvad betaler du for?", "En tandrensning handler typisk om at fjerne tandsten, plak og belægninger. Ved mere tandkødsbehandling kan andre ydelser indgå."],
      ["Hvorfor kan prisen variere?", "Mængden af tandsten, behov for parodontal behandling, røntgen, undersøgelse og tilskud kan påvirke den samlede regning."],
      ["Spørg om ydelseskoder", "Bed klinikken forklare, hvilke poster der er tandrensning, og hvilke der er undersøgelse, røntgen eller anden behandling."],
      ["Brug beregneren som støtte", "KlinikGuidens beregner er vejledende. Den erstatter ikke klinikkens prisoverslag."]
    ],
    related: ["hvad-er-tandrensning", "hvad-er-tandsten", "regningen", "hvad-daekker-sygesikringen-hos-tandlaegen"]
  },
  {
    slug: "hvad-koster-en-tandkrone",
    title: "Hvad koster en tandkrone?",
    category: "priser",
    sourceSet: "price",
    description: "Forstå hvad der påvirker prisen på en tandkrone, og hvilke spørgsmål du bør stille før behandling.",
    intro: "En tandkrone er en større behandling, og prisen afhænger af materiale, opbygning, teknik og tandens tilstand.",
    sections: [
      ["Hvorfor er kroner dyre?", "En krone kræver præparation, scanning eller aftryk, materialer, tilpasning og ofte laboratorie- eller digital fremstilling."],
      ["Materiale betyder noget", "Keramiske materialer, zirkonia og andre løsninger kan have forskellig pris, styrke og æstetik."],
      ["Hvad kan komme oveni?", "Opbygning, rodbehandling, røntgen eller midlertidig krone kan påvirke den samlede pris."],
      ["Bed om skriftligt overslag", "Spørg hvad prisen inkluderer, hvilke alternativer der findes, og hvad prognosen er for tanden."]
    ],
    related: ["hvad-er-en-tandkrone", "hvornaar-skal-man-have-en-krone", "hvad-koster-en-rodbehandling", "hvad-er-forskellen-pa-plast-og-porcelaen"]
  },
  {
    slug: "hvad-er-en-tandkrone",
    title: "Hvad er en tandkrone?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Læs hvad en tandkrone er, hvornår den bruges, og hvordan den adskiller sig fra en almindelig fyldning.",
    intro: "En tandkrone er en beskyttende hætte, der dækker tanden, når den er svækket eller mangler meget tandsubstans.",
    sections: [
      ["Hvad gør en krone?", "Kronen genskaber form, tyggefunktion og beskyttelse. Den bruges ofte, når en fyldning ikke længere vurderes stærk nok."],
      ["Hvornår anbefales den?", "En krone kan anbefales efter stor fyldning, brud, rodbehandling eller kraftigt slid."],
      ["Hvordan laves den?", "Tanden formes, scannes eller aftrykkes, og kronen fremstilles, så den passer til tand og bid."],
      ["Krone er ikke en ny tand", "Tanden under kronen skal stadig holdes ren, især ved kanten mod tandkødet."]
    ],
    related: ["hvornaar-skal-man-have-en-krone", "hvad-koster-en-tandkrone", "hvad-er-en-fyldning", "hvad-er-forskellen-pa-plast-og-porcelaen"]
  },
  {
    slug: "hvornaar-skal-man-have-en-krone",
    title: "Hvornår skal man have en krone?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Forstå hvornår en tandkrone kan være nødvendig, og hvilke alternativer du bør spørge tandlægen om.",
    intro: "En krone overvejes typisk, når tanden er for svækket til, at en almindelig fyldning er en god langtidsholdbar løsning.",
    sections: [
      ["Typiske situationer", "Store fyldninger, rodbehandlede kindtænder, revner, knækkede tænder og kraftigt slid kan gøre en krone relevant."],
      ["Alternativer", "Nogle tænder kan klare sig med plast, indlæg eller overvågning. Andre har dårlig prognose og kan ende med at skulle fjernes."],
      ["Spørg om prognose", "Spørg tandlægen: Hvad sker der, hvis jeg venter? Hvad er risikoen ved fyldning i stedet? Hvor længe forventes løsningen at holde?"],
      ["Økonomi og timing", "En krone er en investering. Bed om skriftligt overslag og få forklaret, om behandlingen haster."]
    ],
    related: ["hvad-er-en-tandkrone", "hvad-koster-en-tandkrone", "hvad-koster-en-rodbehandling", "hvor-laenge-holder-en-fyldning"]
  },
  {
    slug: "hvad-er-et-tandimplantat",
    title: "Hvad er et tandimplantat?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Forstå hvad et tandimplantat er, hvornår det bruges, og hvilke forhold der påvirker behandlingen.",
    intro: "Et implantat er en kunstig rod, som sættes i kæbeknoglen og kan bære en krone, bro eller protese.",
    sections: [
      ["Hvad består det af?", "Et implantat består typisk af en skrue i knoglen, et mellemstykke og en krone. Det fungerer som erstatning for en manglende tandrod."],
      ["Hvornår bruges implantater?", "Implantater kan være relevante ved manglende tænder, men kræver nok knogle, sundt tandkød og god mundhygiejne."],
      ["Ikke alle er kandidater", "Rygning, ukontrolleret sygdom, aktiv paradentose og manglende knogle kan påvirke mulighed og prognose."],
      ["Spørg før du vælger", "Spørg om alternativer som bro eller protese, forventet levetid, vedligehold og samlet pris."]
    ],
    related: ["hvad-koster-et-tandimplantat", "hvornår-skal-en-tand-fjernes", "hvad-er-paradentose", "hvad-koster-en-tandkrone"]
  },
  {
    slug: "hvad-koster-et-tandimplantat",
    title: "Hvad koster et tandimplantat?",
    category: "priser",
    sourceSet: "price",
    description: "Få overblik over hvorfor implantater varierer i pris, og hvilke dele du skal have med i overslaget.",
    intro: "Prisen på et implantat afhænger af kirurgi, komponenter, krone, knogleforhold og eventuelle forbehandlinger.",
    sections: [
      ["Se på samlet pris", "Spørg om prisen inkluderer implantatskrue, mellemstykke, krone, scanning, røntgen, kontroller og eventuel knogleopbygning."],
      ["Hvorfor varierer prisen?", "Materialer, kirurgisk kompleksitet, knoglemængde, specialistniveau og laboratoriearbejde kan ændre prisen."],
      ["Vedligehold koster også", "Implantater skal kontrolleres og renses. Betændelse omkring implantater kan opstå, hvis rengøring og kontrol svigter."],
      ["Alternativer", "Bro eller protese kan i nogle tilfælde være billigere eller mere relevante. Det afhænger af nabotænder, knogle og ønsker."]
    ],
    related: ["hvad-er-et-tandimplantat", "hvad-koster-en-tandkrone", "hvad-daekker-sygesikringen-hos-tandlaegen", "regningen"]
  },
  {
    slug: "hvad-koster-en-tandudtraekning",
    title: "Hvad koster en tandudtrækning?",
    category: "priser",
    sourceSet: "price",
    description: "Forstå hvad prisen på en tandudtrækning afhænger af, og hvornår det kan blive kirurgisk eller akut.",
    intro: "Prisen afhænger især af, om tanden kan fjernes enkelt, eller om der kræves kirurgisk fjernelse.",
    sections: [
      ["Enkel eller kirurgisk fjernelse", "En løs eller enkel tand kan ofte fjernes billigere end en visdomstand eller tand med komplicerede rødder."],
      ["Hvad kan komme oveni?", "Røntgen, akut tillæg, kontrol, bedøvelse og efterbehandling kan indgå som separate poster."],
      ["Spørg om næste skridt", "Efter fjernelse kan der være behov for erstatning, fx bro, protese eller implantat. Det er ikke altid en del af prisen."],
      ["Hvornår haster det?", "Stærke smerter, hævelse, feber eller synkebesvær bør vurderes hurtigt."]
    ],
    related: ["gor-det-ondt-at-fa-en-tand-trukket-ud", "hvornaar-skal-en-tand-fjernes", "hvad-er-visdomstaender", "hvad-koster-et-tandimplantat"]
  },
  {
    slug: "hvornaar-skal-en-tand-fjernes",
    title: "Hvornår skal en tand fjernes?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Læs hvornår en tand kan være så skadet, at fjernelse bliver en mulighed, og hvilke alternativer der findes.",
    intro: "En tand fjernes typisk først, når den ikke kan bevares fornuftigt, eller når risikoen ved at beholde den er for høj.",
    sections: [
      ["Typiske grunde", "Dybe revner, svær infektion, meget lidt tandsubstans, fremskreden paradentose eller visdomstænder uden plads kan føre til fjernelse."],
      ["Bevaring først", "Tandlægen vurderer ofte alternativer som fyldning, rodbehandling, krone eller paradentosebehandling, før tanden opgives."],
      ["Hvad sker der bagefter?", "Efter fjernelse skal området hele. Senere kan der tales om erstatning, hvis tanden har betydning for tygning, smil eller nabotænder."],
      ["Spørgsmål du bør stille", "Spørg hvorfor tanden ikke kan reddes, hvilke alternativer der findes, og hvad næste plan er."]
    ],
    related: ["hvad-koster-en-tandudtraekning", "hvad-er-et-tandimplantat", "hvad-koster-en-rodbehandling", "kan-paradentose-helbredes"]
  },
  {
    slug: "hvornaar-skal-visdomstaender-fjernes",
    title: "Hvornår skal visdomstænder fjernes?",
    category: "behandlinger",
    sourceSet: "treatment",
    description: "Forstå hvornår visdomstænder bør fjernes, og hvornår de kan observeres i stedet.",
    intro: "Visdomstænder fjernes ikke automatisk. De vurderes ud fra plads, symptomer, retning, rengøring og risiko for nabotanden.",
    sections: [
      ["Når der ikke er plads", "Delvist frembrudte visdomstænder kan samle bakterier under tandkødet og give gentagne betændelser."],
      ["Når de kan blive", "Hvis tanden er fuldt frembrudt, sund, i funktion og kan holdes ren, kan den ofte blive siddende."],
      ["Røntgen er vigtigt", "Røntgen kan vise rødder, nerveforløb og om tanden presser på nabotanden."],
      ["Akutte tegn", "Hævelse, feber, synkebesvær eller problemer med at åbne munden skal vurderes hurtigt."]
    ],
    related: ["hvad-er-visdomstaender", "hvad-maa-man-spise-efter-fjernelse-af-visdomstand", "hvor-lang-tid-tager-heling-efter-tandudtraekning", "gor-det-ondt-at-fa-en-tand-trukket-ud"]
  },
  {
    slug: "hvad-maa-man-spise-efter-fjernelse-af-visdomstand",
    title: "Hvad må man spise efter fjernelse af visdomstand?",
    category: "akut",
    sourceSet: "treatment",
    description: "Få rolige råd om mad, drikke og hvad du bør undgå efter fjernelse af en visdomstand.",
    intro: "Efter fjernelse af visdomstand skal såret have ro. Vælg blød, kølig mad i starten og følg altid klinikkens instruktioner.",
    sections: [
      ["De første timer", "Undgå at spise, mens bedøvelsen er stærk, så du ikke bider dig i kind eller tunge. Drik forsigtigt."],
      ["Gode valg", "Yoghurt, suppe der ikke er for varm, kartoffelmos, blød pasta og smoothies uden sugerør kan være lettere i starten."],
      ["Undgå dette", "Undgå rygning, alkohol, meget varm mad, hårde kerner, chips og sugerør, især i den første periode, hvis klinikken har anbefalet det."],
      ["Hvornår skal du ringe?", "Tiltagende smerter efter nogle dage, dårlig smag, feber eller kraftig blødning bør vurderes."]
    ],
    related: ["hvornaar-skal-visdomstaender-fjernes", "hvor-lang-tid-tager-heling-efter-tandudtraekning", "hvad-er-visdomstaender", "gor-det-ondt-at-fa-en-tand-trukket-ud"]
  },
  {
    slug: "hvor-lang-tid-tager-heling-efter-tandudtraekning",
    title: "Hvor lang tid tager heling efter tandudtrækning?",
    category: "akut",
    sourceSet: "treatment",
    description: "Forstå den normale heling efter tandudtrækning, og hvilke tegn der bør få dig til at kontakte klinikken.",
    intro: "Heling varierer, men ømhed og let hævelse er almindeligt i starten. Det vigtigste er, at symptomerne gradvist bliver bedre.",
    sections: [
      ["De første dage", "Blodkoaglet i hullet er vigtigt for helingen. Derfor skal området have ro, og du skal følge klinikkens råd om skylning, mad og rygning."],
      ["Hvad er normalt?", "Let sivblødning, ømhed og hævelse kan være normalt. Smerten bør typisk ikke blive markant værre efter de første dage."],
      ["Tegn på problemer", "Tiltagende smerter, dårlig smag, feber, pus, kraftig blødning eller hævelse der bliver værre bør vurderes."],
      ["Hvornår kan man tygge normalt?", "Det afhænger af tand, sår og om fjernelsen var kirurgisk. Start forsigtigt og brug den modsatte side i begyndelsen."]
    ],
    related: ["hvad-koster-en-tandudtraekning", "hvad-maa-man-spise-efter-fjernelse-af-visdomstand", "gor-det-ondt-at-fa-en-tand-trukket-ud", "hvornaar-skal-en-tand-fjernes"]
  },
  {
    slug: "hvad-sker-der-ved-foerste-tandlaegebesoeg",
    title: "Hvad sker der ved første tandlægebesøg?",
    category: "boern",
    sourceSet: "children",
    description: "Forstå hvad der typisk sker ved barnets første tandlægebesøg, og hvordan du kan gøre det trygt.",
    intro: "Første tandlægebesøg handler ofte mere om tryghed, vaner og tidlig forebyggelse end om behandling.",
    sections: [
      ["Målet med første besøg", "Barnet lærer klinikken at kende, og tandplejen ser på tænder, tandfrembrud, børstning, kost og eventuelle vaner som sut."],
      ["Sådan forbereder du barnet", "Tal neutralt og enkelt. Undgå ord som 'det gør ikke ondt', hvis barnet ikke har spurgt, fordi det kan skabe fokus på smerte."],
      ["Forældres rolle", "Du kan hjælpe ved at være rolig, lade personalet forklare og ikke love præcis, hvad der skal ske, hvis du ikke ved det."],
      ["Hvis barnet er bange", "Små skridt er okay. Nogle besøg handler bare om at sidde i stolen og kigge."]
    ],
    related: ["boern", "hvorfor-far-boern-huller-i-taenderne", "hvornaar-skal-boern-foerste-gang-til-tandlaege", "hvad-gor-man-ved-tandlaegeskraek"]
  },
  {
    slug: "hvorfor-gor-mine-taender-ondt",
    title: "Hvorfor gør mine tænder ondt?",
    category: "symptomer",
    sourceSet: "emergency",
    description: "Læs om almindelige årsager til tandpine og hvornår smerter i tænderne bør vurderes akut.",
    intro: "Tandsmerter kan komme fra hul, revne, betændelse, tandkød, bidbelastning eller isninger. Årsagen kræver ofte undersøgelse.",
    sections: [
      ["Smerte er et signal", "Smerte fortæller, at noget bør vurderes, men den fortæller ikke altid præcis hvad der er galt. Samme symptom kan have flere årsager."],
      ["Typiske årsager", "Huller, dybe fyldninger, revner, tandbyld, betændt tandkød, visdomstænder eller tandskæren kan give smerter."],
      ["Hvornår er det akut?", "Hævelse, feber, synkebesvær, traume, stærke konstante smerter eller påvirket almentilstand kræver hurtig kontakt til tandlæge eller relevant akut hjælp."],
      ["Hvad kan du gøre imens?", "Hold området rent, undgå at tygge hårdt på tanden, og følg almindelige råd om smertestillende, hvis du tåler det. Få årsagen undersøgt."]
    ],
    related: ["hvornar-er-tandpine-akut", "hvorfor-isner-mine-taender", "hvad-gor-man-ved-en-knaekket-tand", "hvorfor-far-man-huller"]
  },
  {
    slug: "hvorfor-isner-mine-taender",
    title: "Hvorfor isner mine tænder?",
    category: "symptomer",
    sourceSet: "treatment",
    description: "Forstå isninger i tænderne, mulige årsager og hvornår du bør få symptomet undersøgt.",
    intro: "Isninger kan skyldes blottede tandhalse, slid, syreskader, revner, huller eller reaktion efter behandling.",
    sections: [
      ["Hvordan føles isninger?", "Det er ofte en kort, skarp reaktion på kulde, sødt, surt eller tandbørstning. Det bør aftage hurtigt igen."],
      ["Almindelige årsager", "Tilbagetrukket tandkød, hård børstning, syre, tandskæren, revner og huller kan give isninger."],
      ["Hvornår skal du reagere?", "Hvis isningen er ny, bliver værre, sidder i én bestemt tand eller varer længe efter kulde, bør tanden vurderes."],
      ["Hvad kan hjælpe?", "Skånsom børstning, fluortandpasta og tandpasta mod isninger kan hjælpe nogle. Årsagen skal dog findes, hvis symptomet fortsætter."]
    ],
    related: ["hvorfor-traekker-tandkodet-sig-tilbage", "hvilken-tandpasta-er-bedst", "hvad-er-fluor", "hvorfor-gor-mine-taender-ondt"]
  },
  {
    slug: "hvad-gor-man-ved-en-knaekket-tand",
    title: "Hvad gør man ved en knækket tand?",
    category: "akut",
    sourceSet: "emergency",
    description: "Få overblik over hvad du bør gøre ved en knækket tand, og hvornår det kræver akut tandlægehjælp.",
    intro: "En knækket tand bør vurderes, især hvis der er smerter, skarpe kanter, blødning eller mistanke om skade på nerven.",
    sections: [
      ["Gem eventuelt tandstykket", "Hvis du har et stykke af tanden, kan du gemme det og tage det med. Det kan ikke altid bruges, men det kan hjælpe vurderingen."],
      ["Undgå at belaste tanden", "Tyg ikke hårdt på tanden, og pas på skarpe kanter. Kontakt klinikken for råd om tid."],
      ["Hvornår haster det?", "Stærke smerter, blødning, traume, løs tand eller synlig nerve kræver hurtig vurdering."],
      ["Mulige behandlinger", "Afhængigt af bruddets størrelse kan løsningen være polering, plastfyldning, krone, rodbehandling eller fjernelse."]
    ],
    related: ["hvad-er-en-fyldning", "hvad-er-en-tandkrone", "hvorfor-gor-mine-taender-ondt", "hvornar-er-tandpine-akut"]
  },
  {
    slug: "hvornar-er-tandpine-akut",
    title: "Hvornår er tandpine akut?",
    category: "akut",
    sourceSet: "emergency",
    description: "Læs hvilke symptomer ved tandpine der bør vurderes hurtigt, og hvad du kan gøre, mens du venter.",
    intro: "Tandpine er akut, når smerter, hævelse eller infektionstegn tyder på, at du ikke bør vente på en almindelig tid.",
    sections: [
      ["Akutte faresignaler", "Hævelse i ansigt eller kæbe, feber, synkebesvær, vejrtrækningsbesvær, stærke konstante smerter eller påvirket almentilstand skal tages alvorligt."],
      ["Smerter uden hævelse", "Kraftig tandpine bør stadig vurderes, men tidspunktet afhænger af smerte, varighed og om smertestillende hjælper."],
      ["Tandbyld", "En tandbyld kan give hævelse, dunkende smerte, dårlig smag og ømhed. Den kræver tandlægefaglig vurdering."],
      ["Hvad du ikke bør gøre", "Tag ikke gamle antibiotika eller forsøg at prikke hul på hævelse. Kontakt tandlæge, lægevagt eller akut hjælp efter symptomernes alvor."]
    ],
    related: ["hvorfor-gor-mine-taender-ondt", "hvad-gor-man-ved-en-knaekket-tand", "hvad-koster-en-tandudtraekning", "rodbehandling"]
  },
  {
    slug: "hvad-daekker-sygesikringen-hos-tandlaegen",
    title: "Hvad dækker sygesikringen hos tandlægen?",
    category: "priser",
    sourceSet: "price",
    description: "Få en enkel forklaring på tilskud, egenbetaling og hvorfor tandlægeregningen kan variere.",
    intro: "Tilskud hos tandlægen afhænger af ydelse, alder, sikringsgruppe og regler. Mange behandlinger har delvis eller ingen offentlig dækning.",
    sections: [
      ["Tilskud er ikke det samme som gratis behandling", "Du kan godt få tilskud og stadig skulle betale en stor del selv. Derfor er prisoverslag vigtigt ved større behandlinger."],
      ["Hvad påvirker dækningen?", "Ydelsestype, alder, undersøgelse, forebyggelse, behandlingens art og eventuelle private forsikringer kan påvirke egenbetalingen."],
      ["Spørg klinikken konkret", "Bed om at få forklaret, hvad der er offentligt tilskud, hvad der er privat pris, og hvad der eventuelt dækkes af forsikring."],
      ["Brug regningen aktivt", "Gem regning og overslag. De gør det lettere at forstå posterne og stille præcise spørgsmål."]
    ],
    related: ["regningen", "hvad-koster-en-tandrensning", "hvad-koster-en-rodbehandling", "hvordan-laeser-man-et-tandlaegeoverslag"]
  },
  {
    slug: "hvorfor-far-boern-huller-i-taenderne",
    title: "Hvorfor får børn huller i tænderne?",
    category: "boern",
    sourceSet: "children",
    description: "Forstå hvorfor børn får huller, og hvordan vaner, sukker, fluor og hjælp til tandbørstning spiller sammen.",
    intro: "Børn får huller af samme grund som voksne: bakterier, sukker, tid og for lidt beskyttelse. Men børn har brug for voksenhjælp til vanerne.",
    sections: [
      ["Mælketænder kan også få huller", "Huller i mælketænder skal tages alvorligt, fordi de kan give smerter og påvirke barnets oplevelse af tandpleje."],
      ["Hyppighed er vigtigt", "Søde drikke, snacks og natflasker kan give mange syreangreb. Det er ofte hyppigheden, ikke kun mængden, der betyder noget."],
      ["Børn bør have hjælp", "Mange børn kan ikke børste grundigt nok selv. Voksenhjælp med fluortandpasta er vigtig i de første år."],
      ["Gør rutinen rolig", "Korte, faste rutiner virker bedre end kamp. Spørg tandplejen om teknik og mængde tandpasta."]
    ],
    related: ["boern", "hvornaar-skal-boern-foerste-gang-til-tandlaege", "hvad-sker-der-ved-foerste-tandlaegebesoeg", "hvad-er-fluor"]
  },
  {
    slug: "hvornaar-skal-boern-foerste-gang-til-tandlaege",
    title: "Hvornår skal børn første gang til tandlæge?",
    category: "boern",
    sourceSet: "children",
    description: "Læs om barnets første tandlægebesøg, hvorfor tidlig tryghed betyder noget, og hvad forældre kan spørge om.",
    intro: "Det konkrete tidspunkt afhænger af den lokale tandpleje, men formålet er tidlig tryghed, forebyggelse og vejledning.",
    sections: [
      ["Hvorfor tidligt besøg hjælper", "Barnet lærer klinikken at kende, før der nødvendigvis er problemer. Det gør senere besøg lettere."],
      ["Hvad ser tandplejen efter?", "Tandfrembrud, børstning, kost, suttevaner, fluor og tegn på tidlige huller kan indgå."],
      ["Spørg om hjemmerutinen", "Få konkret råd om tandpasta, mængde, børsteteknik og hvad du gør, hvis barnet ikke vil børste."],
      ["Hvis barnet slår en tand", "Kontakt tandplejen ved tandskader, også på mælketænder, så skaden kan vurderes."]
    ],
    related: ["hvad-sker-der-ved-foerste-tandlaegebesoeg", "boern", "hvorfor-far-boern-huller-i-taenderne", "hvad-gor-man-ved-tandlaegeskraek"]
  },
  {
    slug: "hvad-er-plak",
    title: "Hvad er plak?",
    category: "forebyggelse",
    sourceSet: "prevention",
    description: "Forstå plak, hvorfor det opstår, og hvordan det hænger sammen med huller, tandsten og tandkødsbetændelse.",
    intro: "Plak er en blød bakteriebelægning på tænderne. Hvis den ikke fjernes, kan den bidrage til huller, tandsten og tandkødsproblemer.",
    sections: [
      ["Plak er levende belægning", "Plak består af bakterier og deres produkter. Den kan føles som en ru eller klistret belægning, især langs tandkødet."],
      ["Fra plak til syre", "Når bakterierne får sukker, kan de danne syre, som angriber emaljen. Det er en central del af cariesprocessen."],
      ["Fra plak til tandsten", "Hvis plak bliver siddende, kan mineraler fra spyttet gøre den hård. Så bliver den til tandsten, som ikke kan børstes væk hjemme."],
      ["Sådan fjerner du plak", "Tandbørstning med fluortandpasta og rengøring mellem tænderne er de vigtigste daglige redskaber."]
    ],
    related: ["hvad-er-tandsten", "hvad-er-caries", "hvad-er-tandkoedsbetaendelse", "er-tandtrad-nodvendigt"]
  },
  {
    slug: "hvordan-laeser-man-et-tandlaegeoverslag",
    title: "Hvordan læser man et tandlægeoverslag?",
    category: "priser",
    sourceSet: "price",
    description: "Få hjælp til at forstå et tandlægeoverslag, poster, tilskud, alternativer og spørgsmål du bør stille.",
    intro: "Et tandlægeoverslag skal hjælpe dig med at forstå behandling, pris og alternativer, før du siger ja.",
    sections: [
      ["Start med diagnosen", "Spørg hvad problemet er, og hvorfor behandlingen anbefales. Prisen giver først mening, når du forstår årsagen."],
      ["Se efter poster", "Overslaget kan indeholde undersøgelse, røntgen, bedøvelse, behandling, materialer, midlertidige løsninger og kontroller."],
      ["Tilskud og egenbetaling", "Skeln mellem samlet pris, tilskud og det beløb du selv skal betale. Spørg hvis tallene ikke står tydeligt."],
      ["Spørg om alternativer", "Bed om at få forklaret billigere, mere holdbare eller mere midlertidige løsninger, hvis de findes."]
    ],
    related: ["regningen", "hvad-daekker-sygesikringen-hos-tandlaegen", "hvad-koster-en-tandkrone", "hvad-koster-et-tandimplantat"]
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function href(slug) {
  return `/${slug}.html`;
}

const allGuides = [...existingGuides, ...newGuides.map(({ slug, title, category }) => ({ slug, title, category }))];
const bySlug = new Map(allGuides.map((guide) => [guide.slug, guide]));

function relatedList(slugs) {
  return slugs
    .filter((slug) => bySlug.has(slug))
    .slice(0, 5)
    .map((slug) => {
      const guide = bySlug.get(slug);
      return `            <li><a href="${href(slug)}">${escapeHtml(guide.title)}</a></li>`;
    })
    .join("\n");
}

function renderSources(sourceSet) {
  return sourceSets[sourceSet].map(([org, title, url]) => `            <li><a href="${url}" rel="noopener" target="_blank">${org}: ${title}</a></li>`).join("\n");
}

function renderGuide(guide) {
  const sections = guide.sections.map(([heading, text]) => `
        <section>
          <h2>${escapeHtml(heading)}</h2>
          <p>${escapeHtml(text)}</p>
        </section>`).join("\n");

  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(guide.title)} | KlinikGuiden</title>
  <meta name="description" content="${escapeHtml(guide.description)}" />
  <meta name="theme-color" content="#4E7A62" />
  <link rel="canonical" href="https://klinikguiden.com/${guide.slug}.html" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --cream:#F5F0E8; --warm-white:#FDFAF5; --sage:#7A9E8A; --sage-dark:#4E7A62; --charcoal:#2C2C2C; --muted:#7A7A72; --border:#E2DDD4; --accent:#C9956A; }
    body { background: var(--warm-white); color: var(--charcoal); font-family: Inter, sans-serif; font-size: 16px; line-height: 1.75; }
    nav { align-items: center; background: rgba(253,250,245,0.94); border-bottom: 1px solid var(--border); display: flex; gap: 1.5rem; min-height: 64px; justify-content: space-between; padding: 0.8rem 2rem; position: sticky; top: 0; z-index: 10; }
    .nav-logo { color: var(--charcoal); font-family: "Playfair Display", serif; font-size: 1.2rem; text-decoration: none; white-space: nowrap; }
    .nav-logo span { color: var(--sage-dark); }
    .nav-links { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: flex-end; }
    .nav-links a { color: var(--muted); font-size: 0.9rem; text-decoration: none; }
    main { margin: 0 auto; max-width: 1040px; padding: 72px 1.5rem; }
    .eyebrow { color: var(--sage-dark); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; margin-bottom: 1rem; text-transform: uppercase; }
    h1 { font-family: "Playfair Display", serif; font-size: clamp(2.25rem, 5vw, 3.7rem); line-height: 1.12; margin-bottom: 1.2rem; max-width: 820px; }
    h2 { font-family: "Playfair Display", serif; font-size: clamp(1.45rem, 3vw, 2rem); line-height: 1.25; margin: 2.2rem 0 0.8rem; }
    p, li { color: var(--muted); font-weight: 300; }
    a { color: var(--sage-dark); }
    .intro { font-size: 1.08rem; max-width: 760px; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.8rem; }
    .button { background: var(--sage-dark); border-radius: 100px; color: white; display: inline-block; font-size: 0.92rem; font-weight: 500; padding: 0.8rem 1.35rem; text-decoration: none; }
    .button.secondary { background: transparent; border: 1px solid var(--border); color: var(--charcoal); }
    .article { display: grid; gap: 3rem; grid-template-columns: minmax(0, 1fr) 280px; margin-top: 2rem; }
    .article-body section { border-top: 1px solid var(--border); padding-top: 1rem; }
    .sidebar, .source-list, .related-guides { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 1.2rem; }
    .sidebar { align-self: start; background: var(--cream); position: sticky; top: 88px; }
    .sidebar ul, .related-guides ul, .source-list ul { margin-left: 1.1rem; margin-top: 0.75rem; }
    .sidebar li, .related-guides li, .source-list li { margin-bottom: 0.45rem; }
    .tag { color: var(--sage-dark); display: inline-block; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; margin-bottom: 0.7rem; text-transform: uppercase; }
    .cta-panel { background: var(--sage-dark); border-radius: 14px; color: white; margin-top: 2.5rem; padding: 1.5rem; }
    .cta-panel p { color: rgba(255,255,255,0.86); }
    .cta-panel a { color: white; font-weight: 500; }
    footer { border-top: 1px solid var(--border); margin-top: 4rem; padding-top: 1.5rem; }
    @media (max-width: 800px) { nav { align-items: flex-start; flex-direction: column; padding: 0.9rem 1.2rem; } main { padding: 48px 1.2rem; } .article { grid-template-columns: 1fr; } .sidebar { position: static; } }
  </style>
</head>
<body>
  <nav>
    <a class="nav-logo" href="/">Klinik<span>Guiden</span></a>
    <div class="nav-links">
      <a href="/vidensbase.html">Vidensbase</a>
      <a href="/#guides">Gratis guides</a>
      <a href="/#calculator">Beregner</a>
      <a href="/#download">PDF-download</a>
    </div>
  </nav>
  <main>
    <p class="eyebrow">${escapeHtml(categories[guide.category])}</p>
    <h1>${escapeHtml(guide.title)}</h1>
    <p class="intro">${escapeHtml(guide.intro)}</p>
    <div class="hero-actions">
      <a class="button" href="/#download">Hent gratis tjekliste</a>
      <a class="button secondary" href="/#calculator">Prøv tilskudsberegneren</a>
      <a class="button secondary" href="/vidensbase.html">Se alle guides</a>
    </div>
    <div class="article">
      <article class="article-body">
${sections}
        <section class="related-guides">
          <h2>Relaterede guides</h2>
          <ul>
${relatedList(guide.related)}
          </ul>
        </section>
        <section class="source-list">
          <h2>Kilder og fagligt grundlag</h2>
          <p>Guiden er skrevet som generel patientinformation og er faktatjekket mod nedenstående kilder. Den erstatter ikke undersøgelse, diagnose eller konkret rådgivning hos din egen tandlæge.</p>
          <ul>
${renderSources(guide.sourceSet)}
          </ul>
        </section>
        <div class="cta-panel">
          <h2>Tag overblikket med til tandlægen</h2>
          <p>Hvis du er i tvivl om behandling, pris eller spørgsmål til klinikken, kan vores gratis tjekliste hjælpe dig med at forberede besøget.</p>
          <p><a href="/#download">Download tjeklisten her</a></p>
        </div>
      </article>
      <aside class="sidebar">
        <span class="tag">Læs også</span>
        <ul>
${relatedList(guide.related.slice(0, 3))}
        </ul>
      </aside>
    </div>
    <footer>
      <p>KlinikGuiden giver generel patientinformation og erstatter ikke undersøgelse, diagnose eller konkret rådgivning hos din egen tandlæge.</p>
    </footer>
  </main>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      if (window.KGAnalytics) KGAnalytics.trackEvent('guide_page_view', { page: '${guide.slug}', guide: ${JSON.stringify(guide.title)}, category: ${JSON.stringify(categories[guide.category])} });
    });
  </script>
  <script src="analytics.js"></script>
</body>
</html>
`;
}

function renderKnowledgeBase() {
  const groups = Object.entries(categories).map(([id, label]) => {
    const guides = allGuides.filter((guide) => guide.category === id);
    if (!guides.length) return "";
    return `<section class="card" id="${id}">
        <span class="tag">${escapeHtml(label)}</span>
        <h2>${escapeHtml(label)}</h2>
        <ul>
${guides.map((guide) => `          <li><a href="${href(guide.slug)}">${escapeHtml(guide.title)}</a></li>`).join("\n")}
        </ul>
      </section>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vidensbase | KlinikGuiden</title>
  <meta name="description" content="KlinikGuidens vidensbase om tandpleje, tandbehandlinger, priser, symptomer, tandlægeskræk og patientforståelse." />
  <link rel="canonical" href="https://klinikguiden.com/vidensbase.html" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --cream:#F5F0E8; --warm-white:#FDFAF5; --sage-dark:#4E7A62; --charcoal:#2C2C2C; --muted:#7A7A72; --border:#E2DDD4; }
    body { background: var(--warm-white); color: var(--charcoal); font-family: Inter, sans-serif; line-height: 1.75; }
    nav { align-items: center; background: rgba(253,250,245,0.94); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; padding: 0.9rem 2rem; position: sticky; top: 0; }
    .nav-logo { color: var(--charcoal); font-family: "Playfair Display", serif; font-size: 1.2rem; text-decoration: none; }
    .nav-logo span, a { color: var(--sage-dark); }
    main { margin: 0 auto; max-width: 1100px; padding: 72px 1.5rem; }
    .eyebrow, .tag { color: var(--sage-dark); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; }
    h1, h2 { font-family: "Playfair Display", serif; line-height: 1.15; }
    h1 { font-size: clamp(2.3rem,5vw,3.8rem); margin: 1rem 0; max-width: 820px; }
    h2 { font-size: 1.45rem; margin: 0.4rem 0 0.8rem; }
    p, li { color: var(--muted); }
    .intro { font-size: 1.08rem; max-width: 760px; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); margin-top: 2rem; }
    .card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 1.3rem; }
    .card ul { margin-left: 1.1rem; }
    .card li { margin-bottom: 0.45rem; }
  </style>
</head>
<body>
  <nav><a class="nav-logo" href="/">Klinik<span>Guiden</span></a><a href="/#download">PDF-download</a></nav>
  <main>
    <p class="eyebrow">Vidensbase</p>
    <h1>KlinikGuidens vidensbank om tænder, behandlinger og priser</h1>
    <p class="intro">Her samler vi korte, rolige og kildebaserede guides til patienter, der vil forstå tandpleje før, under og efter besøget hos tandlægen.</p>
    <div class="grid">
${groups}
    </div>
  </main>
  <script src="analytics.js"></script>
</body>
</html>
`;
}

function renderSitemap() {
  const staticPages = [
    ["/", "1.0"],
    ["/vidensbase.html", "0.95"],
    ["/guide-komplette.html", "0.7"],
    ["/privatliv.html", "0.4"],
    ["/tak.html", "0.3"]
  ];
  const guideUrls = allGuides.map((guide) => [`/${guide.slug}.html`, "0.75"]);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...guideUrls].map(([url, priority]) => `  <url>
    <loc>https://klinikguiden.com${url}</loc>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function renderRedirects() {
  return [
    "https://www.klinikguiden.com/* https://klinikguiden.com/:splat 301!",
    "http://www.klinikguiden.com/* https://klinikguiden.com/:splat 301!",
    "",
    ...allGuides.map((guide) => `/${guide.slug} /${guide.slug}.html 200`),
    "/guide-komplette /guide-komplette.html 200",
    "/vidensbase /vidensbase.html 200",
    "/privatliv /privatliv.html 200",
    "/tak /tak.html 200",
    "/tjekliste /tjekliste_tandlaegebesoeg.pdf 200"
  ].join("\n") + "\n";
}

function renderServiceWorker() {
  const urls = [
    "/",
    "/index.html",
    "/vidensbase.html",
    ...allGuides.map((guide) => `/${guide.slug}.html`),
    "/guide-komplette.html",
    "/privatliv.html",
    "/tak.html",
    "/tjekliste_tandlaegebesoeg.pdf",
    "/site.webmanifest",
    "/icon.svg",
    "/analytics.js"
  ];
  return `const CACHE_NAME = 'klinikguiden-v3';
const PRECACHE_URLS = ${JSON.stringify(urls, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => key === CACHE_NAME ? null : caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
`;
}

function addRelatedSection(file, relatedSlugs) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8");
  const section = `        <section class="related-guides">
          <h2>Relaterede guides</h2>
          <ul>
${relatedList(relatedSlugs)}
          </ul>
        </section>`;

  if (!html.includes(".related-guides")) {
    html = html.replace("    .cta-panel { background: var(--sage-dark); border-radius: 14px; color: white; margin-top: 2.5rem; padding: 1.5rem; }", "    .related-guides { background: white; border: 1px solid var(--border); border-radius: 12px; margin-top: 2rem; padding: 1.2rem; }\n    .related-guides ul { margin-left: 1.1rem; margin-top: 0.75rem; }\n    .related-guides li { margin-bottom: 0.45rem; }\n    .cta-panel { background: var(--sage-dark); border-radius: 14px; color: white; margin-top: 2.5rem; padding: 1.5rem; }");
  }

  if (html.includes('<section class="related-guides">')) {
    html = html.replace(/        <section class="related-guides">[\s\S]*?        <\/section>\n        <section class="source-list">/, `${section}\n        <section class="source-list">`);
    html = html.replace(/        <section class="related-guides">[\s\S]*?        <\/section>\n        <div class="cta-panel">/, `${section}\n        <div class="cta-panel">`);
  } else if (html.includes('<section class="source-list">')) {
    html = html.replace('        <section class="source-list">', `${section}\n        <section class="source-list">`);
  } else {
    html = html.replace('        <div class="cta-panel">', `${section}\n        <div class="cta-panel">`);
  }
  fs.writeFileSync(file, html);
}

const relationOverrides = {
  "hvorfor-far-man-huller": ["hvad-er-fluor", "hvilken-tandpasta-er-bedst", "er-tandtrad-nodvendigt", "hvad-er-en-fyldning", "hvad-er-caries"],
  "hvad-er-paradentose": ["hvorfor-bloder-tandkodet", "hvad-er-tandsten", "hvad-er-tandrensning", "kan-paradentose-helbredes", "hvad-er-gingivitis"],
  "kan-paradentose-helbredes": ["hvad-er-paradentose", "hvorfor-bloder-tandkodet", "hvad-er-tandsten", "hvad-er-tandrensning", "hvorfor-traekker-tandkodet-sig-tilbage"],
  "rodbehandling": ["hvad-koster-en-rodbehandling", "bedoevelse", "hvad-er-en-tandkrone", "hvad-er-en-fyldning", "gor-det-ondt-at-fa-lavet-et-hul"],
  "er-tandtrad-nodvendigt": ["hvad-er-plak", "hvad-er-gingivitis", "hvorfor-bloder-tandkodet", "hvad-er-tandsten", "hvad-er-tandkoedsbetaendelse"],
  "hvad-koster-en-rodbehandling": ["rodbehandling", "hvad-er-en-tandkrone", "hvad-koster-en-tandkrone", "hvad-er-en-fyldning", "regningen"]
};

for (const guide of newGuides) {
  fs.writeFileSync(path.join(root, `${guide.slug}.html`), renderGuide(guide));
}

const newGuideSlugs = new Set(newGuides.map((guide) => guide.slug));

for (const guide of allGuides) {
  if (newGuideSlugs.has(guide.slug)) continue;
  const own = newGuides.find((item) => item.slug === guide.slug);
  const related = relationOverrides[guide.slug] || own?.related || allGuides.filter((item) => item.category === guide.category && item.slug !== guide.slug).slice(0, 5).map((item) => item.slug);
  addRelatedSection(`${guide.slug}.html`, related);
}

fs.writeFileSync("vidensbase.html", renderKnowledgeBase());
fs.writeFileSync("sitemap.xml", renderSitemap());
fs.writeFileSync("_redirects", renderRedirects());
fs.writeFileSync("sw.js", renderServiceWorker());

console.log(`Added ${newGuides.length} new guides and refreshed related links.`);
