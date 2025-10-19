import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, X, Music, Camera, Book, Gamepad2, Plane, Dumbbell } from 'lucide-react';

interface OnboardingData {
  name: string;
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

interface InterestsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const POPULAR_INTERESTS = [
  { id: 'reading', label: 'Reading', icon: Book },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'cooking', label: 'Cooking', icon: Heart },
  { id: 'hiking', label: 'Hiking', icon: Plus },
  { id: 'movies', label: 'Movies & TV', icon: Plus },
  { id: 'sports', label: 'Sports', icon: Plus },
  { id: 'art', label: 'Art & Design', icon: Plus },
  { id: 'technology', label: 'Technology', icon: Plus },
  { id: 'volunteering', label: 'Volunteering', icon: Plus },
  { id: 'meditation', label: 'Meditation', icon: Plus }
];

export const InterestsStep: React.FC<InterestsStepProps> = ({ data, updateData }) => {
  const [newInterest, setNewInterest] = useState('');

  const addInterest = (interest: string) => {
    if (interest && !data.interests.includes(interest)) {
      updateData({ interests: [...data.interests, interest] });
    }
  };

  const addCustomInterest = () => {
    if (newInterest.trim()) {
      addInterest(newInterest.trim());
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    updateData({
      interests: data.interests.filter(interest => interest !== interestToRemove)
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-left md:text-center p-4 md:pb-12">
        <div className="md:mx-auto w-8 md:w-10 h-8 md:h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1">
          <Heart className="w-5 h-5 text-pink-600" />
        </div>
        <CardTitle className="text-2xl">What do you like to do in your free time?</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 md:pt-0">
        {/* Selected Interests */}
        {data.interests.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <Badge key={interest} variant="default" className="text-sm">
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Interest */}
          <div className="flex gap-2 mt-4 items-center justify-center">
            <Input
              id="custom-interest"
              placeholder="e.g. Rock climbing, Astronomy, Gardening..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
              className="flex-1"
            />
            <Button 
              onClick={addCustomInterest} 
              size="sm" 
              disabled={!newInterest.trim()}
              className="h-10 w-10 mt-1"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

        {/* Popular Interests */}
        <div className="space-y-2 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {POPULAR_INTERESTS.map((interest) => {
              const Icon = interest.icon === Plus ? Heart : interest.icon;
              const isSelected = data.interests.includes(interest.label);
              
              return (
                <button
                  key={interest.id}
                  onClick={() => addInterest(interest.label)}
                  disabled={isSelected}
                  className={`px-3 py-2 rounded-sm border transition-all text-left ${
                    isSelected
                      ? 'bg-pink-50 border-pink-300 text-pink-800 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:bg-pink-50 hover:border-pink-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-600' : 'text-gray-600'}`} />
                    <span className="text-xs font-medium">{interest.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};