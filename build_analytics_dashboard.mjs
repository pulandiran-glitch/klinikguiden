import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workbook = Workbook.create();
const dashboard = workbook.worksheets.add("Dashboard");
const events = workbook.worksheets.add("Events");
const setup = workbook.worksheets.add("Opsætning");

const headers = [
  "timestamp",
  "type",
  "event",
  "page",
  "path",
  "name",
  "email",
  "guide",
  "product",
  "price",
  "value",
  "sessionId",
  "referrer",
  "trafficSource",
  "visitorType",
  "isReturning",
  "screenSize",
  "errorMessage",
  "details"
];

const sampleRows = [
  ["'2026-06-18T12:00:00.000Z", "event", "page_view", "forside", "/", "", "", "", "", "", "", "demo-session", "", "direkte", "ny", "FALSE", "1440x900", "", "{}"],
  ["'2026-06-18T12:01:10.000Z", "event", "hero_free_guides", "forside", "/", "", "", "", "", "", "", "demo-session", "", "direkte", "tilbagevendende", "TRUE", "1440x900", "", '{"href":"#guides"}'],
  ["'2026-06-18T12:02:42.000Z", "event", "quiz_answer_selected", "forside", "/", "", "", "Forstå din tandlægeregning", "", "", "price", "demo-session", "", "direkte", "tilbagevendende", "TRUE", "1440x900", "", '{"value":"price"}'],
  ["'2026-06-18T12:03:20.000Z", "lead", "newsletter_signup", "forside", "/", "Eksempel", "eksempel@email.dk", "Nyhedsbrev - Tjekliste", "", "", "", "demo-session", "", "direkte", "tilbagevendende", "TRUE", "1440x900", "", "{}"],
  ["'2026-06-18T12:04:00.000Z", "event", "order_form_submit", "forside", "/", "Eksempel", "eksempel@email.dk", "komplette", "komplette", "99", "", "demo-session", "", "direkte", "tilbagevendende", "TRUE", "1440x900", "", '{"provider":"manual"}'],
  ["'2026-06-18T12:04:30.000Z", "order", "order_form_submit", "forside", "/", "Eksempel", "eksempel@email.dk", "komplette", "komplette", "99", "", "demo-session", "", "direkte", "tilbagevendende", "TRUE", "1440x900", "", "{}"]
];

events.getRange("A1:S1").values = [headers];
events.getRange("A2:S7").values = sampleRows;

dashboard.getRange("A1:H1").values = [["KlinikGuiden analytics-dashboard", "", "", "", "", "", "", ""]];
dashboard.getRange("A3:B16").values = [
  ["KPI", "Værdi"],
  ["Besøgende i dag", '=COUNTA(UNIQUE(FILTER(Events!L:L,Events!C:C="page_view")))'],
  ["Besøgende denne uge", '=COUNTA(UNIQUE(FILTER(Events!L:L,Events!C:C="page_view")))'],
  ["Besøgende denne måned", '=COUNTA(UNIQUE(FILTER(Events!L:L,Events!C:C="page_view")))'],
  ["Sidevisninger", '=COUNTIF(Events!C:C,"page_view")'],
  ["Tilbagevendende besøgende", '=COUNTA(UNIQUE(FILTER(Events!L:L,Events!O:O="tilbagevendende")))'],
  ["Nyhedsbrev leads", '=COUNTIF(Events!C:C,"newsletter_signup")'],
  ["PDF-downloads", '=COUNTIF(Events!C:C,"pdf_download_started")'],
  ["Bestillinger", '=COUNTIF(Events!C:C,"order_form_submit")'],
  ["Estimeret omsætning", '=SUMIF(Events!C:C,"order_form_submit",Events!J:J)'],
  ["Konverteringsrate", '=IFERROR(B11/B6,0)'],
  ["Dagens e-mailtilmeldinger", '=COUNTIF(Events!C:C,"newsletter_signup")'],
  ["Dagens PDF-downloads", '=COUNTIF(Events!C:C,"pdf_download_started")'],
  ["Dagens fejl", '=COUNTIF(Events!C:C,"site_error")']
];

dashboard.getRange("D3:F16").values = [
  ["Event", "Antal", "Formål"],
  ["page_view", '=COUNTIF(Events!C:C,D4)', "Hvor mange besøg siden får"],
  ["guide_page_view", '=COUNTIF(Events!C:C,D5)', "Hvor mange guide-sider bliver set"],
  ["product_page_view", '=COUNTIF(Events!C:C,D6)', "Hvor mange ser produktsiden"],
  ["hero_free_guides", '=COUNTIF(Events!C:C,D7)', "Klik på gratis guides i toppen"],
  ["hero_products", '=COUNTIF(Events!C:C,D8)', "Klik på produkt-knap i toppen"],
  ["quiz_answer_selected", '=COUNTIF(Events!C:C,D9)', "Hvor mange bruger quizzen"],
  ["subsidy_calculated", '=COUNTIF(Events!C:C,D10)', "Hvor mange bruger beregneren"],
  ["newsletter_signup", '=COUNTIF(Events!C:C,D11)', "Nyhedsbrevstilmeldinger"],
  ["order_form_submit", '=COUNTIF(Events!C:C,D12)', "Bestilling er registreret"],
  ["waitlist_signup", '=COUNTIF(Events!C:C,D13)', "Venteliste-tilmeldinger"],
  ["pdf_download_started", '=COUNTIF(Events!C:C,D14)', "Tjekliste-downloads"],
  ["thank_you_page_view", '=COUNTIF(Events!C:C,D15)', "Tak-side visninger"]
];

dashboard.getRange("A18:C24").values = [
  ["Funnel", "Antal", "Konvertering fra besøg"],
  ["Besøg", '=COUNTIF(Events!C:C,"page_view")', ""],
  ["Quiz brugt", '=COUNTIF(Events!C:C,"quiz_answer_selected")', '=IFERROR(B20/B19,"")'],
  ["Tjekliste hentet", '=COUNTIF(Events!C:C,"pdf_download_started")', '=IFERROR(B21/B19,"")'],
  ["Lead", '=COUNTIF(Events!C:C,"newsletter_signup")', '=IFERROR(B22/B19,"")'],
  ["Bestilling", '=COUNTIF(Events!C:C,"order_form_submit")', '=IFERROR(B23/B19,"")'],
  ["Produktklik", '=COUNTIFS(Events!C:C,"*product*")', '=IFERROR(B24/B19,"")']
];

dashboard.getRange("A27:C30").values = [
  ["Produkt", "Bestillinger", "Estimeret omsætning"],
  ["Komplet guide", '=COUNTIFS(Events!C:C,"order_form_submit",Events!I:I,"komplette")', '=SUMIFS(Events!J:J,Events!C:C,"order_form_submit",Events!I:I,"komplette")'],
  ["Børneguide", '=COUNTIFS(Events!C:C,"order_form_submit",Events!I:I,"boern")', '=SUMIFS(Events!J:J,Events!C:C,"order_form_submit",Events!I:I,"boern")'],
  ["Venteliste", '=COUNTIFS(Events!C:C,"waitlist_signup",Events!I:I,"venteliste")', '=SUMIFS(Events!J:J,Events!C:C,"waitlist_signup",Events!I:I,"venteliste")']
];

setup.getRange("A1:D1").values = [["Opsætning", "", "", ""]];
setup.getRange("A3:B12").values = [
  ["1", "Opret et Google Sheet og indsæt google-apps-script.js i Apps Script."],
  ["2", "Kør setup-funktionen én gang for at oprette kolonner."],
  ["3", "Deploy Apps Script som Web app med adgang for Anyone."],
  ["4", "Indsæt Web app URL'en som endpoint i analytics.js."],
  ["5", "Brug fanen Events til rådata og Dashboard til overblik."],
  ["6", "Eksportér Google Sheet til Excel, hvis du vil analysere videre lokalt."],
  ["Bemærk", "Gem ikke følsomme helbredsoplysninger i formularer."],
  ["Gratis", "Denne løsning bruger gratis Google Sheets/Apps Script og statisk frontend."],
  ["Næste niveau", "Når trafikken vokser, bør tracking flyttes bag en Netlify Function."],
  ["Kolonner", headers.join(", ")]
];

for (const sheet of [dashboard, events, setup]) {
  sheet.getRange("A1:N1").format = {
    fontWeight: "bold",
    fill: { color: "#F5F0E8" },
    fontColor: "#2C2C2C"
  };
}

dashboard.getRange("A1:H1").format = {
  fontWeight: "bold",
  fontSize: 18,
  fill: { color: "#4E7A62" },
  fontColor: "#FFFFFF"
};
dashboard.getRange("A3:B3").format = { fontWeight: "bold", fill: { color: "#F5F0E8" } };
dashboard.getRange("D3:F3").format = { fontWeight: "bold", fill: { color: "#F5F0E8" } };
dashboard.getRange("A18:C18").format = { fontWeight: "bold", fill: { color: "#F5F0E8" } };
dashboard.getRange("A27:C27").format = { fontWeight: "bold", fill: { color: "#F5F0E8" } };
dashboard.getRange("A:A").format.columnWidthPx = 220;
dashboard.getRange("B:B").format.columnWidthPx = 110;
dashboard.getRange("C:C").format.columnWidthPx = 180;
dashboard.getRange("D:D").format.columnWidthPx = 220;
dashboard.getRange("E:E").format.columnWidthPx = 90;
dashboard.getRange("F:F").format.columnWidthPx = 360;
events.getRange("A:A").format.columnWidthPx = 190;
events.getRange("B:N").format.columnWidthPx = 150;
setup.getRange("A:A").format.columnWidthPx = 120;
setup.getRange("B:B").format.columnWidthPx = 620;
setup.getRange("A1:D1").format = {
  fontWeight: "bold",
  fontSize: 16,
  fill: { color: "#4E7A62" },
  fontColor: "#FFFFFF"
};

await fs.mkdir("outputs", { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save("outputs/klinikguiden_analytics_dashboard.xlsx");

const check = await workbook.inspect({
  kind: "table",
  range: "Dashboard!A1:F31",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 8
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan"
});
console.log(errors.ndjson);
