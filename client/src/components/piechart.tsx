// src/components/PieChart.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  VictoryPie, 
  VictoryTheme,
  VictoryTooltip
} from 'victory';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface PieChartDataPoint {
  x: string;
  y: number;
  label?: string;
}

interface PieChartProps {
  endpoint?: string;
  width?: number;
  height?: number;
  colors?: string[];
  title?: string;
  refreshInterval?: number;
  innerRadius?: number;
}

const PieChart: React.FC<PieChartProps> = ({ 
  endpoint = 'http://localhost:3000/api/pie-data',
  width = screenWidth - 40,
  height = 300,
  colors = ['#c43a31', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'],
  title = 'Pie Chart',
  refreshInterval,
  innerRadius = 0
}) => {
  const [data, setData] = useState<PieChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChartData();
    
    // Set up auto-refresh if interval is provided
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchChartData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, refreshInterval]);

  const fetchChartData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: PieChartDataPoint[] = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching pie chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading {title}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading {title}</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No data available for {title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <VictoryPie
        data={data}
        width={width}
        height={height}
        theme={VictoryTheme.material}
        colorScale={colors}
        innerRadius={innerRadius}
        labelRadius={({ innerRadius }) => (innerRadius as number) + 60}
        labelComponent={<VictoryTooltip />}
        animate={{
          duration: 1000,
          onLoad: { duration: 500 }
        }}
        style={{
          labels: { fontSize: 12, fill: '#333' }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});

export default PieChart;