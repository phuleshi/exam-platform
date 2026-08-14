# 🎓 Online Examination Platform (Hệ Thống Thi Trực Tuyến)

Hệ thống thi trắc nghiệm trực tuyến full-stack được xây dựng bằng **Spring Boot 3**, **React + TypeScript (Vite)** và **PostgreSQL**.

---

## 🏗️ Cấu Trúc Dự Án (Project Structure)

```text
exam/
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── frontend/                              # React + TypeScript + Vite + TailwindCSS
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/                    # Button, Input, Modal, Loading, ConfirmDialog
│   │   │   ├── layout/                    # Header, Sidebar, MainLayout
│   │   │   ├── exam/                      # ExamCard, QuestionCard, Timer, Navigator, SubmitDialog...
│   │   │   └── result/                    # ResultCard, ResultTable
│   │   ├── pages/
│   │   │   ├── auth/                      # Login, Register
│   │   │   ├── student/                   # Student Dashboard, Exam List/Detail/Taking, Results
│   │   │   └── teacher/                   # Teacher Dashboard, Exam & Question Management, Results
│   │   ├── services/                      # API Axios Clients
│   │   ├── stores/                        # Auth Store (Zustand / Context)
│   │   ├── hooks/                         # Custom Hooks (useAuth, useExam)
│   │   ├── types/                         # TypeScript interfaces
│   │   ├── routes/                        # React Router Config
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
└── backend/                               # Java 17 + Spring Boot 3 + Spring Security + JPA
    ├── pom.xml
    └── src/
        ├── main/
        │   ├── java/com/examplatform/
        │   │   ├── ExamPlatformApplication.java
        │   │   ├── config/                # SecurityConfig, CorsConfig, RedisConfig
        │   │   ├── security/              # JWT Utilities & Authentication Filter
        │   │   ├── auth/                  # Login / Register APIs
        │   │   ├── user/                  # User Management & Roles (STUDENT, TEACHER)
        │   │   ├── exam/                  # Exam Management & Lifecycle
        │   │   ├── question/              # Questions & Options Management
        │   │   ├── submission/            # Exam Submission & Automatic Grading
        │   │   ├── result/                # Score & Results Analytics
        │   │   ├── exception/             # Global Error Handling
        │   │   └── common/                # Standard API Response wrapper
        │   └── resources/
        │       ├── application.yml
        │       └── db/migration/          # Flyway SQL Database Schema Scripts (V1..V6)
        └── test/
```

---

## 🚀 Hướng Dẫn Khởi Chạy (Quick Start)

### 1. Sử dụng Docker Compose (Khuyên dùng)

Chạy toàn bộ hệ thống (PostgreSQL, Spring Boot Backend, React Frontend):

```bash
docker-compose up -d --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **PostgreSQL**: localhost:5432 (Database: `examdb`, User: `postgres`, Pass: `postgres`)

---

### 2. Khởi chạy thủ công (Development Mode)

#### Backend (Spring Boot):
1. Khởi chạy PostgreSQL trên máy local hoặc container:
   ```bash
   docker run --name postgres-exam -e POSTGRES_DB=examdb -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
   ```
2. Mở thư mục `backend/` và chạy Spring Boot:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

#### Frontend (React + Vite):
1. Mở thư mục `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Truy cập ứng dụng tại http://localhost:5173

---

## 🔑 Tài Khoản Mẫu (Default Credentials)

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@exam.com` | `password123` |
| **Giáo viên (Teacher)** | `teacher@exam.com` | `password123` |
| **Sinh viên (Student)** | `11210001@st.neu.edu.vn` hoặc `11210001` | `password123` |

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons, Axios.
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, JWT, Flyway.
- **Database**: PostgreSQL 15, Redis (Caching).
- **DevOps**: Docker, Docker Compose, Nginx, GitLab CI/CD (CI Pipeline).

---

## 🔄 CI Pipeline (GitLab CI/CD)

Repository này được cấu hình CI pipeline tự động trên GitLab (`.gitlab-ci.yml`):
- **GitLab Repository**: `https://gitlab.com/phuleshi/exam`
- **Tự động build & test**: Chạy Maven build cho Backend (Spring Boot) và Node npm build cho Frontend (React).
- **Tự động đóng gói & đẩy Docker Image**: Build Docker container images và đẩy (push) lên **GitLab Container Registry** (`$CI_REGISTRY_IMAGE`).

> **Lưu ý**: Cấu hình Kubernetes (Manifests & CD deployment) được tách riêng sang repository CD chuyên biệt.

