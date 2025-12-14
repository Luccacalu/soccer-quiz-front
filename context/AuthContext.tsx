import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { jwtDecode } from "jwt-decode";
import { api } from '../services/api';

interface AuthContextProps {
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
  user: any;
  loading: boolean;
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const decoded: any = jwtDecode(token);
          setUser(decoded);
        }
      } catch (error) {
        console.log("Erro ao carregar token", error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      if (user.role === 'admin') {
        router.replace('/(admin)/home-admin');
      } else {
        router.replace('/(app)/home');
      }
    } else if (!user && !inAuthGroup) {
      router.replace('/login');
    }
  }, [user, loading, segments]);

  async function signIn(email: string, pass: string) {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', pass);

      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token } = response.data;

      await AsyncStorage.setItem('access_token', access_token);

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const decoded: any = jwtDecode(access_token);
      setUser(decoded);

    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('access_token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);