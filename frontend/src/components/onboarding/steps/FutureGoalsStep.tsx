import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, Rocket, Star, TrendingUp } from 'lucide-react';

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

interface FutureGoalsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const GOAL_SUGGESTIONS = [
  {
    icon: Rocket,
    title: "Starting my own company",
    description: "Building a startup or launching my own business"
  },
  {
    icon: TrendingUp,
    title: "Career advancement", 
    description: "Moving into leadership roles or senior positions"
  },
  {
    icon: Star,
    title: "Becoming an expert",
    description: "Mastering my field and becoming a recognized authority"
  },
  {
    icon: Target,
    title: "Making an impact",
    description: "Contributing to meaningful projects that create positive change"
  }
];

export const FutureGoalsStep: React.FC<FutureGoalsStepProps> = ({ data, updateData }) => {
  const handleSuggestionClick = (suggestion: string) => {
    const currentGoals = data.future_goals;
    const newGoals = currentGoals 
      ? `${currentGoals}\n\n${suggestion}`
      : suggestion;
    updateData({ future_goals: newGoals });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-orange-600" />
        </div>
        <CardTitle className="text-2xl">Where do you see yourself in 5 years?</CardTitle>
        <CardDescription className="text-base">
          Share your professional aspirations and goals for the future
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="future_goals" className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            Your Future Goals *
          </Label>
          <Textarea
            id="future_goals"
            placeholder="e.g. I want to become a tech lead and eventually start my own AI company. I'm passionate about building products that solve real-world problems and hope to mentor other developers along the way..."
            value={data.future_goals}
            onChange={(e) => updateData({ future_goals: e.target.value })}
            rows={6}
            className="resize-none"
          />
          <p className="text-sm text-gray-600">
            Be specific about your career aspirations, personal growth, or the impact you want to make.
          </p>
        </div>

        {/* Goal Suggestions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Need inspiration? Click to add these common goals:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GOAL_SUGGESTIONS.map((goal, index) => {
              const Icon = goal.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(goal.title)}
                  className="p-3 text-left rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>💡 Tip:</strong> Sharing your goals helps others understand your ambitions and can lead to mentorship, collaboration, or opportunity sharing.
          </p>
        </div>

        {/* Character count */}
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {data.future_goals.length} characters
            {data.future_goals.length < 50 && (
              <span className="text-orange-600 ml-2">
                (Add more details for better connections)
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};