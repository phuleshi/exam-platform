CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    score DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO questions (exam_id, content, score) VALUES
(1, 'Tính chất nào dưới đây KHÔNG phải là một trong 4 tính chất cơ bản của lập trình hướng đối tượng (OOP)?', 2.5),
(1, 'Annotation nào trong Spring Boot được sử dụng để đánh dấu một lớp là Rest Controller?', 2.5),
(1, 'Trong PostgreSQL, từ khóa nào được dùng để đảm bảo giá trị của một cột không bị trùng lặp?', 2.5),
(1, 'Đâu là mã trạng thái HTTP (Status Code) trả về khi đăng nhập thành công?', 2.5);
