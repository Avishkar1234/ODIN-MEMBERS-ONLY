# Members Only

A full-stack membership-based message board built as part of [The Odin Project](https://www.theodinproject.com/).

This project builds on previous Express/PostgreSQL applications by introducing **authentication, authorization, sessions, password hashing, validation, role-based permissions, and production deployment**.

## Live Demo

[Members Only](https://odin-members-only-git-main-avishkar1234s-projects.vercel.app/)

---

## Features

- User signup, login, and logout
- Password hashing with bcrypt
- Passport.js LocalStrategy authentication
- Persistent sessions with PostgreSQL
- Protected routes
- Membership system using a secret passcode
- Admin role with separate permissions
- Create and display messages
- Members can see message authors and timestamps
- Admins can delete messages
- Signup validation and password confirmation
- Validation error messages with preserved form input
- Conditional UI based on authentication and permissions
- Production deployment with Vercel and Neon PostgreSQL

---

## Tech Stack

### Backend

- Node.js
- Express.js
- Passport.js
- `passport-local`
- `express-session`
- `connect-pg-simple`
- bcrypt
- express-validator
- PostgreSQL
- `pg`
- dotenv

### Frontend

- EJS
- HTML
- CSS

### Deployment

- Vercel
- Neon PostgreSQL
- GitHub

---

## Project Structure

```text
ODIN-MEMBERS-ONLY/
├── config/
│   └── db.js
├── controllers/
│   └── authController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── membershipRoutes.js
│   └── messageRoutes.js
├── views/
│   ├── admin.ejs
│   ├── home.ejs
│   ├── join.ejs
│   ├── login.ejs
│   ├── newMessage.ejs
│   └── signup.ejs
├── public/
│   └── styles.css
├── app.js
├── package.json
└── vercel.json
