import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 200 },  // Ramp up to 200 users
    { duration: '3m', target: 200 },  // Stay at 200 users
    { duration: '1m', target: 500 },  // Ramp up to 500 users (stress test)
    { duration: '3m', target: 500 },  // Stay at 500 users
    { duration: '5m', target: 0 },    // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // More lenient for stress test
    errors: ['rate<0.2'],              // Allow up to 20% errors in stress test
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
  const response = http.get(`${API_URL}/products`);
  check(response, {
    'status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(1);
}
