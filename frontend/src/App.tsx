import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Component to handle onboarding flow
const AppContent = () => {
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </Box>
    );
  }

  // Show onboarding for authenticated users who haven't completed it
  if (isAuthenticated && user && !user.onboarding_completed) {
    return <OnboardingFlow onComplete={checkAuthStatus} />;
  }

  // Show main app
  return (
    <Box className="min-h-screen flex flex-col">
      <Header />
      <Box as="main" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
      <Footer />
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
