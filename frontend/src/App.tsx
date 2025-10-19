import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@/components/ui/box";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import HomePage from "./pages/HomePage";
import MeetupsPage from "./pages/MeetupsPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ProfilePage from "./pages/ProfilePage";
import MessagingPage from "./pages/MessagingPage";
import BrowseConnectionsPage from "./pages/BrowseConnectionsPage";

const queryClient = new QueryClient();

// Component to handle signup/onboarding route
const SignupRoute = () => {
  const { user, isAuthenticated, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  
  // If user is not authenticated, redirect to home where they can sign up
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If user has completed onboarding, redirect to home
  if (user && user.onboarding_completed) {
    return <Navigate to="/" replace />;
  }
  
  // Handle onboarding completion
  const handleOnboardingComplete = async () => {
    await checkAuthStatus();
    navigate('/', { replace: true });
  };
  
  // Show onboarding flow
  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

// Component to protect routes that require completed onboarding
const OnboardingRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </Box>
    );
  }
  
  // If authenticated but onboarding not completed, redirect to signup
  // This makes onboarding mandatory for new signups
  if (isAuthenticated && user && user.onboarding_completed === false) {
    // Don't redirect if already on signup page
    if (location.pathname !== '/signup') {
      return <Navigate to="/signup" replace />;
    }
  }
  
  return <>{children}</>;
};

// Component to handle onboarding flow
const AppContent = () => {
  const { isLoading } = useAuth();
  const location = useLocation();
  
  // Check if we're on the signup page
  const isSignupPage = location.pathname === '/signup';

  // Show loading state
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </Box>
    );
  }

  // Show main app with routes - protect all routes to require completed onboarding
  return (
    <OnboardingRequiredRoute>
      <Box className="min-h-screen flex flex-col">
        {!isSignupPage && <Header />}
        <Box as="main" className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupRoute />} />
            <Route path="/meetups" element={<MeetupsPage />} />
            <Route path="/connections" element={
              <ProtectedRoute>
                <ConnectionsPage />
              </ProtectedRoute>
            } />
            <Route path="/browse" element={
              <ProtectedRoute>
                <BrowseConnectionsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/messaging" element={
              <ProtectedRoute>
                <MessagingPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Box>
        {!isSignupPage && <Footer />}
      </Box>
    </OnboardingRequiredRoute>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
