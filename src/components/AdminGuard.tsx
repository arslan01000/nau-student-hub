import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!cancelled) {
        setIsAdmin(!error && !!data);
        setLoading(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return <Navigate to="/" replace />;
  if (loading) return null; // можно потом заменить на лоадер
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
