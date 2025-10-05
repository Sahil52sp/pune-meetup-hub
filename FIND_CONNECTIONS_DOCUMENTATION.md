# Find a Connection Feature - Complete Documentation

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Authentication System](#authentication-system)
3. [Backend Components](#backend-components)
4. [Frontend Components](#frontend-components)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [User Flow](#user-flow)
8. [Code Structure](#code-structure)
9. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🏗️ Architecture Overview

### Tech Stack
```
Frontend: React + TypeScript + Tailwind CSS + Vite
Backend: FastAPI + Python
Database: MongoDB
Authentication: Google OAuth via Emergent Auth
```

### System Architecture
```
[User Browser] 
     ↓ HTTPS
[Frontend - React App (Port 3000)]
     ↓ API Calls (/api/*)
[Backend - FastAPI (Port 8001)]
     ↓ Database Queries
[MongoDB Database]

[Emergent Auth Service] ← OAuth Flow
```

### Key Features
1. **Google OAuth Authentication** - Secure login via Google
2. **Profile Management** - Users can create and edit professional profiles
3. **Browse Connections** - Search and filter other professionals
4. **Connection Requests** - Send/receive connection requests with messages
5. **Built-in Messaging** - Real-time chat with accepted connections

---

## 🔐 Authentication System

### How Google OAuth Works

#### 1. Login Flow
```javascript
// File: /app/frontend/src/contexts/AuthContext.tsx

const login = () => {
  const redirectUrl = `${window.location.origin}/`;
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
};
```

**Step-by-step:**
1. User clicks "Sign In" button
2. Browser redirects to `https://auth.emergentagent.com`
3. User completes Google OAuth
4. Google redirects back to your app with `session_id` in URL fragment
5. Frontend detects `session_id` and exchanges it for user data

#### 2. Session Processing
```javascript
// URL after OAuth: https://yourapp.com/#session_id=abc123

useEffect(() => {
  const fragment = window.location.hash.substring(1);
  const params = new URLSearchParams(fragment);
  const sessionId = params.get('session_id');
  
  if (sessionId) {
    // Exchange session_id for user data
    const response = await fetch(`${backendUrl}/api/auth/session`, {
      method: 'POST',
      headers: { 'X-Session-ID': sessionId },
      credentials: 'include'
    });
  }
}, []);
```

#### 3. Backend Session Handling
```python
# File: /app/backend/routes/auth_routes.py

@router.post("/auth/session")
async def process_session(request: Request, response: Response):
    session_id = request.headers.get("X-Session-ID")
    
    # Get user data from Emergent Auth
    session_data = await get_session_data_from_emergent(session_id)
    
    # Create or update user
    user = await create_or_get_user(db, session_data)
    
    # Set httpOnly cookie with session token
    response.set_cookie("session_token", session_data.session_token, httponly=True)
    
    return {"success": True, "user": user}
```

### Authentication Context
```javascript
// File: /app/frontend/src/contexts/AuthContext.tsx

interface AuthContextType {
  user: User | null;           // Current user data
  isAuthenticated: boolean;    // true if user is logged in
  isLoading: boolean;         // true during auth checks
  login: () => void;          // Redirect to OAuth
  logout: () => Promise<void>; // Clear session
  checkAuthStatus: () => void; // Verify current session
}
```

---

## 🔧 Backend Components

### File Structure
```
/app/backend/
├── server.py              # Main FastAPI app
├── models.py             # Pydantic models for data validation
├── auth.py               # Authentication helper functions
└── routes/
    ├── auth_routes.py    # Authentication endpoints
    ├── profile_routes.py # Profile management
    ├── connection_routes.py # Connection requests
    └── messaging_routes.py  # Messaging system
```

### 1. Database Models
```python
# File: /app/backend/models.py

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    job_title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    is_open_for_connection: bool = True
```

### 2. Authentication Middleware
```python
# File: /app/backend/auth.py

async def get_current_user(request: Request, db) -> User:
    """Get authenticated user from session token"""
    
    # Try cookie first, then Authorization header
    session_token = request.cookies.get("session_token")
    if not session_token:
        authorization = request.headers.get("authorization")
        if authorization and authorization.startswith("Bearer "):
            session_token = authorization.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Validate session in database
    user = await get_current_user_from_session_token(db, session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user
```

### 3. API Route Protection
```python
# All protected routes use this pattern:

@router.get("/profile")
async def get_profile(request: Request, db: Database = Depends(get_database)):
    current_user = await get_current_user(request, db)  # This enforces authentication
    # Route logic here...
```

---

## 🎨 Frontend Components

### File Structure
```
/app/frontend/src/
├── contexts/
│   └── AuthContext.tsx       # Global auth state
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── layout/
│   │   └── Header.tsx        # Navigation with auth
│   └── onboarding/
│       ├── WelcomeBanner.tsx # New user guidance
│       └── QuickActions.tsx  # Action shortcuts
└── pages/
    ├── ProfilePage.tsx       # Profile management
    ├── BrowseConnectionsPage.tsx # Find people
    ├── ConnectionsPage.tsx   # Manage requests
    └── MessagingPage.tsx     # Chat interface
```

### 1. Protected Routes
```javascript
// File: /app/frontend/src/components/auth/ProtectedRoute.tsx

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <LoginPrompt onLogin={login} />;
  }

  return <>{children}</>;
};

// Usage in App.tsx:
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

### 2. Authentication-Aware Navigation
```javascript
// File: /app/frontend/src/components/layout/Header.tsx

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <nav>
        {isAuthenticated ? (
          <>
            <Link to="/profile">My Profile</Link>
            <Link to="/browse">Browse Connections</Link>
            <Link to="/connections">My Connections</Link>
            <Link to="/messaging">Messages</Link>
            <UserDropdown user={user} onLogout={logout} />
          </>
        ) : (
          <Button onClick={login}>Sign In</Button>
        )}
      </nav>
    </header>
  );
}
```

### 3. API Communication Pattern
```javascript
// Every page follows this pattern for API calls:

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const backendUrl = 'https://meetup-network-1.preview.emergentagent.com';

  const loadProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/profile`, {
        credentials: 'include'  // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data.profile);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);
};
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  "_id": "user_uuid_here",
  "id": "user_uuid_here",      // Same as _id for consistency
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "created_at": "2025-01-04T...",
  "is_active": true
}
```

#### 2. User Profiles Collection
```javascript
{
  "_id": "profile_uuid_here",
  "id": "profile_uuid_here",
  "user_id": "user_uuid_here",     // References users.id
  "job_title": "Software Engineer",
  "company": "Tech Corp",
  "bio": "Passionate developer...",
  "location": "San Francisco, CA",
  "linkedin_url": "https://linkedin.com/in/...",
  "years_experience": 5,
  "skills": ["JavaScript", "Python", "React"],
  "interests": ["AI", "Blockchain", "Startups"],
  "is_open_for_connection": true,
  "contact_preferences": "email",
  "created_at": "2025-01-04T...",
  "updated_at": "2025-01-04T..."
}
```

#### 3. Connection Requests Collection
```javascript
{
  "_id": "request_uuid_here",
  "id": "request_uuid_here",
  "sender_id": "user_uuid_here",     // Who sent the request
  "receiver_id": "user_uuid_here",   // Who received it
  "message": "Hi, let's connect!",
  "status": "pending",               // pending|accepted|rejected|blocked
  "created_at": "2025-01-04T...",
  "responded_at": "2025-01-04T..."   // When accepted/rejected
}
```

#### 4. Conversations Collection
```javascript
{
  "_id": "conversation_uuid_here",
  "id": "conversation_uuid_here",
  "user1_id": "user_uuid_here",
  "user2_id": "user_uuid_here",
  "created_at": "2025-01-04T...",
  "last_message_at": "2025-01-04T...",
  "is_active": true
}
```

#### 5. Messages Collection
```javascript
{
  "_id": "message_uuid_here",
  "id": "message_uuid_here",
  "conversation_id": "conversation_uuid_here",
  "sender_id": "user_uuid_here",
  "content": "Hello there!",
  "timestamp": "2025-01-04T...",
  "is_read": false
}
```

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST /api/auth/session
- Headers: X-Session-ID: <session_id_from_oauth>
- Purpose: Exchange session_id for user data and create session
- Response: User object + sets httpOnly cookie

GET /api/auth/me  
- Purpose: Check current authentication status
- Response: Current user data or 401 if not authenticated

POST /api/auth/logout
- Purpose: Clear user session and cookies
- Response: Success message
```

### Profile Endpoints
```
POST /api/profile
- Purpose: Create new user profile
- Body: UserProfileCreate object
- Auth: Required

GET /api/profile
- Purpose: Get current user's profile
- Auth: Required

PUT /api/profile  
- Purpose: Update current user's profile
- Body: UserProfileUpdate object
- Auth: Required

GET /api/profile/browse?search=<term>&location=<loc>&company=<comp>
- Purpose: Browse other users' profiles with filters
- Auth: Required

GET /api/profile/{user_id}
- Purpose: Get specific user's profile
- Auth: Required
```

### Connection Endpoints
```
POST /api/connections/request
- Purpose: Send connection request
- Body: { receiver_id: string, message: string }
- Auth: Required

GET /api/connections/requests/received
- Purpose: Get connection requests received by current user
- Auth: Required

GET /api/connections/requests/sent
- Purpose: Get connection requests sent by current user  
- Auth: Required

PUT /api/connections/requests/{request_id}/respond
- Purpose: Accept or reject connection request
- Body: { status: "accepted" | "rejected" }
- Auth: Required

GET /api/connections/established
- Purpose: Get established connections (accepted requests)
- Auth: Required
```

### Messaging Endpoints
```
GET /api/conversations
- Purpose: Get all conversations for current user
- Auth: Required

GET /api/conversations/{conversation_id}
- Purpose: Get conversation details
- Auth: Required

GET /api/conversations/{conversation_id}/messages
- Purpose: Get messages in a conversation
- Auth: Required

POST /api/conversations/{conversation_id}/messages
- Purpose: Send message in conversation
- Body: { content: string }
- Auth: Required
```

---

## 👥 User Flow

### 1. New User Journey
```
1. User visits homepage
2. Clicks "Sign In" button
3. Redirected to Google OAuth
4. Completes Google login
5. Redirected back with session_id
6. Frontend exchanges session_id for user data
7. User sees Welcome Banner prompting profile completion
8. User clicks "Complete My Profile"
9. User fills out profile form (job, company, skills, etc.)
10. User saves profile
11. User can now browse connections and send requests
```

### 2. Connection Request Flow
```
1. User goes to "Browse Connections"
2. User searches/filters for relevant professionals
3. User finds someone interesting
4. User clicks "Send Connection Request"
5. User writes personalized message
6. Request is sent to receiver
7. Receiver sees request in "My Connections" → "Received" tab
8. Receiver can accept or reject with one click
9. If accepted, both users can now message each other
10. Conversation appears in "Messages" section
```

### 3. Messaging Flow
```
1. User has established connection
2. User goes to "Messages"
3. User sees list of conversations
4. User clicks on a conversation
5. User sees message history
6. User types and sends new message
7. Message appears instantly in conversation
8. Other user receives message (marked as unread)
9. Real-time messaging continues
```

---

## 📁 Code Structure Explained

### Frontend Architecture Patterns

#### 1. Context Pattern for Global State
```javascript
// AuthContext provides authentication state to entire app
<AuthProvider>
  <App />
</AuthProvider>

// Any component can access auth state:
const { user, isAuthenticated, login, logout } = useAuth();
```

#### 2. Protected Route Pattern
```javascript
// Wrapper component that checks authentication
<ProtectedRoute>
  <ProfilePage />
</ProtectedRoute>

// Shows login prompt if not authenticated
// Shows loading spinner during auth checks
// Shows actual content if authenticated
```

#### 3. Custom Hooks Pattern
```javascript
// useAuth hook encapsulates authentication logic
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Backend Architecture Patterns

#### 1. Dependency Injection
```python
# Database dependency
async def get_database() -> AsyncIOMotorDatabase:
    return db

# Route uses dependency
@router.get("/profile")
async def get_profile(db: Database = Depends(get_database)):
    pass
```

#### 2. Middleware Pattern
```python
# Authentication middleware
async def get_current_user(request: Request, db) -> User:
    # Check session, validate user, return user object
    pass

# Used in all protected routes
@router.get("/profile") 
async def get_profile(request: Request, db = Depends(get_database)):
    current_user = await get_current_user(request, db)  # Auth check
    # Route logic here
```

#### 3. Pydantic Models for Validation
```python
# Input validation
class UserProfileCreate(BaseModel):
    job_title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = Field(default_factory=list)

# Automatic validation on API calls
@router.post("/profile")
async def create_profile(profile_data: UserProfileCreate):
    # profile_data is automatically validated
```

---

## 🔧 How Backend and Frontend Communicate

### 1. HTTP Requests with Credentials
```javascript
// Frontend always includes cookies for authentication
const response = await fetch(`${backendUrl}/api/endpoint`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',  // This sends httpOnly cookies
  body: JSON.stringify(data)
});
```

### 2. Cookie-Based Authentication
```python
# Backend sets httpOnly cookie
response.set_cookie(
    key="session_token",
    value=session_token,
    max_age=7 * 24 * 60 * 60,  # 7 days
    httponly=True,              # Prevents JS access (security)
    secure=True,               # HTTPS only
    samesite="none",           # Cross-origin requests
    path="/"                   # Available on all paths
)

# Backend reads cookie for authentication
session_token = request.cookies.get("session_token")
```

### 3. CORS Configuration
```python
# Backend CORS settings allow frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,  # Allow cookies
    allow_origins=["https://meetup-network-1.preview.emergentagent.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. Error Handling
```javascript
// Frontend handles different response statuses
const response = await fetch(url, options);

if (response.status === 401) {
  // Not authenticated - redirect to login
  logout();
} else if (response.status === 403) {
  // Forbidden - show error message
  showError("Permission denied");
} else if (response.ok) {
  // Success - process data
  const data = await response.json();
  return data;
} else {
  // Other error - show generic error
  showError("Something went wrong");
}
```

### 5. Data Flow Example: Sending Connection Request
```
Frontend (BrowseConnectionsPage.tsx)
     ↓ User clicks "Send Request"
     ↓ POST /api/connections/request
     ↓ Body: { receiver_id: "123", message: "Hi!" }
     ↓ credentials: 'include' (sends session cookie)

Backend (connection_routes.py)
     ↓ Receives request
     ↓ get_current_user() validates session cookie
     ↓ Extracts sender_id from authenticated user
     ↓ Validates receiver exists and is open for connections
     ↓ Creates ConnectionRequest in MongoDB
     ↓ Returns success response

Frontend
     ↓ Receives success response
     ↓ Shows toast notification "Request sent!"
     ↓ Removes user from browse list
     ↓ Updates UI state
```

---

## 🐛 Troubleshooting Guide

### Common Issues and Solutions

#### 1. "Still see Sign In button after OAuth"
**Problem:** User completes Google OAuth but remains unauthenticated

**Debug Steps:**
```javascript
// Check browser console for these messages:
"Processing session_id: abc123"  // ✓ Session ID detected
"Session response status: 200"   // ✓ Backend responded
"User set: {user object}"       // ✓ User authenticated

// If missing any of these, check:
1. CORS settings in backend/.env
2. Backend URL in frontend code
3. Browser cookies (should have session_token)
4. Network tab for failed requests
```

**Common Causes:**
- CORS not allowing credentials with wildcard origins
- Backend URL undefined in frontend
- Session token not being set in cookies
- Backend authentication service not running

#### 2. "Profile/Browse buttons not appearing"
**Problem:** Authentication works but navigation doesn't update

**Debug Steps:**
```javascript
// Check AuthContext state:
console.log('isAuthenticated:', isAuthenticated);
console.log('user:', user);
console.log('isLoading:', isLoading);

// Should show:
isAuthenticated: true
user: {id: "...", email: "...", name: "..."}
isLoading: false
```

**Fix:** Navigation is conditional on `isAuthenticated` - ensure AuthContext is properly wrapping the app.

#### 3. "API calls return 401 Unauthorized"
**Problem:** Authenticated user gets 401 errors on protected routes

**Common Causes:**
- Session token expired (7-day limit)
- Session token not included in requests
- Backend session validation failing

**Debug Steps:**
```javascript
// Check if cookies are being sent:
// In Network tab, verify request includes:
Cookie: session_token=xyz123

// If missing, check:
1. credentials: 'include' in fetch calls
2. CORS allow_credentials: True
3. Cookie secure/samesite settings
```

#### 4. "MongoDB Connection Issues"
**Problem:** Backend can't connect to database

**Check:**
```bash
# Verify MongoDB is running
sudo supervisorctl status mongodb

# Check backend logs
tail -f /var/log/supervisor/backend.err.log

# Verify database name in .env
cat /app/backend/.env
```

#### 5. "Frontend Build Errors"
**Problem:** Frontend won't compile/build

**Common Issues:**
```bash
# Missing dependencies
cd /app/frontend && yarn install

# TypeScript errors
yarn build  # Check for type errors

# Import path issues
# Verify all imports use correct paths:
import { Component } from '@/components/ui/component';
```

### Environment Variables Checklist

#### Backend (.env)
```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"  
CORS_ORIGINS="https://meetup-network-1.preview.emergentagent.com"
```

#### Frontend (.env)
```bash
REACT_APP_BACKEND_URL=https://meetup-network-1.preview.emergentagent.com
VITE_BACKEND_URL=https://meetup-network-1.preview.emergentagent.com
```

### Service Management Commands
```bash
# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all

# Check service status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

---

## 🚀 Making Changes to the Code

### Adding a New Feature

#### 1. Backend Changes
```python
# 1. Add new Pydantic model in models.py
class NewFeature(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str

# 2. Create new route file routes/new_feature_routes.py
router = APIRouter(prefix="/new-feature", tags=["new-feature"])

@router.post("")
async def create_feature(request: Request, db = Depends(get_database)):
    current_user = await get_current_user(request, db)
    # Implementation here

# 3. Include router in server.py
from routes import new_feature_routes
app.include_router(new_feature_routes.router)
```

#### 2. Frontend Changes
```javascript
// 1. Create new page pages/NewFeaturePage.tsx
export default function NewFeaturePage() {
  const [features, setFeatures] = useState([]);
  const backendUrl = 'https://meetup-network-1.preview.emergentagent.com';
  
  const loadFeatures = async () => {
    const response = await fetch(`${backendUrl}/api/new-feature`, {
      credentials: 'include'
    });
    // Handle response
  };
}

// 2. Add route in App.tsx
<Route path="/new-feature" element={
  <ProtectedRoute>
    <NewFeaturePage />
  </ProtectedRoute>
} />

// 3. Add navigation link in Header.tsx  
<Link to="/new-feature">New Feature</Link>
```

### Modifying Existing Features

#### Changing Profile Fields
```python
# 1. Update UserProfile model in models.py
class UserProfile(BaseModel):
    # ... existing fields ...
    new_field: Optional[str] = None  # Add new field

# 2. Update frontend form in ProfilePage.tsx
<Input
  value={profile.new_field || ''}
  onChange={(e) => setProfile({...profile, new_field: e.target.value})}
  placeholder="New field value"
/>
```

#### Adding Search Filters
```python
# 1. Backend: Add new query parameter in profile_routes.py
@router.get("/browse")
async def browse_profiles(
    new_filter: Optional[str] = Query(None)  # Add new filter
):
    if new_filter:
        match_filter["new_field"] = {"$regex": new_filter, "$options": "i"}

# 2. Frontend: Add filter input in BrowseConnectionsPage.tsx
const [newFilter, setNewFilter] = useState('');

// Add to search parameters
const params = new URLSearchParams();
if (newFilter) params.append('new_filter', newFilter);
```

---

## 📚 Learning Resources

### Understanding the Technologies

#### React + TypeScript
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Key concepts: Components, Hooks (useState, useEffect), Context, Props

#### FastAPI + Python  
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- Key concepts: Route decorators, Dependency injection, Request/Response models

#### MongoDB
- [MongoDB Documentation](https://docs.mongodb.com/)
- Key concepts: Collections, Documents, Queries, Aggregation pipelines

### Next Steps for Development
1. **Add Unit Tests** - Test individual functions and components
2. **Add Integration Tests** - Test complete user flows
3. **Improve Error Handling** - Better user feedback for errors
4. **Add Real-time Features** - WebSocket for live messaging
5. **Optimize Performance** - Pagination, caching, lazy loading
6. **Add Mobile Support** - Responsive design improvements
7. **Security Enhancements** - Rate limiting, input sanitization

---

This documentation provides a complete understanding of the "Find a Connection" feature. Use it as a reference for understanding the code, making modifications, or adding new features. Each section builds upon the previous ones to give you a comprehensive view of how the entire system works together.