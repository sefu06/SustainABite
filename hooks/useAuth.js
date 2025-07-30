import { useState, useEffect, createContext, useContext } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Get user data from Firestore
        try {
          const data = await AuthService.getCurrentUserData(authUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading,
    login: AuthService.login,
    register: AuthService.register,
    logout: AuthService.logout,
    updateUserData: AuthService.updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};