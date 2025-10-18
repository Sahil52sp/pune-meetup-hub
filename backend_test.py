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