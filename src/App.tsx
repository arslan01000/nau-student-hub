import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/AuthModal";
import { Footer } from "@/components/Footer";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Discussions from "./pages/Discussions";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Reviews from "./pages/Reviews";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        onLoginClick={() => setShowAuthModal(true)}
        user={user}
        onLogout={handleLogout}
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;