function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

function splitCsvRecords(text: string): string[] {
  const records: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '""';
        i += 1;
      } else {
        inQuotes = !inQuotes;
        current += char;
      }
      continue;
    }

    if ((char === "\n" || (char === "\r" && next === "\n")) && !inQuotes) {
      if (char === "\r") i += 1;
      if (current.trim().length > 0) records.push(current);
      current = "";
      continue;
    }

    if (char === "\r" && !inQuotes) {
      if (current.trim().length > 0) records.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim().length > 0) records.push(current);
  return records;
}

export function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const records = splitCsvRecords(text.trim());
  if (records.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(records[0]);
  const rows = records.slice(1).map(parseCsvLine);
  return { headers, rows };
}
