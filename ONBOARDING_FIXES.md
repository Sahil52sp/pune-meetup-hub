# Onboarding Feature Fixes - Complete Guide

## Issues Fixed

### 1. CORS Error ✅

**Problem**: Backend was only allowing production domains, blocking localhost requests from frontend.

**Solution**: Updated `backend/server.py` to allow localhost origins in development mode:

- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

### 2. Existing Users Stuck in Onboarding ✅

**Problem**: Existing users with profiles were being forced into onboarding, then getting 400 error "Profile already exists".

**Solution**:

- Updated `backend/auth.py` to check if user has a profile
- If user has a profile, automatically set `onboarding_completed=True`
- Updated `backend/routes/profile_routes.py` to update existing profiles instead of failing
- Now profile creation endpoint handles both create AND update

### 3. Sign Up vs Sign In Buttons ✅

**Problem**: Only one "Sign In" button in the navbar.

**Solution**: Added both buttons to `frontend/src/components/layout/Header.tsx`:

- **Sign In** button (outline style)
- **Sign Up** button (primary style)
- Both visible for unauthenticated users
- Desktop and mobile layouts updated

### 4. Skip/Back Button in Onboarding ✅

**Problem**: Users couldn't exit onboarding flow to go back to home page.

**Solution**: Added skip button to `frontend/src/components/onboarding/OnboardingFlow.tsx`:

- X button in top-right corner
- Shows confirmation dialog
- Logs user out and returns to home page
- User can complete profile later from profile page

## Changes Made

### Backend Files

1. **`backend/server.py`**

   - Added environment-based CORS configuration
   - Development mode allows localhost origins
   - Production mode keeps strict domain restrictions

2. **`backend/auth.py`**

   - Modified `create_or_get_user()` to return tuple: `(User, is_new_user)`
   - Added logic to check if user has existing profile
   - If user has profile → set `onboarding_completed=True` automatically
   - Legacy users without profile or field → set `onboarding_completed=True`
   - Only truly new users get `onboarding_completed=False`

3. **`backend/routes/auth_routes.py`**

   - Updated session processing to use new tuple return
   - Added logging for user creation vs login

4. **`backend/routes/profile_routes.py`** ⭐ KEY FIX

   - Changed POST `/api/profile` to handle both create AND update
   - If profile exists, updates it instead of throwing 400 error
   - Prevents existing users from getting stuck in onboarding

5. **`backend/migrate_existing_users.py`** (NEW)
   - Migration script to update all existing users
   - Sets `onboarding_completed=True` for users without this field

### Frontend Files

1. **`frontend/src/components/layout/Header.tsx`**

   - Added separate "Sign Up" and "Sign In" buttons
   - Updated both desktop and mobile navigation
   - Improved button styling and spacing

2. **`frontend/src/components/onboarding/OnboardingFlow.tsx`** ⭐ KEY FIX
   - Added skip/close button (X icon in top-right)
   - Shows confirmation dialog before skipping
   - Logs user out and redirects to home
   - User can complete onboarding later

## How to Deploy

### Step 1: Restart Backend

```bash
cd backend
# Make sure you're in development mode (or environment variable not set)
uvicorn server:app --reload --port 8000
```

### Step 2: Run Migration (Optional)

For existing production databases with users:

```bash
cd backend
python migrate_existing_users.py
```

### Step 3: Frontend

Frontend should automatically pick up changes. If not:

```bash
cd frontend
npm run dev
```

## Expected Behavior

### For New Users (Sign Up)

1. User clicks "Sign Up"
2. OAuth flow with Emergent Auth
3. New account created with `onboarding_completed=False`
4. User sees onboarding flow (5 steps)
5. After completion, `onboarding_completed=True`
6. User can access main app
7. **OR** user can click X to skip and complete later

### For Existing Users with Profile (Sign In)

1. User clicks "Sign In"
2. OAuth flow with Emergent Auth
3. Existing account retrieved
4. System checks: User has profile in database
5. Automatically sets `onboarding_completed=True`
6. User directly accesses main app (no onboarding)

### For Existing Users without Profile

1. User logs in
2. User has account but no profile yet
3. Shows onboarding flow
4. **NEW**: If profile creation fails, updates existing profile instead
5. No more "Profile already exists" error

### For Legacy Users

1. User logs in
2. System detects missing `onboarding_completed` field
3. Checks if user has profile
4. If yes → sets `onboarding_completed=True`
5. If no → sets `onboarding_completed=True` (legacy user, optional onboarding)
6. User accesses main app without forced onboarding

## Testing Checklist

### ✅ Test New User Flow

1. Use incognito/private browsing
2. Click "Sign Up"
3. Complete OAuth
4. Should see onboarding flow
5. Complete all 5 steps OR click X to skip
6. Should reach main dashboard

### ✅ Test Existing User with Profile Flow

1. Use account that already has a profile
2. Click "Sign In"
3. Complete OAuth
4. ✅ Should go directly to dashboard (no onboarding)
5. Backend logs should show: "User has profile, marking onboarding as complete"

### ✅ Test Skip Onboarding

1. Start new signup
2. When onboarding appears, click X button in top-right
3. Should show confirmation dialog
4. Click OK
5. Should be logged out and return to home page
6. Can sign up again later to complete profile

### ✅ Test Development Mode

1. Check browser console - no CORS errors
2. All API calls to `http://localhost:8000` should work
3. Check backend logs for proper authentication flow
4. Profile creation should work for both new and existing profiles

## Key Changes Summary

✅ **CORS Fixed**: Localhost origins now allowed in development  
✅ **Existing Users Fixed**: Auto-detect profiles and skip onboarding  
✅ **Profile Creation Fixed**: Updates instead of failing for existing profiles  
✅ **Skip Button Added**: Users can exit onboarding and return later  
✅ **Sign Up/In Buttons**: Separate buttons for clarity

## Troubleshooting

### Issue: Still seeing CORS errors

- **Solution**: Restart backend server, ensure ENVIRONMENT variable is not set to 'production'

### Issue: Existing user still sees onboarding

- **Solution**: Check if user actually has a profile in database, run migration script

### Issue: Profile creation still fails

- **Solution**: Check backend logs, ensure profile_routes.py changes are deployed

### Issue: Can't skip onboarding

- **Solution**: Hard refresh frontend (Ctrl+Shift+R), clear browser cache
