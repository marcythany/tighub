import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check`,
          { credentials: 'include' },
        );
        const data = await res.json();
        setAuthUser(data.user);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
