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
// Only applies to specific protected routes, not the homepage
const OnboardingRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </Box>
    );
  }
  
  // If authenticated but onboarding not completed, redirect to signup
  // This only applies to routes wrapped with this component
  if (isAuthenticated && user && user.onboarding_completed === false) {
    return <Navigate to="/signup" replace />;
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

  // Show main app with routes
  // Homepage and meetups are public, other routes require onboarding completion
  return (
    <Box className="min-h-screen flex flex-col">
      {!isSignupPage && <Header />}
      <Box as="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/meetups" element={<MeetupsPage />} />
          <Route path="/connections" element={
            <ProtectedRoute>
              <OnboardingRequiredRoute>
                <ConnectionsPage />
              </OnboardingRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/browse" element={
            <ProtectedRoute>
              <OnboardingRequiredRoute>
                <BrowseConnectionsPage />
              </OnboardingRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <OnboardingRequiredRoute>
                <ProfilePage />
              </OnboardingRequiredRoute>
            </ProtectedRoute>
          } />
          <Route path="/messaging" element={
            <ProtectedRoute>
              <OnboardingRequiredRoute>
                <MessagingPage />
              </OnboardingRequiredRoute>  
            </ProtectedRoute>
          } />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Box>
      {!isSignupPage && <Footer />}
    </Box>
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
