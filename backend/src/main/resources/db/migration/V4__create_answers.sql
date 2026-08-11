CREATE TABLE IF NOT EXISTS answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- Answers for Q1
INSERT INTO answers (question_id, content, is_correct) VALUES
(1, 'Tính Đóng Gói (Encapsulation)', FALSE),
(1, 'Tính Kế Thừa (Inheritance)', FALSE),
(1, 'Tính Đa Biến (Multivariance)', TRUE),
(1, 'Tính Trừu Tượng (Abstraction)', FALSE);

-- Answers for Q2
INSERT INTO answers (question_id, content, is_correct) VALUES
(2, '@Controller', FALSE),
(2, '@RestController', TRUE),
(2, '@Service', FALSE),
(2, '@Component', FALSE);

-- Answers for Q3
INSERT INTO answers (question_id, content, is_correct) VALUES
(3, 'PRIMARY KEY', FALSE),
(3, 'UNIQUE', TRUE),
(3, 'NOT NULL', FALSE),
(3, 'CHECK', FALSE);

-- Answers for Q4
INSERT INTO answers (question_id, content, is_correct) VALUES
(4, '200 OK', TRUE),
(4, '201 Created', FALSE),
(4, '401 Unauthorized', FALSE),
(4, '500 Internal Server Error', FALSE);
