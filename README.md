# Node_Ecommerce

## Overview

Node_Ecommerce is a RESTful backend API for an e-commerce platform built with Node.js, Express, MongoDB, and Redis. It provides user authentication, product management, and order processing, complete with rate limiting and JWT-based security.

## Features

- **User Management**: Register, login, and retrieve profile information
- **Authentication & Authorization**: JWT access and refresh tokens, protected routes, admin privileges
- **Product Management**: CRUD operations on products (admin only for create, update, delete)
- **Order Processing**: Create orders, view order history, mark orders as paid or delivered
- **Rate Limiting**: Global API rate limiting to prevent abuse
- **Cookie-based Tokens**: Secure storage of access and refresh tokens in HTTP-only cookies
- **Environment Configuration**: `.env` support for secrets and database URIs
- **Testing**: Mocha, Chai, Sinon, and Supertest for unit and integration tests

## Tech Stack

- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Cache/Session**: Redis (ioredis)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Security**: `express-rate-limit`, `bcrypt` for password hashing
- **Logging**: `morgan`
- **Environment**: `dotenv`
- **Payment Processing**: Stripe SDK (optional)

## Getting Started

### Prerequisites

- Node.js v22 or later
- MongoDB instance (local or Atlas)
- Redis instance (optional, for session/queue support)

### Installation

```bash
# Clone the repository
git clone https://github.com/BeygonK/Node_Ecommerce.git
cd Node_Ecommerce

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory and define the following variables:

```dotenv
PORT=5000
MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<dbname>
REDIS_URL=redis://<host>:<port>
JWT_SECRET=your_jwt_access_secret
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
STRIPE_SECRET_KEY=your_stripe_secret_key  # if using payments
NODE_ENV=development
```

### Running the Application

```bash
# Start in development mode (with nodemon)
npm run dev

# Start in production mode
npm start
```

The API will be available at `http://localhost:5000/api`.

### Running Tests

```bash
npm test
```

## Project Structure

```
├── app.js            # Express app setup and global middleware
├── server.js         # Entry point: starts the server
├── controllers/      # Request handlers for users, products, orders
├── models/           # Mongoose schemas (User, Product, Order)
├── routes/           # Route definitions with authentication middleware
├── middleware/       # Error handling, authentication, rate limiting
├── utils/            # DB connection, Redis client
├── test/             # Unit and integration tests
├── .env.example      # Example environment variables
└── package.json
```

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint           | Description                | Access            |
| ------ | ------------------ | -------------------------- | ----------------- |
| POST   | `/`                | Register a new user        | Public            |
| POST   | `/login`           | Authenticate user & token  | Public            |
| GET    | `/profile`         | Get logged-in user profile | Private (Bearer)  |

### Product Routes (`/api/products`)

| Method | Endpoint           | Description                   | Access             |
| ------ | ------------------ | ----------------------------- | ------------------ |
| GET    | `/`                | Get all products              | Public             |
| POST   | `/`                | Create a new product          | Private (Admin)    |
| GET    | `/:id`             | Get product by ID             | Public             |
| PUT    | `/:id`             | Update product by ID          | Private (Admin)    |
| DELETE | `/:id`             | Delete product by ID          | Private (Admin)    |

### Order Routes (`/api/orders`)

| Method | Endpoint             | Description                         | Access             |
| ------ | -------------------- | ----------------------------------- | ------------------ |
| POST   | `/`                  | Create a new order                  | Private            |
| GET    | `/`                  | Get all orders (admin)              | Private (Admin)    |
| GET    | `/:id`               | Get order by ID                     | Private            |
| PUT    | `/:id/pay`           | Mark order as paid                  | Private            |
| PUT    | `/:id/deliver`       | Mark order as delivered             | Private (Admin)    |

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

