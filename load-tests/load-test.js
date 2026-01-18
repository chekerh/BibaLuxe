import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const requestCounter = new Counter('requests_total');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    errors: ['rate<0.05'],
    http_req_failed: ['rate<0.05'],
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
  // Test multiple endpoints
  const endpoints = [
    '/products',
    '/products?category=mattress',
    '/products?category=furniture',
    '/health',
  ];

  for (const endpoint of endpoints) {
    const response = http.get(`${API_URL}${endpoint}`);
    requestCounter.add(1);
    
    const success = check(response, {
      [`${endpoint} status is 200`]: (r) => r.status === 200,
      [`${endpoint} response time < 3s`]: (r) => r.timings.duration < 3000,
    });

    if (!success) {
      errorRate.add(1);
    }
    
    responseTime.add(response.timings.duration);
    sleep(0.5);
  }
}
