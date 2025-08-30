// Final cleanup: Fix incorrect search patterns
const fs = require('fs');

console.log('🔧 FINAL CLEANUP: Fixing search patterns...');

const filePath = 'src/lib/accelerated-pathway.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix specific incorrect patterns that we know about
const fixes = [
  {
    from: 'searchPattern: "LESSON 1 | UNIT A: PROPORTIONAL RELATIONSHIPS: RATIOS, RATES, AND CIRCLES"',
    to: 'searchPattern: "LESSON 1 | SOLVE PROBLEMS INVOLVING SCALE"'
  },
  {
    from: 'fallbackPattern: "Unit A: Proportional Relationships: Ratios, Rates, and Circles"',
    to: 'fallbackPattern: "Solve Problems Involving Scale"'
  },
  {
    from: 'searchPattern: "LESSON 7 | UNIT B: NUMBERS AND OPERATIONS: OPERATIONS WITH RATIONAL NUMBERS"',
    to: 'searchPattern: "LESSON 7 | UNDERSTAND ADDITION WITH NEGATIVE INTEGERS"'  
  },
  {
    from: 'fallbackPattern: "Unit B: Numbers and Operations: Operations with Rational Numbers"',
    to: 'fallbackPattern: "Understand Addition with Negative Integers"'
  },
  {
    from: 'searchPattern: "LESSON 14 | UNIT C: EXPRESSIONS AND EQUATIONS: APPLICATIONS OF RATIONAL NUMBERS"',
    to: 'searchPattern: "LESSON 14 | USE THE FOUR OPERATIONS WITH NEGATIVE NUMBERS"'
  },
  {
    from: 'fallbackPattern: "Unit C: Expressions and Equations: Applications of Rational Numbers"',
    to: 'fallbackPattern: "Use the Four Operations with Negative Numbers"'
  }
];

let fixCount = 0;
for (const fix of fixes) {
  if (content.includes(fix.from)) {
    content = content.replace(fix.from, fix.to);
    fixCount++;
    console.log('✓ Fixed search pattern');
  }
}

fs.writeFileSync(filePath, content);

console.log(`\n🎉 Final cleanup complete!`);
console.log(`✅ Applied ${fixCount} pattern fixes`);
console.log(`📁 Updated: ${filePath}`);
