import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },  // Carga moderada
    { duration: '1m', target: 200 },  // Estrés
    { duration: '30s', target: 0 },   // Enfriamiento
  ],
};

const BASE_URL = 'http://localhost:3001';
const USER_CREDENTIALS = JSON.stringify({ email: 'test@example.com', password: '1234' });
const HEADERS = { 'Content-Type': 'application/json' };

export default function () {
  let loginRes = http.post(`${BASE_URL}/login`, USER_CREDENTIALS, { headers: HEADERS });
  check(loginRes, {
    'Login successful': (res) => res.status === 200 && res.json('token') !== undefined,
  });

  if (loginRes.status === 200) {
    let token = loginRes.json('token');
    let authHeaders = { Authorization: `Bearer ${token}` };
    
    let profileRes = http.get(`${BASE_URL}/profile`, { headers: authHeaders });
    check(profileRes, {
      'Profile retrieved': (res) => res.status === 200,
    });
    
    let logoutRes = http.post(`${BASE_URL}/logout`, null, { headers: HEADERS });
    check(logoutRes, {
      'Logout successful': (res) => res.status === 200,
    });
  }
  
  sleep(1); // Esperar antes de la siguiente iteración
};

export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');
    return {
        "report/jsonReportLoad.json": JSON.stringify(data),
    }
};