import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        constant_load: {
            executor: 'constant-arrival-rate',
            rate: 200,
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 100,
            maxVUs: 500,
        },
    },
};

export default function () {
    const res = http.get(
        'http://exam-platform.phule.xyz/api/v1/exams/student'
    );

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}