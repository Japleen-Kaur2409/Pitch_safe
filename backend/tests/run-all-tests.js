// tests/run-all-tests.js
/**
 * Comprehensive Test Runner for PitchSafe Backend
 * 
 * This script runs all test suites and generates coverage reports
 * 
 * Usage:
 *   npm test                    # Run all tests
 *   npm run test:watch          # Run tests in watch mode
 *   npm run test:coverage       # Run tests with coverage
 *   npm run test:unit           # Run only unit tests
 *   npm run test:integration    # Run only integration tests
 */

const { execSync } = require('child_process');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function runTests() {
  log('\n' + '='.repeat(70), 'cyan');
  log('   PITCHSAFE BACKEND - COMPREHENSIVE TEST SUITE', 'bright');
  log('='.repeat(70) + '\n', 'cyan');

  const testSuites = [
    {
      name: 'Unit Tests - Entities',
      path: 'tests/unit/entities',
      description: 'Testing domain entities (Player, Game, User)'
    },
    {
      name: 'Unit Tests - Use Cases',
      path: 'tests/unit/use-cases',
      description: 'Testing business logic use cases'
    },
    {
      name: 'Integration Tests',
      path: 'tests/integration',
      description: 'Testing component integration'
    }
  ];

  let totalPassed = 0;
  let totalFailed = 0;
  const results = [];

  testSuites.forEach((suite, index) => {
    log(`\n[${index + 1}/${testSuites.length}] Running: ${suite.name}`, 'yellow');
    log(`Description: ${suite.description}`, 'blue');
    log('-'.repeat(70));

    try {
      // Run Jest for this specific test path
      execSync(`npx jest ${suite.path} --verbose`, {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      log(`✓ ${suite.name} - PASSED`, 'green');
      results.push({ suite: suite.name, status: 'PASSED' });
      totalPassed++;
    } catch (error) {
      log(`✗ ${suite.name} - FAILED`, 'red');
      results.push({ suite: suite.name, status: 'FAILED' });
      totalFailed++;
    }
  });

  // Print summary
  log('\n' + '='.repeat(70), 'cyan');
  log('   TEST SUMMARY', 'bright');
  log('='.repeat(70), 'cyan');
  
  results.forEach(result => {
    const color = result.status === 'PASSED' ? 'green' : 'red';
    const symbol = result.status === 'PASSED' ? '✓' : '✗';
    log(`${symbol} ${result.suite}: ${result.status}`, color);
  });

  log('\n' + '-'.repeat(70));
  log(`Total Suites: ${testSuites.length}`, 'blue');
  log(`Passed: ${totalPassed}`, 'green');
  log(`Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green');
  log('='.repeat(70) + '\n', 'cyan');

  if (totalFailed > 0) {
    log('⚠ Some tests failed. Please review the output above.', 'red');
    process.exit(1);
  } else {
    log('✓ All test suites passed successfully!', 'green');
    log('💯 Your code is protected and ready for deployment!', 'bright');
  }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  log(`\n✗ Uncaught Exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`\n✗ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

// Run the tests
runTests();
