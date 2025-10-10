import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  User,
  Briefcase,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { backendUrl } from "@/config/api";

interface UserProfile {
  id: string;
  user_id: string;
  job_title?: string;
  company?: string;
  bio?: string;
  location?: string;
  linkedin_url?: string;
  years_experience?: number;
  skills: string[];
  interests: string[];
  is_open_for_connection: boolean;
  contact_preferences?: string;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  user_picture?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/profile`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data.profile);
          setIsEditing(false);
        }
      } else if (response.status === 404) {
        // Profile doesn't exist, enable editing mode
        setIsEditing(true);
        if (user) {
          setProfile({
            id: "",
            user_id: user.id,
            job_title: "",
            company: "",
            bio: "",
            location: "",
            linkedin_url: "",
            years_experience: 0,
            skills: [],
            interests: [],
            is_open_for_connection: true,
            contact_preferences: "email",
            created_at: "",
            updated_at: "",
            user_name: user.name,
            user_email: user.email,
            user_picture: user.picture,
          });
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateProfile = (profile: UserProfile): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!profile.job_title?.trim()) {
      errors.job_title = "Job title is required";
    }

    if (!profile.company?.trim()) {
      errors.company = "Company is required";
    }

    if (!profile.years_experience || profile.years_experience <= 0) {
      errors.years_experience =
        "Years of experience is required and must be greater than 0";
    }

    if (!profile.bio?.trim()) {
      errors.bio = "Bio is required";
    }

    return errors;
  };

  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    // Validate required fields
    const errors = validateProfile(profile);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});

    setSaving(true);
    try {
      const method = profile.id ? "PUT" : "POST";
      const response = await fetch(`${backendUrl}/api/profile`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          job_title: profile.job_title,
          company: profile.company,
          bio: profile.bio,
          location: profile.location,
          linkedin_url: profile.linkedin_url,
          years_experience: profile.years_experience,
          skills: profile.skills,
          interests: profile.interests,
          is_open_for_connection: profile.is_open_for_connection,
          contact_preferences: profile.contact_preferences,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile saved successfully",
        });
        await loadProfile();
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && profile) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter((_, i) => i !== index),
      });
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && profile) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    if (profile) {
      setProfile({
        ...profile,
        interests: profile.interests.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              Unable to load your profile. Please try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col lg:flex-row justify-between items-left lg:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional profile and connection preferences
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="job_title">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job_title"
                  value={profile.job_title || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, job_title: e.target.value });
                    clearValidationError("job_title");
                  }}
                  disabled={!isEditing}
                  placeholder="e.g. Senior Software Engineer"
                  className={validationErrors.job_title ? "border-red-500" : ""}
                />
                {validationErrors.job_title && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.job_title}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  value={profile.company || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, company: e.target.value });
                    clearValidationError("company");
                  }}
                  disabled={!isEditing}
                  placeholder="e.g. Tech Corp"
                  className={validationErrors.company ? "border-red-500" : ""}
                />
                {validationErrors.company && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.company}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="years_experience">
                  Years of Experience <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={profile.years_experience || 0}
                  onChange={(e) => {
                    setProfile({
                      ...profile,
                      years_experience: parseInt(e.target.value) || 0,
                    });
                    clearValidationError("years_experience");
                  }}
                  disabled={!isEditing}
                  placeholder="0"
                  className={
                    validationErrors.years_experience ? "border-red-500" : ""
                  }
                />
                {validationErrors.years_experience && (
                  <p className="text-sm text-red-500 mt-1">
                    {validationErrors.years_experience}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">
                Bio <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bio"
                value={profile.bio || ""}
                onChange={(e) => {
                  setProfile({ ...profile, bio: e.target.value });
                  clearValidationError("bio");
                }}
                disabled={!isEditing}
                placeholder="Tell others about yourself, your interests, and what you're looking for in networking..."
                rows={4}
                className={validationErrors.bio ? "border-red-500" : ""}
              />
              {validationErrors.bio && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.bio}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                value={profile.linkedin_url || ""}
                onChange={(e) =>
                  setProfile({ ...profile, linkedin_url: e.target.value })
                }
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>
          </CardContent>
        </Card>

        {/* Connection Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Activate to set Open for Connections</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to send you connection requests
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={profile.is_open_for_connection}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, is_open_for_connection: checked })
                  }
                  disabled={!isEditing}
                />
                {/* <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">You are Active</span>
                </div> */}
              </div>
            </div>

            {/* <div>
              <Label>Preferred Contact Method</Label>
              <select
                value={profile.contact_preferences || "email"}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    contact_preferences: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="w-full mt-1 p-2 border border-input rounded-md"
              >
                <option value="email">Email</option>
                <option value="linkedin">LinkedIn</option>
                <option value="both">Both</option>
              </select>
            </div> */}
          </CardContent>
        </Card>

        <div className="flex lg:flex-row flex-col gap-6 w-full">
          {/* Skills */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button size="sm" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeInterest(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      onKeyPress={(e) => e.key === "Enter" && addInterest()}
                    />
                    <Button size="sm" onClick={addInterest}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Box>
  );
}
