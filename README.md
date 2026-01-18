# Order Processing System

A scalable, event-driven microservices architecture for processing e-commerce orders with reliable message queuing, email notifications, and inventory management.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

The Order Processing System is a distributed microservices application that handles order creation, processing, and notification workflows. It implements the **Outbox Pattern** for reliable message publishing and uses **AWS SQS** for asynchronous order processing, ensuring data consistency and fault tolerance.

### Key Highlights

- ✅ **Microservices Architecture** - Two independent services for order management and processing
- ✅ **Event-Driven Design** - Asynchronous order processing using message queues
- ✅ **Reliable Messaging** - Outbox pattern ensures no message loss
- ✅ **Inventory Management** - Real-time stock validation and updates
- ✅ **Email Notifications** - Automated order confirmation emails
- ✅ **JWT Authentication** - Secure user authentication and authorization
- ✅ **Transaction Safety** - MongoDB transactions for data consistency

## 🏗️ Architecture

The system consists of two microservices:

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────────┐
│  Order Service  │────────▶│  AWS SQS     │────────▶│ Order Processing    │
│  (Producer)     │         │  (Queue)     │         │ Service (Consumer)  │
└─────────────────┘         └──────────────┘         └─────────────────────┘
         │                                                      │
         │                                                      │
         ▼                                                      ▼
   ┌──────────┐                                          ┌──────────┐
   │ MongoDB  │                                          │ MongoDB  │
   │ (Orders) │                                          │ (Orders) │
   └──────────┘                                          └──────────┘
```

### Service Responsibilities

**Order Service** (`order-service/`)
- User authentication and authorization
- Order creation and validation
- Inventory management
- Outbox pattern implementation
- Message publishing to SQS queue

**Order Processing Service** (`order-processing-service/`)
- Consumes messages from SQS queue
- Processes orders asynchronously
- Sends order confirmation emails
- Updates order status

## ✨ Features

### Order Management
- Create orders with multiple items
- Real-time inventory validation
- Automatic tax calculation (18% GST)
- Price snapshotting at purchase time
- Order status tracking (Pending → Processing → Processed)

### User Management
- User registration with password hashing
- JWT-based authentication
- Refresh token mechanism
- Secure cookie-based token storage

### Message Processing
- Outbox pattern for reliable message publishing
- Cron-based outbox processor (runs every minute)
- SQS message queue for asynchronous processing
- Idempotent message processing
- Error handling and retry mechanisms

### Email Notifications
- Automated order confirmation emails
- Beautiful HTML email templates using Mailgen
- Email delivery status tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety (order-processing-service)
- **JavaScript (ES6+)** - (order-service)

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Message Queue
- **AWS SQS** - Message queuing service
- **LocalStack** - Local AWS services for development

### Authentication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing

### Email
- **Nodemailer** - Email sending
- **Mailgen** - Email template generation
- **MailTrap** - Email testing service

### Other Tools
- **Docker Compose** - Container orchestration
- **node-cron** - Scheduled tasks
- **express-validator** - Request validation
- **Zod** - Schema validation (TypeScript service)

## 📁 Project Structure

```
OrderProcessingSystem/
├── docker-compose.yml              # LocalStack configuration
├── order-service/                  # Order management service
│   ├── src/
│   │   ├── app.js                  # Express app configuration
│   │   ├── index.js                # Service entry point
│   │   ├── config/                 # Configuration files
│   │   │   └── sqs-client.js       # AWS SQS client setup
│   │   ├── controllers/            # Request handlers
│   │   │   ├── auth.controllers.js
│   │   │   ├── order.controllers.js
│   │   │   └── healthcheck.controllers.js
│   │   ├── db/                     # Database management
│   │   │   └── db-manager.js
│   │   ├── middlewares/            # Express middlewares
│   │   │   ├── auth.middlewares.js
│   │   │   ├── customErrorHandler.middlewares.js
│   │   │   └── validate.middlewares.js
│   │   ├── models/                 # Mongoose models
│   │   │   ├── order.models.js
│   │   │   ├── outbox.models.js
│   │   │   ├── product.models.js
│   │   │   └── user.models.js
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── order.routes.js
│   │   │   └── healthcheck.routes.js
│   │   ├── services/               # Business logic
│   │   │   ├── order.services.js
│   │   │   └── queue.services.js
│   │   ├── utils/                  # Utility functions
│   │   │   ├── asyncHandler.js
│   │   │   ├── constants.js
│   │   │   └── customError.js
│   │   ├── validators/             # Input validation rules
│   │   │   ├── auth.validators.js
│   │   │   └── order.validators.js
│   │   └── worker/                 # Background workers
│   │       └── producer.js          # Outbox processor
│   ├── package.json
│   └── .env                        # Environment variables
│
└── order-processing-service/       # Order processing service
    ├── src/
    │   ├── app.ts                  # Express app configuration
    │   ├── index.ts                # Service entry point
    │   ├── config/                 # Configuration files
    │   │   ├── env.ts              # Environment config
    │   │   └── sqs-client.ts       # AWS SQS client setup
    │   ├── controllers/            # Request handlers
    │   │   └── healthCheck.controllers.ts
    │   ├── db/                     # Database management
    │   │   └── db-manager.ts
    │   ├── models/                 # Mongoose models
    │   │   ├── order.models.ts
    │   │   ├── product.models.ts
    │   │   └── user.models.ts
    │   ├── routes/                 # API routes
    │   │   └── healthCheck.routes.ts
    │   ├── services/               # Business logic
    │   │   ├── email.services.ts
    │   │   └── messageProcessing.services.ts
    │   ├── types/                  # TypeScript types
    │   │   ├── order.types.ts
    │   │   └── sqsMessage.types.ts
    │   ├── utils/                  # Utility functions
    │   │   ├── constants.ts
    │   │   └── mailGenerator.ts
    │   └── worker/                 # Background workers
    │       └── consumer.ts         # SQS message consumer
    ├── package.json
    ├── tsconfig.json
    └── .env                        # Environment variables
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v6 or higher) - Running locally or connection string
- **Docker** and **Docker Compose** (for LocalStack)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OrderProcessingSystem
```

### 2. Start LocalStack (SQS)

Start the LocalStack container for local SQS development:

```bash
docker-compose up -d
```

This will start LocalStack on port `4566` with SQS service enabled.

### 3. Create SQS Queue

After LocalStack is running, create an SQS queue:

```bash
# Using AWS CLI (configured for LocalStack)
aws --endpoint-url=http://localhost:4566 sqs create-queue \
  --queue-name order-processing-queue \
  --region ap-south-1
```

Or use the LocalStack web interface at `http://localhost:4566`.

### 4. Set Up Order Service

```bash
cd order-service
npm install
```

Create a `.env` file in `order-service/`:

```env
# Server
PORT=8000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/order-service

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# AWS SQS (LocalStack)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
SQS_QUEUE_URL=http://localhost:4566/000000000000/order-processing-queue
SQS_ENDPOINT=http://localhost:4566

# Outbox Processing
OUTBOX_PROCESSING_BATCH_SIZE=10
```

### 5. Set Up Order Processing Service

```bash
cd ../order-processing-service
npm install
```

Create a `.env` file in `order-processing-service/`:

```env
# Server
PORT=8001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/order-processing-service

# AWS SQS (LocalStack)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
SQS_QUEUE_URL=http://localhost:4566/000000000000/order-processing-queue
SQS_ENDPOINT=http://localhost:4566

# SQS Consumer
VISIBILITY_TIMEOUT=30
BATCH_SIZE=10

# Email (MailTrap)
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your-mailtrap-username
MAILTRAP_SMTP_PASS=your-mailtrap-password
```

> **Note:** Sign up for a free MailTrap account at [mailtrap.io](https://mailtrap.io) to get SMTP credentials for email testing.

### 6. Start the Services

**Terminal 1 - Order Service:**
```bash
cd order-service
npm run dev
```

**Terminal 2 - Order Processing Service:**
```bash
cd order-processing-service
npm run dev
```

Both services should now be running:
- Order Service: `http://localhost:8000`
- Order Processing Service: `http://localhost:8001`

## ⚙️ Configuration

### Environment Variables

#### Order Service
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_EXPIRY` | Access token expiry | `1h` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `SQS_QUEUE_URL` | SQS queue URL | - |
| `OUTBOX_PROCESSING_BATCH_SIZE` | Outbox batch size | `10` |

#### Order Processing Service
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8001` |
| `MONGODB_URI` | MongoDB connection string | - |
| `SQS_QUEUE_URL` | SQS queue URL | - |
| `VISIBILITY_TIMEOUT` | SQS visibility timeout (seconds) | `30` |
| `BATCH_SIZE` | SQS batch size | `10` |
| `MAILTRAP_SMTP_HOST` | MailTrap SMTP host | - |
| `MAILTRAP_SMTP_PORT` | MailTrap SMTP port | `2525` |
| `MAILTRAP_SMTP_USER` | MailTrap username | - |
| `MAILTRAP_SMTP_PASS` | MailTrap password | - |

## 📡 API Endpoints

### Order Service (`http://localhost:8000`)

#### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Refresh Token**
```http
POST /api/auth/refresh
```

#### Orders

**Create Order** (Protected)
```http
POST /api/orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1
    }
  ]
}
```

**Get Order Details** (Protected)
```http
GET /api/orders/:id
Authorization: Bearer <access_token>
```

#### Health Check
```http
GET /api/health
```

### Order Processing Service (`http://localhost:8001`)

#### Health Check
```http
GET /processor/api/health
```

## 🔄 How It Works

### Order Creation Flow

1. **User Authentication**
   - User registers/logs in through Order Service
   - Receives JWT access and refresh tokens

2. **Order Creation**
   - User sends order request with items
   - Order Service validates:
     - User authentication
     - Product existence
     - Inventory availability
   - Creates order within MongoDB transaction:
     - Deducts inventory
     - Creates order document
     - Creates outbox entry (same transaction)
   - Returns order ID to user

3. **Outbox Processing**
   - Cron job runs every minute
   - Fetches pending outbox messages
   - Publishes messages to SQS queue
   - Marks outbox messages as processed

4. **Order Processing**
   - Order Processing Service consumes messages from SQS
   - Validates and processes order:
     - Updates order status to "Processed"
     - Generates order confirmation email
     - Sends email via MailTrap
     - Marks email as sent

### Outbox Pattern

The Outbox Pattern ensures reliable message delivery:

```
Order Creation Transaction:
├── Create Order
├── Update Inventory
└── Create Outbox Entry
    └── (All in same transaction - atomic)

Outbox Processor (Cron):
├── Fetch Pending Outbox Messages
├── Publish to SQS
└── Mark as Processed
```

This guarantees that if an order is created, a message will eventually be published to the queue, even if the service crashes immediately after order creation.

### Idempotency

The Order Processing Service implements idempotency checks:
- Order status is only updated if not already processed
- Email is only sent if not already sent
- Prevents duplicate processing of the same message

## 💻 Development

### Running in Development Mode

Both services support hot-reloading with `nodemon`:

```bash
# Order Service
cd order-service
npm run dev

# Order Processing Service
cd order-processing-service
npm run dev
```

### Code Style

The project uses Prettier for code formatting. Format code with:

```bash
npm run format  # If configured in package.json
```

### Database Setup

Ensure MongoDB is running and accessible. The services will automatically create collections on first use.

**Required Collections:**
- `users` - User accounts
- `products` - Product catalog
- `orders` - Order records
- `outbox` - Outbox messages (Order Service only)

### Testing the Flow

1. **Create a Product** (manually in MongoDB or via a script)
2. **Register a User** via `/api/auth/register`
3. **Login** to get access token
4. **Create an Order** with the access token
5. **Wait for Processing** - The order will be processed within 1 minute
6. **Check Email** - Order confirmation email will be sent

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add appropriate error handling
- Include logging for debugging
- Update documentation for new features
- Ensure backward compatibility

## 👤 Author

**Anubhav Jain**

---

## 🎓 Learning Resources

This project demonstrates several important concepts:

- **Microservices Architecture** - Service separation and communication
- **Event-Driven Architecture** - Asynchronous processing with message queues
- **Outbox Pattern** - Reliable message publishing
- **Transaction Management** - MongoDB transactions for data consistency
- **Idempotency** - Handling duplicate messages safely
- **JWT Authentication** - Token-based security
- **Email Integration** - Automated notifications

---

**Happy Coding! 🚀**
