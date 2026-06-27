import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Usado apenas no registo
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login e Registo

  // Função para fazer Login
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Erro ao entrar', error.message);
    setLoading(false);
  }

  // Função para criar nova conta
  async function signUpWithEmail() {
    if (!fullName) {
      Alert.alert('Atenção', 'Por favor, insere o teu nome para o registo.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName, // Isto vai ser apanhado pelo teu Trigger na Base de Dados!
        },
      },
    });

    if (error) {
      Alert.alert('Erro ao registar', error.message);
    } else {
      Alert.alert('Sucesso', 'Conta criada! Já podes entrar.');
      setIsLogin(true); // Volta para a vista de login
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Bem-vindo de volta!' : 'Criar nova conta'}</Text>

      {!isLogin && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="O teu nome completo"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Botão Principal (Entrar ou Registar) */}
      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={isLogin ? signInWithEmail : signUpWithEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.mainButtonText}>{isLogin ? 'Entrar' : 'Registar'}</Text>
        )}
      </TouchableOpacity>

      {/* Botão para alternar entre Login e Registo */}
      <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchButtonText}>
          {isLogin ? 'Não tens conta? Regista-te aqui.' : 'Já tens conta? Entra aqui.'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos básicos para deixar a interface limpa e profissional
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  mainButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});