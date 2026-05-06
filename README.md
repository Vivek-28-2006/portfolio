# Portfolio (PostgreSQL)
Publish : https://portfolio-fgj8evn40-vivek-28-2006s-projects.vercel.app

A polished personal portfolio built with Node.js, Express.js, PostgreSQL, HTML, CSS, and JavaScript.

## Features

- Responsive single-page portfolio with a modern visual system
- Express API that serves profile, skills, projects, and experience data
- PostgreSQL-backed project storage with local fallback data for preview
- Contact form that stores submissions on the backend
- Deployment-friendly setup for Render, Railway, or Heroku

## Project Structure

- `server/server.js` - Express server and API routes
- `server/public/` - Frontend assets
- `data/portfolio.json` - Default portfolio content used for fallback and seeding

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and update your Postgres connection string:

```bash
copy .env.example .env
```

3. Start the server:

```bash
npm start
```

4. Open `http://localhost:3000`

## Database Setup

The app uses PostgreSQL when `DATABASE_URL` is set.

- Create a local or hosted Postgres database
- Update `DATABASE_URL` in `.env`
- If your provider requires SSL, set `PGSSL=true`

If PostgreSQL is unavailable, the app still starts with local fallback data so you can preview the frontend.

## Deployment

### Render

- Create a new Web Service from the repository root
- Set build command to `npm install`
- Set start command to `npm start`
- Add `DATABASE_URL` (and `PGSSL=true` if required) as environment variables

### Railway

- Deploy from the repository root
- Add `DATABASE_URL` to the service variables
- Use `npm start` as the start command

### Heroku

- Set `DATABASE_URL` in config vars
- Use the included `Procfile`

## Customization

Edit `data/portfolio.json` to change your bio, projects, social links, and skills. If PostgreSQL is connected, the database will be seeded from that file the first time the app starts.
