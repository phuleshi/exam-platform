-- Keep the quick-login accounts available in every database.
-- Password for every account: '123456' (BCrypt encoded).
INSERT INTO users (full_name, email, student_id, password, role)
VALUES
    ('Quản Trị Viên', 'admin@exam.com', NULL, '$2a$10$UknmOtNtSck7FgIHjV1AVuv45X/jyY/kGgn846sWGPgnz.RpygsBq', 'ADMIN'),
    ('Giáo Viên Mẫu', 'teacher@exam.com', NULL, '$2a$10$UknmOtNtSck7FgIHjV1AVuv45X/jyY/kGgn846sWGPgnz.RpygsBq', 'TEACHER'),
    ('Sinh Viên NEU', '11210001@st.neu.edu.vn', '11210001', '$2a$10$UknmOtNtSck7FgIHjV1AVuv45X/jyY/kGgn846sWGPgnz.RpygsBq', 'STUDENT')
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    student_id = EXCLUDED.student_id,
    password = EXCLUDED.password,
    role = EXCLUDED.role;
