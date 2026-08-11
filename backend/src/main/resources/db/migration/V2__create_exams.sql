CREATE TABLE IF NOT EXISTS exams (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 45,
    pass_score DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO exams (title, description, duration_minutes, pass_score, status, created_by)
VALUES 
('Bài Thi Kiểm Tra Kiến Thức Lập Trình Java & Spring Boot', 'Bài thi thử nghiệm kiểm tra kiến thức Java Core, OOP, RESTful API và Spring Security', 30, 5.0, 'PUBLISHED', 1)
ON CONFLICT DO NOTHING;
