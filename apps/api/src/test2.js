import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',

  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8080/api/v1';
const TOKEN = __ENV.ACCESS_TOKEN;

function randomSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  const length = Math.floor(Math.random() * 5) + 6;
  // 6-10 chars

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export default function () {
  const slug = randomSlug();

  const payload = JSON.stringify({
    name: `Test Organization ${slug}`,
    slug,
  });

  const res = http.post(`${BASE_URL}/organizations`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },

    cookies: {
      access_token: TOKEN,
    },
  });

  console.log(
    `STATUS: ${res.status} | ${res.timings.duration}ms | slug=${slug}`,
  );

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
