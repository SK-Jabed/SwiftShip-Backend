# 🚀 SwiftShip – Parcel Delivery Backend API

[🌐 **Live App**](https://swift-ship-backend.vercel.app) | [🛠 **Server Repo**](https://github.com/SK-Jabed/SwiftShip-Backend)

A secure, scalable, and role-based backend system built with **Express.js**, **MongoDB**, **Mongoose**, **Zod**, **JWT**, and **TypeScript**, enabling smooth parcel delivery operations inspired by platforms like Pathao Courier or Sundarban.

---

## 📖 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔐 Roles & Permissions](#-roles--permissions)
- [⚙️ Setup & Installation](#️-setup--installation)
- [🧾 Example `.env` Values](#-example-env-values)
- [🛡️ Super Admin & Other Credentials](#️-super-admin--other-credentials)
- [🔌 API Base URL](#-api-base-url)
- [📭 API Testing with Postman](#-api-testing-with-postman)
- [🔗 API Endpoints](#-api-endpoints)
- [📦 Parcel Status Flow](#-parcel-status-flow)
- [🔍 Parcel Tracking Format](#-parcel-tracking-format)
- [🧾 Sample Payloads & Schema](#-sample-payloads--schema)
- [🔒 Security](#-security)
- [📄 License](#-license)
- [🙌 Acknowledgements](#-acknowledgements)
- [✨ Author](#-author)

---




## 🎯 Project Overview

SwiftShip is a backend API service for managing parcel delivery operations. It handles:

- User registration & authentication
- Parcel creation, tracking, and status updates
- Role-based access (Admin, Sender, Receiver)
- Modular, maintainable code architecture
- Embedded delivery logs per parcel
- Google OAuth and credentials login

---

## ✨ Features

- 🔐 **JWT Authentication + Google OAuth** (access & refresh tokens)
- 👥 **Role-based Authorization** (`SENDER`, `RECEIVER`, `ADMIN`, `SUPER_ADMIN`)
- 📦 Parcel lifecycle tracking & logs
- 📊 Delivery history & cancel/reschedule options
- 🧾 Embedded status tracking with full delivery logs
- ❌ Cancel parcels (pre-dispatch only)
- ✅ Confirm delivery by receivers
- 🚫 Block/Unblock users or parcels (admin)
- 📄 Auto-generated Tracking ID for each parcel
- 🧱 Clean and modular folder architecture
- 🛡️ Zod validations across all endpoints

---

## 🛠 Tech Stack

| Category        | Technology                 |
| --------------- | -------------------------- |
| Runtime         | Node.js                    |
| Framework       | Express.js                 |
| Language        | TypeScript                 |
| Database        | MongoDB + Mongoose         |
| Auth & Security | JWT, bcrypt, cookie-parser |
| Validation      | Zod                        |
| Dev Tools       | dotenv, ts-node-dev, etc.  |

---

## 📁 Project Structure

```bash
src/
├── .env
├── .gitignore
├── eslint.config.mjs
├── README.md
├── package-lock.json
├── package.json
├── tsconfig.json
├── vercel.json
├── app/
│   ├── config/
│   ├── errorHelpers/
│   ├── helpers/
│   ├── interfaces/
│   ├── middlewares/       # Error handlers, auth checks
│   ├── modules/
│   │   ├── auth/          # Login, token, Google OAuth
│   │   ├── parcel/        # Parcel logic, status, delivery
│   │   └── user/          # Registration, user login, blocking
│   ├── routes/            # ENV, session, passport setup
│   ├── utils/             # Validation helpers, PDF generator
├── types                  # Types Declaration
├── app.ts                 # Express App Init
└── server.ts              # Server Startup
```

---

## 🔐 Roles & Permissions

| Role         | Capabilities                                                |
| ------------ | ----------------------------------------------------------- |
| **Admin**    | View/update all parcels, block/unblock users, manage status |
| **Sender**   | Create, cancel, and view their parcels                      |
| **Receiver** | View incoming parcels, confirm deliveries                   |

---

## ⚙️ Setup & Installation

### 🔧 Prerequisites

- Node.js v18+
- MongoDB URI
- Vercel (optional, for frontend hosting)

### 🚀 Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/SK-Jabed/SwiftShip-Backend.git
   ```

2. **Navigate to project folder**

   ```bash
   cd parcel-delivery-server
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Setup environment variables**

   ```bash
   PORT=5000
   DATABASE_URI=your_mongo_uri
   JWT_SECRET=your_secret
   BCRYPT_SALT_ROUNDS=10
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

---

## 🧾 Example `.env` Values

```env
PORT=5000
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiftShipDB
NODE_ENV=development

# JWT SECRETS & EXPIRATION
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES=1D
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=30D

# BCRYPT
BCRYPT_SALT_ROUND=10

# SUPER ADMIN CREDENTIALS
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=StrongPass123

# GOOGLE AUTHENTICATION
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://swift-ship-backend.vercel.app/api/v1/auth/google/callback

# EXPRESS SESSION
EXPRESS_SESSION_SECRET=your_express_session_secret

# FRONTEND URL
FRONTEND_URL=http://localhost:5173
```

---

## 🛡️ Super Admin & Other Credentials

**SUPER_ADMIN**

- Email: `superadmin@gmail.com`
- Password: `123456Aa@`

**ADMIN**

- Email: `admin@gmail.com`
- Password: `123456Aa@`

**SENDER**

- Email: `sender@gmail.com`
- Password: `123456Aa@`

**RECEIVER**

- Email: `receiver@gmail.com`
- Password: `123456Aa@`

---

## 🔌 API Base URL

```
https://swift-ship-backend.vercel.app/api/v1
```

---

## 📭 API Testing with Postman

You can test all the backend API routes using the provided Postman collection.

**🗂 File:** [SwiftShip APIs](https://github.com/SK-Jabed/SwiftShip-Backend/blob/main/SwiftShip%20APIs.postman_collection.json)

### 🔧 How to Use

1. Open [Postman](https://www.postman.com/).
2. Click on `Import` in the top-left corner.
3. Select the `SwiftShipAPIs.postman_collection.json` file.
4. Set your environment variables such as:
   - `base_url` → `https://swift-ship-backend.vercel.app` _(or your local URL)_
   - `accessToken` → Your JWT access token after login
5. Start testing each route directly!

This collection includes:

- Authentication flows
- Sender, Receiver, and Admin route testing
- Real examples for ride parcel management, cancel parcel, and admin reports

---

## 🔗 API Endpoints

All endpoints are prefixed with `/api/v1`.

### 🧑 Auth Routes

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/auth/login`           | Login via credentials    |
| POST   | `/auth/logout`          | Logout current session   |
| POST   | `/auth/refresh-token`   | Refresh JWT access token |
| POST   | `/auth/reset-password`  | Reset password           |
| GET    | `/auth/google`          | Initiate Google OAuth    |
| GET    | `/auth/google/callback` | OAuth callback handler   |

---

### 👤 User Routes

| Role   | Method | Endpoint            | Description       |
| ------ | ------ | ------------------- | ----------------- |
| Public | POST   | `/user/register`    | Register new user |
| Admin  | GET    | `/user/all-users`   | List of all users |
| Admin  | PATCH  | `/user/:id`         | Update profile    |
| Admin  | PATCH  | `/user/block/:id`   | Block a user      |
| Admin  | PATCH  | `/user/unblock/:id` | Unblock a user    |

---

### 📦 Parcel Routes

#### 🔸 Sender

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/parcel/create-parcel` | Create a new parcel           |
| PATCH  | `/parcel/update/:id`    | Update parcel info            |
| PATCH  | `/parcel/cancel/:id`    | Cancel parcel before dispatch |
| GET    | `/parcel/my-parcels`    | Get your parcels              |

#### 🔹 Receiver

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| GET    | `/parcel/incoming-parcels`     | View incoming parcels |
| PATCH  | `/parcel/confirm-delivery/:id` | Confirm receipt       |
| GET    | `/parcel/delivery-history`     | View delivery history |

#### 🔧 Admin

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/parcel/all-parcel`         | View all parcels        |
| PATCH  | `/parcel/status/:id`         | Update status           |
| PATCH  | `/parcel/block/:id`          | Block a parcel          |
| PATCH  | `/parcel/unblock/:id`        | Unblock a parcel        |
| GET    | `/parcel/all-parcel/:userId` | View parcels for a user |

---

## 📦 Parcel Status Flow

Each parcel includes a `statusLogs[]` subdocument tracking its progress:

```
REQUESTED → APPROVED → PICKED_UP → IN_TRANSIT → DELIVERED
```

Each status entry contains:

- `status`: Current state of the parcel
- `timestamp`: Auto-generated ISO timestamp
- `updatedAt`: Updating time
- `updatedBy`: Admin/User ID
- `location`: Optional remarks
- `note`: Optional remarks

---

## 🔍 Parcel Tracking Format

Every parcel has a unique tracking ID like:

```bash
TRK-20250802-000001
```

---

## 🧾 Sample Payloads & Schema

### 🧑 User Create Schema (Example)

```json
{
  "name": "Tony Stark",
  "email": "rdj@gmail.com",
  "password": "123456Aa@"
}
```

### 📦 Parcel Create Schema (Example)

```json
{
  "senderId": ObjectId,
  "receiverId": ObjectId,
  "parcelType": "ELECTRONICS",
  "weight": 5,
  "description": "Fragile electronics",
  "parcelFee": {
    "baseRate": 50,
    "weightCharge": 20,
    "distanceCharge": 30,
    "totalFee": 100
  },
  "senderInfo": {
    "name": "John Doe",
    "phone": "01712345678",
    "division": "Dhaka",
    "city": "Dhaka",
    "area": "Mirpur",
    "detailAddress": "House 123, Road 8"
  },
  "receiverInfo": {
    "name": "Jane Smith",
    "phone": "01898765432",
    "division": "Chittagong",
    "city": "Chittagong",
    "area": "Agrabad",
    "detailAddress": "Office 456, Commercial Area"
  },
  "paymentMethod": "COD"
}
```

### 🛠 Block and Unblock User (Admin)

Body:

```json
{
    "adminId": ObjectId
}
```

### 🛠 Reset Password (Public)

Body:

```json
{
  "oldPassword": "123456Aa@",
  "newPassword": "123456Aa&"
}
```

### 🛠 Cancel Parcel (Sender)

Body:

```json
{
  "cancellationReason": "Recipient address changed"
}
```

### 🛠 Confirm Parcel Delivery (Receiver)

Body:

```json
{
  "deliveryProof": "https://example.com/proof.jpg"
}
```

### 🛠 Update Parcel Status (Admin)

```json
{
  "status": "IN_TRANSIT",
  "note": "Package departed from warehouse",
  "location": "Dhaka"
}
```

### 🛠 Block Parcel (Admin)

Body:

```json
{
  "blockReason": "Suspicious package content"
}
```

---

### 🔁 Parcel Status Logs

Each parcel contains a statusLogs array to track its full journey. Each log contains:

```bash
statusLogs: [
  {
    status: 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED' | ...,
    timestamp: Date,
    updatedAt: Date,
    updatedBy: UserID or 'SYSTEM',
    location: 'Dhaka Hub',
    note: 'Parcel left the station',
  }
]


```

---

## 🔒 Security

- Password hashing with `bcryptjs`
- JWT tokens with expiry control
- Role-based middleware
- Google OAuth with credentials fallback
- Session management with `express-session`

---

## 📄 License

Licensed under the [ISC License](LICENSE).
© 2025 Sheikh Jabed. All rights reserved.

---

## 🙌 Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Passport.js](http://www.passportjs.org/)

---

## ✨ Author

**Sheikh Jabed**
[GitHub](https://github.com/SK-Jabed)

---
