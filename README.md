# Stayora

An original stay marketplace built with React, Express, and MongoDB. It includes a responsive browse experience, listing details, account registration and login, wish lists, bookings, and a host dashboard for managing properties.

## Requirements

- Node.js 20+
- MongoDB locally, or a MongoDB Atlas connection string

## Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `MONGODB_URI` and a long, random `JWT_SECRET` in `backend/.env`.
3. Install dependencies from the project root: `npm install`, `npm --prefix frontend install`, and `npm --prefix backend install`.
4. Run both apps with `npm run dev`.
5. (Optional) Load sample stays with `npm run seed`.
6. Open the Vite URL printed in your terminal (usually `http://localhost:5173`).

The Express API listens on port 5000 by default. Vite proxies `/api` requests to it. Create an account in the UI to try protected features. Listings are created by signed-in hosts; bookings and saved stays are attached to the signed-in user.

The top navigation has All, Homes, Hotels, Experiences, and Services pages. The Homes page uses MongoDB stay listings; the Hotels, Experiences, and Services pages are styled, working page shells ready for the details you want to provide later.

## Other commands

- `npm run build` builds the React app for production.
- `npm start` starts the API server.

## API overview

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/listings`, `GET /api/listings/:id`, `POST /api/listings`, `PUT /api/listings/:id`, `DELETE /api/listings/:id`
- `GET /api/bookings`, `POST /api/bookings`, `PATCH /api/bookings/:id/cancel`
- `GET /api/users/me`, `GET /api/users/me/favorites`, `PUT /api/users/me/favorites/:listingId`

All write operations except registration/login require a bearer token. Hosts can modify only their own listings; booking users can view and cancel only their own bookings.

## New: bookable rows, list + map page

- Every photo in every row (Home, Hotels, Experiences, Services) opens its own page with photo viewer, dates (check-in / check-out), guests, price and booking.
- The arrow next to a row title opens a 2-column page: list on the left, map (OpenStreetMap) on the right.
- Run `npm run seed` once (or `npm run seed:reset` to rebuild the demo data) so all rows have listings. Demo listings belong to a separate demo host, so your own account can book them.
