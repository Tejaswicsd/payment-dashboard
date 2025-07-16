// src/components/Chart.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  VictoryChart, 
  VictoryLine, 
  VictoryAxis, 
  VictoryTheme,
  VictoryTooltip,
  VictoryScatter,
  VictoryArea,
  VictoryBar
} from 'victory';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

interface ChartProps {
  endpoint?: string;
  chartType?: 'line' | 'area' | 'bar';
  width?: number;
  height?: number;
  color?: string;
  title?: string;
  refreshInterval?: number;
}

const Chart: React.FC<ChartProps> = ({ 
  endpoint = 'http://localhost:3000/api/chart-data',
  chartType = 'line',
  width = screenWidth - 40,
  height = 300,
  color = '#c43a31',
  title = 'Chart',
  refreshInterval
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
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
      
      const result: ChartDataPoint[] = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (): JSX.Element => {
    const commonProps = {
      theme: VictoryTheme.material,
      width,
      height,
      padding: { left: 70, top: 20, right: 50, bottom: 60 }
    };

    switch (chartType) {
      case 'line':
        return (
          <VictoryChart {...commonProps}>
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryLine
              data={data}
              style={{
                data: { stroke: color, strokeWidth: 2 }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
            />
            <VictoryScatter
              data={data}
              size={3}
              style={{
                data: { fill: color }
              }}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        );
      
      case 'area':
        return (
          <VictoryChart {...commonProps}>
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryArea
              data={data}
              style={{
                data: { 
                  fill: color, 
                  fillOpacity: 0.3, 
                  stroke: color, 
                  strokeWidth: 2 
                }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
            />
          </VictoryChart>
        );
      
      case 'bar':
        return (
          <VictoryChart {...commonProps}>
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryBar
              data={data}
              style={{
                data: { fill: color }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        );
      
      default:
        return renderChart();
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
      {renderChart()}
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

export default Chart;