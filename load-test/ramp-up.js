import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        ramping_rps: {
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1s',
            preAllocatedVUs: 100,
            maxVUs: 1000,
            stages: [
                { duration: '2m', target: 50 },   // Ramp up tới 50 RPS trong 2 phút
                { duration: '5m', target: 50 },   // Duy trì 50 RPS trong 5 phút
                { duration: '2m', target: 200 },  // Ramp up tiếp tới 200 RPS trong 2 phút
                { duration: '5m', target: 200 },  // Duy trì 200 RPS trong 5 phút
                { duration: '2m', target: 0 },    // Ramp down về 0 RPS trong 2 phút
            ],
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],   // Tỷ lệ lỗi < 1%
        http_req_duration: ['p(95)<500'], // 95% request hoàn thành dưới 500ms
    },
};

export default function () {
    const res = http.get('http://exam-platform.phule.xyz/api/v1/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}
