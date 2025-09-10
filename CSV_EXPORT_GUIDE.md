# Enhanced CSV Export Guide

## Overview
The pacing guide generator now includes an optimized CSV export feature designed specifically for Excel and Google Sheets compatibility, with special attention to printing on standard 8.5" x 11" paper.

## Features

### ✅ Enhanced CSV Export
- **Excel Compatible**: Includes BOM (Byte Order Mark) for proper character encoding
- **Google Sheets Ready**: Optimized format that imports cleanly
- **Print Optimized**: Column layout designed for 8.5" x 11" paper in both portrait and landscape
- **Session Details Preserved**: Complete 5-day lesson structure information included

### 📊 CSV Structure

#### Header Information
- **Summary Section**: Grade level, timeframe, total weeks, generation date
- **Column Headers**: Week, Unit/Topic, Lesson Title, Session Flow, Duration, Complexity, Key Standards, Assessment

#### Data Layout
- **One Row Per Lesson**: Each lesson gets its own row for clarity
- **Session Flow**: Shows exact progression (e.g., "Develop → Develop → Refine")
- **Duration**: Displays lesson length (1-4 days)
- **Complexity**: Indicates difficulty level (low/medium/high)
- **Standards**: Limited to 2 key standards per row for readability

### 🖨️ Print Optimization

#### Portrait Mode (8.5" x 11")
- **Recommended Columns**: Week, Unit/Topic, Lesson Title, Session Flow
- **Font Size**: 10-11pt for optimal readability
- **Margins**: 0.5" all around

#### Landscape Mode (11" x 8.5")
- **All Columns Visible**: Complete data set fits comfortably
- **Font Size**: 9-10pt recommended
- **Margins**: 0.25" for maximum space utilization

### 📁 File Output
- **Filename Format**: `pacing-guide-grade-[GRADE]-detailed.csv`
- **Character Encoding**: UTF-8 with BOM
- **Line Endings**: Windows (CRLF) for Excel compatibility

## Usage Instructions

### In Excel
1. **Open**: Double-click the CSV file - it should open directly
2. **Format**: Use "Format as Table" for better readability
3. **Print Setup**: 
   - Landscape orientation for full data
   - Scale to fit on one page width
   - Repeat row headers on each page

### In Google Sheets
1. **Import**: File → Import → Upload → Select CSV file
2. **Format**: 
   - Auto-resize columns for optimal width
   - Apply alternating row colors for readability
3. **Print Setup**:
   - Landscape orientation
   - Scale to fit width
   - Repeat frozen rows

### Print Settings Recommendations

#### For Portrait Printing
```
Orientation: Portrait
Scale: Fit to 1 page wide
Columns to include: Week, Unit/Topic, Lesson Title, Session Flow
Font: 10-11pt
Margins: 0.5" all sides
```

#### For Landscape Printing
```
Orientation: Landscape
Scale: Fit to 1 page wide, unlimited pages tall
Columns: All columns visible
Font: 9-10pt
Margins: 0.25" all sides
```

## Technical Details

### CSV Format Specifications
- **Delimiter**: Comma (,)
- **Text Qualifier**: Double quotes (")
- **Escape Character**: Double quote ("") for literal quotes
- **Encoding**: UTF-8 with BOM (\\uFEFF)
- **Line Terminator**: CRLF (\\r\\n)

### Data Validation
- **Empty Cell Handling**: Empty cells are properly quoted as ""
- **Special Characters**: Properly escaped in cell content
- **Long Text**: Wrapped in quotes to preserve formatting

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## Example Output

```csv
"PACING GUIDE SUMMARY","","","","","","",""
"Grade Level:","8+9","","","","","",""
"Timeframe:","year","","","","","",""
"Total Weeks:","36","","","","","",""
"Generated:","1/15/2025","","","","","",""
"","","","","","","",""
"Week","Unit/Topic","Lesson Title","Session Flow","Duration","Complexity","Key Standards","Assessment"
"1","Geometric Figures","Lesson 1: Understand Rigid Transformations","Develop → Develop → Refine","3 days","high","8.G.A.1; 8.G.A.2","Formative"
"","","Lesson 2: Transformations and Congruence","Develop → Develop","2 days","medium","","",
```

## Troubleshooting

### Common Issues

#### Excel Issues
- **Problem**: Garbled characters
- **Solution**: Ensure file is saved with UTF-8 BOM encoding

#### Google Sheets Issues
- **Problem**: Columns not aligned properly
- **Solution**: Use "Data → Split text to columns" if needed

#### Printing Issues
- **Problem**: Text cut off
- **Solution**: Adjust scale to "Fit to page width" or reduce font size

### File Size Considerations
- **Typical Size**: 50-150KB for full year curriculum
- **Maximum Recommended**: 1MB for optimal spreadsheet performance
- **Large Datasets**: Consider splitting by semester if over 1MB

## Version History

### v2.0 (Current)
- ✅ Enhanced Excel/Google Sheets compatibility
- ✅ Print optimization for 8.5" x 11" paper
- ✅ Complete session details preservation
- ✅ Summary header information
- ✅ Improved column structure

### v1.0 (Previous)
- Basic CSV export
- Limited session information
- Generic formatting
