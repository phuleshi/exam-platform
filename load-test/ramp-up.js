import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 50 },  // Ramp up tới 50 VUs trong 2 phút
        { duration: '5m', target: 50 },  // Duy trì 50 VUs trong 5 phút
        { duration: '2m', target: 200 }, // Ramp up tiếp tới 200 VUs trong 2 phút
        { duration: '5m', target: 200 }, // Duy trì 200 VUs trong 5 phút
        { duration: '2m', target: 0 },   // Ramp down về 0 VUs trong 2 phút
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],  // Tỷ lệ lỗi < 1%
        http_req_duration: ['p(95)<500'],// 95% số request hoàn thành dưới 500ms
    },
};

export default function () {
    const res = http.get('http://exam-platform.phule.xyz/api/v1/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
