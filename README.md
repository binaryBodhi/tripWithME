# TripWithMe - Cab Booking & Ride Sharing App 🚙✨

**TripWithMe** is a full-stack web application designed to simplify cab booking and ride sharing. Users can create trips, search for others going the same way, and join rides to split costs and reduce their carbon footprint.

---

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based login and registration.
- **Trip Management**: Create, search, join, and leave trips.
- **Real-time Notifications**: Get notified of join requests, acceptances, and trip cancellations.
- **Trip History**: View your past completed and cancelled trips with a detailed "Repeat Trip" functionality.
- **Metrics Dashboard**: Track your total completed trips and unique fellow travelers.

### Modern UI/UX
- **Responsive Design**: Optimized for both Desktop and Mobile (iOS/Android).
- **Glassmorphism Aesthetic**: Sleek, premium look with dark/light mode support.
- **Dynamic Theming**: Automatically adjusts to system preferences or manual toggles.

---

## 🛠 Tech Stack

- **Backend**: FastAPI (Python), MongoDB (Beanie ODM).
- **Frontend**: React (Vite), Axios, CSS Modules.
- **Testing**: Pytest (Backend), Vitest & React Testing Library (Frontend).
- **Deployment**: Docker, Docker Compose, Gunicorn.

---

## ⚙️ Getting Started

### Local Setup (Development)

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd cab-booking-app
   ```

2. **Backend**:
   - Create a virtual environment: `python -m venv .venv`
   - Activate it: `source .venv/bin/activate`
   - Install dependencies: `pip install -r requirements.txt`
   - Create a `.env` file in `backend/` with `MONGODB_URL` and `JWT_SECRET`.
   - Run the server: `uvicorn backend.main:app --reload`

3. **Frontend**:
   - Navigate to frontend: `cd frontend`
   - Install dependencies: `npm install`
   - Run the dev server: `npm run dev`

---

## 🐳 Running with Docker (Recommended for Production)

Launch the entire stack (Database, API, and UI) with a single command:
```bash
docker-compose up --build
```
Access the app at `http://localhost`.

---

## 🧪 Testing

### Backend Integration Tests
```bash
./.venv/bin/pytest backend/tests/
```

### Frontend Component Tests
```bash
cd frontend && npm test
```

---

## 📁 Project Structure

```text
.
├── backend/            # FastAPI Backend
│   ├── auth/           # JWT & Security
│   ├── controller/     # Business Logic
│   ├── models/         # Beanie ODM Models
│   ├── repositories/   # DB Operations
│   ├── routes/         # API Endpoints
│   └── tests/          # Integration Tests
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── pages/      # View Components
│   │   ├── services/   # API Clients
│   │   └── styles/     # Vanilla CSS Modules
└── docker-compose.yml  # Orchestration
```

---

## 📄 License
This project is licensed under the MIT License.
