# DevWorkFlow

**DevWorkFlow** is a full-stack web application designed to simplify project management, task tracking, and team collaboration. It provides a centralized workspace where users can organize development projects, manage tasks, monitor progress, and collaborate efficiently.

## Features

- **User Authentication:** User registration, login, and protected routes.
- **Project Management:** Create, view, and manage projects.
- **Task Management:** Create, assign, update, and track tasks.
- **Dashboard:** Centralized interface for managing projects and tasks.
- **Collaboration:** Task comments, activity logs, and task history.
- **Administration:** Dedicated administrative interface and backend API endpoints.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| ORM | Sequelize |
| Authentication | JWT, bcrypt |
| Testing | Jest, Supertest |
| Development Tools | Git, GitHub, nodemon |

## Project Structure

```text
DevWorkFlow/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── styles/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   └── routes/
│   └── server.js
│
└── .gitignore
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/anuragrana1997/DevWorkFlow.git
cd DevWorkFlow
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the database connection:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_CONNECTION_LIMIT=10
```

Additional environment variables may be required for authentication and other backend functionality.

Start the backend server:

```bash
npm run dev
```

The backend runs on:

`http://localhost:3000`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd client
npm install
npm run dev
```

The frontend typically runs on:

`http://localhost:5173`

Ensure the frontend API configuration points to the correct backend URL.

**Note:** The application requires the appropriate MySQL database schema. Database initialization instructions are not included because the setup has not been fully verified.

## API Overview

| Endpoint Prefix | Description |
|---|---|
| `/api/auth` | Authentication operations |
| `/api/user` | User management |
| `/api/project` | Project management |
| `/api/task` | Task management and history |
| `/api/comment` | Task comments |
| `/api/activitLog` | Activity logging |
| `/api/admin` | Administrative operations |
| `/health` | Server health check |

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm start
npm test
```

## Future Improvements

- Enhanced project analytics and reporting.
- Real-time task updates and notifications.
- Improved search and filtering functionality.
- Additional collaboration features.
- Deployment and production environment configuration.

## Project Status

DevWorkFlow is under active development. Additional features, improvements, and optimizations will be introduced as development progresses.

## Author

**Anurag Rana**

GitHub: [anuragrana1997](https://github.com/anuragrana1997)

## Repository

[DevWorkFlow on GitHub](https://github.com/anuragrana1997/DevWorkFlow)
