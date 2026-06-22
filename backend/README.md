# Strive Blog — Backend

REST API for the Strive Blog app. Built with Express + MongoDB (Mongoose), JWT auth, Cloudinary uploads and email notifications.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # development (nodemon)
npm start              # production
```

## Environment variables

See `.env.example`. Required to run: `MONGO_URI`, `JWT_SECRET`.
Optional (features degrade gracefully if missing): Cloudinary, SendGrid/SMTP, Google OAuth.

## Authentication

All routes require a JWT except `POST /login` and `POST /users` (register).
Send the token in the header:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth & users
- `POST /users` — register (password hashed with bcrypt) · **public**
- `POST /login` — returns `{ "token": "..." }` · **public**
- `GET /me` — current authenticated user
- `GET /users` · `GET /users/:id` · `PATCH /users/:id` · `DELETE /users/:id`
- `PATCH /users/:id/avatar` — upload avatar (form-data field `avatar`) → Cloudinary

### Posts
- `GET /posts` · `GET /post/:id`
- `POST /posts` — create (sends notification email to the author)
- `PATCH /post/:id` · `DELETE /post/:id`
- `PATCH /posts/:id/cover` — upload cover (form-data field `cover`) → Cloudinary

### Comments
- `GET /posts/:id/comments`
- `GET /posts/:id/comments/:commentId`
- `POST /posts/:id/comments`
- `PUT /posts/:id/comments/:commentId`
- `DELETE /posts/:id/comments/:commentId`

## Deploy (Heroku)

Set the environment variables in the Heroku dashboard and deploy. The `start`
script (`node main.js`) is used as the web process.
