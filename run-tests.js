#!/usr/bin/env node
/**
 * run-tests.js — Newman CI runner for Disconnect Agencies API
 *
 * Usage:
 *   node run-tests.js                          # local (localhost:3000)
 *   BASE_URL=https://yourdomain.com node run-tests.js
 *   ADMIN_EMAIL=x ADMIN_PASSWORD=y node run-tests.js
 *
 * Outputs:
 *   - Console (CLI reporter)
 *   - newman-report.html (htmlextra reporter, if installed)
 *   - Exit code 1 on any test failure (CI-friendly)
 */

const newman = require('newman');
const path   = require('path');
const fs     = require('fs');

// ── Config ───────────────────────────────────────────────────────────────────
const BASE_URL       = process.env.BASE_URL       || 'http://localhost:3000/api';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const TIMEOUT_MS     = parseInt(process.env.REQUEST_TIMEOUT || '15000', 10);

const collectionPath  = path.join(__dirname, 'collection.json');
const environmentPath = path.join(__dirname, 'environment.json');
const reportDir       = path.join(__dirname, 'test-reports');

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

// ── Patch environment at runtime ─────────────────────────────────────────────
const envFile   = JSON.parse(fs.readFileSync(environmentPath, 'utf8'));
const envValues = envFile.values;

function setEnvVar(key, value) {
  const v = envValues.find(e => e.key === key);
  if (v) v.value = value;
  else envValues.push({ key, value, enabled: true });
}

setEnvVar('baseUrl',        BASE_URL);
if (ADMIN_EMAIL)    setEnvVar('admin_email',    ADMIN_EMAIL);
if (ADMIN_PASSWORD) setEnvVar('admin_password', ADMIN_PASSWORD);

// ── Reporters ─────────────────────────────────────────────────────────────────
let reporters = ['cli'];
let reporterOptions = {
  cli: { silent: false }
};

// Add HTML report if htmlextra is available
try {
  require.resolve('newman-reporter-htmlextra');
  reporters.push('htmlextra');
  reporterOptions.htmlextra = {
    export:    path.join(reportDir, 'api-test-report.html'),
    title:     'Disconnect Agencies — API Test Report',
    darkTheme: true,
    showEnvironmentData: true,
    skipSensitiveData:   true,
    omitRequestBodies:   false,
    omitResponseBodies:  false
  };
  console.log('📊 HTML report will be saved to:', reporterOptions.htmlextra.export);
} catch (_) {
  console.log('ℹ️  HTMLExtra reporter not installed. Run: npm i -D newman-reporter-htmlextra');
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('  🚀  Disconnect Agencies API Test Suite');
console.log(`  🌐  Base URL : ${BASE_URL}`);
console.log(`  ⏱   Timeout  : ${TIMEOUT_MS}ms`);
console.log('═══════════════════════════════════════════════════════════');
console.log('');

newman.run(
  {
    collection:  require(collectionPath),
    environment: envFile,
    timeoutRequest: TIMEOUT_MS,
    reporters,
    reporter: reporterOptions,
    delayRequest:   200,   // 200ms between requests — avoids rate limits
    bail:           false  // Do NOT bail on first failure — run all tests
  },
  (err, summary) => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');

    if (err) {
      console.error('❌  Newman runner error:', err.message);
      process.exit(1);
    }

    const { stats, failures } = summary.run;

    console.log(`  ✅  Tests       : ${stats.tests.total}`);
    console.log(`  ✅  Passed      : ${stats.tests.pending}`);
    console.log(`  ❌  Failed      : ${stats.tests.failed}`);
    console.log(`  📨  Requests    : ${stats.requests.total}`);
    console.log(`  🌐  Assertions  : ${stats.assertions.total}`);
    console.log('');

    if (failures.length > 0) {
      console.log('─── Failures ───────────────────────────────────────────────');
      failures.forEach((f, i) => {
        const name = f.source && f.source.name ? f.source.name : 'Unknown';
        const msg  = f.error  && f.error.message ? f.error.message : String(f.error);
        console.log(`  [${i + 1}] ${name}`);
        console.log(`       ${msg}`);
      });
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════');

    if (stats.tests.failed > 0 || stats.assertions.failed > 0) {
      console.error(`\n💥  ${stats.tests.failed} test(s) failed. Build FAILED.\n`);
      process.exit(1);
    }

    console.log('\n🎉  All tests passed!\n');
    process.exit(0);
  }
);
