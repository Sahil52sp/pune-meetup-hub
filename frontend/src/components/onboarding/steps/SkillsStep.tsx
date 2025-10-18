import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Plus, X, Lightbulb } from 'lucide-react';

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
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Code className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">What are you good at?</CardTitle>
        <CardDescription className="text-base">
          Share your skills and tell us what you do professionally
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* What do you do */}
        <div className="space-y-2">
          <Label htmlFor="expertise" className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            What do you do? *
          </Label>
          <Textarea
            id="expertise"
            placeholder="e.g. I build web applications using React and Node.js, focusing on creating user-friendly interfaces and scalable backends..."
            value={data.expertise}
            onChange={(e) => updateData({ expertise: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Your Skills *</Label>
          
          {/* Selected Skills */}
          {data.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
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
          <div className="flex gap-2">
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
              variant="outline"
              disabled={!newSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Popular Skills */}
          <div>
            <p className="text-sm text-gray-600 mb-3">Popular skills to choose from:</p>
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

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>💡 Tip:</strong> Add skills you're confident in. This helps others find you for collaboration and opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};