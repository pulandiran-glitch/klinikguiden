import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const categories = [
  { id: "forebyggelse", name: "Forebyggelse", intro: "Gode vaner, tandbørstning, fluor og det daglige arbejde med at undgå huller." },
  { id: "tandbehandlinger", name: "Tandbehandlinger", intro: "Forklaringer på behandlinger, materialer og hvad der typisk sker hos tandlægen." },
  { id: "tandlaegeregninger", name: "Tandlægeregninger", intro: "Priser, regninger og hjælp til at forstå hvad du betaler for." },
  { id: "tandlaegeskraek", name: "Tandlægeskræk", intro: "Rolige forklaringer og konkrete råd til dig, der bliver nervøs før besøget." },
  { id: "boern-og-taender", name: "Børn og tænder", intro: "Viden til forældre om børns tænder, vaner og trygge tandlægebesøg." }
];

const guides = [
  {
    slug: "hvor-ofte-skal-man-ga-til-tandlaege",
    category: "forebyggelse",
    title: "Hvor ofte skal man gå til tandlæge?",
    question: "Hvor ofte skal man gå til tandlæge?",
    description: "Forstå hvor tit du bør gå til tandlæge, hvad der afgør intervallet, og hvornår du bør bestille tid før næste kontrol.",
    short: "De fleste bør følge det interval, tandlægen anbefaler efter risiko for huller, tandkødsproblemer og tidligere behandlinger.",
    sections: [
      ["Det korte svar", "Der findes ikke ét rigtigt interval for alle. Nogle har brug for kontrol hver 6. måned, mens andre kan gå længere tid mellem besøgene. Det afhænger især af, om du ofte får huller, har tandkødsproblemer, ryger, tager medicin der giver mundtørhed, eller har mange tidligere behandlinger."],
      ["Hvorfor intervallet er individuelt", "Tandlægen vurderer risiko ud fra tænder, tandkød, mundhygiejne og symptomer. Et menneske med stabil mundsundhed og få problemer kan ofte kontrolleres sjældnere end en person med aktiv tandkødsbetændelse, mange fyldninger eller begyndende paradentose."],
      ["Tegn på at du ikke bør vente", "Bestil tid tidligere, hvis du har smerter, hævelse, knækket tand, blødende tandkød, dårlig smag, isninger der bliver værre, eller en fyldning der føles løs. Kontrolintervaller gælder kun, når alt er roligt."],
      ["Hvad sker der ved en kontrol?", "Ved en almindelig undersøgelse ser tandlægen eller tandplejeren efter huller, tandsten, tandkødslommer, slid, gamle fyldninger og tegn på sygdom. Målet er at opdage små problemer, før de bliver dyre eller smertefulde."],
      ["Sådan bruger du anbefalingen", "Spørg gerne: 'Hvorfor anbefaler du netop dette interval for mig?' Det giver dig et bedre billede af, hvad du selv kan gøre for at holde tænderne stabile mellem besøgene."]
    ],
    faq: [
      ["Er én gang om året nok?", "For nogle ja, men ikke for alle. Følg den konkrete anbefaling fra din klinik."],
      ["Skal jeg gå oftere, hvis mit tandkød bløder?", "Ja, blødning kan være tegn på betændelse og bør vurderes."],
      ["Kan jeg springe kontrol over, hvis jeg ikke har ondt?", "Smerter kommer ofte sent. Kontrol handler netop om at finde problemer tidligt."]
    ],
    related: ["hvad-er-tandsten", "hvad-er-tandkoedsbetaendelse", "hvordan-undgar-man-huller"]
  },
  {
    slug: "hvor-ofte-skal-man-borste-taender",
    category: "forebyggelse",
    title: "Hvor ofte skal man børste tænder?",
    question: "Hvor ofte skal man børste tænder?",
    description: "Læs hvor ofte du bør børste tænder, hvorfor fluor er vigtigt, og hvordan du gør tandbørstningen mere effektiv.",
    short: "Børst tænder to gange dagligt med fluortandpasta, og giv tandpastaen tid til at virke.",
    sections: [
      ["Det korte svar", "For de fleste er anbefalingen to gange om dagen: morgen og aften. Aftenbørstningen er særligt vigtig, fordi tænderne ellers ligger med plak og madrester hele natten, hvor spytproduktionen er lavere."],
      ["Hvor længe skal man børste?", "Sigt efter cirka to minutter. Det vigtigste er dog ikke kun tiden, men at du faktisk rammer alle flader: ydersider, indersider, tyggeflader og tandkødsranden."],
      ["Hvorfor fluor betyder så meget", "Fluor hjælper emaljen med at modstå syreangreb og kan reparere helt tidlige skader i overfladen. Derfor bør du bruge tandpasta med fluor og undgå at skylle kraftigt med vand bagefter."],
      ["Hård børstning er ikke bedre", "Hvis du presser for hårdt, kan tandkødet trække sig tilbage, og tænderne kan blive følsomme. Brug hellere en blød børste, små bevægelser og god systematik."],
      ["Når det stadig ikke er nok", "Tandbørsten renser ikke ordentligt mellem tænderne. Derfor kan tandtråd, mellemrumsbørster eller tandstikkere være nødvendige, især hvis du ofte får huller mellem tænderne."]
    ],
    faq: [
      ["Skal man børste tænder efter hvert måltid?", "Ikke nødvendigvis. To grundige børstninger dagligt er vigtigere for de fleste."],
      ["Må man skylle munden efter tandbørstning?", "Spyt overskydende tandpasta ud, men undgå at skylle meget, så fluoren bliver længere på tænderne."],
      ["Er elektrisk tandbørste bedre?", "Den kan hjælpe mange, men teknik og regelmæssighed betyder stadig mest."]
    ],
    related: ["hvilken-tandpasta-er-bedst", "hvad-er-fluor", "er-tandtrad-nodvendigt"]
  },
  {
    slug: "hvilken-tandpasta-er-bedst",
    category: "forebyggelse",
    title: "Hvilken tandpasta er bedst?",
    question: "Hvilken tandpasta er bedst?",
    description: "Få hjælp til at vælge tandpasta, forstå fluor, whitening, isninger og hvad du bør kigge efter på tuben.",
    short: "Den bedste tandpasta for de fleste er en almindelig fluortandpasta, som du kan bruge hver dag.",
    sections: [
      ["Start med fluor", "Det vigtigste valg er, at tandpastaen indeholder fluor. Fluor styrker emaljen og sænker risikoen for huller. For de fleste er en helt almindelig fluortandpasta derfor et bedre valg end dyre specialprodukter uden klar grund."],
      ["Hvis du har isninger", "Tandpasta mod isninger kan hjælpe, men den skal bruges konsekvent i en periode. Hvis isningerne er nye, kraftige eller kun sidder i én tand, bør du få det vurderet, fordi årsagen også kan være hul, revne eller utæt fyldning."],
      ["Whitening-tandpasta", "Whitening-tandpasta fjerner typisk overfladiske misfarvninger, men ændrer ikke tandens grundfarve som en egentlig blegning. Nogle produkter kan være slibende, så brug dem med omtanke."],
      ["Tandpasta til tandkød", "Nogle tandpastaer markedsføres til tandkød, men de erstatter ikke grundig rengøring langs tandkødsranden. Bløder tandkødet ofte, handler det som regel om plak og bør vurderes sammen med din renserutine."],
      ["Børn og tandpasta", "Børn skal bruge alderssvarende mængde og tandpasta med fluor. Spørg tandplejen, hvis du er i tvivl om mængde, især til små børn."]
    ],
    faq: [
      ["Skal tandpasta være dyr for at virke?", "Nej. En almindelig fluortandpasta er ofte nok."],
      ["Er naturlig tandpasta uden fluor god?", "Den kan smage fint, men den giver ikke samme dokumenterede hulbeskyttelse som fluor."],
      ["Kan tandpasta fjerne tandsten?", "Nej, tandsten skal fjernes professionelt."]
    ],
    related: ["hvad-er-fluor", "hvorfor-far-man-huller", "hvad-er-tandsten"]
  },
  {
    slug: "er-tandtrad-nodvendigt",
    category: "forebyggelse",
    title: "Er tandtråd nødvendigt?",
    question: "Er tandtråd nødvendigt?",
    description: "Forstå hvornår tandtråd er nyttigt, hvornår mellemrumsbørster er bedre, og hvordan du renser mellem tænderne.",
    short: "For mange er rengøring mellem tænderne nødvendig, men værktøjet behøver ikke altid være tandtråd.",
    sections: [
      ["Hvorfor tandbørsten ikke er nok", "Tandbørsten rammer dårligt mellem tænderne. Hvis plak får lov at sidde der, kan det give huller mellem tænderne, tandkødsbetændelse og dårlig ånde."],
      ["Tandtråd eller mellemrumsbørster?", "Tandtråd passer ofte bedst, hvor tænderne står tæt. Mellemrumsbørster er bedre, hvis der er mere plads, tandkødet har trukket sig tilbage, eller du har paradentose. Mange bruger en kombination."],
      ["Blødning i starten", "Hvis tandkødet bløder, når du begynder, betyder det ofte inflammation. Det er ikke automatisk et tegn på, at du skal stoppe. Bliver blødningen ved, bør du få teknikken og tandkødet vurderet."],
      ["Sådan gør du vanen lettere", "Læg tandtråd eller børster synligt, og start med de steder, hvor du oftest får madrester. En realistisk vane er bedre end en perfekt rutine, du kun holder i tre dage."],
      ["Spørg om størrelser", "Mellemrumsbørster findes i flere størrelser. For små børster renser dårligt, og for store kan skade. Din klinik kan hjælpe dig med den rigtige størrelse."]
    ],
    faq: [
      ["Skal alle bruge tandtråd?", "Ikke nødvendigvis, men de fleste bør rense mellem tænderne på en eller anden måde."],
      ["Er vandflosser nok?", "De kan være et supplement, men erstatter ikke altid mekanisk rengøring."],
      ["Hvor ofte skal man bruge tandtråd?", "Gerne dagligt, især hvis du har tendens til huller eller tandkødsproblemer."]
    ],
    related: ["hvad-er-tandkoedsbetaendelse", "hvordan-undgar-man-huller", "hvad-er-paradentose"]
  },
  {
    slug: "hvordan-undgar-man-huller",
    category: "forebyggelse",
    title: "Hvordan undgår man huller?",
    question: "Hvordan undgår man huller?",
    description: "Praktiske råd til at undgå huller i tænderne: fluor, sukker, tandbørstning, mellemrumsrens og kontrol.",
    short: "Huller forebygges bedst med fluor, færre syreangreb, god rengøring og regelmæssig kontrol.",
    sections: [
      ["Hvad skaber huller?", "Huller opstår, når bakterier i plak omdanner sukker til syre, som opløser emaljen over tid. Det handler ikke kun om hvor meget sukker, men også hvor ofte tænderne udsættes for sukker og syre."],
      ["Brug fluor rigtigt", "Børst med fluortandpasta to gange dagligt, og spyt ud uden at skylle kraftigt. Fluor er en af de mest effektive måder at styrke emaljen på i hverdagen."],
      ["Skær ned på hyppige snacks", "Tænderne tåler bedre, at sødt samles til få tidspunkter, end at de småspiser hele dagen. Juice, sodavand, energidrik og sød kaffe kan også give mange syreangreb."],
      ["Rens mellem tænderne", "Mange huller starter mellem tænderne, hvor tandbørsten ikke når. Brug tandtråd eller mellemrumsbørster, hvis din klinik anbefaler det."],
      ["Reager på tidlige tegn", "Isninger, flossende fyldninger, mørke pletter og mad der sætter sig fast kan være tegn på problemer. Jo tidligere du reagerer, jo mindre behandling er ofte nødvendig."]
    ],
    faq: [
      ["Kan begyndende huller gå væk?", "Meget tidlige emaljeforandringer kan nogle gange standses, men et egentligt hul kræver ofte behandling."],
      ["Er sukkerfri sodavand sikkert?", "Det kan stadig være surt og påvirke emaljen."],
      ["Hjælper tyggegummi?", "Sukkerfrit tyggegummi kan øge spyt, men erstatter ikke tandbørstning."]
    ],
    related: ["hvorfor-far-man-huller", "hvad-er-fluor", "er-tandtrad-nodvendigt"]
  },
  {
    slug: "hvad-er-paradentose",
    category: "tandbehandlinger",
    title: "Hvad er paradentose?",
    question: "Hvad er paradentose?",
    description: "Forstå paradentose, symptomer, behandling og hvorfor sygdommen skal tages alvorligt tidligt.",
    short: "Paradentose er en betændelsestilstand, hvor tandens støttevæv gradvist nedbrydes.",
    sections: [
      ["Hvad betyder paradentose?", "Paradentose kaldes også parodontitis. Det er en sygdom i tandens støttevæv, hvor betændelse og bakterier kan føre til dybere tandkødslommer og tab af knogle omkring tanden."],
      ["Typiske tegn", "Blødende tandkød, dårlig ånde, løse tænder, tandkød der trækker sig tilbage, og ømhed kan være tegn. Mange mærker dog meget lidt i starten."],
      ["Hvorfor det skal opdages tidligt", "Når knogle først er tabt, kommer den sjældent bare tilbage af sig selv. Behandlingen handler derfor om at stoppe udviklingen og holde sygdommen stabil."],
      ["Hvad gør tandlægen?", "Klinikken måler tandkødslommer, vurderer røntgenbilleder og fjerner bakteriebelægninger og tandsten. Du får også instruktion i hjemmerengøring, fordi din daglige indsats er afgørende."],
      ["Risikofaktorer", "Rygning, diabetes, arv, mundtørhed, dårlig mundhygiejne og uregelmæssige kontroller kan øge risikoen eller gøre sygdommen sværere at styre."]
    ],
    faq: [
      ["Er paradentose farligt?", "Det kan føre til løse tænder og tandtab, hvis det ikke behandles."],
      ["Gør paradentose ondt?", "Ikke altid. Derfor kan sygdommen udvikle sig uden tydelige smerter."],
      ["Kan unge få paradentose?", "Ja, men risikoen stiger typisk med alder og andre faktorer."]
    ],
    related: ["kan-paradentose-helbredes", "hvad-er-tandsten", "hvorfor-bloder-tandkodet"]
  },
  {
    slug: "kan-paradentose-helbredes",
    category: "tandbehandlinger",
    title: "Kan paradentose helbredes?",
    question: "Kan paradentose helbredes?",
    description: "Læs hvad behandling af paradentose realistisk kan gøre, og hvordan du holder sygdommen stabil.",
    short: "Paradentose kan ofte bremses og holdes stabil, men tabt støttevæv kommer ikke altid tilbage.",
    sections: [
      ["Det realistiske mål", "Målet er som regel at stoppe sygdommens udvikling, mindske inflammation og bevare tænderne. Man taler ofte om at få paradentose under kontrol frem for at love, at alt bliver som før."],
      ["Hvad behandlingen består af", "Behandlingen kan omfatte grundig tandrensning under tandkødsranden, instruktion i mellemrumsrens, hyppigere kontroller og i nogle tilfælde kirurgi eller specialistbehandling."],
      ["Din egen rolle", "Paradentose kan ikke holdes stabil med klinikbesøg alene. Daglig rengøring mellem tænderne er ofte forskellen på fremgang og tilbagefald."],
      ["Rygning og sygdom", "Rygning gør paradentose sværere at behandle og kan skjule blødning, så problemet ser mindre ud, end det er. Diabetes og mundtørhed kan også påvirke forløbet."],
      ["Hvornår er det alvorligt?", "Løse tænder, pus, hævelse, dybe lommer eller hurtigt forværrede målinger kræver tæt opfølgning. Spørg klinikken, hvad dine tal betyder."]
    ],
    faq: [
      ["Kan knogle vokse tilbage?", "Nogle behandlinger kan hjælpe i særlige tilfælde, men ofte handler det om at bevare det støttevæv, der er tilbage."],
      ["Hvor ofte skal man kontrolleres?", "Det afhænger af sværhedsgrad og stabilitet. Mange med paradentose ses oftere."],
      ["Kan paradentose smitte?", "Bakterier kan deles, men sygdommen afhænger også af immunrespons, vaner og risiko."]
    ],
    related: ["hvad-er-paradentose", "hvad-er-tandrensning", "er-tandtrad-nodvendigt"]
  },
  {
    slug: "hvad-er-tandsten",
    category: "forebyggelse",
    title: "Hvad er tandsten?",
    question: "Hvad er tandsten?",
    description: "Forstå hvad tandsten er, hvorfor det opstår, og hvorfor det skal fjernes hos tandlægen eller tandplejeren.",
    short: "Tandsten er forkalket plak, som sidder fast og ikke kan børstes væk derhjemme.",
    sections: [
      ["Fra plak til tandsten", "Plak er en blød bakteriebelægning. Når plak ikke fjernes, kan mineraler fra spyttet gøre den hård. Så bliver den til tandsten."],
      ["Hvor sidder tandsten typisk?", "Tandsten ses ofte bag fortænderne i underkæben og ved kindtænderne i overkæben, hvor spytkirtlerne udmunder. Det kan også sidde under tandkødet."],
      ["Hvorfor er det et problem?", "Tandsten giver bakterier en ru overflade at sidde på. Det kan irritere tandkødet, give blødning og gøre det sværere at holde rent."],
      ["Kan man fjerne det selv?", "Nej, ikke sikkert og effektivt. Tandsten skal fjernes med professionelle instrumenter. Forsøg med skarpe redskaber hjemme kan skade tandkød og emalje."],
      ["Sådan forebygger du det", "God tandbørstning langs tandkødsranden, mellemrumsrens og regelmæssig tandrensning reducerer mængden. Nogle danner tandsten hurtigere end andre."]
    ],
    faq: [
      ["Er tandsten det samme som huller?", "Nej. Tandsten er forkalket plak, mens huller er skade i tanden."],
      ["Gør tandrensning ondt?", "Det kan være ømt, især ved betændt tandkød, men sig til så behandlingen kan tilpasses."],
      ["Hvor ofte skal tandsten fjernes?", "Det afhænger af hvor hurtigt du danner det og tandkødets tilstand."]
    ],
    related: ["hvad-er-tandrensning", "hvad-er-tandkoedsbetaendelse", "hvad-er-paradentose"]
  },
  {
    slug: "hvorfor-far-man-huller",
    category: "forebyggelse",
    title: "Hvorfor får man huller?",
    question: "Hvorfor får man huller?",
    description: "Få en enkel forklaring på hvorfor huller opstår, og hvad du kan gøre for at sænke risikoen.",
    short: "Huller opstår, når bakterier, sukker og tid tilsammen nedbryder tandens emalje.",
    sections: [
      ["Den enkle forklaring", "Bakterier i plak bruger sukker som energi og danner syre. Syren trækker mineraler ud af emaljen. Hvis det sker ofte nok og længe nok, kan der opstå et hul."],
      ["Hyppighed betyder meget", "Det er ikke kun mængden af sukker, men hvor tit tænderne udsættes. Små søde eller sure indtag hele dagen giver tænderne færre pauser til at reparere sig."],
      ["Mundtørhed øger risikoen", "Spyt beskytter tænderne. Medicin, sygdom, stress eller mundånding kan give mundtørhed og dermed øge risikoen for huller."],
      ["Gamle fyldninger og kanter", "Huller kan opstå ved kanten af gamle fyldninger, hvis der samler sig plak, eller hvis fyldningen er utæt. Derfor er kontrol vigtigt."],
      ["Hvad kan du gøre?", "Brug fluortandpasta, begræns hyppige snacks, rens mellem tænderne og få kontrolleret tidlige tegn. Små ændringer kan gøre stor forskel."]
    ],
    faq: [
      ["Kan man få huller selvom man børster tænder?", "Ja, hvis der stadig sidder plak, hvis sukkerindtag er hyppigt, eller hvis risikoen er forhøjet."],
      ["Er huller arvelige?", "Vaner, bakterier, spyt og emaljeforhold spiller sammen. Risiko kan godt løbe i familier."],
      ["Gør huller altid ondt?", "Nej, især ikke i starten."]
    ],
    related: ["hvordan-undgar-man-huller", "hvad-er-fluor", "hvilken-tandpasta-er-bedst"]
  },
  {
    slug: "hvad-er-fluor",
    category: "forebyggelse",
    title: "Hvad er fluor?",
    question: "Hvad er fluor?",
    description: "Forstå hvad fluor gør for tænderne, hvorfor det bruges i tandpasta, og hvordan du bruger det sikkert.",
    short: "Fluor styrker emaljen og hjælper tænderne med at modstå syreangreb.",
    sections: [
      ["Hvad gør fluor?", "Fluor hjælper mineraler tilbage i emaljen og gør tandoverfladen mere modstandsdygtig mod syre. Det er derfor en central del af forebyggelsen mod huller."],
      ["Fluor i tandpasta", "For de fleste er fluortandpasta den vigtigste kilde. Børst to gange dagligt, spyt ud, og undgå at skylle meget med vand bagefter."],
      ["Er fluor farligt?", "I de mængder der bruges i almindelig tandpasta efter anbefalingerne, er fluor sikkert og veldokumenteret. Små børn skal bruge passende mængde og have hjælp af en voksen."],
      ["Ekstra fluor", "Nogle med høj risiko for huller kan få anbefalet ekstra fluor, fx mundskyl, gel eller lak hos tandlægen. Det bør ske efter individuel vurdering."],
      ["Når fluor ikke er nok alene", "Fluor hjælper meget, men kan ikke opveje konstant sukker, dårlig rengøring eller ubehandlede problemer. Det virker bedst sammen med gode vaner."]
    ],
    faq: [
      ["Skal voksne bruge fluor?", "Ja, voksne kan også få huller og har gavn af fluor."],
      ["Skal jeg vælge tandpasta uden fluor?", "Kun hvis du har en særlig grund og har drøftet det med fagperson. Ellers anbefales fluor."],
      ["Hjælper fluor mod isninger?", "Nogle fluorprodukter kan hjælpe, men isninger bør vurderes hvis de er nye eller kraftige."]
    ],
    related: ["hvilken-tandpasta-er-bedst", "hvordan-undgar-man-huller", "hvor-ofte-skal-man-borste-taender"]
  },
  {
    slug: "hvad-koster-en-rodbehandling",
    category: "tandlaegeregninger",
    title: "Hvad koster en rodbehandling?",
    question: "Hvad koster en rodbehandling?",
    description: "Få overblik over hvad en rodbehandling typisk afhænger af prismæssigt, og hvilke ekstra udgifter der kan komme.",
    short: "Prisen afhænger især af hvilken tand der behandles, antal rodkanaler og om tanden bagefter skal have fyldning eller krone.",
    sections: [
      ["Hvorfor prisen varierer", "En fortand er ofte enklere end en kindtand med flere rodkanaler. Derfor kan prisen variere meget. Røntgen, bedøvelse, midlertidig lukning og kontrol kan også indgå forskelligt."],
      ["Efterbehandling betyder meget", "Når nerven er fjernet, skal tanden lukkes tæt. Nogle tænder kan afsluttes med en fyldning, mens andre har brug for en krone for at mindske risikoen for brud."],
      ["Spørg efter et overslag", "Bed altid om et skriftligt prisoverslag, hvis behandlingen er større. Spørg også hvad der er med i prisen, og hvad der kan komme bagefter."],
      ["Kan det blive akut dyrere?", "Hvis du kommer med stærke smerter, hævelse eller infektion, kan første besøg handle om akut lindring. Den samlede behandling kan derfor blive delt op i flere besøg."],
      ["Sådan læser du regningen", "Kig efter poster for undersøgelse, røntgen, rodbehandling, fyldning og eventuel krone. Hvis du ikke forstår koderne, så bed klinikken forklare dem enkelt."]
    ],
    faq: [
      ["Er rodbehandling billigere end implantat?", "Ofte ja, men det afhænger af tandens prognose og efterbehandling."],
      ["Kan jeg få tilskud?", "Der kan være offentlige eller private tilskud afhængigt af situation og forsikring."],
      ["Hvorfor skal der krone på bagefter?", "Fordi rodbehandlede kindtænder kan være mere udsatte for at knække."]
    ],
    related: ["rodbehandling", "hvad-koster-en-krone", "hvad-er-en-plastfyldning"]
  },
  {
    slug: "hvad-koster-en-krone",
    category: "tandlaegeregninger",
    title: "Hvad koster en krone?",
    question: "Hvad koster en krone?",
    description: "Forstå hvad en tandkrone koster, hvorfor materialer betyder noget, og hvilke spørgsmål du bør stille før behandling.",
    short: "Prisen på en krone afhænger af materiale, teknik, tandens tilstand og om der skal laves opbygning først.",
    sections: [
      ["Hvad er en krone?", "En krone er en hætte, der dækker tanden, når den er svækket, knækket, meget fyldt eller rodbehandlet. Den skal beskytte tanden og genskabe form og funktion."],
      ["Hvorfor prisen varierer", "Materiale, laboratoriearbejde, scanning/aftryk, opbygning og kompleksitet påvirker prisen. En krone på en stærkt ødelagt tand kan kræve mere forarbejde end en mere stabil tand."],
      ["Materialer", "Kroner kan laves i forskellige keramiske materialer, metal-keramik eller andre løsninger. Valget afhænger af styrke, æstetik, placering og økonomi."],
      ["Spørgsmål før du siger ja", "Spørg hvorfor kronen anbefales, hvilke alternativer der findes, hvad prognosen er, og hvad den samlede pris inkluderer."],
      ["Efter behandlingen", "En krone skal stadig holdes ren. Der kan stadig opstå problemer ved kanten, hvis plak får lov at sidde."]
    ],
    faq: [
      ["Holder en krone hele livet?", "Ikke nødvendigvis. Mange holder længe, men levetid afhænger af tand, bid, rengøring og materiale."],
      ["Er en krone bedre end en fyldning?", "Ikke altid. Kroner bruges typisk, når tanden er for svækket til en almindelig fyldning."],
      ["Gør det ondt at få krone?", "Behandlingen foregår normalt med bedøvelse, hvis der er behov."]
    ],
    related: ["hvad-er-forskellen-pa-plast-og-porcelaen", "hvad-er-en-plastfyldning", "hvad-koster-en-rodbehandling"]
  },
  {
    slug: "hvad-er-tandrensning",
    category: "tandbehandlinger",
    title: "Hvad er en tandrensning?",
    question: "Hvad er en tandrensning?",
    description: "Læs hvad en tandrensning er, hvorfor tandsten fjernes, og hvad du kan forvente under behandlingen.",
    short: "En tandrensning fjerner plak, tandsten og misfarvninger, som du ikke selv kan fjerne med tandbørsten.",
    sections: [
      ["Hvad sker der?", "Tandlægen eller tandplejeren fjerner tandsten og belægninger med instrumenter eller ultralyd. Bagefter kan tænderne poleres, så overfladen føles glattere."],
      ["Hvorfor er det nødvendigt?", "Tandsten og plak langs tandkødet kan give inflammation, blødning og dårligere rengøringsmuligheder. En tandrensning gør det lettere at holde rent derhjemme."],
      ["Gør det ondt?", "Det kan nive eller være ømt, især hvis tandkødet er betændt, eller hvis tandsten sidder under tandkødet. Sig til undervejs, så tempo og teknik kan tilpasses."],
      ["Hvor ofte skal man have renset tænder?", "Det afhænger af tandsten, tandkød og risiko. Nogle har brug for hyppigere rensning, mens andre danner lidt tandsten."],
      ["Efter tandrensning", "Tænderne kan føles glatte, og tandkødet kan være lidt ømt. Fortsæt med blød tandbørste og den mellemrumsrens, klinikken anbefaler."]
    ],
    faq: [
      ["Kan tandrensning skade emaljen?", "Professionel tandrensning er lavet til at fjerne belægninger uden at skade tanden."],
      ["Fjerner tandrensning gule tænder?", "Den kan fjerne nogle ydre misfarvninger, men ændrer ikke tandens grundfarve."],
      ["Er tandrensning det samme som blegning?", "Nej, blegning ændrer farven kemisk, mens rensning fjerner belægninger."]
    ],
    related: ["hvad-er-tandsten", "hvad-er-tandkoedsbetaendelse", "kan-paradentose-helbredes"]
  },
  {
    slug: "hvad-er-tandkoedsbetaendelse",
    category: "forebyggelse",
    title: "Hvad er tandkødsbetændelse?",
    question: "Hvad er tandkødsbetændelse?",
    description: "Forstå tandkødsbetændelse, blødning, årsager og hvad du selv kan gøre for at få tandkødet roligt igen.",
    short: "Tandkødsbetændelse er inflammation i tandkødet, ofte fordi plak sidder langs tandkødsranden.",
    sections: [
      ["Hvad er det?", "Tandkødsbetændelse kaldes gingivitis. Tandkødet bliver irriteret af bakteriebelægninger og kan blive rødt, hævet og bløde ved børstning."],
      ["Er det farligt?", "I sig selv kan det ofte vendes, hvis plak fjernes effektivt. Men ubehandlet inflammation kan hos nogle udvikle sig videre og hænge sammen med paradentose."],
      ["Hvad kan du gøre?", "Børst grundigt langs tandkødsranden med blød børste. Rens mellem tænderne, og giv det tid. Tandkød kan bløde mere i starten, når du begynder at rense bedre."],
      ["Hvornår skal du kontakte tandlægen?", "Hvis blødningen fortsætter, hvis tandkødet hæver, hvis du har dårlig smag, pus, smerter eller løse tænder, bør du få det vurderet."],
      ["Tandsten kan holde betændelsen i gang", "Hvis der sidder tandsten, kan du ikke fjerne det selv. Så kræver det en tandrensning, før tandkødet kan blive helt roligt."]
    ],
    faq: [
      ["Hvor hurtigt går tandkødsbetændelse væk?", "Ofte bedres det over dage til uger med effektiv rengøring, men tandsten skal fjernes professionelt."],
      ["Skal jeg stoppe med tandtråd hvis det bløder?", "Som regel nej. Blødning kan være tegn på, at området netop skal renses bedre."],
      ["Kan mundskyl klare problemet?", "Mundskyl kan være supplement, men fjerner ikke plak mekanisk."]
    ],
    related: ["hvorfor-bloder-tandkodet", "hvad-er-tandsten", "er-tandtrad-nodvendigt"]
  },
  {
    slug: "hvorfor-bloder-tandkodet",
    category: "forebyggelse",
    title: "Hvorfor bløder tandkødet?",
    question: "Hvorfor bløder tandkødet?",
    description: "Læs de mest almindelige grunde til blødende tandkød, og hvornår du bør få det undersøgt.",
    short: "Blødende tandkød skyldes ofte inflammation fra plak, men kan også hænge sammen med andre forhold.",
    sections: [
      ["Den mest almindelige årsag", "Tandkød bløder ofte, fordi der sidder plak langs tandkødsranden. Kroppen reagerer med inflammation, og det gør vævet mere letblødende."],
      ["Når du lige er startet med tandtråd", "Mange oplever blødning i starten. Det betyder ikke nødvendigvis, at tandtråd er forkert. Det kan være tegn på, at området har været irriteret længe."],
      ["Andre mulige årsager", "Hård børstning, medicin, graviditet, mundtørhed, sygdom eller vitaminmangel kan også spille ind. Derfor skal vedvarende blødning ikke bare ignoreres."],
      ["Hvornår skal du reagere?", "Kontakt tandlægen, hvis blødningen varer ved, hvis tandkødet er hævet, hvis tænder føles løse, eller hvis du har dårlig smag eller pus."],
      ["Hvad hjælper?", "Grundig men skånsom rengøring, mellemrumsrens og tandrensning ved tandsten er de vigtigste tiltag. Spørg klinikken om teknik, hvis du er usikker."]
    ],
    faq: [
      ["Er blødende tandkød normalt?", "Det er almindeligt, men ikke noget man bør acceptere som normalt på lang sigt."],
      ["Kan stress give blødende tandkød?", "Stress kan påvirke vaner og immunforsvar, men plak er stadig ofte en central faktor."],
      ["Skal jeg bruge en hårdere tandbørste?", "Nej, en blød børste og god teknik er bedre."]
    ],
    related: ["hvad-er-tandkoedsbetaendelse", "hvad-er-paradentose", "hvad-er-tandrensning"]
  },
  {
    slug: "hvad-er-visdomstaender",
    category: "tandbehandlinger",
    title: "Hvad er visdomstænder?",
    question: "Hvad er visdomstænder?",
    description: "Forstå hvad visdomstænder er, hvorfor de kan give problemer, og hvornår de skal vurderes eller fjernes.",
    short: "Visdomstænder er de bagerste kindtænder, som ofte bryder frem sent og nogle gange mangler plads.",
    sections: [
      ["Hvor sidder de?", "Visdomstænder sidder helt bagerst i munden. De kommer typisk i ungdoms- eller voksenårene, men ikke alle får dem frem, og nogle mangler dem helt."],
      ["Hvorfor giver de problemer?", "Hvis der er for lidt plads, kan tanden kun bryde delvist frem. Så kan der samles bakterier under tandkødslappen, hvilket kan give betændelse, hævelse og smerter."],
      ["Skal de altid fjernes?", "Nej. En visdomstand der er fuldt frembrudt, sund og mulig at holde ren, kan ofte blive. Fjernelse vurderes ud fra symptomer, plads, retning og risiko."],
      ["Hvad undersøger tandlægen?", "Tandlægen ser på tandens placering og bruger ofte røntgen til at vurdere rødder, nabotand og nerveforløb."],
      ["Når det bliver akut", "Smerter, hævelse, synkebesvær, feber eller problemer med at åbne munden bør vurderes hurtigt."]
    ],
    faq: [
      ["Hvorfor hedder det visdomstænder?", "Fordi de typisk kommer senere end de andre tænder."],
      ["Kan visdomstænder give dårlig ånde?", "Ja, hvis der samler sig bakterier omkring en delvist frembrudt tand."],
      ["Er fjernelse en operation?", "Nogle kan trækkes ud enkelt, mens andre kræver kirurgisk fjernelse."]
    ],
    related: ["gor-det-ondt-at-fa-en-tand-trukket-ud", "hvad-er-tandkoedsbetaendelse", "bedoevelse"]
  },
  {
    slug: "gor-det-ondt-at-fa-en-tand-trukket-ud",
    category: "tandbehandlinger",
    title: "Gør det ondt at få en tand trukket ud?",
    question: "Gør det ondt at få en tand trukket ud?",
    description: "Rolig forklaring af tandudtrækning, bedøvelse, trykfornemmelse og hvad du kan forvente bagefter.",
    short: "Du bør ikke mærke skarp smerte under udtrækningen, men du kan mærke tryk og bevægelse.",
    sections: [
      ["Bedøvelsen først", "Tandlægen lægger bedøvelse, så området bliver følelsesløst. Du kan stadig mærke tryk, skub og vibration, men ikke egentlig skarp smerte. Sig til, hvis noget gør ondt."],
      ["Hvorfor tryk er normalt", "Tanden skal løsnes fra knoglen og tandkødet. Det kan føles voldsomt, fordi der arbejdes i kæben, men tryk er ikke det samme som smerte."],
      ["Efter udtrækningen", "Når bedøvelsen går ud, kan området være ømt. Du får instruktioner om blødning, mad, skylning, rygning og smertestillende."],
      ["Hvornår skal du ringe?", "Kontakt klinikken ved tiltagende smerter efter et par dage, dårlig smag, feber, kraftig blødning eller hævelse der bliver værre."],
      ["Hvis du er nervøs", "Fortæl klinikken det på forhånd. Aftal et stoptegn og bed om forklaring undervejs, hvis det hjælper dig."]
    ],
    faq: [
      ["Hvor længe bløder det?", "Let sivning er normalt i starten, men kraftig blødning skal vurderes."],
      ["Hvornår må jeg spise?", "Følg klinikkens instruktioner. Start typisk med blød, kølig mad når bedøvelsen aftager."],
      ["Kan tanden knække undervejs?", "Det kan ske, især ved svækkede tænder, men tandlægen har metoder til at håndtere det."]
    ],
    related: ["bedoevelse", "hvad-er-visdomstaender", "hvad-gor-man-ved-tandlaegeskraek"]
  },
  {
    slug: "hvad-er-en-plastfyldning",
    category: "tandbehandlinger",
    title: "Hvad er en plastfyldning?",
    question: "Hvad er en plastfyldning?",
    description: "Forstå plastfyldninger, hvornår de bruges, hvordan de laves, og hvad du skal være opmærksom på bagefter.",
    short: "En plastfyldning reparerer en tand med et tandfarvet materiale, ofte efter hul eller mindre brud.",
    sections: [
      ["Hvad bruges den til?", "Plastfyldninger bruges ofte til huller, mindre knækkede hjørner, slid eller udskiftning af gamle fyldninger. Materialet kan formes og hærdes direkte i tanden."],
      ["Hvordan laves den?", "Tandlægen fjerner sygt eller svækket tandvæv, renser området, limer materialet til tanden og hærder det med lys. Til sidst tilpasses bid og polering."],
      ["Fordele", "Plast er tandfarvet, kræver ofte mindre fjernelse af sund tand end nogle ældre materialer og kan repareres i mange situationer."],
      ["Begrænsninger", "Store plastfyldninger kan være mere udsatte for slid eller brud end en krone. Levetid afhænger af størrelse, placering, bid og rengøring."],
      ["Efter behandlingen", "Tanden kan være følsom kortvarigt. Hvis biddet føles for højt, eller ømheden varer ved, bør du kontakte klinikken."]
    ],
    faq: [
      ["Hvor længe holder en plastfyldning?", "Det varierer meget, men god rengøring og korrekt bid øger levetiden."],
      ["Kan man spise bagefter?", "Ofte ja, når bedøvelsen er væk, men følg klinikkens råd."],
      ["Er plast det samme som porcelæn?", "Nej, porcelæn laves typisk uden for munden og bruges til fx kroner eller indlæg."]
    ],
    related: ["hvad-er-forskellen-pa-plast-og-porcelaen", "hvorfor-far-man-huller", "hvad-koster-en-krone"]
  },
  {
    slug: "hvad-er-forskellen-pa-plast-og-porcelaen",
    category: "tandbehandlinger",
    title: "Hvad er forskellen på plast og porcelæn?",
    question: "Hvad er forskellen på plast og porcelæn?",
    description: "Sammenlign plast og porcelæn til tænder: pris, holdbarhed, æstetik og hvornår de forskellige materialer bruges.",
    short: "Plast laves ofte direkte i tanden, mens porcelæn typisk bruges til stærkere og mere formstabile løsninger som kroner og indlæg.",
    sections: [
      ["Plast kort forklaret", "Plast er et tandfarvet materiale, som tandlægen kan lægge direkte i tanden. Det er velegnet til mange små og mellemstore reparationer."],
      ["Porcelæn kort forklaret", "Porcelæn eller keramik bruges ofte til kroner, facader og indlæg. Det fremstilles typisk digitalt eller på laboratorium og kan være stærkt og meget æstetisk."],
      ["Pris og tid", "Plast er ofte billigere og kan tit laves på ét besøg. Porcelæn koster typisk mere, fordi der er mere teknik, fremstilling og planlægning involveret."],
      ["Holdbarhed", "Porcelæn kan være mere slidstærkt og farvestabilt i større løsninger. Plast kan repareres lettere, men kan misfarves og slides mere over tid."],
      ["Hvad skal du vælge?", "Det afhænger af tandens størrelse, bid, placering, æstetik, økonomi og prognose. Bed tandlægen forklare hvorfor et materiale anbefales i netop din situation."]
    ],
    faq: [
      ["Er porcelæn altid bedst?", "Nej. Til mindre reparationer kan plast være den mest skånsomme og fornuftige løsning."],
      ["Kan plast blive gult?", "Ja, plast kan misfarves over tid afhængigt af kost, rygning og overflade."],
      ["Kan porcelæn knække?", "Ja, alt kan knække, men korrekt design og bidtilpasning mindsker risikoen."]
    ],
    related: ["hvad-er-en-plastfyldning", "hvad-koster-en-krone", "hvad-koster-en-rodbehandling"]
  },
  {
    slug: "hvad-gor-man-ved-tandlaegeskraek",
    category: "tandlaegeskraek",
    title: "Hvad gør man ved tandlægeskræk?",
    question: "Hvad gør man ved tandlægeskræk?",
    description: "Konkrete råd til tandlægeskræk: forberedelse, stoptegn, pauser, bedøvelse og hvordan du taler med klinikken.",
    short: "Tandlægeskræk bliver ofte lettere at håndtere, når du aftaler tempo, stoptegn og forklaring med klinikken på forhånd.",
    sections: [
      ["Sig det højt før besøget", "Skriv eller ring til klinikken og fortæl, at du er nervøs. Det giver personalet mulighed for at sætte ekstra tid af, forklare roligt og aftale et tempo, du kan være i."],
      ["Aftal et stoptegn", "Et løftet håndtegn kan give dig kontrol. Når du ved, at du kan stoppe behandlingen, bliver det ofte lettere at blive i stolen."],
      ["Bed om forklaring eller ro", "Nogle vil gerne vide alt, andre vil helst høre så lidt som muligt. Fortæl hvad der hjælper dig. Der er ikke én rigtig måde at være patient på."],
      ["Start småt", "Hvis du har undgået tandlægen længe, kan første mål være en samtale eller undersøgelse uden behandling. Det bygger tillid op trin for trin."],
      ["Når frygten er stærk", "Ved svær tandlægeskræk kan du spørge om ekstra muligheder, fx længere tid, pauser, beroligende samtale eller henvisning til klinik med særlig erfaring."]
    ],
    faq: [
      ["Er tandlægeskræk pinligt?", "Nej. Det er meget almindeligt, og en god klinik tager det alvorligt."],
      ["Kan jeg få bedøvelse før tandrensning?", "I nogle situationer ja. Spørg klinikken."],
      ["Hvad hvis jeg græder?", "Det er okay. Personalet har set nervøse patienter før."]
    ],
    related: ["tandlaegeangst", "gor-det-ondt-at-fa-en-tand-trukket-ud", "bedoevelse"]
  }
];

const legacyGuides = {
  rodbehandling: "rodbehandling.html",
  bedoevelse: "bedoevelse.html",
  tandlaegeangst: "tandlaegeangst.html"
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function guideHref(slug) {
  return legacyGuides[slug] || `${slug}.html`;
}

function categoryById(id) {
  return categories.find((category) => category.id === id);
}

function layout({ title, description, canonical, body, extraHead = "" }) {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | KlinikGuiden</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#4E7A62" />
  <link rel="canonical" href="https://klinikguiden.com/${canonical}" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
  ${extraHead}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --cream:#F5F0E8; --warm-white:#FDFAF5; --sage:#7A9E8A; --sage-dark:#4E7A62; --charcoal:#2C2C2C; --muted:#7A7A72; --border:#E2DDD4; --accent:#C9956A; --accent-light:#FBF2EA; }
    html { scroll-behavior: smooth; }
    body { background: var(--warm-white); color: var(--charcoal); font-family: Inter, sans-serif; font-size: 16px; line-height: 1.75; }
    nav { align-items: center; background: rgba(253,250,245,0.94); border-bottom: 1px solid var(--border); display: flex; gap: 1.5rem; min-height: 64px; justify-content: space-between; padding: 0.8rem 2rem; position: sticky; top: 0; z-index: 10; }
    .nav-logo { color: var(--charcoal); font-family: "Playfair Display", serif; font-size: 1.2rem; text-decoration: none; white-space: nowrap; }
    .nav-logo span { color: var(--sage-dark); }
    .nav-links { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: flex-end; }
    .nav-links a { color: var(--muted); font-size: 0.9rem; text-decoration: none; }
    .nav-links a:hover { color: var(--charcoal); }
    main { margin: 0 auto; max-width: 1040px; padding: 72px 1.5rem; }
    .eyebrow { color: var(--sage-dark); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em; margin-bottom: 1rem; text-transform: uppercase; }
    h1 { font-family: "Playfair Display", serif; font-size: clamp(2.25rem, 5vw, 3.7rem); line-height: 1.12; margin-bottom: 1.2rem; max-width: 820px; }
    h2 { font-family: "Playfair Display", serif; font-size: clamp(1.45rem, 3vw, 2rem); line-height: 1.25; margin: 2.4rem 0 0.8rem; }
    h3 { font-size: 1rem; margin-bottom: 0.35rem; }
    p, li { color: var(--muted); font-weight: 300; }
    a { color: var(--sage-dark); }
    .intro { font-size: 1.08rem; max-width: 760px; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.8rem; }
    .button { background: var(--sage-dark); border-radius: 100px; color: white; display: inline-block; font-size: 0.92rem; font-weight: 500; padding: 0.8rem 1.35rem; text-decoration: none; }
    .button.secondary { background: transparent; border: 1px solid var(--border); color: var(--charcoal); }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); margin-top: 2rem; }
    .card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 1.3rem; }
    .card p { font-size: 0.92rem; }
    .tag { color: var(--sage-dark); display: inline-block; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; margin-bottom: 0.7rem; text-transform: uppercase; }
    .article { display: grid; gap: 3rem; grid-template-columns: minmax(0, 1fr) 280px; margin-top: 2rem; }
    .article-body { min-width: 0; }
    .article-body section { border-top: 1px solid var(--border); padding-top: 1rem; }
    .sidebar { align-self: start; background: var(--cream); border: 1px solid var(--border); border-radius: 12px; padding: 1.2rem; position: sticky; top: 88px; }
    .sidebar ul, .faq-list { list-style: none; margin-top: 0.8rem; }
    .sidebar li, .faq-list li { border-top: 1px solid var(--border); padding: 0.75rem 0; }
    .faq-list strong { color: var(--charcoal); display: block; margin-bottom: 0.25rem; }
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
  ${body}
  <script src="analytics.js"></script>
</body>
</html>
`;
}

function renderGuide(guide) {
  const category = categoryById(guide.category);
  const related = guide.related.map((slug) => {
    const target = guides.find((item) => item.slug === slug);
    const title = target ? target.title : slug === "rodbehandling" ? "Hvad sker der egentlig ved en rodbehandling?" : slug === "bedoevelse" ? "Bedøvelse hos tandlægen" : "Tandlægeangst - hvad hjælper faktisk?";
    return `<li><a href="/${guideHref(slug)}">${escapeHtml(title)}</a></li>`;
  }).join("\n");
  const sections = guide.sections.map(([heading, text]) => `
        <section>
          <h2>${escapeHtml(heading)}</h2>
          <p>${escapeHtml(text)}</p>
        </section>`).join("\n");
  const faq = guide.faq.map(([question, answer]) => `<li><strong>${escapeHtml(question)}</strong><span>${escapeHtml(answer)}</span></li>`).join("\n");
  const body = `
  <main>
    <p class="eyebrow">${escapeHtml(category.name)}</p>
    <h1>${escapeHtml(guide.title)}</h1>
    <p class="intro">${escapeHtml(guide.short)}</p>
    <div class="hero-actions">
      <a class="button" href="/#download">Hent gratis tjekliste</a>
      <a class="button secondary" href="/#calculator">Prøv tilskudsberegneren</a>
      <a class="button secondary" href="/vidensbase.html">Se alle guides</a>
    </div>
    <div class="article">
      <article class="article-body">
        ${sections}
        <section>
          <h2>Ofte stillede spørgsmål</h2>
          <ul class="faq-list">${faq}</ul>
        </section>
        <div class="cta-panel">
          <h2>Tag overblikket med til tandlægen</h2>
          <p>Hvis du er i tvivl om behandling, pris eller spørgsmål til klinikken, kan vores gratis tjekliste hjælpe dig med at forberede besøget.</p>
          <p><a href="/#download">Download tjeklisten her</a></p>
        </div>
      </article>
      <aside class="sidebar">
        <span class="tag">Læs også</span>
        <ul>${related}</ul>
      </aside>
    </div>
    <footer>
      <p>KlinikGuiden giver generel patientinformation og erstatter ikke undersøgelse, diagnose eller konkret rådgivning hos din egen tandlæge.</p>
    </footer>
  </main>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      if (window.KGAnalytics) {
        KGAnalytics.trackEvent('guide_page_view', { page: '${guide.slug}', guide: ${JSON.stringify(guide.title)}, category: ${JSON.stringify(category.name)} });
      }
    });
  </script>`;
  return layout({
    title: guide.title,
    description: guide.description,
    canonical: `${guide.slug}.html`,
    body
  });
}

function renderKnowledgeBase() {
  const categoryCards = categories.map((category) => {
    const categoryGuides = guides.filter((guide) => guide.category === category.id);
    const links = categoryGuides.map((guide) => `<li><a href="/${guide.slug}.html">${escapeHtml(guide.question)}</a></li>`).join("\n");
    return `<section class="card" id="${category.id}">
        <span class="tag">${escapeHtml(category.name)}</span>
        <h2>${escapeHtml(category.name)}</h2>
        <p>${escapeHtml(category.intro)}</p>
        <ul>${links}</ul>
      </section>`;
  }).join("\n");
  const body = `
  <main>
    <p class="eyebrow">Vidensbase</p>
    <h1>Alle KlinikGuidens guides om tænder, behandlinger og regninger</h1>
    <p class="intro">Her samler vi korte, klare svar på de spørgsmål, danske patienter søger efter, når noget gør ondt, virker dyrt eller bare føles uklart.</p>
    <div class="hero-actions">
      <a class="button" href="/#download">Hent gratis tjekliste</a>
      <a class="button secondary" href="/#calculator">Prøv tilskudsberegneren</a>
    </div>
    <div class="grid">${categoryCards}</div>
  </main>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      if (window.KGAnalytics) KGAnalytics.trackEvent('knowledge_base_view', { page: 'vidensbase' });
    });
  </script>`;
  return layout({
    title: "Vidensbase",
    description: "KlinikGuidens vidensbase samler guides om tandbehandlinger, tandlægeregninger, tandlægeskræk, børn og forebyggelse.",
    canonical: "vidensbase.html",
    body
  });
}

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content);
}

function renderSitemap() {
  const staticPages = [
    ["/", "1.0"],
    ["/vidensbase.html", "0.95"],
    ["/rodbehandling.html", "0.8"],
    ["/regningen.html", "0.8"],
    ["/tandlaegeangst.html", "0.8"],
    ["/boern.html", "0.8"],
    ["/besoegsfrekvens.html", "0.8"],
    ["/bedoevelse.html", "0.8"],
    ["/guide-komplette.html", "0.7"],
    ["/privatliv.html", "0.4"],
    ["/tak.html", "0.3"]
  ];
  const all = [...staticPages, ...guides.map((guide) => [`/${guide.slug}.html`, "0.75"])];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(([url, priority]) => `  <url>
    <loc>https://klinikguiden.com${url}</loc>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function renderRedirects() {
  const redirects = [
    "https://www.klinikguiden.com/* https://klinikguiden.com/:splat 301!",
    "http://www.klinikguiden.com/* https://klinikguiden.com/:splat 301!",
    "",
    "/rodbehandling /rodbehandling.html 200",
    "/regningen /regningen.html 200",
    "/tandlaegeangst /tandlaegeangst.html 200",
    "/boern /boern.html 200",
    "/besoegsfrekvens /besoegsfrekvens.html 200",
    "/bedoevelse /bedoevelse.html 200",
    "/guide-komplette /guide-komplette.html 200",
    "/vidensbase /vidensbase.html 200",
    ...guides.map((guide) => `/${guide.slug} /${guide.slug}.html 200`),
    "/privatliv /privatliv.html 200",
    "/tak /tak.html 200",
    "/tjekliste /tjekliste_tandlaegebesoeg.pdf 200"
  ];
  return `${redirects.join("\n")}\n`;
}

function renderServiceWorker() {
  const urls = [
    "/",
    "/index.html",
    "/vidensbase.html",
    "/rodbehandling.html",
    "/regningen.html",
    "/tandlaegeangst.html",
    "/boern.html",
    "/besoegsfrekvens.html",
    "/bedoevelse.html",
    "/guide-komplette.html",
    ...guides.map((guide) => `/${guide.slug}.html`),
    "/privatliv.html",
    "/tak.html",
    "/tjekliste_tandlaegebesoeg.pdf",
    "/site.webmanifest",
    "/icon.svg",
    "/analytics.js"
  ];
  return `const CACHE_NAME = 'klinikguiden-v2';
const PRECACHE_URLS = ${JSON.stringify(urls, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => key === CACHE_NAME ? null : caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
`;
}

write("vidensbase.html", renderKnowledgeBase());
for (const guide of guides) {
  write(`${guide.slug}.html`, renderGuide(guide));
}
write("sitemap.xml", renderSitemap());
write("_redirects", renderRedirects());
write("sw.js", renderServiceWorker());

console.log(`Generated vidensbase.html and ${guides.length} guide pages.`);
