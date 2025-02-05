import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:3001';
const HEADERS = { 'Content-Type': 'application/json' };

export default function () {
  // Test 1: SQL Injection Attempt
  let sqlRes = http.post(`${BASE_URL}/login`, JSON.stringify({ email: "' OR 1=1 --", password: "password" }), { headers: HEADERS });
  check(sqlRes, {
    'SQL Injection prevented': (res) => res.status !== 200,
  });

  // Test 2: XSS Attack Attempt
  let xssRes = http.post(`${BASE_URL}/login`, JSON.stringify({ email: "<script>alert('Hacked')</script>", password: "1234" }), { headers: HEADERS });
  check(xssRes, {
    'XSS Injection prevented': (res) => res.status !== 200,
  });

  // Test 3: Brute Force Attack Simulation
  for (let i = 0; i < 5; i++) {
    let bruteRes = http.post(`${BASE_URL}/login`, JSON.stringify({ email: "test@example.com", password: "wrongpass" }), { headers: HEADERS });
    check(bruteRes, {
      'Brute force attempt detected': (res) => res.status === 401,
    });
    sleep(1);
  }

  // Test 4: Missing Authentication for Profile
  let profileRes = http.get(`${BASE_URL}/profile`, { headers: {} });
  check(profileRes, {
    'Unauthorized profile access prevented': (res) => res.status === 403,
  });

  // Test 5: Malicious JSON Payload
  let jsonRes = http.post(`${BASE_URL}/login`, "{ invalidJson: }", { headers: HEADERS });
  check(jsonRes, {
    'Invalid JSON rejected': (res) => res.status === 400,
  });

  sleep(1);
};

export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');
    return {
        "report/jsonReportSecurity.json": JSON.stringify(data),
    }
};