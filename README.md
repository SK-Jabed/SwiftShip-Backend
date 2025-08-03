
# 🚀 SwiftShip – Parcel Delivery Backend API

[🌐 Live App](https://happy-parcel-picker.vercel.app) | [🛠 Server Repo](https://github.com/SK-Jabed/SwiftShip-Backend)

A secure, scalable, and role-based backend system built with **Express.js**, **MongoDB**, **Mongoose**, **Zod**, **JWT**, and **TypeScript**, enabling smooth parcel delivery operations inspired by platforms like Pathao Courier or Sundarban.

---

## 📖 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [📁 Project Structure](#-project-structure)
- [🔐 Roles & Permissions](#-roles--permissions)
- [⚙️ Setup & Installation](#️-setup--installation)
- [🔗 API Endpoints](#-api-endpoints)
- [📦 Parcel Status Flow](#-parcel-status-flow)
- [🧾 Sample Payloads](#-sample-payloads)
- [🔒 Security](#-security)
- [📥 Postman Collection](#-postman-collection)
- [📄 License](#-license)

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

- ✅ JWT Auth + Google OAuth
- 👥 Role-based Access: Admin, Sender, Receiver
- 📦 Parcel lifecycle tracking & logs
- 📊 Delivery history & cancel/reschedule options
- ❌ Cancel parcels (pre-dispatch only)
- 🚫 Block/Unblock users or parcels (admin)
- 🧱 Clean and modular folder architecture
- 🛡️ Zod validations across all endpoints

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── modules/
│   │   ├── auth/          # Login, token, Google OAuth
│   │   ├── user/          # Registration, user mgmt, blocking
│   │   └── parcel/        # Parcel logic, status, delivery
│   ├── middlewares/       # Error handlers, auth checks
│   ├── config/            # ENV, session, passport setup
│   ├── utils/             # Validation helpers, PDF generator
├── app.ts                 # Express App Init
└── server.ts              # Server Startup
````

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

* Node.js v18+
* MongoDB URI
* Vercel (for frontend hosting, optional)

### 🚀 Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/SK-Jabed/SwiftShip-Backend.git

# 2. Navigate to project folder
cd Parcel-Delivery-Server

# 3. Install dependencies
npm install

# 4. Setup environment variables
cp .env.example .env
# Fill in required fields in .env (DB_URI, JWT, Google OAuth keys, etc.)

# 5. Start development server
npm run dev
```

### 📁 Example `.env` Values

```env
PORT=5000
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiftShipDB
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=StrongPass123
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
FRONTEND_URL=http://localhost:5173
```

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
| Admin  | GET    | `/user/all-users`   | List all users    |
| All    | PATCH  | `/user/:id`         | Update profile    |
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

* `status`: Current state of the parcel
* `timestamp`: Auto-generated ISO timestamp
* `updatedBy`: Admin/User ID
* `note`: Optional remarks

---

## 🧾 Sample Payloads

### 📬 Create Parcel

```json
{
  "senderId": "123456789",
  "parcelType": "PACKAGE",
  "weight": 5,
  "description": "Fragile electronics",
  "senderInfo": {
    "name": "Alice",
    "phone": "017xxxxxxxx",
    "division": "Dhaka",
    "city": "Mirpur",
    "area": "Section 2",
    "detailAddress": "House 4, Road 2"
  },
  "receiverInfo": {
    "name": "Bob",
    "phone": "018xxxxxxxx",
    "division": "Chattogram",
    "city": "Agrabad",
    "area": "Block A",
    "detailAddress": "Apartment 7B"
  },
  "paymentMethod": "COD"
}
```

### 🛠 Update Parcel Status (Admin)

```json
{
  "status": "IN_TRANSIT",
  "note": "Left sorting hub",
  "location": "Chattogram"
}
```

---

## 🔒 Security

* **Passwords** hashed with `bcryptjs`
* **JWT tokens** with expiry control via `.env`
* **Role-based middleware** guards endpoints
* **Google OAuth** with fallback to credential login
* **Session Management** with `express-session`

---

## 🧭 Postman Collection

🧪 [Postman Collection (Download)]()

> Use test tokens or login credentials. Adjust `Authorization: Bearer <token>` headers per user role.

---

## 📄 License

Licensed under the [ISC License](LICENSE).
© 2025 Sheikh Jabed. All rights reserved.

---

## 🙌 Acknowledgements

Built with ❤️ using:

* [Express.js](https://expressjs.com/)
* [MongoDB + Mongoose](https://mongoosejs.com/)
* [Zod](https://zod.dev/)
* [JWT](https://jwt.io/)
* [PDFKit](https://pdfkit.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Passport.js](http://www.passportjs.org/)


---
