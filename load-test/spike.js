import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 10 },   // Tải bình thường 10 VUs
        { duration: '1m', target: 10 },
        { duration: '10s', target: 500 },  // Tăng đột biến (spike) lên 500 VUs trong 10 giây
        { duration: '3m', target: 500 },   // Giữ tải spike trong 3 phút
        { duration: '10s', target: 10 },   // Hạ nhanh về 10 VUs
        { duration: '3m', target: 10 },    // Theo dõi khả năng phục hồi
        { duration: '10s', target: 0 },
    ],
};

export default function () {
    const res = http.get('http://exam-platform.phule.xyz/api/v1/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
