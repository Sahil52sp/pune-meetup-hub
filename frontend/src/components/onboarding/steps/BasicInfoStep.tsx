import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, Calendar, Award } from 'lucide-react';

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

interface BasicInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-left md:text-center p-4 md:pb-12">
        <div className="md:mx-auto w-8 md:w-10 h-8 md:h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
          <User className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="h-11"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title" className="text-sm font-medium flex items-center gap-2">
              Designation*
            </Label>
            <Input
              id="job_title"
              placeholder="e.g. Software Engineer"
              value={data.job_title}
              onChange={(e) => updateData({ job_title: e.target.value })}
              className="h-11"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
              Company *
            </Label>
            <Input
              id="company"
              placeholder="e.g. Google, Startup, Freelance"
              value={data.company}
              onChange={(e) => updateData({ company: e.target.value })}
              className="h-11"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
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
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_experience" className="text-sm font-medium flex items-center gap-2">
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
              autoComplete="off"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};