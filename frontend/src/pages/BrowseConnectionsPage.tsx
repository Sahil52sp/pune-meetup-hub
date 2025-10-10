import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Briefcase, Calendar, Users, MessageSquare, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { backendUrl } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

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

export default function BrowseConnectionsPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, login, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Box className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Find Connections</CardTitle>
            <CardDescription>
              Sign in with Google to start networking with tech professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={login} 
              className="w-full" 
              size="lg"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Connect with fellow developers, attend meetups, and grow your professional network
            </p>
          </CardContent>
        </Card>
      </Box>
    );
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProfiles();
    }
  }, [isAuthenticated]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (locationFilter) params.append('location', locationFilter);
      if (companyFilter) params.append('company', companyFilter);
      params.append('limit', '20');

      const response = await fetch(`${backendUrl}/api/profile/browse?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfiles(data.data.profiles);
        }
      } else {
        throw new Error('Failed to load profiles');
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async () => {
    if (!selectedProfile || !requestMessage.trim()) return;

    setSendingRequest(true);
    try {
      const response = await fetch(`${backendUrl}/api/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          receiver_id: selectedProfile.user_id,
          message: requestMessage.trim()
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Connection request sent successfully!"
        });
        setSelectedProfile(null);
        setRequestMessage('');
        // Remove the profile from the list since request is sent
        setProfiles(profiles.filter(p => p.user_id !== selectedProfile.user_id));
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request",
        variant: "destructive"
      });
    } finally {
      setSendingRequest(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProfiles();
  };

  return (
    <Box className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Connections</h1>
        <p className="text-muted-foreground">
          Discover and connect with tech professionals in your area
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by skills, job title, company, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button type="submit">Search</Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g. Google, Microsoft"
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </Box>
      )}

      {/* Results */}
      {!loading && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Found {profiles.length} professional{profiles.length !== 1 ? 's' : ''} open for connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.user_picture} alt={profile.user_name} />
                      <AvatarFallback>
                        {profile.user_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {profile.user_name}
                      </h3>
                      {profile.job_title && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {profile.job_title}
                        </p>
                      )}
                      {profile.company && (
                        <p className="text-sm text-muted-foreground">
                          @ {profile.company}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {profile.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {profile.location}
                    </div>
                  )}

                  {profile.years_experience !== undefined && profile.years_experience > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {profile.years_experience} years experience
                    </div>
                  )}

                  {profile.bio && (
                    <p className="text-sm line-clamp-3">
                      {profile.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {profile.skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {profile.interests.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Interests</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.interests.slice(0, 3).map((interest, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {profile.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setSelectedProfile(profile);
                          setRequestMessage(`Hi ${profile.user_name}, I'd like to connect with you!`);
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Send Connection Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Connection Request</DialogTitle>
                        <DialogDescription>
                          Send a personalized message to {selectedProfile?.user_name}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar>
                            <AvatarImage src={selectedProfile?.user_picture} alt={selectedProfile?.user_name} />
                            <AvatarFallback>
                              {selectedProfile?.user_name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedProfile?.user_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedProfile?.job_title} {selectedProfile?.company && `at ${selectedProfile.company}`}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Introduce yourself and explain why you'd like to connect..."
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedProfile(null);
                            setRequestMessage('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={sendConnectionRequest}
                          disabled={sendingRequest || !requestMessage.trim()}
                        >
                          {sendingRequest ? 'Sending...' : 'Send Request'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {profiles.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No connections found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or check back later for new professionals.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setCompanyFilter('');
                  loadProfiles();
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}