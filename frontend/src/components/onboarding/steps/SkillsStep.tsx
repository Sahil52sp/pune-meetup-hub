import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Plus, X } from 'lucide-react';

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

interface SkillsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
  'Product Management', 'UI/UX Design', 'Digital Marketing', 'Data Analysis',
  'Machine Learning', 'Mobile Development', 'DevOps', 'Blockchain'
];

export const SkillsStep: React.FC<SkillsStepProps> = ({ data, updateData }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (skill: string) => {
    if (skill && !data.skills.includes(skill)) {
      updateData({ skills: [...data.skills, skill] });
    }
  };

  const addCustomSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateData({
      skills: data.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-left md:text-center p-4 md:pb-12">
        <div className="md:mx-auto w-8 md:w-10 h-8 md:h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
          <Code className="w-5 h-5 text-green-600" />
        </div>
        <CardTitle className="text-2xl">What are you good at?</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 md:pt-0">
        {/* What do you do */}
        

        {/* Skills */}
        <div className="space-y-4">
          
          {/* Selected Skills */}
          {data.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge key={skill} variant="default" className="text-sm">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Custom Skill */}
          <div className="flex gap-2 items-center justify-center">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
              className="flex-1"
            />
            <Button 
              onClick={addCustomSkill} 
              size="sm" 
              disabled={!newSkill.trim()}
              className="h-10 w-10 mt-1"
            >
              <Plus className="h-8 w-4" />
            </Button>
          </div>

          {/* Popular Skills */}
          <div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  disabled={data.skills.includes(skill)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    data.skills.includes(skill)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};