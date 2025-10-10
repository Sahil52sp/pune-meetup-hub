import { Box } from "@/components/ui/box";
import { WelcomeBanner } from "@/components/onboarding/WelcomeBanner";
import { QuickActions } from "@/components/onboarding/QuickActions";

export default function AuthenticatedHomePage() {
  return (
    <>
      <Box className="min-h-screen bg-background relative px-4 sm:px-8 md:mx-16 lg:mx-24 xl:mx-40">
        {/* Welcome Banner for New Users */}
        <Box className="relative z-10 mb-8 pt-8">
          <WelcomeBanner />
        </Box>

        {/* Quick Actions for Authenticated Users */}
        <Box className="relative z-10 mb-8">
          <QuickActions />
        </Box>
      </Box>
    </>
  );
}

