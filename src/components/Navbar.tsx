import { Link, NavLink } from "react-router-dom";
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

  // Shared styles
  const navLink =
    "text-sm font-medium text-foreground/80 underline-offset-4 transition-all duration-150 hover:text-primary hover:underline";

  const activeLink =
    "text-primary underline underline-offset-4";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 transition-opacity hover:opacity-80"
          >
            <img
              src="/media/logo.png"
              alt="NAU Threads Logo"
              className="h-12 w-auto object-contain"
              style={{ marginTop: "-2px" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">

            <NavLink
              to="/discussions"
              className={({ isActive }) =>
                isActive ? `${navLink} ${activeLink}` : navLink
              }
            >
              Discussions
            </NavLink>

            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                isActive ? `${navLink} ${activeLink}` : navLink
              }
            >
              Reviews
            </NavLink>

            <NavLink
              to="/playbooks"
              className={({ isActive }) =>
                isActive ? `${navLink} ${activeLink}` : navLink
              }
            >
              Playbooks
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? `${navLink} ${activeLink}` : navLink
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${navLink} ${activeLink}` : navLink
              }
            >
              Contact
            </NavLink>

            <NavLink
              to="/ai-assistant"
              className={({ isActive }) =>
                isActive ? `${navLink} ${activeLink}` : navLink
              }
            >
              AI Assistant
            </NavLink>

            {user && (
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? `${navLink} ${activeLink}` : navLink
                }
              >
                Settings
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? `${navLink} ${activeLink}` : navLink
                }
              >
                Admin
              </NavLink>
            )}

            {/* User section */}
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
              className="block text-sm font-medium py-2 transition-all hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Discussions
            </Link>

            <Link
              to="/reviews"
              className="block text-sm font-medium py-2 transition-all hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </Link>

            <Link
              to="/playbooks"
              className="block text-sm font-medium py-2 transition-all hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Playbooks
            </Link>

            <Link
              to="/about"
              className="block text-sm font-medium py-2 transition-all hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <Link
              to="/contact"
              className="block text-sm font-medium py-2 transition-all hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <Link
              to="/ai-assistant"
              className="block text-sm font-medium py-2 transition-all hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Assistant
            </Link>

            {user && (
              <Link
                to="/settings"
                className="block text-sm font-medium py-2 transition-all hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="block text-sm font-medium py-2 transition-all hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            <div className="pt-2 border-t border-border">
              {user ? (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    {user.email}
                  </p>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onLoginClick}
                  size="sm"
                  className="w-full"
                >
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
