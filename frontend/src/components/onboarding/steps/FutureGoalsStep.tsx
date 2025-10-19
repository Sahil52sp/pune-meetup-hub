import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, Rocket, Star, TrendingUp } from 'lucide-react';

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
    const currentGoals = data.future_goals || '';
    const isCurrentlySelected = currentGoals.includes(suggestion);
    
    let newGoals;
    if (isCurrentlySelected) {
      // Remove the suggestion
      const goalsArray = currentGoals.split('\n\n').filter(goal => goal.trim() !== suggestion);
      newGoals = goalsArray.join('\n\n');
    } else {
      // Add the suggestion
      newGoals = currentGoals 
        ? `${currentGoals}\n\n${suggestion}`
        : suggestion;
    }
    
    updateData({ future_goals: newGoals });
  };

  const isSelected = (goalTitle: string) => {
    return data.future_goals && data.future_goals.includes(goalTitle);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-left md:text-center p-4 md:pb-12">
        <div className="md:mx-auto w-8 md:w-10 h-8 md:h-10 bg-orange-100 rounded-full flex items-center justify-center mb-1">
          <Target className="w-5 h-5 text-orange-600" />
        </div>
        <CardTitle className="text-2xl">Where do you see yourself in 5 years?</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 md:pt-0">
        {/* <div className="space-y-2">
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
        </div> */}

        {/* Goal Suggestions */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GOAL_SUGGESTIONS.map((goal, index) => {
              const Icon = goal.icon;
              const selected = isSelected(goal.title);
              return (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(goal.title)}
                  className={`p-3 text-left rounded-lg border transition-colors transition-all hover:shadow-md ${
                    selected 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selected ? 'bg-orange-200' : 'bg-orange-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        selected ? 'text-orange-700' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm ${
                        selected ? 'text-orange-900' : 'text-gray-900'
                      }`}>{goal.title}</h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Character count */}
        {/* <div className="text-right">
          <p className="text-xs text-gray-500">
            {data.future_goals.length} characters
            {data.future_goals.length < 50 && (
              <span className="text-orange-600 ml-2">
                (Add more details for better connections)
              </span>
            )}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
};