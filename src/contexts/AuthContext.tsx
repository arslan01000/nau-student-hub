import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Слушаем состояние авторизации
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Авто-создание/обновление профиля в таблице `profiles`
  useEffect(() => {
    if (!user) return;

    const ensureProfile = async () => {
      const email = user.email ?? '';
      const baseName =
        email && email.includes('@')
          ? email.split('@')[0]
          : (user.user_metadata as any)?.name || 'user';

      const { error } = await supabase.from('profiles').upsert(
        {
          id: user.id,            // тот же id, что в reviews.user_id
          username: baseName,
          display_name: baseName, // то, что ты показываешь в ReviewCard
        },
        { onConflict: 'id' }      // если профиль уже есть — не дублируем
      );

      if (error) {
        console.error('Failed to ensure profile', error);
      }
    };

    ensureProfile();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
