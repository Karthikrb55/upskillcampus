# cms-fullstack-starter-new

Minimal production-style CMS starter scaffold.

Run locally:

- Client
  ```powershell
  cd client
  npm install
  npm run dev
  ```

- Server
  ```powershell
  cd server
  npm install
  node app.js
  ```

Environment variables (create `.env` in `server`):

- `MONGODB_URI` - MongoDB connection string (Atlas recommended)
- `JWT_SECRET` - secret for signing JWTs

Notes:
- Tailwind and Tiptap are wired as placeholders; install required packages in `client` if you want full features.
- Image uploads use local filesystem by default (`server/uploads`).
