# GroupSync

Prototype: collaborative group event booking.

## Prerequisites

- **Node.js** (v22 or higher recommended)
- **npm** or **yarn**
- **Firebase account** with a project created

## Local Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd groupsync
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Firebase configuration values from the Firebase Console:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   - Open [http://localhost:5173](http://localhost:5173) in your browser

## Scripts

- `npm run dev` — start Vite development server
- `npm run build` — create production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

## Tech Stack

- **React 19** — UI library
- **Vite 7** — build tool and dev server
- **Firebase 12** — backend services (Auth, Firestore, Storage)
- **React Router 7** — client-side routing
- **TypeScript** — type safety (via dev dependencies)
- **ESLint + Prettier** — code quality and formatting
- **GitHub Actions** — continuous integration and deployment

## Troubleshooting

- **Environment variables not loading**: Ensure variable names start with `VITE_`
- **Firebase errors**: Verify all services are enabled in Firebase Console
- **Port already in use**: Vite defaults to port 5173; change in `vite.config.js` if needed
