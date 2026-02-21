# RollKnow V3 - Gamified LMS Integration Platform

A gamified learning platform that integrates with Learning Management Systems via LTI 1.3, featuring challenge-based progression, skill trees, and real-time dice rolling sessions.

## 🎯 Project Overview

This is a Masters research project at North West University studying gamification in education. The platform provides:

- **Challenge System**: Students accept and complete challenges to earn XP and advance through levels
- **Skill Trees**: Three skill tracks (Research, Collaboration, Creation) with progressive tiers
- **Roll Sessions**: Live dice rolling events for challenge assignment
- **LTI 1.3 Integration**: Seamless embedding in Canvas, Moodle, Sakai, and other LMS platforms

## 📁 Project Structure

```
rollknow_v3/
├── frontend/          # React TypeScript SPA
│   ├── src/          # React components and application code
│   ├── public/       # Static assets
│   ├── package.json  # Node dependencies
│   └── vite.config.ts
│
├── backend/          # Django REST API + WebSocket
│   ├── apps/
│   │   └── learning_tools_interoperability/
│   │       ├── models.py           # Gamification data models
│   │       ├── api_views.py        # DRF ViewSets
│   │       ├── serializers.py      # DRF serializers
│   │       ├── consumers.py        # WebSocket consumers
│   │       ├── routing.py          # WebSocket routing
│   │       ├── authentication.py   # JWT authentication
│   │       ├── views.py            # LTI launch handlers
│   │       ├── urls.py             # URL configuration
│   │       └── admin.py            # Django admin
│   ├── core/
│   │   ├── settings/              # Environment-based settings
│   │   ├── urls.py                # Root URL configuration
│   │   └── asgi.py                # ASGI configuration
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/                      # Virtual environment
│
├── .gitignore        # Root gitignore for both frontend and backend
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Redis** (for WebSocket support)

### Backend Setup (Django)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create cache table for LTI state
python manage.py createcachetable

# Create superuser (for Django admin)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

**For WebSocket support**, run Daphne in a separate terminal:

```bash
cd backend
redis-server  # Start Redis in another terminal
daphne -p 9000 core.asgi:application
```

### Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state management
- **Socket.io-client** - WebSocket client

### Backend
- **Django 5.1** - Web framework
- **Django REST Framework** - API framework
- **Django Channels** - WebSocket support
- **Redis** - Channel layer for WebSockets
- **PyLTI1p3** - LTI 1.3 implementation
- **PostgreSQL / SQLite** - Database

## 🎮 Key Features

### 1. Challenge System
- Instructors create challenges with:
  - Rarity levels (Common, Uncommon, Legendary)
  - Skill tree association (Research, Collaboration, Creation)
  - XP and skill point rewards
  - Success criteria and objectives

### 2. Student Progression
- XP-based leveling system
- Activity streaks tracking
- Three skill trees with progressive tiers:
  - Novice → Apprentice → Adept → Expert → Master

### 3. Roll Sessions
- Live dice rolling events
- Real-time updates via WebSocket
- Challenge assignment through dice rolls
- Session history and analytics

### 4. LTI 1.3 Integration
- Seamless LMS embedding
- Single Sign-On (SSO)
- Course context isolation
- Grade passback (future)

## 🔐 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
DJANGO_SETTINGS_MODULE=core.settings.local

# JWT Authentication
JWT_SECRET_KEY=your-jwt-secret-key

# Frontend URL (for LTI redirects)
LTI_FRONTEND_URL=http://localhost:5173

# LMS Domain (for CSRF)
LMS_DOMAIN=https://canvas.nwu.ac.za
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:9000
```

## 📚 API Documentation

### Authentication

All API endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <token>
```

The JWT token is generated during LTI launch and contains:
- `user_id`: LTI user ID
- `context_id`: LTI context (course) ID
- `exp`: Expiration timestamp

### API Endpoints

**Student Profiles**
- `GET /api/profiles/` - List profiles
- `GET /api/profiles/me/` - Get current user's profile

**Challenges**
- `GET /api/challenges/` - List active challenges
- `GET /api/challenges/{id}/` - Get challenge details
- `POST /api/challenges/{id}/accept/` - Accept a challenge

**Submissions**
- `GET /api/submissions/` - List user's submissions
- `POST /api/submissions/` - Create submission
- `POST /api/submissions/{id}/submit/` - Submit for review
- `POST /api/submissions/{id}/complete/` - Complete submission (instructor)

**Roll Sessions**
- `GET /api/sessions/` - List sessions
- `GET /api/sessions/active/` - Get active session
- `GET /api/sessions/{id}/rolls/` - Get session rolls

### WebSocket Endpoint

**Roll Session**
- `ws://localhost:9000/ws/session/<session_id>/?token=<jwt_token>`

**Message Format (Client → Server)**:
```json
{
  "action": "roll",
  "challenge_id": 123
}
```

**Message Format (Server → Client)**:
```json
{
  "type": "roll",
  "roll_id": 456,
  "student_name": "John Doe",
  "challenge_title": "Research Challenge",
  "roll_value": 15,
  "timestamp": "2026-01-23T12:00:00Z"
}
```

## 🧪 Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Database Management

```bash
# Create migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Access Django admin
# Visit http://localhost:8000/admin/
```

### LTI Testing with ngrok

For LTI testing with Canvas/Moodle/Sakai:

```bash
# Start ngrok
ngrok http 8000

# Update LTI_FRONTEND_URL in backend/.env
# Register the ngrok URL in your LMS
```

## 📖 Research Context

This platform is part of a Masters research project at **North West University** investigating:
- The impact of gamification on student engagement
- Challenge-based learning in higher education
- LTI 1.3 integration patterns
- Real-time collaborative learning experiences

## 🤝 Contributing

This is a research project. For questions or collaboration inquiries, please contact the research team.

## 📄 License

Copyright © 2026 North West University. All rights reserved.

This software is part of ongoing academic research and is not licensed for commercial use.

## 🔗 Related Documentation

- [LTI 1.3 Specification](https://www.imsglobal.org/spec/lti/v1p3/)
- [Django Channels Documentation](https://channels.readthedocs.io/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)

---

**Built with ❤️ for education research at North West University**
