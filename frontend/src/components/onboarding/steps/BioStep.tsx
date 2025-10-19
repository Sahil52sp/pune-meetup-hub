import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Calendar, Award, Lightbulb, CheckCircle, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingData {
  name: string;
  job_title: string;
  company: string;
  age: number | "";
  years_experience: number | "";
  skills: string[];
  bio: string;
  meeting_preferences: string[];
  interests: string[];
  future_goals: string;
}

interface BioStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const BioStep: React.FC<BioStepProps> = ({ data, updateData }) => {
  const wordCount = data.bio.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 25;
  const isValidWordCount = wordCount >= minWords;

  const getWordCountText = () => {
    if (wordCount === 0) return "";
    if (wordCount <= 15) return "Too short";
    if (wordCount <= 25) return "few more words";
    if (wordCount <= 35) return "Perfect";
    return "More than enough, great!";
  };

  const getWordCountIcon = () => {
    if (wordCount <= 15 || wordCount <= 25) return null;
    if (wordCount <= 35) return <CheckCircle className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getTextColor = () => {
    if (wordCount === 0) return "text-gray-400";
    if (wordCount <= 15) return "text-red-500";
    if (wordCount <= 25) return "text-orange-500";
    if (wordCount <= 35) return "text-green-600";
    return "text-green-600";
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-left md:text-center p-4 md:pb-12">
        <div className="md:mx-auto w-8 md:w-10 h-8 md:h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">
          {" "}
          Write a short bio about yourself
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 md:pt-0">
        <div className="space-y-2 w-full">
          <Label
            htmlFor="bio"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Bio * <span className="text-xs text-gray-500">(Min {minWords} words)</span>
          </Label>
          <Textarea
            id="bio"
            placeholder="e.g. I build web applications using React and Node.js, focusing on creating user-friendly interfaces and scalable backends..."
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            rows={6}
            className="resize-none min-h-[250px] md:min-h-[140px]"
          />
          <div className={`text-sm flex items-center gap-1 ${getTextColor()}`}>
            {getWordCountIcon()}
            {getWordCountText()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
