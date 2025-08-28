// ingest-pdfs.ts
// Script to parse all PDFs in the /pdfs directory and output JSON to /data

import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

const pdfsDir = path.join(__dirname, '../pdfs');
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

async function parsePDF(filePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return {
    file: path.basename(filePath),
    text: data.text,
    info: data.info,
    metadata: data.metadata,
  };
}

async function main() {
  const files = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));
  const results = [];
  for (const file of files) {
    const fullPath = path.join(pdfsDir, file);
    const parsed = await parsePDF(fullPath);
    results.push(parsed);
    fs.writeFileSync(
      path.join(dataDir, file.replace(/\.pdf$/i, '.json')),
      JSON.stringify(parsed, null, 2)
    );
    console.log(`Parsed: ${file}`);
  }
  fs.writeFileSync(path.join(dataDir, 'all.json'), JSON.stringify(results, null, 2));
  console.log('All PDFs parsed.');
}

main().catch(console.error);
