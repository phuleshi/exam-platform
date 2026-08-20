import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        periodic_rps: {
            executor: 'ramping-arrival-rate',
            startRate: 0,
            timeUnit: '1s',
            preAllocatedVUs: 100,
            maxVUs: 1500,
            stages: [
                { duration: '1m', target: 50 },   // Đợt 1: 50 RPS
                { duration: '2m', target: 50 },
                { duration: '30s', target: 10 },  // Giảm về 10 RPS giữa đợt
                { duration: '1m', target: 200 },  // Đợt 2: 200 RPS
                { duration: '2m', target: 200 },
                { duration: '30s', target: 10 },  // Giảm về 10 RPS giữa đợt
                { duration: '1m', target: 300 },  // Đợt 3: Đỉnh tải 300 RPS
                { duration: '2m', target: 300 },
                { duration: '1m', target: 0 },    // Kết thúc
            ],
        },
    },
};

export default function () {
    const res = http.get('http://exam-platform.phule.xyz/api/v1/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}
