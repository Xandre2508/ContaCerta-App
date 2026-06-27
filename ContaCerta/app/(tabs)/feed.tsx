import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Feed() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })

    if (!error && data) setExpenses(data)
    setLoading(false)
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1D9E75" />
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Despesas da família</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.description}>{item.description || 'Sem descrição'}</Text>
              <Text style={styles.person}>{item.profiles?.full_name}</Text>
            </View>
            <Text style={styles.amount}>€{Number(item.amount).toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Ainda não há despesas.</Text>
            <Text style={styles.emptySubText}>Adiciona a primeira!</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1D9E75', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.5, borderColor: '#eee' },
  cardLeft: { flex: 1 },
  category: { fontSize: 13, color: '#1D9E75', fontWeight: '600', marginBottom: 2 },
  description: { fontSize: 15, fontWeight: '500', color: '#222', marginBottom: 2 },
  person: { fontSize: 12, color: '#999' },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333' },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 4 },
})