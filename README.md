# IoT Sensor MongoDB

A small Node.js/TypeScript service for collecting IoT sensor readings via HTTP and storing them in MongoDB. It also includes MQTT broker/subscriber support and a simulator pipeline.

## Features

- Express API server
- MongoDB storage for sensor readings
- MQTT broker and subscriber integration
- TypeScript build and development workflow
- Health check endpoint (`GET /health`)

## Prerequisites

- Node.js 20+ or compatible runtime
- pnpm package manager
- MongoDB instance or Atlas cluster

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file from `.env.example`:

```bash
copy .env.example .env
```

3. Update `.env` with your MongoDB URI and database name.

## Environment Variables

The service uses the following environment variables:

- `PORT` - HTTP port for the server (default: `3000`)
- `MQTT_PORT` - MQTT broker port (default: `1883`)
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - MongoDB database name

## Scripts

- `pnpm dev` - compile TypeScript and start the server in watch mode
- `pnpm build` - build the project using TypeScript
- `pnpm start` - run the compiled server from `dist`
- `pnpm pipeline` - compile and run the simulator pipeline

## Running the Server

```bash
pnpm dev
```

Then open:

- `http://localhost:3000/health` for health status

If your API router is mounted at `/api`, other endpoints will appear under `/api/...`.

## Notes

- Do not commit `.env` to source control.
- Keep credentials and database connection strings private.
