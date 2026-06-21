import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("outputs/klinikguiden_analytics_dashboard.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
await fs.mkdir("outputs/rendered", { recursive: true });

for (const [sheetName, range] of [
  ["Dashboard", "A1:F31"],
  ["Events", "A1:N8"],
  ["Opsætning", "A1:D12"]
]) {
  const image = await workbook.render({ sheetName, range, scale: 2 });
  if (typeof image.bytes === "function") {
    await fs.writeFile(`outputs/rendered/${sheetName}.png`, await image.bytes());
  } else if (image.buffer) {
    await fs.writeFile(`outputs/rendered/${sheetName}.png`, image.buffer);
  } else if (image instanceof Uint8Array) {
    await fs.writeFile(`outputs/rendered/${sheetName}.png`, image);
  }
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan after export"
});
console.log(errors.ndjson);
