const SHEET_NAME = 'KlinikGuiden data';
const DASHBOARD_SHEET_NAME = 'Dashboard';
const REPORT_SHEET_NAME = 'Rapporter';
const AI_SHEET_NAME = 'AI analyse';
const HEADERS = [
  'timestamp',
  'type',
  'event',
  'page',
  'path',
  'name',
  'email',
  'guide',
  'product',
  'price',
  'value',
  'sessionId',
  'referrer',
  'trafficSource',
  'visitorType',
  'isReturning',
  'screenSize',
  'errorMessage',
  'details'
];

function doPost(e) {
  const sheet = getSheet();
  const data = e && e.parameter ? e.parameter : {};
  const row = HEADERS.map((header) => data[header] || '');

  if (!row[0]) row[0] = new Date().toISOString();
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  const sheet = getSheet();
  sheet.clear();
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.autoResizeColumns(1, HEADERS.length);
  setupDashboard();
  setupReportsSheet();
  setupAiSheet();
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function setupDashboard() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let dashboard = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME);

  if (!dashboard) {
    dashboard = spreadsheet.insertSheet(DASHBOARD_SHEET_NAME);
  }

  dashboard.clear();
  dashboard.getRange('A1:F1').merge();
  dashboard.getRange('A1').setValue('KlinikGuiden kontrolcenter');
  dashboard.getRange('A1').setFontWeight('bold').setFontSize(18);
  dashboard.getRange('A3:B15').setValues([
    ['KPI', 'Værdi'],
    ['Besøgende i dag', '=IFERROR(COUNTUNIQUE(FILTER(\'KlinikGuiden data\'!L2:L,\'KlinikGuiden data\'!C2:C="page_view",DATEVALUE(LEFT(\'KlinikGuiden data\'!A2:A,10))=TODAY())),0)'],
    ['Besøgende denne uge', '=IFERROR(COUNTUNIQUE(FILTER(\'KlinikGuiden data\'!L2:L,\'KlinikGuiden data\'!C2:C="page_view",DATEVALUE(LEFT(\'KlinikGuiden data\'!A2:A,10))>=TODAY()-WEEKDAY(TODAY(),2)+1)),0)'],
    ['Besøgende denne måned', '=IFERROR(COUNTUNIQUE(FILTER(\'KlinikGuiden data\'!L2:L,\'KlinikGuiden data\'!C2:C="page_view",DATEVALUE(LEFT(\'KlinikGuiden data\'!A2:A,10))>=EOMONTH(TODAY(),-1)+1)),0)'],
    ['Sidevisninger', '=COUNTIF(\'KlinikGuiden data\'!C:C,"page_view")'],
    ['Tilbagevendende besøgende', '=IFERROR(COUNTUNIQUE(FILTER(\'KlinikGuiden data\'!L2:L,\'KlinikGuiden data\'!C2:C="page_view",\'KlinikGuiden data\'!O2:O="tilbagevendende")),0)'],
    ['Nye e-mailtilmeldinger', '=COUNTIF(\'KlinikGuiden data\'!C:C,"newsletter_signup")'],
    ['PDF-downloads', '=COUNTIF(\'KlinikGuiden data\'!C:C,"pdf_download_started")'],
    ['Bestillinger', '=COUNTIF(\'KlinikGuiden data\'!C:C,"order_form_submit")'],
    ['Estimeret omsætning', '=SUMIF(\'KlinikGuiden data\'!C:C,"order_form_submit",\'KlinikGuiden data\'!J:J)'],
    ['Konverteringsrate', '=IFERROR(B11/B6,0)'],
    ['Dagens e-mailtilmeldinger', '=COUNTIFS(\'KlinikGuiden data\'!C:C,"newsletter_signup",\'KlinikGuiden data\'!A:A,">="&TEXT(TODAY(),"yyyy-mm-dd"))'],
    ['Dagens PDF-downloads', '=COUNTIFS(\'KlinikGuiden data\'!C:C,"pdf_download_started",\'KlinikGuiden data\'!A:A,">="&TEXT(TODAY(),"yyyy-mm-dd"))'],
    ['Dagens fejl', '=COUNTIFS(\'KlinikGuiden data\'!C:C,"site_error",\'KlinikGuiden data\'!A:A,">="&TEXT(TODAY(),"yyyy-mm-dd"))']
  ]);

  dashboard.getRange('D3:F18').setValues([
    ['Event', 'Antal', 'Hvad betyder det?'],
    ['page_view', '=COUNTIF(\'KlinikGuiden data\'!C:C,D4)', 'Forsiden er set'],
    ['guide_page_view', '=COUNTIF(\'KlinikGuiden data\'!C:C,D5)', 'En guide-side er set'],
    ['product_page_view', '=COUNTIF(\'KlinikGuiden data\'!C:C,D6)', 'Produktsiden er set'],
    ['hero_free_guides', '=COUNTIF(\'KlinikGuiden data\'!C:C,D7)', 'Klik på gratis guides'],
    ['hero_products', '=COUNTIF(\'KlinikGuiden data\'!C:C,D8)', 'Klik på produkter'],
    ['product_complete_guide_click', '=COUNTIF(\'KlinikGuiden data\'!C:C,D9)', 'Klik på komplet guide'],
    ['product_children_guide_click', '=COUNTIF(\'KlinikGuiden data\'!C:C,D10)', 'Klik på børneguide'],
    ['quiz_answer_selected', '=COUNTIF(\'KlinikGuiden data\'!C:C,D11)', 'Quiz er brugt'],
    ['subsidy_calculated', '=COUNTIF(\'KlinikGuiden data\'!C:C,D12)', 'Beregner er brugt'],
    ['newsletter_signup', '=COUNTIF(\'KlinikGuiden data\'!C:C,D13)', 'Nyhedsbrev tilmelding'],
    ['checkout_started', '=COUNTIF(\'KlinikGuiden data\'!C:C,D14)', 'Stripe-betaling er startet'],
    ['order_form_submit', '=COUNTIF(\'KlinikGuiden data\'!C:C,D15)', 'Betalt ordre registreret'],
    ['waitlist_signup', '=COUNTIF(\'KlinikGuiden data\'!C:C,D16)', 'Venteliste tilmelding'],
    ['pdf_download_started', '=COUNTIF(\'KlinikGuiden data\'!C:C,D17)', 'PDF er downloadet'],
    ['thank_you_page_view', '=COUNTIF(\'KlinikGuiden data\'!C:C,D18)', 'Tak-side er set']
  ]);

  dashboard.getRange('H3:J14').setValues([
    ['Mest besøgte artikler', 'Sidevisninger', 'Note'],
    ['=IFERROR(QUERY(\'KlinikGuiden data\'!C2:D,"select D, count(D) where C = \'page_view\' and D <> \'forside\' group by D order by count(D) desc limit 10 label D \'Side\', count(D) \'Visninger\'",0),"Ingen data endnu")', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  dashboard.getRange('L3:M10').setValues([
    ['Trafikkilde', 'Besøg'],
    ['=IFERROR(QUERY(\'KlinikGuiden data\'!C2:N,"select N, count(N) where C = \'page_view\' group by N order by count(N) desc label N \'Kilde\', count(N) \'Besøg\'",0),"Ingen data endnu")', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', '']
  ]);

  dashboard.getRange('A3:B3').setFontWeight('bold');
  dashboard.getRange('D3:F3').setFontWeight('bold');
  dashboard.getRange('H3:J3').setFontWeight('bold');
  dashboard.getRange('L3:M3').setFontWeight('bold');
  dashboard.getRange('A18:C21').setValues([
    ['Produkt', 'Bestillinger', 'Estimeret omsætning'],
    ['Komplet guide', '=COUNTIFS(\'KlinikGuiden data\'!C:C,"order_form_submit",\'KlinikGuiden data\'!I:I,"komplette")', '=SUMIFS(\'KlinikGuiden data\'!J:J,\'KlinikGuiden data\'!C:C,"order_form_submit",\'KlinikGuiden data\'!I:I,"komplette")'],
    ['Børneguide', '=COUNTIFS(\'KlinikGuiden data\'!C:C,"order_form_submit",\'KlinikGuiden data\'!I:I,"boern")', '=SUMIFS(\'KlinikGuiden data\'!J:J,\'KlinikGuiden data\'!C:C,"order_form_submit",\'KlinikGuiden data\'!I:I,"boern")'],
    ['Venteliste', '=COUNTIFS(\'KlinikGuiden data\'!C:C,"waitlist_signup",\'KlinikGuiden data\'!I:I,"venteliste")', '=SUMIFS(\'KlinikGuiden data\'!J:J,\'KlinikGuiden data\'!C:C,"waitlist_signup",\'KlinikGuiden data\'!I:I,"venteliste")']
  ]);
  dashboard.getRange('A18:C18').setFontWeight('bold');
  dashboard.getRange('B12').setNumberFormat('#,##0 kr');
  dashboard.getRange('B13').setNumberFormat('0.0%');
  dashboard.getRange('C19:C21').setNumberFormat('#,##0 kr');
  dashboard.autoResizeColumns(1, 13);
}

function setupReportsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(REPORT_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(REPORT_SHEET_NAME);

  sheet.clear();
  sheet.getRange('A1:D1').setValues([['Dato', 'Type', 'Nøgletal', 'Anbefalinger']]);
  sheet.getRange('A1:D1').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 4);
}

function setupAiSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(AI_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(AI_SHEET_NAME);

  sheet.clear();
  sheet.getRange('A1:B10').setValues([
    ['AI-analyse / anbefaling', 'Status'],
    ['Artikler der performer bedst', '=IFERROR(INDEX(QUERY(\'KlinikGuiden data\'!C2:D,"select D, count(D) where C = \'page_view\' and D <> \'forside\' group by D order by count(D) desc limit 1 label count(D) \'\'",0),1,1),"Afventer data")'],
    ['Sider besøgende forlader', 'Kræver GA4/Search Console eller udvidet exit-tracking'],
    ['Næste emner at skrive om', '=IFERROR("Skriv mere om: "&INDEX(QUERY(\'KlinikGuiden data\'!H2:H,"select H, count(H) where H is not null group by H order by count(H) desc limit 1 label count(H) \'\'",0),1,1),"Afventer quizdata")'],
    ['Øg e-mailtilmeldinger', '=IF(COUNTIF(\'KlinikGuiden data\'!C:C,"newsletter_signup")<5,"Test stærkere CTA til tjeklisten","Fortsæt med nuværende lead magnet")'],
    ['Øg Google-trafik', 'Forbind Google Search Console og brug top queries til nye artikler'],
    ['Fejl på siden', '=COUNTIF(\'KlinikGuiden data\'!C:C,"site_error")'],
    ['Checkout-friktion', '=IFERROR(COUNTIF(\'KlinikGuiden data\'!C:C,"order_form_submit")/COUNTIF(\'KlinikGuiden data\'!C:C,"checkout_started"),"Afventer checkoutdata")'],
    ['Tilbagevendende besøgende', '=IFERROR(COUNTUNIQUE(FILTER(\'KlinikGuiden data\'!L2:L,\'KlinikGuiden data\'!O2:O="tilbagevendende")),0)'],
    ['Dagligt fokus', '=IF(COUNTIF(\'KlinikGuiden data\'!C:C,"newsletter_signup")=0,"Fokus: få første lead","Fokus: forbedr konvertering fra besøg til lead")']
  ]);
  sheet.getRange('A1:B1').setFontWeight('bold');
  sheet.autoResizeColumns(1, 2);
}

function createDailyReport() {
  const dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DASHBOARD_SHEET_NAME);
  const reports = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REPORT_SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(REPORT_SHEET_NAME);
  const visitors = dashboard.getRange('B4').getDisplayValue();
  const signups = dashboard.getRange('B14').getDisplayValue();
  const downloads = dashboard.getRange('B15').getDisplayValue();
  const errors = dashboard.getRange('B16').getDisplayValue();
  const summary = `Besøgende: ${visitors}. E-mailtilmeldinger: ${signups}. PDF-downloads: ${downloads}. Fejl: ${errors}.`;
  const advice = Number(errors) > 0 ? 'Tjek site_error-rækker i dataarket.' : 'Ingen registrerede fejl. Fokusér på leads og topartikler.';
  reports.appendRow([new Date(), 'Daglig rapport', summary, advice]);
  sendReportEmail('KlinikGuiden daglig rapport', summary + '\n\n' + advice);
}

function createWeeklyReport() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = spreadsheet.getSheetByName(DASHBOARD_SHEET_NAME);
  const reports = spreadsheet.getSheetByName(REPORT_SHEET_NAME) || spreadsheet.insertSheet(REPORT_SHEET_NAME);
  const visitorsWeek = dashboard.getRange('B5').getDisplayValue();
  const conversion = dashboard.getRange('B13').getDisplayValue();
  const summary = `Ugens besøgende: ${visitorsWeek}. Konverteringsrate: ${conversion}. Se Dashboard for top 10 artikler og trafikkilder.`;
  const advice = 'SEO-status: Tjek Google Search Console for queries, indeksering og sider med fald. Skriv næste artikel ud fra quizdata og mest besøgte guides.';
  reports.appendRow([new Date(), 'Ugentlig rapport', summary, advice]);
  sendReportEmail('KlinikGuiden ugentlig rapport', summary + '\n\n' + advice);
}

function sendReportEmail(subject, body) {
  const email = Session.getActiveUser().getEmail();
  if (email) MailApp.sendEmail(email, subject, body);
}

function setupReportTriggers() {
  ScriptApp.getProjectTriggers().forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('createDailyReport').timeBased().everyDays(1).atHour(7).create();
  ScriptApp.newTrigger('createWeeklyReport').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
}
