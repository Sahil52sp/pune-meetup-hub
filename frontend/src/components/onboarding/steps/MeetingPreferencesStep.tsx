import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin, Coffee, Building, Home, Users, Wifi } from 'lucide-react';

interface OnboardingData {
  job_title: string;
  company: string;
  age: number | '';
  years_experience: number | '';
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
  { id: 'coffee-shops', label: 'Coffee Shops', icon: Coffee, description: 'Casual meetings over coffee' },
  { id: 'co-working-spaces', label: 'Co-working Spaces', icon: Wifi, description: 'Professional workspace environment' },
  { id: 'office-spaces', label: 'Office Spaces', icon: Building, description: 'Corporate meeting rooms' },
  { id: 'online-virtual', label: 'Online/Virtual', icon: Users, description: 'Video calls and online meetings' },
  { id: 'home-office', label: 'Home Office', icon: Home, description: 'Work from home setups' },
  { id: 'public-spaces', label: 'Public Spaces', icon: MapPin, description: 'Parks, libraries, open spaces' }
];

export const MeetingPreferencesStep: React.FC<MeetingPreferencesStepProps> = ({ data, updateData }) => {
  const togglePreference = (preferenceId: string) => {
    const currentPreferences = data.meeting_preferences;
    const updatedPreferences = currentPreferences.includes(preferenceId)
      ? currentPreferences.filter(p => p !== preferenceId)
      : [...currentPreferences, preferenceId];
    
    updateData({ meeting_preferences: updatedPreferences });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-2xl">Where do you prefer to meet?</CardTitle>
        <CardDescription className="text-base">
          Choose your preferred meeting locations and environments for networking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select all that apply *</Label>
          <p className="text-sm text-gray-600">
            This helps others know where you're comfortable meeting for coffee chats, work sessions, or collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEETING_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = data.meeting_preferences.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => togglePreference(option.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-purple-200' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-purple-700' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      isSelected ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h3>
                    <p className={`text-sm ${
                      isSelected ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>💡 Tip:</strong> Select multiple options to increase your chances of connecting with others who share similar meeting preferences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};