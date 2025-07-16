import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import ApiService from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function PaymentStatsScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getPaymentStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Revenue (Last 7 Days)</Text>
      <LineChart
        data={{
          labels: stats.revenueChart.map((r: any) =>
            new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          ),
          datasets: [{ data: stats.revenueChart.map((r: any) => Number(r.total)) }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Text style={styles.title}>Payments by Method</Text>
      <PieChart
        data={stats.byMethod.map((m: any, i: number) => ({
          name: m.method,
          population: Number(m.count),
          color: colors[i % colors.length],
          legendFontColor: '#000',
        }))}
        width={screenWidth - 40}
        height={220}
        accessor="population"
      />

      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <Text>Total Revenue</Text>
          <Text>{stats.totalRevenue}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text>Failed Payments</Text>
          <Text>{stats.failedCount}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text>Today's Payments</Text>
          <Text>{stats.todayCount}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
};

const colors = ['#4caf50', '#03a9f4', '#ff9800', '#f44336'];

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  chart: { borderRadius: 16, marginVertical: 20 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  metricCard: { alignItems: 'center', flex: 1 },
});
