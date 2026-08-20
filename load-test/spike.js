import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        spike_rps: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1s',
            preAllocatedVUs: 100,
            maxVUs: 2000,
            stages: [
                { duration: '10s', target: 10 },   // Mức tải bình thường: 10 RPS
                { duration: '1m', target: 10 },
                { duration: '10s', target: 500 },  // Spike đột biến lên 500 RPS trong 10 giây
                { duration: '3m', target: 500 },   // Giữ tải spike 500 RPS trong 3 phút
                { duration: '10s', target: 10 },   // Hạ nhanh về 10 RPS
                { duration: '3m', target: 10 },    // Theo dõi khả năng phục hồi ở 10 RPS
                { duration: '10s', target: 0 },
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
