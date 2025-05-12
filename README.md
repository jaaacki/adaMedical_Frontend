# Business Operations Platform Frontend

This is the Next.js frontend for the Integrated Business Operations Platform.

## Features

- Next.js 14 with TypeScript
- Tailwind CSS for styling
- React Query for API data fetching
- JWT Authentication with refresh tokens
- Role-based access control

## Getting Started

### Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed.

2. Start the development server:

```bash
docker-compose up
```

3. The application will be available at [http://localhost:3000](http://localhost:3000).

### Local Development Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:5555/api/v1
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
# Build the Docker image
docker build -t business-ops-frontend .

# Run the container
docker run -p 3000:3000 business-ops-frontend
```

## Project Structure

```
business-ops-frontend/
├── public/           # Static assets
├── src/              # Source code
│   ├── app/          # Next.js App Router
│   ├── components/   # Reusable components
│   ├── lib/          # Utilities and libraries
│   └── types/        # TypeScript type definitions
├── .gitignore        # Git ignore file
├── docker-compose.yml # Docker Compose configuration
├── Dockerfile        # Docker configuration
├── next.config.js    # Next.js configuration
├── package.json      # Project dependencies
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## Connecting to the Backend

This frontend is designed to connect to the Flask backend running at `http://localhost:5555/api/v1`. Make sure your backend is running before using the frontend.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: URL of the backend API (default: `http://localhost:5555/api/v1`)