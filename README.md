🎯 Multi-Level Referral System with Admin Dashboard

This is a full-stack web app that makes it easy to manage a multi-level referral program and rewards. It’s built with the MERN stack and comes with:

User registration & login, with optional referral codes

Automated rewards handed out up to 9 levels deep

Admin dashboard for managing users and rewards

Referral links & history, so users can share and track their rewards

🏗️ Key Features

For Users

Sign up (with or without a referral code)

Earn and see rewards for your referrals

View your unique referral link and history

For Admins

Secure login to an admin panel

See and search all users (non-admins)

Activate or deactivate accounts

Manually adjust user points

Browse the complete reward history (excluding admin actions)

⚙️ Tech Stack

| Frontend   | React.js, Axios                 |
| Backend    | Node.js, Express.js             |
| Database   | MongoDB (Mongoose)              |
| Authentication | JWT, bcrypt               |
| Styling    | Theme colors (#2E6F40, #CFFFDC, #68BA7F, #253D2C) |

🚀 Getting Started

Clone the repo:

git clone https://github.com/your-username/referral-system.git
cd referral-system

Install dependencies:

npm install

Set up your environment:

Create a .env file based on .env.example

Add your MongoDB Atlas URI and JWT secret

Run the app:

npm run dev

Access the app:

Frontend: http://localhost:3000

Admin panel: http://localhost:3000/admin