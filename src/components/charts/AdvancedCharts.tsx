import React from 'react';
import {
  LineChart,
  BarChart,
  AreaChart,
  ScatterChart,
  Line,
  Bar,
  Area,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'scatter';
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

interface AdvancedChartsProps {
  config: ChartConfig;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ config }) => {
  const renderChart = () => {
    const commonProps = {
      data: config.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (config.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={config.yKey} stroke={config.color || "#8884d8"} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={config.yKey} fill={config.color || "#8884d8"} />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={config.yKey} fill={config.color || "#8884d8"} />
          </AreaChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Scatter name={config.yKey} data={config.data} fill={config.color || "#8884d8"} />
          </ScatterChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      {renderChart()}
    </ResponsiveContainer>
  );
}; 
