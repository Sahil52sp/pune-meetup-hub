import { useAuth } from "@/contexts/AuthContext";
import GuestHomePage from "./GuestHomePage";
import AuthenticatedHomePage from "./AuthenticatedHomePage";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authenticated dashboard ONLY if user has completed onboarding
  // Users without completed onboarding see the public website
  const shouldShowDashboard = isAuthenticated && user && user.onboarding_completed === true;
  
  return shouldShowDashboard ? <AuthenticatedHomePage /> : <GuestHomePage />;
}
