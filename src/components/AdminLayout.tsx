import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";

export const AdminLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/playbooks", label: "Playbooks", icon: BookOpen },
    { path: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 p-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
        
        <h2 className="text-xl font-serif mb-6">Admin Panel</h2>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};