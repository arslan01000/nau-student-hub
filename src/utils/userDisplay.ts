// Utility functions for displaying user information

export const obfuscateEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!username || !domain) return 'Anonymous';
  
  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const obfuscated = username.slice(0, visibleChars) + '***';
  return `${obfuscated}@${domain}`;
};

export const getUserDisplayName = (
  isAnonymous: boolean,
  displayName?: string | null,
  email?: string | null
): string => {
  if (isAnonymous) {
    return 'Anonymous';
  }
  
  if (displayName) {
    return displayName;
  }
  
  if (email) {
    return obfuscateEmail(email);
  }
  
  return 'Unknown User';
};
