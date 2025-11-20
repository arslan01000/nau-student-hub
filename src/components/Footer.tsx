import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            NAU Threads is an unofficial student platform. Posts may be inaccurate or incomplete. 
            Always verify important academic, legal, and immigration information with official NAU advisors.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
