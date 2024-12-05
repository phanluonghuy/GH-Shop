# GH-Shop

GH-Shop is an e-commerce project built with modern technologies including TypeScript, Node.js, Express for the backend, and Next.js, React, and Tailwind CSS for the frontend. The project also uses MongoDB for the database, Docker for containerization, Cloudinary for image storage, Stripe for payment processing, and Google Authentication for user login.

## Features

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js, React, Tailwind CSS
- **Database**: MongoDB
- **Authentication**: Google Authentication
- **Image Storage**: Cloudinary
- **Payment**: Stripe
- **Containerization**: Docker

## Online Demo

You can check out the live demo of the project at: [https://toangtv.live/](https://toangtv.live/)

## Installation

To run the project locally, follow the steps below:

1. **Clone the repository**

   ```bash
   git clone https://github.com/phanluonghuy/GH-Shop.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd GH-Shop
   ```

3. **Build and run the project using Docker**

   Make sure you have Docker installed and running on your machine. Then, execute the following command to build and start the containers:

   ```bash
   docker compose up
   ```

   This will start both the backend and frontend services in Docker containers. The application will be available locally once the containers are up and running.

## Usage

After running the application, you can access:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: The backend will run in a container, accessible through its respective API endpoints.

### Test Accounts

For testing user login and roles, use the following test credentials:

- **User Account**:
  - **Username**: `user@test.com`
  - **Password**: `Admin@123`
  
- **Admin Account**:
  - **Username**: `admin@test.com`
  - **Password**: `Admin@123`

Use these accounts to log in and test both regular user and admin access to the application. Admin users will have additional privileges like managing products and users.

### Stripe Card Test

To test the Stripe payment functionality, you can use the following test card details:

- **Card Number**: `4242 4242 4242 4242`
- **Expiration Date**: `12/34`
- **CVC**: `567`
- **Other form fields**: You can enter any value or use `qrcode` for the payment field.

These test credentials simulate a successful payment and allow you to test the payment flow without real charges.
