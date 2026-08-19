import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        constant_load: {
            executor: 'constant-arrival-rate',
            rate: 100,
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 100,
            maxVUs: 500,
        },
    },
};

export default function () {
    // API thực tế của exam-platform: kiểm tra trang thai suc khoe backend
    const res = http.get('http://exam-platform.phule.xyz/api/v1/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
