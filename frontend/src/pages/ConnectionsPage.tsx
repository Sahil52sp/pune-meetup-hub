import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Check, X, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  created_at: string;
  responded_at?: string;
  sender_name: string;
  sender_email: string;
  sender_picture?: string;
  receiver_name: string;
  receiver_email: string;
  receiver_picture?: string;
}

export default function ConnectionsPage() {
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [establishedConnections, setEstablishedConnections] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const { toast } = useToast();

  const backendUrl = 'https://meetup-network-1.preview.emergentagent.com';

  useEffect(() => {
    loadAllConnections();
  }, []);

  const loadAllConnections = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes, establishedRes] = await Promise.all([
        fetch(`${backendUrl}/api/connections/requests/received`, { credentials: 'include' }),
        fetch(`${backendUrl}/api/connections/requests/sent`, { credentials: 'include' }),
        fetch(`${backendUrl}/api/connections/established`, { credentials: 'include' })
      ]);

      if (receivedRes.ok) {
        const receivedData = await receivedRes.json();
        if (receivedData.success) {
          setReceivedRequests(receivedData.data.requests);
        }
      }

      if (sentRes.ok) {
        const sentData = await sentRes.json();
        if (sentData.success) {
          setSentRequests(sentData.data.requests);
        }
      }

      if (establishedRes.ok) {
        const establishedData = await establishedRes.json();
        if (establishedData.success) {
          setEstablishedConnections(establishedData.data.connections);
        }
      }
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    setRespondingTo(requestId);
    try {
      const response = await fetch(`${backendUrl}/api/connections/requests/${requestId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Connection request ${status} successfully`
        });
        await loadAllConnections();
      } else {
        throw new Error(`Failed to ${status} request`);
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${status} request`,
        variant: "destructive"
      });
    } finally {
      setRespondingTo(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-600"><Check className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Connections</h1>
        <p className="text-muted-foreground">
          Manage your connection requests and established connections
        </p>
      </div>

      <Tabs defaultValue="received" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Received ({receivedRequests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Sent ({sentRequests.length})
          </TabsTrigger>
          <TabsTrigger value="established" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Connected ({establishedConnections.length})
          </TabsTrigger>
        </TabsList>

        {/* Received Requests */}
        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No connection requests</h3>
                <p className="text-muted-foreground">
                  You haven't received any connection requests yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.sender_picture} alt={request.sender_name} />
                      <AvatarFallback>
                        {request.sender_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{request.sender_name}</h3>
                          <p className="text-sm text-muted-foreground">{request.sender_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(request.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm italic">"{request.message}"</p>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => respondToRequest(request.id, 'accepted')}
                            disabled={respondingTo === request.id}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => respondToRequest(request.id, 'rejected')}
                            disabled={respondingTo === request.id}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}

                      {request.status === 'accepted' && (
                        <div className="pt-2">
                          <Link to="/messaging">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Start Conversation
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Sent Requests */}
        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't sent any connection requests yet.
                </p>
                <Link to="/browse">
                  <Button>Browse Connections</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.receiver_picture} alt={request.receiver_name} />
                      <AvatarFallback>
                        {request.receiver_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{request.receiver_name}</h3>
                          <p className="text-sm text-muted-foreground">{request.receiver_email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(request.status)}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(request.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm italic">"{request.message}"</p>
                      </div>

                      {request.status === 'accepted' && (
                        <div className="pt-2">
                          <Link to="/messaging">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Start Conversation
                            </Button>
                          </Link>
                        </div>
                      )}

                      {request.responded_at && (
                        <p className="text-xs text-muted-foreground">
                          Responded on {formatDate(request.responded_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Established Connections */}
        <TabsContent value="established" className="space-y-4">
          {establishedConnections.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No established connections</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any established connections yet.
                </p>
                <Link to="/browse">
                  <Button>Find Connections</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {establishedConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={connection.receiver_picture || connection.sender_picture} 
                          alt={connection.receiver_name || connection.sender_name} 
                        />
                        <AvatarFallback>
                          {(connection.receiver_name || connection.sender_name).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {connection.receiver_name || connection.sender_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {connection.receiver_email || connection.sender_email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Connected {formatDate(connection.responded_at || connection.created_at)}
                        </p>
                      </div>

                      <Link to="/messaging">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Box>
  );
}