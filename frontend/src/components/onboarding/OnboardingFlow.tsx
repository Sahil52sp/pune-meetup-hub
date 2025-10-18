import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { SkillsStep } from './steps/SkillsStep';
import { MeetingPreferencesStep } from './steps/MeetingPreferencesStep';
import { InterestsStep } from './steps/InterestsStep';
import { FutureGoalsStep } from './steps/FutureGoalsStep';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  // Basic Info
  job_title: string;
  company: string;
  age: number | '';
  years_experience: number | '';
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
  'Basic Information',
  'Skills & Expertise', 
  'Meeting Preferences',
  'Interests',
  'Future Goals'
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [data, setData] = useState<OnboardingData>({
    job_title: '',
    company: '',
    age: '',
    years_experience: '',
    skills: [],
    expertise: '',
    meeting_preferences: [],
    interests: [],
    future_goals: ''
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL || 'https://punemeetups.in';

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return data.job_title && data.company && data.age && data.years_experience;
      case 1: // Skills
        return data.skills.length > 0 && data.expertise;
      case 2: // Meeting Preferences
        return data.meeting_preferences.length > 0;
      case 3: // Interests
        return data.interests.length > 0;
      case 4: // Future Goals
        return data.future_goals.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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
        is_open_for_connection: true
      };

      const profileResponse = await fetch(`${backendUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to create profile');
      }

      // Mark onboarding as complete
      const onboardingResponse = await fetch(`${backendUrl}/api/auth/complete-onboarding`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!onboardingResponse.ok) {
        throw new Error('Failed to complete onboarding');
      }

      toast({
        title: "Welcome to the community!",
        description: "Your profile has been created successfully."
      });

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive"
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
        return <SkillsStep data={data} updateData={updateData} />;
      case 2:
        return <MeetingPreferencesStep data={data} updateData={updateData} />;
      case 3:
        return <InterestsStep data={data} updateData={updateData} />;
      case 4:
        return <FutureGoalsStep data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Help us personalize your networking experience
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2 font-medium">
              {STEPS[currentStep]}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2"
            >
              {currentStep === STEPS.length - 1 ? (
                isSubmitting ? 'Creating Profile...' : 'Complete Setup'
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
  );
};