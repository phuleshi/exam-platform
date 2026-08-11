-- Insert default Admin user
-- Password: 'password123' BCrypt encoded ($2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQ8175m)
INSERT INTO users (full_name, email, password, role) 
VALUES ('Quản Trị Viên', 'admin@exam.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQ8175m', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
