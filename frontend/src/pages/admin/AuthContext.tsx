import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import apiEnc from '../../api/apiEnc';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  // Agrega más campos según tu modelo de usuario
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiEnc<User>('users').getOne('current');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // Aquí debes ajustar según tu API de autenticación
      const response = await apiEnc<any>('auth').create({
        ...credentials,
      });
      
      // Asume que la API devuelve el usuario en response.data.user
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiEnc('auth/logout').create({});
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};