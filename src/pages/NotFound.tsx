import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-serif font-bold">Lost in the campus?</h1>
        <p className="text-xl text-muted-foreground">This page doesn't exist.</p>
        <a href="/">
          <button className="mt-4 px-6 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors">
            Go Home
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
