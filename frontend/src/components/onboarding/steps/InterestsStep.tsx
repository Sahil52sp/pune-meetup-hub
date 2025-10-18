import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, X, Music, Camera, Book, Gamepad2, Plane, Dumbbell } from 'lucide-react';

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
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-pink-600" />
        </div>
        <CardTitle className="text-2xl">What do you like to do in your free time?</CardTitle>
        <CardDescription className="text-base">
          Share your hobbies and interests to connect with like-minded people
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Interests */}
        {data.interests.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Your Interests</Label>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="text-sm">
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
        <div className="space-y-2">
          <Label htmlFor="custom-interest" className="text-sm font-medium">Add Custom Interest</Label>
          <div className="flex gap-2">
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
              variant="outline"
              disabled={!newInterest.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Popular Interests */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Popular Interests *</Label>
          <p className="text-sm text-gray-600">
            Click to add interests that resonate with you:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {POPULAR_INTERESTS.map((interest) => {
              const Icon = interest.icon === Plus ? Heart : interest.icon;
              const isSelected = data.interests.includes(interest.label);
              
              return (
                <button
                  key={interest.id}
                  onClick={() => addInterest(interest.label)}
                  disabled={isSelected}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    isSelected
                      ? 'bg-pink-50 border-pink-300 text-pink-800 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:bg-pink-50 hover:border-pink-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-600' : 'text-gray-600'}`} />
                    <span className="text-sm font-medium">{interest.label}</span>
                    {isSelected && (
                      <div className="ml-auto w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <p className="text-sm text-pink-800">
            <strong>💡 Tip:</strong> Shared interests are great conversation starters! Choose interests you're genuinely passionate about.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};