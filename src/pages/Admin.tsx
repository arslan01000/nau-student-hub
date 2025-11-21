import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div>
      <h1 className="text-4xl font-serif mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Welcome to the NAU Threads admin panel
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border border-border bg-card/30">
          <h3 className="text-lg font-medium mb-2">Playbooks</h3>
          <p className="text-sm text-muted-foreground">
            Review and moderate submitted playbooks
          </p>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card/30">
          <h3 className="text-lg font-medium mb-2">Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Manage professor reviews and ratings
          </p>
        </div>

        <div className="p-6 rounded-lg border border-border bg-card/30">
          <h3 className="text-lg font-medium mb-2">Contact Messages</h3>
          <p className="text-sm text-muted-foreground">
            View submitted contact form messages
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;