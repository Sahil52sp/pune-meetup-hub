import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { SkillsStep } from "./steps/SkillsStep";
import { MeetingPreferencesStep } from "./steps/MeetingPreferencesStep";
import { BioStep } from "./steps/BioStep";
import { InterestsStep } from "./steps/InterestsStep";
import { FutureGoalsStep } from "./steps/FutureGoalsStep";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/Logo.svg";
import OnboardingBg from "@/assets/onboarding-bg.svg";

interface OnboardingData {
  // Basic Info
  name: string;
  job_title: string;
  company: string;
  bio: string;
  age: number | "";
  years_experience: number | "";
  // Skills & Expertise
  skills: string[];
  expertise: string;
  // Meeting Preferences
  meeting_preferences: string[];
  // Interests
  interests: string[];
  // Future Goals
  future_goals: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

const STEPS = [
  "Basic Information",
  "Bio",
  "Skills",
  "Meeting Preferences",
  "Interests",
  "Future Goals",
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [data, setData] = useState<OnboardingData>({
    name: "",
    job_title: "",
    company: "",
    bio: "",
    age: "",
    years_experience: "",
    skills: [],
    expertise: "",
    meeting_preferences: [],
    interests: [],
    future_goals: "",
  });

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.REACT_APP_BACKEND_URL ||
    "https://punemeetups.in";

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...stepData }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          data.name && data.job_title && data.company && data.age && data.years_experience
        );
      case 1: // Bio
        const wordCount = data.bio.trim().split(/\s+/).filter(word => word.length > 0).length;
        return wordCount >= 25;
      case 2: // Skills
        return data.skills.length > 0;
      case 3: // Meeting Preferences
        return data.meeting_preferences.length > 0;
      case 4: // Interests
        return data.interests.length > 0;
      case 5: // Future Goals
        return data.future_goals.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create profile with all data
      const profileData = {
        ...data,
        age: Number(data.age),
        years_experience: Number(data.years_experience),
        is_open_for_connection: true,
      };

      const profileResponse = await fetch(`${backendUrl}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to create profile");
      }

      // Mark onboarding as complete and update user name
      const onboardingResponse = await fetch(
        `${backendUrl}/api/auth/complete-onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name: data.name }),
        }
      );

      if (!onboardingResponse.ok) {
        throw new Error("Failed to complete onboarding");
      }

      toast({
        title: "Welcome to the community!",
        description: "Your profile has been created successfully.",
      });

      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep data={data} updateData={updateData} />;
      case 1:
        return <BioStep data={data} updateData={updateData} />;
      case 2:
        return <SkillsStep data={data} updateData={updateData} />;
      case 3:
        return <MeetingPreferencesStep data={data} updateData={updateData} />;
      case 4:
        return <InterestsStep data={data} updateData={updateData} />;
      case 5:
        return <FutureGoalsStep data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 md:p-4 relative"
      style={{ 
        background: `url(${OnboardingBg}) no-repeat center center`,
        backgroundSize: "cover",
        backgroundColor: "#FFF4ED"
      }}
    >
      <div className="relative w-full max-w-2xl sm:w-full">
        {/* Logo positioned above the card */} 
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
          <img src={Logo} alt="Pune Meetups" className="h-10 w-auto" />
        </div>

         <Card className="w-full h-[calc(100vh-6rem)] md:h-[600px] flex flex-col ">
           <CardContent className="p-6 flex flex-col h-full">
             {/* Progress - Fixed height */}
             <div className="mb-4 mt-4 flex-shrink-0">
               <Progress value={progress} className="h-1" />
             </div>

             {/* Step Content - Flexible height with scroll */}
             <div className="flex-1 overflow-y-auto pr-2 min-h-0">{renderStep()}</div>

             {/* Navigation - Fixed height */}
             <div className="flex justify-between pt-4 flex-shrink-0">
              {currentStep === 0 ? null : (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  size="md"
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                variant="tertiary"
                size="md"
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-2 ml-auto"
              >
                {currentStep === STEPS.length - 1 ? (
                  isSubmitting ? (
                    "Creating Profile..."
                  ) : (
                    "Complete Setup"
                  )
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
