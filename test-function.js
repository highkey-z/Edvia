// Test the simplify function locally
const { simplifyText, extractVocabulary } = require('./client/api/simplify.js');

// Test data
const testText = "Although I had spent hours refining the interface to make it intuitive for students, I realized that the true measure of success would come only when they could use the platform independently and confidently, discovering insights on their own that I hadn't anticipated.";

console.log('🧪 Testing local simplification...');
console.log('📝 Original text:', testText);
console.log('\n📚 Grade 3 simplification:');
const grade3Result = simplifyText(testText, 'grade3');
console.log(grade3Result);

console.log('\n📚 Middle School simplification:');
const middleSchoolResult = simplifyText(testText, 'middle-school');
console.log(middleSchoolResult);

console.log('\n📚 Vocabulary extraction:');
const vocabulary = extractVocabulary(testText, 'grade3');
console.log(vocabulary);
