import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";

interface NavbarProps {
  onLoginClick: () => void;
  user: any;
  onLogout: () => void;
}

export const Navbar = ({ onLoginClick, user, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img
            src="/media/logo.png"
            alt="NAU Threads Logo"
            className="h-12 w-auto object-contain"
            style={{ marginTop: "-2px" }}
          />
        </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/discussions" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
              Discussions
            </Link>
            <Link to="/reviews" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
              Reviews
            </Link>
            <Link to="/playbooks" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
              Playbooks
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
              Contact
            </Link>
            <Link to="/ai-assistant" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
              AI Assistant
            </Link>
            {user && (
              <Link to="/settings" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
                Settings
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors transition underline-offset-4 hover:underline hover:text-primary">
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button onClick={onLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick} size="sm">
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <Link
              to="/discussions"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Discussions
            </Link>
            <Link
              to="/reviews"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link
              to="/playbooks"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Playbooks
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/ai-assistant"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Assistant
            </Link>
            {user && (
              <Link
                to="/settings"
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-border">
              {user ? (
                <>
                  <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                  <Button onClick={onLogout} variant="outline" size="sm" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={onLoginClick} size="sm" className="w-full">
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
