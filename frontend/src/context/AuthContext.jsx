import { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(status === 'loading');

  useEffect(() => {
    setUser(session?.user || null);
    setLoading(status === 'loading');
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
