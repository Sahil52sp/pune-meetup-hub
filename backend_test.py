#!/usr/bin/env python3
"""
Backend API Testing Suite for Find a Connection Feature
Tests authentication, profiles, connections, and messaging APIs
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Optional, Any

# Configuration
BASE_URL = "https://techconnect-15.preview.emergentagent.com/api"
TEST_SESSION_ID = "test_session_123"  # Mock session ID for testing

class APITester:
    def __init__(self):
        self.session = None
        self.session_token = None
        self.user_data = None
        self.test_users = []
        self.test_profiles = []
        self.test_connections = []
        self.test_conversations = []
        
    async def setup_session(self):
        """Setup HTTP session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup_session(self):
        """Cleanup HTTP session"""
        if self.session:
            await self.session.close()
            
    async def make_request(self, method: str, endpoint: str, 
                          headers: Optional[Dict] = None, 
                          data: Optional[Dict] = None,
                          cookies: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request and return response"""
        url = f"{BASE_URL}{endpoint}"
        
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            async with self.session.request(
                method, url, 
                headers=default_headers,
                json=data,
                cookies=cookies
            ) as response:
                response_data = await response.json()
                return {
                    "status": response.status,
                    "data": response_data,
                    "headers": dict(response.headers),
                    "cookies": dict(response.cookies) if response.cookies else {}
                }
        except Exception as e:
            return {
                "status": 0,
                "error": str(e),
                "data": None
            }
    
    def print_test_result(self, test_name: str, success: bool, details: str = ""):
        """Print formatted test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        print()
    
    async def test_auth_session_without_header(self):
        """Test /api/auth/session without X-Session-ID header"""
        print("🔍 Testing Authentication - Session without header")
        
        response = await self.make_request("POST", "/auth/session")
        
        success = response["status"] == 400
        details = f"Status: {response['status']}, Expected: 400"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Auth session without X-Session-ID header", success, details)
        return success
    
    async def test_auth_session_with_invalid_header(self):
        """Test /api/auth/session with invalid X-Session-ID"""
        print("🔍 Testing Authentication - Session with invalid header")
        
        headers = {"X-Session-ID": "invalid_session_id"}
        response = await self.make_request("POST", "/auth/session", headers=headers)
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Auth session with invalid X-Session-ID", success, details)
        return success
    
    async def test_auth_me_without_token(self):
        """Test /api/auth/me without authentication"""
        print("🔍 Testing Authentication - Get user info without token")
        
        response = await self.make_request("GET", "/auth/me")
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Get user info without authentication", success, details)
        return success
    
    async def test_profile_create_without_auth(self):
        """Test profile creation without authentication"""
        print("🔍 Testing Profile - Create without authentication")
        
        profile_data = {
            "job_title": "Software Engineer",
            "company": "Tech Corp",
            "bio": "Passionate developer",
            "location": "San Francisco",
            "skills": ["Python", "JavaScript"],
            "interests": ["AI", "Web Development"]
        }
        
        response = await self.make_request("POST", "/profile", data=profile_data)
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Create profile without authentication", success, details)
        return success
    
    async def test_profile_get_without_auth(self):
        """Test get profile without authentication"""
        print("🔍 Testing Profile - Get without authentication")
        
        response = await self.make_request("GET", "/profile")
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Get profile without authentication", success, details)
        return success
    
    async def test_profile_browse_without_auth(self):
        """Test browse profiles without authentication"""
        print("🔍 Testing Profile - Browse without authentication")
        
        response = await self.make_request("GET", "/profile/browse")
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Browse profiles without authentication", success, details)
        return success
    
    async def test_connections_request_without_auth(self):
        """Test send connection request without authentication"""
        print("🔍 Testing Connections - Send request without authentication")
        
        request_data = {
            "receiver_id": "test_user_id",
            "message": "Let's connect!"
        }
        
        response = await self.make_request("POST", "/connections/request", data=request_data)
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Send connection request without authentication", success, details)
        return success
    
    async def test_connections_received_without_auth(self):
        """Test get received requests without authentication"""
        print("🔍 Testing Connections - Get received requests without authentication")
        
        response = await self.make_request("GET", "/connections/requests/received")
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Get received requests without authentication", success, details)
        return success
    
    async def test_messaging_conversations_without_auth(self):
        """Test get conversations without authentication"""
        print("🔍 Testing Messaging - Get conversations without authentication")
        
        response = await self.make_request("GET", "/conversations")
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Get conversations without authentication", success, details)
        return success
    
    async def test_messaging_send_without_auth(self):
        """Test send message without authentication"""
        print("🔍 Testing Messaging - Send message without authentication")
        
        message_data = {"content": "Hello there!"}
        response = await self.make_request("POST", "/conversations/test_conv_id/messages", data=message_data)
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Send message without authentication", success, details)
        return success
    
    async def test_api_root(self):
        """Test API root endpoint"""
        print("🔍 Testing API - Root endpoint")
        
        response = await self.make_request("GET", "/")
        
        success = response["status"] == 200
        details = f"Status: {response['status']}, Expected: 200"
        if response.get("data"):
            details += f", Message: {response['data'].get('message', 'N/A')}"
            
        self.print_test_result("API root endpoint", success, details)
        return success
    
    async def test_invalid_endpoints(self):
        """Test invalid endpoints return appropriate status codes"""
        print("🔍 Testing API - Invalid endpoints")
        
        # These should return 404
        endpoints_404 = ["/invalid", "/auth/invalid", "/connections/invalid"]
        # These should return 401 (auth required before route matching)
        endpoints_401 = ["/profile/invalid", "/conversations/invalid"]
        
        all_success = True
        
        for endpoint in endpoints_404:
            response = await self.make_request("GET", endpoint)
            success = response["status"] == 404
            if not success:
                all_success = False
                print(f"   ❌ {endpoint} returned {response['status']}, expected 404")
            else:
                print(f"   ✅ {endpoint} correctly returned 404")
        
        for endpoint in endpoints_401:
            response = await self.make_request("GET", endpoint)
            success = response["status"] == 401
            if not success:
                all_success = False
                print(f"   ❌ {endpoint} returned {response['status']}, expected 401 (auth required)")
            else:
                print(f"   ✅ {endpoint} correctly returned 401 (auth required)")
        
        self.print_test_result("Invalid endpoints return appropriate status codes", all_success)
        return all_success
    
    async def test_cors_headers(self):
        """Test CORS headers are present"""
        print("🔍 Testing API - CORS headers")
        
        # Test CORS with Origin header (simulates browser request)
        headers = {"Origin": "https://example.com"}
        response = await self.make_request("GET", "/", headers=headers)
        
        response_headers = response.get("headers", {})
        has_cors = "access-control-allow-origin" in [h.lower() for h in response_headers.keys()]
        
        details = f"Status: {response['status']}, CORS headers present: {has_cors}"
        if has_cors:
            cors_origin = next((v for k, v in response_headers.items() if k.lower() == "access-control-allow-origin"), "N/A")
            cors_credentials = next((v for k, v in response_headers.items() if k.lower() == "access-control-allow-credentials"), "N/A")
            details += f", Origin: {cors_origin}, Credentials: {cors_credentials}"
        
        self.print_test_result("CORS headers present", has_cors, details)
        return has_cors
    
    async def test_database_connection(self):
        """Test database connection by checking status endpoint"""
        print("🔍 Testing Database - Connection via status endpoint")
        
        # Test creating a status check
        status_data = {"client_name": "backend_test"}
        response = await self.make_request("POST", "/status", data=status_data)
        
        create_success = response["status"] == 200
        
        # Test getting status checks
        response = await self.make_request("GET", "/status")
        get_success = response["status"] == 200
        
        success = create_success and get_success
        details = f"Create status: {response['status'] if create_success else 'Failed'}, Get status: {response['status'] if get_success else 'Failed'}"
        
        self.print_test_result("Database connection via status endpoint", success, details)
        return success
    
    async def authenticate_test_user(self):
        """Authenticate a test user using dev-login endpoint"""
        print("🔍 Setting up authenticated test user...")
        
        response = await self.make_request("POST", "/auth/dev-login")
        
        if response["status"] == 200:
            # Extract session token from cookies
            cookies = response.get("cookies", {})
            if "session_token" in cookies:
                self.session_token = cookies["session_token"]
                self.user_data = response["data"]["data"]["user"]
                print(f"   ✅ Authenticated as: {self.user_data['email']}")
                return True
            else:
                print("   ❌ No session token in response")
                return False
        else:
            print(f"   ❌ Dev login failed: {response['status']}")
            return False
    
    async def test_onboarding_complete_without_auth(self):
        """Test complete onboarding endpoint without authentication"""
        print("🔍 Testing Onboarding - Complete onboarding without auth")
        
        response = await self.make_request("POST", "/auth/complete-onboarding")
        
        success = response["status"] == 401
        details = f"Status: {response['status']}, Expected: 401"
        if not success and response.get("data"):
            details += f", Response: {response['data']}"
            
        self.print_test_result("Complete onboarding without authentication", success, details)
        return success
    
    async def test_auth_me_includes_onboarding_status(self):
        """Test /auth/me includes onboarding_completed field"""
        print("🔍 Testing Onboarding - Auth /me includes onboarding status")
        
        if not self.session_token:
            self.print_test_result("Auth /me includes onboarding status", False, "No authenticated session available")
            return False
        
        cookies = {"session_token": self.session_token}
        response = await self.make_request("GET", "/auth/me", cookies=cookies)
        
        success = False
        details = f"Status: {response['status']}"
        
        if response["status"] == 200:
            user_data = response["data"].get("data", {}).get("user", {})
            has_onboarding_field = "onboarding_completed" in user_data
            onboarding_status = user_data.get("onboarding_completed", None)
            
            success = has_onboarding_field
            details += f", Has onboarding_completed field: {has_onboarding_field}"
            if has_onboarding_field:
                details += f", Value: {onboarding_status}"
        else:
            details += f", Response: {response.get('data', 'N/A')}"
            
        self.print_test_result("Auth /me includes onboarding status", success, details)
        return success
    
    async def test_profile_creation_with_onboarding_data(self):
        """Test profile creation with all onboarding fields"""
        print("🔍 Testing Onboarding - Profile creation with onboarding data")
        
        if not self.session_token:
            self.print_test_result("Profile creation with onboarding data", False, "No authenticated session available")
            return False
        
        # Comprehensive onboarding profile data
        profile_data = {
            # Basic Info (Step 2)
            "job_title": "Senior Software Engineer",
            "company": "TechCorp Solutions",
            "age": 28,
            "years_experience": 5,
            # Skills & Expertise (Step 3)
            "skills": ["Python", "JavaScript", "React", "FastAPI", "MongoDB"],
            "expertise": "Full-stack web development with focus on backend APIs",
            # Meeting Preferences (Step 4)
            "meeting_preferences": ["Coffee shops", "Co-working spaces", "Online video calls"],
            # Interests (Step 5)
            "interests": ["Machine Learning", "Open Source", "Tech Meetups", "Photography"],
            # Future Goals (Step 6)
            "future_goals": "I want to become a tech lead and contribute to innovative AI projects that make a positive impact on society",
            # Additional fields
            "bio": "Passionate developer who loves building scalable applications",
            "location": "San Francisco, CA",
            "is_open_for_connection": True
        }
        
        cookies = {"session_token": self.session_token}
        response = await self.make_request("POST", "/profile", data=profile_data, cookies=cookies)
        
        success = response["status"] == 200
        details = f"Status: {response['status']}, Expected: 200"
        
        if success:
            profile_response = response["data"].get("data", {}).get("profile", {})
            # Verify key onboarding fields are saved
            key_fields = ["job_title", "company", "skills", "expertise", "meeting_preferences", "interests", "future_goals"]
            saved_fields = [field for field in key_fields if profile_response.get(field)]
            details += f", Saved onboarding fields: {len(saved_fields)}/{len(key_fields)}"
            
            # Verify is_open_for_connection defaults to true
            is_open = profile_response.get("is_open_for_connection", False)
            details += f", is_open_for_connection: {is_open}"
        else:
            details += f", Response: {response.get('data', 'N/A')}"
            
        self.print_test_result("Profile creation with onboarding data", success, details)
        return success
    
    async def test_complete_onboarding_endpoint(self):
        """Test complete onboarding endpoint with authentication"""
        print("🔍 Testing Onboarding - Complete onboarding endpoint")
        
        if not self.session_token:
            self.print_test_result("Complete onboarding endpoint", False, "No authenticated session available")
            return False
        
        cookies = {"session_token": self.session_token}
        response = await self.make_request("POST", "/auth/complete-onboarding", cookies=cookies)
        
        success = response["status"] == 200
        details = f"Status: {response['status']}, Expected: 200"
        
        if success:
            message = response["data"].get("message", "")
            details += f", Message: {message}"
        else:
            details += f", Response: {response.get('data', 'N/A')}"
            
        self.print_test_result("Complete onboarding endpoint", success, details)
        return success
    
    async def test_onboarding_status_after_completion(self):
        """Test that onboarding_completed is true after calling complete-onboarding"""
        print("🔍 Testing Onboarding - Status after completion")
        
        if not self.session_token:
            self.print_test_result("Onboarding status after completion", False, "No authenticated session available")
            return False
        
        cookies = {"session_token": self.session_token}
        response = await self.make_request("GET", "/auth/me", cookies=cookies)
        
        success = False
        details = f"Status: {response['status']}"
        
        if response["status"] == 200:
            user_data = response["data"].get("data", {}).get("user", {})
            onboarding_completed = user_data.get("onboarding_completed", False)
            
            success = onboarding_completed is True
            details += f", onboarding_completed: {onboarding_completed}"
        else:
            details += f", Response: {response.get('data', 'N/A')}"
            
        self.print_test_result("Onboarding status after completion", success, details)
        return success
    
    async def test_onboarding_idempotency(self):
        """Test that calling complete-onboarding multiple times is safe"""
        print("🔍 Testing Onboarding - Idempotency (multiple calls)")
        
        if not self.session_token:
            self.print_test_result("Onboarding idempotency", False, "No authenticated session available")
            return False
        
        cookies = {"session_token": self.session_token}
        
        # Call complete-onboarding again
        response1 = await self.make_request("POST", "/auth/complete-onboarding", cookies=cookies)
        response2 = await self.make_request("POST", "/auth/complete-onboarding", cookies=cookies)
        
        success = response1["status"] == 200 and response2["status"] == 200
        details = f"First call: {response1['status']}, Second call: {response2['status']}, Both should be 200"
        
        self.print_test_result("Onboarding idempotency", success, details)
        return success
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for Find a Connection Feature")
        print("=" * 60)
        
        await self.setup_session()
        
        test_results = []
        
        try:
            # Test API basics
            test_results.append(await self.test_api_root())
            test_results.append(await self.test_cors_headers())
            test_results.append(await self.test_invalid_endpoints())
            test_results.append(await self.test_database_connection())
            
            # Test authentication endpoints
            test_results.append(await self.test_auth_session_without_header())
            test_results.append(await self.test_auth_session_with_invalid_header())
            test_results.append(await self.test_auth_me_without_token())
            
            # Test onboarding without authentication
            test_results.append(await self.test_onboarding_complete_without_auth())
            
            # Test profile endpoints without auth
            test_results.append(await self.test_profile_create_without_auth())
            test_results.append(await self.test_profile_get_without_auth())
            test_results.append(await self.test_profile_browse_without_auth())
            
            # Test connection endpoints without auth
            test_results.append(await self.test_connections_request_without_auth())
            test_results.append(await self.test_connections_received_without_auth())
            
            # Test messaging endpoints without auth
            test_results.append(await self.test_messaging_conversations_without_auth())
            test_results.append(await self.test_messaging_send_without_auth())
            
            print("\n" + "=" * 60)
            print("🔐 AUTHENTICATED ONBOARDING TESTS")
            print("=" * 60)
            
            # Authenticate test user for onboarding tests
            auth_success = await self.authenticate_test_user()
            if auth_success:
                # Test onboarding flow with authentication
                test_results.append(await self.test_auth_me_includes_onboarding_status())
                test_results.append(await self.test_profile_creation_with_onboarding_data())
                test_results.append(await self.test_complete_onboarding_endpoint())
                test_results.append(await self.test_onboarding_status_after_completion())
                test_results.append(await self.test_onboarding_idempotency())
            else:
                print("❌ Could not authenticate test user - skipping authenticated onboarding tests")
                # Add 5 failed tests for the skipped onboarding tests
                test_results.extend([False] * 5)
            
        finally:
            await self.cleanup_session()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(test_results)
        total = len(test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 All tests passed! Backend APIs are working correctly.")
        else:
            print(f"\n⚠️  {total - passed} test(s) failed. Check the details above.")
        
        return passed == total

async def main():
    """Main test runner"""
    tester = APITester()
    success = await tester.run_all_tests()
    return success

if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)