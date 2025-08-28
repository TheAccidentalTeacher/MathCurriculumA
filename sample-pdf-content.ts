// sample-pdf-content.ts - Let's see what raw content looks like
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

async function samplePDF() {
  const pdfPath = path.join(process.cwd(), 'pdfs', 'RCM07_NA_SW_V1.pdf');
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  
  console.log('=== PDF ANALYSIS ===');
  console.log(`File: RCM07_NA_SW_V1.pdf`);
  console.log(`Pages: ${data.numpages}`);
  console.log(`Total text length: ${data.text.length} chars`);
  console.log('\n=== FIRST 2000 CHARACTERS ===');
  console.log(data.text.substring(0, 2000));
  console.log('\n=== LAST 1000 CHARACTERS ===');
  console.log(data.text.substring(data.text.length - 1000));
}

samplePDF().catch(console.error);
