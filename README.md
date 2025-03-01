Below is a detailed `README.md` file for your E-commerce App, covering both the `ecommerce-backend` and `ecommerce-frontend` components. This README provides an overview, installation instructions, usage, and structure to help users understand and contribute to the project. It’s written in Markdown format and includes sections for clarity, suitable for a GitHub repository.

---

* E-commerce App

Welcome to the E-commerce App, a modern, full-stack application designed to manage an online store. This project consists of two main components:

- E-commerce Backend: A TypeScript-based RESTful API built with Express.js, PostgreSQL, and Firebase Authentication, handling business logic, user management, products, carts, and orders.
- E-commerce Frontend: A React-based single-page application (SPA) built with TypeScript, providing a user interface for browsing products, managing carts, and placing orders.

This README provides an overview, setup instructions, usage details, and the project structure for both components.

---

 Overview

* E-commerce Backend
The backend serves as the core API for the E-commerce App, offering endpoints for user authentication (via Firebase), product management, cart operations, and order processing. It uses Express.js for routing, PostgreSQL for data storage, and Firebase for authentication, with Swagger for API documentation.

* E-commerce Frontend
The frontend is a React application that provides a user-friendly interface for interacting with the backend. It allows users to log in, browse products, add items to their cart, and create orders, leveraging Firebase for authentication and TypeScript for type safety.

---

 Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v16 or later)
- npm (Node Package Manager)
- PostgreSQL (v12 or later)
- Git (for version control)
- Firebase Account (for authentication and configuration)

---

 Installation

* 1. Clone the Repository
Clone this repository to your local machine:

```bash
git clone <repository-url>
cd QEcommerceApp
```

* 2. Backend Setup (ecommerce-backend)
Navigate to the `ecommerce-backend` directory:

```bash
cd ecommerce-backend
```

 Install Dependencies
Run the following command to install backend dependencies:

```bash
npm install
```

 Configure Environment Variables
Create a `.env` file in the `ecommerce-backend` directory with the following variables:

```plaintext
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
```

Replace `username`, `password`, `your-firebase-project-id`, `your-firebase-private-key`, and `your-firebase-client-email` with your PostgreSQL and Firebase credentials. You can obtain Firebase credentials from your Firebase Console under Project Settings > Service Accounts.

 Set Up PostgreSQL
1. Ensure PostgreSQL is running on your machine.
2. Create a database named `ecommerce_db`:
   ```sql
   CREATE DATABASE ecommerce_db;
   ```
3. Initialize the database tables by running the backend server, which executes `initUsersTable`, `initProductsTable`, `initCartTable`, and `initOrdersTable` from the models.

 Start the Backend
Run the development server:

```bash
npm run dev
```

The backend will start on `http://localhost:5000`, and Swagger UI will be available at `http://localhost:5000/api-docs`.

* 3. Frontend Setup (ecommerce-frontend)
Navigate to the `ecommerce-frontend` directory:

```bash
cd ../ecommerce-frontend
```

 Install Dependencies
Run the following command to install frontend dependencies:

```bash
npm install
```

 Configure Environment Variables
Create a `.env` file in the `ecommerce-frontend` directory with the following variables:

```plaintext
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

Replace the Firebase values with those from your Firebase Console under Project Settings > General.

 Start the Frontend
Run the development server:

```bash
npm start
```

The frontend will start on `http://localhost:3000`.

---

 Usage

* E-commerce Backend
- Use the Swagger UI at `http://localhost:5000/api-docs` to explore and test API endpoints.
- Authenticate users via Firebase using `POST /auth/login` with a Firebase ID token.
- Manage products, carts, orders, and users through their respective endpoints (e.g., `POST /products/add`, `POST /cart/add`, `POST /orders/create`).

* E-commerce Frontend
- Open `http://localhost:3000` in a web browser.
- Log in using Firebase authentication to access the application.
- Browse products, add items to the cart, and place orders via the React components (`ProductList`, `Cart`, `Login`).

---

 Project Structure

* E-commerce Backend (`ecommerce-backend`)
```
C:\interview\QEcommerceApp\ecommerce-backend
├── firebase
│   └── admin.ts                    * Firebase Admin SDK configuration
├── src
│   ├── controllers                 * API endpoint handlers
│   │   ├── authController.ts       * User authentication logic
│   │   ├── cartController.ts       * Cart management logic
│   │   ├── orderController.ts      * Order processing logic
│   │   └── productController.ts    * Product management logic
│   ├── middleware                  * Middleware functions
│   │   └── authMiddleware.ts       * Authentication middleware for protected routes
│   ├── models                      * Database models and schema initialization
│   │   ├── cartModel.ts            * Cart table operations
│   │   ├── orderModel.ts           * Order and order items table operations
│   │   ├── productModel.ts         * Product table operations
│   │   ├── types.ts                * Type definitions for models
│   │   └── userModel.ts            * User table operations
│   ├── routes                      * API route definitions
│   │   ├── authRoutes.ts           * Authentication routes
│   │   ├── cartRoutes.ts           * Cart routes
│   │   ├── orderRoutes.ts          * Order routes
│   │   └── productRoutes.ts        * Product routes
│   ├── utils                       * Utility functions
│   │   └── dbConnection.ts         * PostgreSQL database connection
│   ├── app.ts                      * Main application entry point
│   └── swagger.ts                  * Swagger configuration for API documentation
├── .env                            * Environment variables (not committed to Git)
├── package.json                    * Backend dependencies and scripts
├── serviceAccountKey.json          * Firebase service account key (not committed to Git)
└── tsconfig.json                   * TypeScript configuration
```

* E-commerce Frontend (`ecommerce-frontend`)
```
C:\interview\QEcommerceApp\ecommerce-frontend
├── public                         * Static assets for the React app
│   ├── favicon.ico                * Favicon for the web app
│   ├── index.html                 * Main HTML entry point
│   ├── logo192.png                * Logo for PWA (192x192)
│   ├── logo512.png                * Logo for PWA (512x512)
│   ├── manifest.json              * PWA manifest
│   └── robots.txt                 * SEO configuration
├── src                            * Source code for the React app
│   ├── components                 * React components
│   │   ├── Cart.css               * Styling for Cart component
│   │   ├── Cart.tsx               * Cart component implementation
│   │   ├── Login.css              * Styling for Login component
│   │   ├── Login.tsx              * Login component implementation
│   │   ├── ProductList.css        * Styling for ProductList component
│   │   └── ProductList.tsx        * ProductList component implementation
│   ├── App.css                    * Global CSS for the app
│   ├── App.test.tsx               * Test file for App component
│   ├── App.tsx                    * Main App component
│   ├── index.css                  * Global CSS for the app
│   ├── index.tsx                  * Entry point for React app
│   ├── logo.svg                   * App logo
│   ├── react-app-env.d.ts         * TypeScript environment declarations
│   ├── reportWebVitals.ts         * Web vitals reporting utility
│   ├── setupTests.ts              * Test setup for Jest
│   └── types.ts                   * Type definitions for the frontend
├── .gitignore                     * Files and directories to ignore in Git
├── package.json                   * Frontend dependencies and scripts
├── README.md                      * Frontend-specific README (can be merged with this one)
└── tsconfig.json                  * TypeScript configuration
```

---

 Contributing

1. Fork this repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add your feature or fix"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Submit a pull request to the main branch.

Please follow the coding standards (TypeScript, ESLint, Prettier) and include tests where applicable.

---

 License

This project is licensed under the [MIT License](LICENSE) - see the `LICENSE` file for details.

---

 Contact

For questions or feedback, reach out to:
- Email: [salam.romim@Gamil.com]
- GitHub: [Abdalslam-Alromimah](https://github.com/Abdalslam-Alromimah)
=======
# ecommerce-app
 E-commerce App  Welcome to the E-commerce App, a modern, full-stack application designed to manage an online store.This README provides an overview, setup instructions, usage details, and the project structure for both components.
>>>>>>> d0663817d4fad1c048efd59fa8d917e7b52d768f
