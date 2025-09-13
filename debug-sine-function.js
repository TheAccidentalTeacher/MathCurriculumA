// Debug script to test sine function evaluation

console.log('🌊 Testing Sine Function Evaluation...\n');

// Replicate the evaluateFunction logic from PlotlyGrapher
function evaluateFunction(expression, x) {
  let expr = expression
    .replace(/\^/g, '**')           // x^2 -> x**2
    .replace(/(\d+)x/g, '$1*x')     // 2x -> 2*x, 3x -> 3*x
    .replace(/x(\d+)/g, 'x*$1')     // x2 -> x*2
    .replace(/\)(\d+)/g, ')*$1')    // )2 -> )*2  
    .replace(/(\d+)\(/g, '$1*(')    // 2( -> 2*(
    .replace(/x/g, `(${x})`)        // Replace x with actual value
    .replace(/sin/g, 'Math.sin')    // sin -> Math.sin
    .replace(/cos/g, 'Math.cos')    // cos -> Math.cos
    .replace(/tan/g, 'Math.tan')    // tan -> Math.tan
    .replace(/log/g, 'Math.log10')  // log -> Math.log10
    .replace(/ln/g, 'Math.log')     // ln -> Math.log
    .replace(/sqrt/g, 'Math.sqrt')  // sqrt -> Math.sqrt
    .replace(/abs/g, 'Math.abs')    // abs -> Math.abs
    .replace(/pi/g, 'Math.PI')      // pi -> Math.PI
    .replace(/e/g, 'Math.E');       // e -> Math.E

  console.log(`Original: ${expression} | x=${x} | Transformed: ${expr}`);
  
  try {
    const result = new Function('return ' + expr)();
    console.log(`Result: ${result}`);
    return result;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    throw new Error(`Invalid expression: ${expression}`);
  }
}

// Test different sine function expressions
const testExpressions = [
  'sin(x)',
  'sin(x)',  // Might have different quotes/formatting
  'Math.sin(x)',
  '\\sin(x)',
  'sin',
  'sin x'
];

const testX = Math.PI / 2; // Should give sin(π/2) = 1

console.log('Testing different expressions for x = π/2 (should equal 1):');
testExpressions.forEach((expr, i) => {
  console.log(`\n${i + 1}. Testing: "${expr}"`);
  try {
    const result = evaluateFunction(expr, testX);
    const isCorrect = Math.abs(result - 1) < 0.0001;
    console.log(`   ✓ Result: ${result.toFixed(4)} ${isCorrect ? '✅ CORRECT' : '❌ WRONG'}`);
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  }
});

// Test edge cases that might cause the empty graph
console.log('\n\nTesting edge cases:');

const edgeCases = [
  { expr: 'sin(x)', x: 0 },        // Should be 0
  { expr: 'sin(x)', x: Math.PI },  // Should be ~0
  { expr: 'sin(x)', x: -Math.PI }, // Should be ~0
  { expr: 'sin(x)', x: NaN },      // Should throw or return NaN
  { expr: 'sin(x)', x: Infinity }, // Should throw or return NaN
];

edgeCases.forEach(({expr, x}, i) => {
  console.log(`\n${i + 1}. Testing: ${expr} at x=${x}`);
  try {
    const result = evaluateFunction(expr, x);
    const isFinite = Number.isFinite(result);
    console.log(`   Result: ${result} ${isFinite ? '✅ Finite' : '❌ Not Finite'}`);
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  }
});

// Test the range detection logic we implemented
console.log('\n\nTesting range detection:');
const functions = ['sin(x)'];
const hasTrig = functions.some(func => /sin|cos|tan/.test(func));
console.log(`Functions: ${functions.join(', ')}`);
console.log(`Has trigonometric: ${hasTrig}`);

if (hasTrig) {
  const xRange = [-2 * Math.PI, 2 * Math.PI];
  const yRange = [-3, 3];
  console.log(`Should use xRange: [${xRange[0].toFixed(2)}, ${xRange[1].toFixed(2)}]`);
  console.log(`Should use yRange: [${yRange[0]}, ${yRange[1]}]`);
}

console.log('\n🔍 Check this output to debug the sine function issue!');
