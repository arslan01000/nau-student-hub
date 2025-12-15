import { createContext, useContext, useState, useCallback } from "react";
import { LoginPromptModal } from "@/components/LoginPromptModal";

interface LoginPromptContextType {
  showLoginPrompt: () => void;
}

const LoginPromptContext = createContext<LoginPromptContextType | null>(null);

export const useLoginPrompt = () => {
  const context = useContext(LoginPromptContext);
  if (!context) {
    throw new Error("useLoginPrompt must be used within a LoginPromptProvider");
  }
  return context;
};

interface LoginPromptProviderProps {
  children: React.ReactNode;
  onOpenAuthModal: () => void;
}

export const LoginPromptProvider = ({ 
  children, 
  onOpenAuthModal 
}: LoginPromptProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const showLoginPrompt = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogin = useCallback(() => {
    onOpenAuthModal();
  }, [onOpenAuthModal]);

  return (
    <LoginPromptContext.Provider value={{ showLoginPrompt }}>
      {children}
      <LoginPromptModal 
        isOpen={isOpen} 
        onClose={handleClose} 
        onLogin={handleLogin} 
      />
    </LoginPromptContext.Provider>
  );
};
