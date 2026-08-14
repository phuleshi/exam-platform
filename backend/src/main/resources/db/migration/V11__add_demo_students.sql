-- Insert default demo students
-- Password for all demo accounts: 'password123' BCrypt encoded ($2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQ8175m)

INSERT INTO users (full_name, email, student_id, password, role)
VALUES 
('Nguyễn Văn A', '11210001@st.neu.edu.vn', '11210001', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQ8175m', 'STUDENT'),
('Trần Thị B', '11210002@st.neu.edu.vn', '11210002', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQ8175m', 'STUDENT'),
('Lê Văn C', '11210003@st.neu.edu.vn', '11210003', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQ8175m', 'STUDENT')
ON CONFLICT (email) DO UPDATE SET student_id = EXCLUDED.student_id;
