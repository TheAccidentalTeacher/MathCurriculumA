-- OCR Processing Extensions for Math Curriculum Database
-- Add OCR-related columns to existing tables

-- Add OCR columns to lessons table
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS ocr_content TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS mathematical_formulas JSONB;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS extraction_confidence DECIMAL(5,4);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS ocr_processed_at TIMESTAMP;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS ocr_processing_time_ms INTEGER;

-- Create OCR processing jobs table
CREATE TABLE IF NOT EXISTS ocr_processing_jobs (
  id SERIAL PRIMARY KEY,
  job_id VARCHAR(100) UNIQUE NOT NULL,
  volume_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_pages INTEGER DEFAULT 0,
  processed_pages INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  results JSONB DEFAULT '[]',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for job lookups
CREATE INDEX IF NOT EXISTS idx_ocr_jobs_job_id ON ocr_processing_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_ocr_jobs_volume_id ON ocr_processing_jobs(volume_id);
CREATE INDEX IF NOT EXISTS idx_ocr_jobs_status ON ocr_processing_jobs(status);

-- Create OCR page results table for detailed tracking
CREATE TABLE IF NOT EXISTS ocr_page_results (
  id SERIAL PRIMARY KEY,
  job_id VARCHAR(100) NOT NULL,
  volume_id VARCHAR(50) NOT NULL,
  page_number INTEGER NOT NULL,
  extracted_text TEXT,
  mathematical_formulas JSONB DEFAULT '[]',
  tables_data JSONB DEFAULT '[]',
  confidence DECIMAL(5,4) DEFAULT 0,
  processing_time_ms INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Foreign key constraint
  CONSTRAINT fk_ocr_page_results_job 
    FOREIGN KEY (job_id) 
    REFERENCES ocr_processing_jobs(job_id) 
    ON DELETE CASCADE
);

-- Create indexes for page results
CREATE INDEX IF NOT EXISTS idx_ocr_page_results_job_id ON ocr_page_results(job_id);
CREATE INDEX IF NOT EXISTS idx_ocr_page_results_volume_page ON ocr_page_results(volume_id, page_number);
CREATE INDEX IF NOT EXISTS idx_ocr_page_results_confidence ON ocr_page_results(confidence);

-- Create function to update timestamp on record changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at timestamp
DROP TRIGGER IF EXISTS update_ocr_jobs_updated_at ON ocr_processing_jobs;
CREATE TRIGGER update_ocr_jobs_updated_at
    BEFORE UPDATE ON ocr_processing_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes to existing tables for OCR integration
CREATE INDEX IF NOT EXISTS idx_lessons_ocr_processed ON lessons(ocr_processed_at) WHERE ocr_processed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lessons_confidence ON lessons(extraction_confidence) WHERE extraction_confidence IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lessons_formulas ON lessons USING GIN (mathematical_formulas) WHERE mathematical_formulas IS NOT NULL;

-- Create view for OCR processing statistics
CREATE OR REPLACE VIEW ocr_processing_stats AS
SELECT 
  volume_id,
  COUNT(*) as total_jobs,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_jobs,
  SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as active_jobs,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_jobs,
  SUM(total_pages) as total_pages_queued,
  SUM(processed_pages) as total_pages_processed,
  ROUND(AVG(progress), 2) as avg_progress,
  MIN(started_at) as first_job_started,
  MAX(completed_at) as last_job_completed
FROM ocr_processing_jobs
GROUP BY volume_id;

-- Grant permissions (adjust as needed for your user)
-- GRANT ALL PRIVILEGES ON ocr_processing_jobs TO your_app_user;
-- GRANT ALL PRIVILEGES ON ocr_page_results TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE ocr_processing_jobs_id_seq TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE ocr_page_results_id_seq TO your_app_user;
