import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 10 },   // Stay at 10 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    errors: ['rate<0.1'],              // Error rate must be below 10%
    http_req_failed: ['rate<0.1'],     // HTTP failure rate must be below 10%
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
  // Test products endpoint
  const productsResponse = http.get(`${API_URL}/products`);
  check(productsResponse, {
    'products status is 200': (r) => r.status === 200,
    'products response time < 2s': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);
  responseTime.add(productsResponse.timings.duration);

  sleep(1);

  // Test health endpoint
  const healthResponse = http.get(`${API_URL}/health`);
  check(healthResponse, {
    'health status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    'k6-results.json': JSON.stringify(data),
  };
}
