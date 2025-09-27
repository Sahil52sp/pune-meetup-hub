import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@/components/ui/box";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Box className="min-h-screen flex flex-col">
            <Header onSearchChange={setSearchQuery} />
            <main className="flex-1">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <HomePage 
                      searchQuery={searchQuery} 
                      onSearchChange={setSearchQuery}
                    />
                  } 
                />
                <Route 
                  path="/events" 
                  element={<EventsPage searchQuery={searchQuery} />} 
                />
                <Route path="/event/:id" element={<EventDetailPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </Box>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
