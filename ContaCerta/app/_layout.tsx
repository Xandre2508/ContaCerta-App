import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // 1. Carrega a sessão inicial do Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Controla a navegação com base na sessão
  useEffect(() => {
    if (!isInitialized) return; // Espera que o Supabase responda

    // Verifica se o utilizador está a tentar aceder a um ecrã do grupo (auth)
    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // Se tem sessão ativa e está na página de login, manda para o feed
      router.replace('/(tabs)/feed');
    } else if (!session && !inAuthGroup) {
      // Se não tem sessão e está a tentar aceder à app, manda para o login
      router.replace('/(auth)/login');
    }
  }, [session, isInitialized, segments]);

  // Removemos o "return null" para a Stack poder ser montada e o Router funcionar
  return <Stack screenOptions={{ headerShown: false }} />;
}