declare module 'pdf-parse' {
  interface PDFInfo {
    [key: string]: any;
  }
  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info?: PDFInfo;
    metadata?: any;
    text: string;
    version: string;
  }
  function pdf(data: Buffer | Uint8Array): Promise<PDFParseResult>;
  export default pdf;
}
