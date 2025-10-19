import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Coffee, Building, Home, Users, Wifi } from "lucide-react";

interface OnboardingData {
  name: string;
  job_title: string;
  company: string;
  age: number | "";
  years_experience: number | "";
  skills: string[];
  expertise: string;
  meeting_preferences: string[];
  interests: string[];
  future_goals: string;
}

interface MeetingPreferencesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const MEETING_OPTIONS = [
  {
    id: "coffee-shops",
    label: "Coffee Shops",
    icon: Coffee,
  },
  {
    id: "co-working-spaces",
    label: "Co-working Spaces",
    icon: Wifi,
  },
  {
    id: "office-spaces",
    label: "Office Spaces",
    icon: Building,
  },
  {
    id: "online-virtual",
    label: "Online/Virtual",
    icon: Users,
  },
  {
    id: "home-office",
    label: "Home Office",
    icon: Home,
  },
  {
    id: "public-spaces",
    label: "Public Spaces",
    icon: MapPin,
  },
];

export const MeetingPreferencesStep: React.FC<MeetingPreferencesStepProps> = ({
  data,
  updateData,
}) => {
  const togglePreference = (preferenceId: string) => {
    const currentPreferences = data.meeting_preferences;
    const updatedPreferences = currentPreferences.includes(preferenceId)
      ? currentPreferences.filter((p) => p !== preferenceId)
      : [...currentPreferences, preferenceId];

    updateData({ meeting_preferences: updatedPreferences });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-left md:text-center p-4 md:pb-12">
        <div className="md:mx-auto w-8 md:w-10 h-8 md:h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
          <MapPin className="w-5 h-5 text-purple-600" />
        </div>
        <CardTitle className="text-2xl">Where do you prefer to meet?</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 md:pt-0">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MEETING_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = data.meeting_preferences.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => togglePreference(option.id)}
                className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                  isSelected
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? "bg-purple-200" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? "text-purple-700" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-sm ${
                        isSelected ? "text-purple-900" : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </h3>
                  </div>
                  {/* {isSelected && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )} */}
                </div>
              </button>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
};
