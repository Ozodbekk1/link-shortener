import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080/api/v1';
const TOKEN = __ENV.ACCESS_TOKEN;

if (!TOKEN) {
  throw new Error('ACCESS_TOKEN is missing');
}

export default function () {
  const res = http.get(`${BASE_URL}/organizations/`, {
    headers: {
      Cookie: `access_token=${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (res.status !== 200) {
    console.log('STATUS:', res.status);
    console.log('BODY:', res.body);
  }

  sleep(1);
}
