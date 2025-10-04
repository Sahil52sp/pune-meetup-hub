import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Search, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const QuickActions: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-center">
          🚀 Quick Actions - Start Networking Now!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/profile">
            <Button 
              variant="outline" 
              className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <User className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">My Profile</span>
              <span className="text-xs text-muted-foreground">Edit details</span>
            </Button>
          </Link>

          <Link to="/browse">
            <Button 
              variant="outline" 
              className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-50 border-green-200"
            >
              <Search className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium">Browse</span>
              <span className="text-xs text-muted-foreground">Find people</span>
            </Button>
          </Link>

          <Link to="/connections">
            <Button 
              variant="outline" 
              className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 border-purple-200"
            >
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Connections</span>
              <span className="text-xs text-muted-foreground">Manage requests</span>
            </Button>
          </Link>

          <Link to="/messaging">
            <Button 
              variant="outline" 
              className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 border-orange-200"
            >
              <MessageSquare className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium">Messages</span>
              <span className="text-xs text-muted-foreground">Chat now</span>
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Pro Tip:</strong> Complete your profile first, then browse and connect with professionals in your field!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};