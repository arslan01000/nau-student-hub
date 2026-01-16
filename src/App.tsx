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
import { LoginPromptProvider } from "@/contexts/LoginPromptContext";
import Home from "./pages/Home";
import Discussions from "./pages/Discussions";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Reviews from "./pages/Reviews";
import Professors from "./pages/Professors";
import ProfessorProfile from "./pages/ProfessorProfile";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import Playbooks from "./pages/Playbooks";
import PlaybookArticle from "./pages/PlaybookArticle";
import SubmitPlaybook from "./pages/SubmitPlaybook";
import AdminPlaybooks from "./pages/AdminPlaybooks";
import Admin from "./pages/Admin";
import AdminReviews from "./pages/AdminReviews";
import { AdminLayout } from "@/components/AdminLayout";
import NotFound from "./pages/NotFound";
import { AdminGuard } from "@/components/AdminGuard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <LoginPromptProvider onOpenAuthModal={() => setShowAuthModal(true)}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar
          onLoginClick={() => setShowAuthModal(true)}
          user={user}
          onLogout={handleLogout}
        />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onLoginClick={() => setShowAuthModal(true)} />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/professors" element={<Professors />} />
            <Route path="/professors/:id" element={<ProfessorProfile />} />
            <Route path="/playbooks" element={<Playbooks />} />
              <Route path="/playbooks/submit" element={<SubmitPlaybook />} />
              <Route path="/playbooks/:id" element={<PlaybookArticle />} />
            
            {/* Admin Routes */}
            <Route
  path="/admin"
  element={
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  }
>
  <Route index element={<Admin />} />
  <Route path="playbooks" element={<AdminPlaybooks />} />
  <Route path="reviews" element={<AdminReviews />} />
</Route>

            
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
    </LoginPromptProvider>
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
