import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Summary() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, profiles(full_name)')
    if (!error && data) setExpenses(data)
    setLoading(false)
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const byCategory = expenses.reduce((acc: any, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
    return acc
  }, {})

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1D9E75" />
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Resumo do mês</Text>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total gasto</Text>
        <Text style={styles.totalAmount}>€{total.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Por categoria</Text>
      {Object.entries(byCategory).map(([cat, val]: any) => (
        <View key={cat} style={styles.row}>
          <Text style={styles.rowCat}>{cat}</Text>
          <Text style={styles.rowVal}>€{val.toFixed(2)}</Text>
        </View>
      ))}

      {Object.keys(byCategory).length === 0 && (
        <Text style={styles.empty}>Ainda não há despesas este mês.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1D9E75', marginBottom: 20 },
  totalCard: { backgroundColor: '#1D9E75', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  totalLabel: { color: '#fff', fontSize: 14, opacity: 0.8, marginBottom: 4 },
  totalAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 12 },
  row: { backgroundColor: '#fff', borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderWidth: 0.5, borderColor: '#eee' },
  rowCat: { fontSize: 14, color: '#444' },
  rowVal: { fontSize: 14, fontWeight: '600', color: '#1D9E75' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 },
})