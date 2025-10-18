import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, Calendar, Award } from 'lucide-react';

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

interface BasicInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
        <CardDescription className="text-base">
          Let's start with some basic information about your professional background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="job_title" className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Designation / Job Title *
            </Label>
            <Input
              id="job_title"
              placeholder="e.g. Software Engineer, Product Manager"
              value={data.job_title}
              onChange={(e) => updateData({ job_title: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company *
            </Label>
            <Input
              id="company"
              placeholder="e.g. Google, Startup, Freelance"
              value={data.company}
              onChange={(e) => updateData({ company: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g. 25"
              value={data.age}
              onChange={(e) => updateData({ age: e.target.value ? parseInt(e.target.value) : '' })}
              min="18"
              max="100"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_experience" className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Years of Experience *
            </Label>
            <Input
              id="years_experience"
              type="number"
              placeholder="e.g. 3"
              value={data.years_experience}
              onChange={(e) => updateData({ years_experience: e.target.value ? parseInt(e.target.value) : '' })}
              min="0"
              max="50"
              className="h-11"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> This information helps others understand your professional background and connect with relevant opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};