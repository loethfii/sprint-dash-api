# 📝 Sprint Dash API

Sprint Dash API is a Node.js and TypeScript backend service built using Object-Oriented Programming (OOP) principles. It is designed to support project management, tasks, dashboard widgets, and asynchronous/real-time notification systems.

---

## 👥 Mock Users

For testing and demonstration purposes, you can log in using the following pre-configured user credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `lS5px` |
| **Manager** | `manager@gmail.com` | `HGTtD` |
| **Staff** | `staff@gmail.com` | `YmIiB` |

---

## 🚀 Key Features

- **Authentication & Authorization**: Registration, login, and secure password changes (`bcrypt` & JWT).
- **Task Management**: CRUD operations for Tasks, recursive Subtask/Child Task structures, task status/priority management, and user assignment.
- **Event-Driven Notification**: Asynchronous email notification creation using Node.js `EventEmitter` to run tasks out-of-band without blocking the main API response lifecycle.
- **Automated Overdue Status**: Automatically checks task due dates (`endTime`) via RabbitMQ *Delayed Queue / Dead Letter Exchange*. If a task's deadline passes and it is not completed, its status is automatically updated to `OVERDUE`.
- **Redis Cache Integration**: Caching the task tree hierarchy to speed up render times of dashboard widgets.
- **Docker Support**: Containerized with a production-ready `Dockerfile` and `docker-compose.yml` for isolated deployment.

---

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v20.x or higher)
- **npm** or **yarn**
- **PostgreSQL** (relational database engine)
- **Redis** (in-memory key-value cache store)
- **RabbitMQ** (asynchronous message broker)

---

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/loethfii/sprint-dash-api.git
cd sprint-dash-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the Environment (.env)
Copy the example environment configuration:
```bash
cp .env.example .env
```
Fill in the database credentials, Redis configuration, JWT secret, and RabbitMQ URL in the `.env` file.

### 4. Run Database Migrations
Create and setup the database tables with TypeORM migrations:
```bash
npm run migration:run
```

### 5. Run the Application in Development Mode
```bash
npm run dev
```
The server will start locally at: `http://localhost:3000`

### 6. Run using Docker Compose
If you prefer running the application inside a containerized setup:
```bash
docker-compose up --build
```

---

## 📁 Main Folder Structure

```
sprint-dash-api/
├── src/
│   ├── controllers/      # API Controllers and Route Handlers
│   ├── decorators/       # Custom decorators (Auth, Routing, validation)
│   ├── dtos/             # Data Transfer Objects (Request validations)
│   ├── entities/         # TypeORM Database Entities
│   ├── enums/            # Common Enumerations & constants
│   ├── exceptions/       # Custom HTTP Exception classes
│   ├── middlewares/      # Express middle-tier handlers (Auth check)
│   ├── service/          # Application services and business logic
│   ├── utils/            # Shared utilities (Redis, Event Emitter, etc.)
│   └── app.ts            # Main application bootstrap and Express configuration
├── dist/                 # Transpiled JavaScript production build output
├── Dockerfile            # Multi-stage production Docker image configuration
├── docker-compose.yml    # Docker Compose orchestration configurations
├── package.json          # Dependencies manifest and execution scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 📡 Message Queue Architecture (RabbitMQ)

The task due date notification/automated overdue updates are handled asynchronously via a dead-letter exchange (DLX) design:

1. **Scheduling**: When a task is created or its `endTime` is updated, the `TaskService` calls the `scheduleTaskDueCheck()` method in `WorkerService`.
2. **Waiting Queue**: If the `endTime` is in the future, the task ID is pushed into the `task.due.waiting.queue` with a dynamic *Message-Level TTL* (`expiration` header set to sisa time in ms).
3. **Dead Letter Exchange (DLX)**: When the message TTL expires, RabbitMQ flags it as a dead letter and automatically routes it through the `task.due.exchange` using the `task.due.process` routing key.
4. **Process Queue & Update**: The message is routed to `task.due.process.queue` which is actively consumed by the worker. The worker verifies if the task is still open and updates its status to `OVERDUE` in the database.

---

## 📡 Postman Documentation

API Collections and environment files have been prepared and can be directly imported into Postman:
- Collection: **`postman collection/Sprint Dash.postman_collection.json`**
- Environment: **`postman collection/Sprint Dash local.postman_environment.json`**
