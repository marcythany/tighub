import { createContext, useState, useEffect } from 'react';
import { getSession, signin, signout } from '@auth/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSignin = async (provider) => {
    try {
      await signin(provider);
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  const handleSignout = async () => {
    try {
      await signout();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signin: handleSignin, signout: handleSignout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
