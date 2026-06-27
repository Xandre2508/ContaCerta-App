import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function Settings() {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) Alert.alert('Erro', error.message)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Definições</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Terminar sessão</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1D9E75', marginBottom: 32 },
  button: { backgroundColor: '#ff4444', borderRadius: 10, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})