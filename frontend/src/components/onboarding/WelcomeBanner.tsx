import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { backendUrl } from "@/config/api";

export const WelcomeBanner: React.FC = () => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const checkProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/profile`, {
          credentials: "include",
        });

        if (response.ok) {
          setHasProfile(true);
        } else if (response.status === 404) {
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };

    checkProfile();
  }, [isAuthenticated, backendUrl]);

  // Don't show if not authenticated, has profile, or is dismissed
  if (!isAuthenticated || hasProfile !== false || dismissed) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-center flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <div className="bg-blue-100 p-2 sm:p-2 rounded-full flex-shrink-0">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0 sm:items-center">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <h3 className="text-base text-md sm:text-xl font-semibold text-blue-900 break-words">
                  Welcome to Find Connections, {user?.name?.split(" ")[0]}! 🎉
                </h3>
                {/* <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 self-start text-xs"
                >
                  New User
                </Badge> */}
              </div>
              {/* <p className="text-sm sm:text-base text-blue-700 mb-3 sm:mb-4">
                You're just one step away from networking with amazing tech professionals! 
                Complete your profile to start making meaningful connections.
              </p> */}
            </div>
          </div>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-blue-400 hover:text-blue-600 self-end sm:self-start flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button> */}
          <div className="flex flex-col sm:flex-col sm:items-center gap-2 sm:gap-3 sm:w-auto w-full ">
            <Link to="/profile" className="w-full sm:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm">
                <User className="h-4 w-4 mr-2" />
                Complete My Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            {/* <span className="text-xs sm:text-sm text-blue-600 text-center sm:text-left">
                  Takes less than 2 minutes
                </span> */}
          </div>
        </div>

        {/* Quick Preview of What They Can Do */}
        {/* <div className="mt-6 pt-6 border-t border-blue-200">
          <p className="text-sm text-blue-600 mb-3 font-medium">After completing your profile, you'll be able to:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Browse and connect with tech professionals
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Send and receive connection requests
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Start conversations with your connections
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};
