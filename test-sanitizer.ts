import { sanitizeInput } from './src/lib/sanitizer';

const testCases = [
  {
    name: 'Simple string with whitespace',
    input: '  hello world  ',
    expected: 'hello world',
  },
  {
    name: 'String with malicious script',
    input: '<script>alert("xss")</script>Hello',
    expected: 'Hello',
  },
  {
    name: 'String with malicious attributes',
    input: '<img src=x onerror=alert(1)>',
    expected: '<img src="x">',
  },
  {
    name: 'Nested object',
    input: {
      name: '  John Doe  ',
      bio: '<p>Loves <b>coding</b> and <script>scripts</script></p>',
      settings: {
        theme: 'dark',
        nested: ['  item 1  ', '<script>bad</script>'],
      },
    },
    expected: {
      name: 'John Doe',
      bio: '<p>Loves <b>coding</b> and </p>',
      settings: {
        theme: 'dark',
        nested: ['item 1', ''],
      },
    },
  },
  {
    name: 'Mixed types',
    input: {
      count: 42,
      isActive: true,
      nothing: null,
      tags: ['a', 'b'],
    },
    expected: {
      count: 42,
      isActive: true,
      nothing: null,
      tags: ['a', 'b'],
    },
  },
];

function runTests() {
  let passed = 0;
  testCases.forEach((tc) => {
    const output = sanitizeInput(tc.input);
    const outputStr = JSON.stringify(output);
    const expectedStr = JSON.stringify(tc.expected);

    if (outputStr === expectedStr) {
      console.log(`✅ PASSED: ${tc.name}`);
      passed++;
    } else {
      console.log(`❌ FAILED: ${tc.name}`);
      console.log(`   Input:    ${JSON.stringify(tc.input)}`);
      console.log(`   Expected: ${expectedStr}`);
      console.log(`   Actual:   ${outputStr}`);
    }
  });

  console.log(`\nTests: ${passed}/${testCases.length} passed`);
}

runTests();
