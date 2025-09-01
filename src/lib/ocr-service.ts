import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';

export interface OCRResult {
  pageNumber: number;
  extractedText: string;
  mathematicalFormulas: string[];
  tables: TableData[];
  confidence: number;
  processingTimeMs: number;
  metadata: {
    language: string;
    pageCount: number;
    extractedAt: string;
  };
}

export interface TableData {
  rows: string[][];
  confidence: number;
  boundingBox: Array<{ x: number; y: number }>;
}

export interface OCRJobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  totalPages: number;
  processedPages: number;
  errors: string[];
  results?: OCRResult[];
  startedAt: string;
  completedAt?: string;
}

export class OCRService {
  private static client: DocumentAnalysisClient;
  private static initialized = false;

  private static initialize() {
    if (!this.initialized) {
      const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT;
      const key = process.env.AZURE_AI_FOUNDRY_KEY;
      
      if (!endpoint || !key) {
        throw new Error('Azure AI Foundry credentials not found in environment variables');
      }

      this.client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
      this.initialized = true;
      console.log('✅ Azure Document Intelligence client initialized');
    }
  }

  /**
   * Process a single page image with Azure Document Intelligence
   */
  static async processPageImage(
    imagePath: string, 
    pageNumber: number
  ): Promise<OCRResult> {
    this.initialize();
    
    const startTime = Date.now();
    console.log(`📄 Processing page ${pageNumber}: ${imagePath}`);

    try {
      // Read the image file
      const fs = await import('fs/promises');
      const imageBuffer = await fs.readFile(imagePath);
      
      // Use the layout model for comprehensive extraction
      const poller = await this.client.beginAnalyzeDocument(
        'prebuilt-layout',
        imageBuffer,
        {
          features: ['formulas'],
          // Enable formula detection for mathematical content
        }
      );

      const result = await poller.pollUntilDone();
      const processingTimeMs = Date.now() - startTime;

      // Extract text content
      const extractedText = result.content || '';

      // Extract mathematical formulas
      const mathematicalFormulas: string[] = [];
      if (result.pages) {
        for (const page of result.pages) {
          if (page.formulas) {
            for (const formula of page.formulas) {
              if (formula.value) {
                mathematicalFormulas.push(formula.value);
              }
            }
          }
        }
      }

      // Extract tables
      const tables: TableData[] = [];
      if (result.tables) {
        for (const table of result.tables) {
          const rows: string[][] = [];
          const tableRows: { [key: number]: string[] } = {};
          
          for (const cell of table.cells) {
            if (!tableRows[cell.rowIndex]) {
              tableRows[cell.rowIndex] = [];
            }
            tableRows[cell.rowIndex][cell.columnIndex] = cell.content || '';
          }
          
          // Convert to array format
          for (let i = 0; i < table.rowCount; i++) {
            rows.push(tableRows[i] || []);
          }

          tables.push({
            rows,
            confidence: table.boundingRegions?.[0]?.polygon ? 0.9 : 0.7, // Estimate confidence
            boundingBox: table.boundingRegions?.[0]?.polygon?.map(point => ({ x: point.x, y: point.y })) || []
          });
        }
      }

      // Calculate overall confidence (estimate based on content length and structure)
      let confidence = 0.8; // Base confidence
      if (extractedText.length > 100) confidence += 0.1;
      if (mathematicalFormulas.length > 0) confidence += 0.05;
      if (tables.length > 0) confidence += 0.05;
      confidence = Math.min(confidence, 0.99);

      const ocrResult: OCRResult = {
        pageNumber,
        extractedText,
        mathematicalFormulas,
        tables,
        confidence,
        processingTimeMs,
        metadata: {
          language: 'en',
          pageCount: 1,
          extractedAt: new Date().toISOString()
        }
      };

      console.log(`✅ Page ${pageNumber} processed in ${processingTimeMs}ms (${extractedText.length} chars, ${mathematicalFormulas.length} formulas)`);
      
      return ocrResult;

    } catch (error) {
      console.error(`❌ Error processing page ${pageNumber}:`, error);
      
      // Return a failed result
      return {
        pageNumber,
        extractedText: '',
        mathematicalFormulas: [],
        tables: [],
        confidence: 0,
        processingTimeMs: Date.now() - startTime,
        metadata: {
          language: 'en',
          pageCount: 1,
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Batch process all pages in a volume
   */
  static async batchProcessVolume(
    volumeId: string,
    onProgress?: (status: OCRJobStatus) => void
  ): Promise<OCRJobStatus> {
    this.initialize();

    const jobId = `ocr-${volumeId}-${Date.now()}`;
    const startedAt = new Date().toISOString();
    
    console.log(`🚀 Starting batch OCR processing for volume: ${volumeId}`);
    
    // Get all page files for this volume
    const path = await import('path');
    const fs = await import('fs/promises');
    
    const volumePath = path.join(process.cwd(), 'webapp_pages', volumeId);
    
    try {
      const files = await fs.readdir(volumePath);
      const imageFiles = files
        .filter(file => file.match(/\.(png|jpg|jpeg)$/i))
        .sort((a, b) => {
          // Sort numerically by page number
          const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
          const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
          return aNum - bNum;
        });

      const totalPages = imageFiles.length;
      let processedPages = 0;
      const results: OCRResult[] = [];
      const errors: string[] = [];

      const jobStatus: OCRJobStatus = {
        jobId,
        status: 'processing',
        progress: 0,
        totalPages,
        processedPages,
        errors,
        results,
        startedAt
      };

      // Process pages with concurrency control (max 3 concurrent)
      const concurrency = 3;
      const batches: string[][] = [];
      
      for (let i = 0; i < imageFiles.length; i += concurrency) {
        batches.push(imageFiles.slice(i, i + concurrency));
      }

      for (const batch of batches) {
        const batchPromises = batch.map(async (filename, batchIndex) => {
          const pageNumber = processedPages + batchIndex + 1;
          const imagePath = path.join(volumePath, filename);
          
          try {
            const result = await this.processPageImage(imagePath, pageNumber);
            return { success: true, result };
          } catch (error) {
            const errorMsg = `Page ${pageNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            errors.push(errorMsg);
            return { success: false, error: errorMsg };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach(({ success, result, error }) => {
          if (success && result) {
            results.push(result);
          }
          processedPages++;
        });

        // Update progress
        jobStatus.progress = Math.round((processedPages / totalPages) * 100);
        jobStatus.processedPages = processedPages;
        
        // Call progress callback
        if (onProgress) {
          onProgress({ ...jobStatus });
        }

        console.log(`📊 Progress: ${processedPages}/${totalPages} pages (${jobStatus.progress}%)`);

        // Small delay between batches to avoid overwhelming the API
        if (processedPages < totalPages) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Complete the job
      jobStatus.status = results.length > 0 ? 'completed' : 'failed';
      jobStatus.completedAt = new Date().toISOString();
      jobStatus.results = results;

      const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
      const totalFormulas = results.reduce((sum, r) => sum + r.mathematicalFormulas.length, 0);
      const totalTables = results.reduce((sum, r) => sum + r.tables.length, 0);

      console.log(`🎉 Batch processing completed for ${volumeId}:`);
      console.log(`   📄 Pages processed: ${results.length}/${totalPages}`);
      console.log(`   🎯 Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
      console.log(`   📐 Mathematical formulas found: ${totalFormulas}`);
      console.log(`   📊 Tables extracted: ${totalTables}`);
      console.log(`   ⚠️  Errors: ${errors.length}`);

      return jobStatus;

    } catch (error) {
      console.error(`❌ Batch processing failed for ${volumeId}:`, error);
      
      return {
        jobId,
        status: 'failed',
        progress: 0,
        totalPages: 0,
        processedPages: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        startedAt,
        completedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Get available volumes for OCR processing
   */
  static async getAvailableVolumes(): Promise<string[]> {
    try {
      const path = await import('path');
      const fs = await import('fs/promises');
      
      const webappPagesPath = path.join(process.cwd(), 'webapp_pages');
      const entries = await fs.readdir(webappPagesPath, { withFileTypes: true });
      
      const volumes = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .filter(name => name.match(/^RCM\d{2}_NA_SW_V\d$/)) // Match curriculum volume pattern
        .sort();

      console.log(`📚 Available volumes for OCR: ${volumes.join(', ')}`);
      return volumes;

    } catch (error) {
      console.error('❌ Error getting available volumes:', error);
      return [];
    }
  }

  /**
   * Test the OCR service with a single page
   */
  static async testOCR(volumeId?: string): Promise<OCRResult | null> {
    try {
      const volumes = await this.getAvailableVolumes();
      if (volumes.length === 0) {
        throw new Error('No volumes available for testing');
      }

      const testVolume = volumeId || volumes[0];
      console.log(`🧪 Testing OCR with volume: ${testVolume}`);

      const path = await import('path');
      const fs = await import('fs/promises');
      
      const volumePath = path.join(process.cwd(), 'webapp_pages', testVolume);
      const files = await fs.readdir(volumePath);
      const imageFiles = files.filter(file => file.match(/\.(png|jpg|jpeg)$/i));
      
      if (imageFiles.length === 0) {
        throw new Error(`No image files found in ${testVolume}`);
      }

      // Test with the first page
      const testFile = imageFiles[0];
      const testImagePath = path.join(volumePath, testFile);
      
      console.log(`🔍 Testing with: ${testImagePath}`);
      
      const result = await this.processPageImage(testImagePath, 1);
      
      console.log(`✅ OCR test completed successfully!`);
      console.log(`   📝 Text extracted: ${result.extractedText.length} characters`);
      console.log(`   📐 Formulas found: ${result.mathematicalFormulas.length}`);
      console.log(`   📊 Tables found: ${result.tables.length}`);
      console.log(`   🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      
      return result;

    } catch (error) {
      console.error('❌ OCR test failed:', error);
      return null;
    }
  }
}
