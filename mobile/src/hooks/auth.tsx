import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signUp(credentials: SignUpCredentials): Promise<void>;
  signIn(credentials: SignInCredentials): Promise<void>;
  updateUser(user: User): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.Authorization = `Bearer ${token[1]}`;

        setData({
          token: token[1],
          user: JSON.parse(user[1]),
        });
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    await api.post('users', {
      name,
      email,
      password,
    });
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [data]
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signUp, signIn, signOut, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Use auth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
