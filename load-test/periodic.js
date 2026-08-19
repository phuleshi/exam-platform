import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 },   // Đợt 1: 50 VUs
        { duration: '2m', target: 50 },
        { duration: '30s', target: 10 },  // Giảm tải giữa đợt
        { duration: '1m', target: 200 },  // Đợt 2: 200 VUs
        { duration: '2m', target: 200 },
        { duration: '30s', target: 10 },  // Giảm tải giữa đợt
        { duration: '1m', target: 300 },  // Đợt 3: Đỉnh tải 300 VUs
        { duration: '2m', target: 300 },
        { duration: '1m', target: 0 },    // Kết thúc
    ],
};

export default function () {
    const res = http.get('http://exam-platform.phule.xyz/api/v1/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
