import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#00c49f'];

export default function PaymentStatsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/payments/stats') // 👈 Update to your actual backend URL
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text>Loading payment statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Payment Dashboard</Text>

      {/* 📌 Summary */}
      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue:</Text>
        <Text style={styles.value}>₹ {stats.totalRevenue.toFixed(2)}</Text>

        <Text style={styles.label}>Failed Transactions:</Text>
        <Text style={styles.value}>{stats.failedTransactions}</Text>

        <Text style={styles.label}>Payments Today:</Text>
        <Text style={styles.value}>{stats.totalPaymentsToday}</Text>

        <Text style={styles.label}>Payments This Week:</Text>
        <Text style={styles.value}>{stats.totalPaymentsThisWeek}</Text>
      </View>

      {/* 📈 Revenue Trend */}
      <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={stats.revenueChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      {/* 🥧 Method Breakdown */}
      <Text style={styles.chartTitle}>Payments by Method</Text>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={stats.paymentsByMethod}
            dataKey="count"
            nameKey="method"
            outerRadius={90}
            label
          >
            {stats.paymentsByMethod.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 24,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
