import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['🛒 Supermercado', '🍽️ Restaurante', '⛽ Combustível', '💊 Farmácia', '🎉 Lazer', '📱 Tecnologia', '🏠 Casa', '👗 Roupa', '📚 Educação', '❓ Outro']

export default function Add() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    if (!amount || !category) {
      Alert.alert('Atenção', 'Preenche o valor e a categoria.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: member } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user?.id)
      .single()

    if (!member) {
      Alert.alert('Erro', 'Ainda não pertences a nenhuma família.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('expenses').insert({
      amount: parseFloat(amount),
      description,
      category,
      family_id: member.family_id,
      paid_by: user?.id,
    })

    if (error) Alert.alert('Erro', error.message)
    else {
      Alert.alert('Sucesso', 'Despesa adicionada!')
      setAmount('')
      setDescription('')
      setCategory('')
    }
    setLoading(false)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Nova despesa</Text>

      <Text style={styles.label}>Valor (€)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Compras no Continente"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBtn, category === cat && styles.catBtnActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdd} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar despesa</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1D9E75', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 16, backgroundColor: '#fff' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  catBtnActive: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
  catText: { fontSize: 13, color: '#444' },
  catTextActive: { color: '#fff' },
  button: { backgroundColor: '#1D9E75', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 40 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})