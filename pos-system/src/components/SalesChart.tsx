import React from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';

interface SalesChartProps {
  chartType: string;
  timeRange: string;
  chartDataState: any;
  barChartDataState: any;
  chartOptions: any;
  barChartOptions: any;
  setChartType: (type: string) => void;
  setTimeRange: (range: string) => void;
}

const SalesChart: React.FC<SalesChartProps> = ({
  chartType,
  timeRange,
  chartDataState,
  barChartDataState,
  chartOptions,
  barChartOptions,
  setChartType,
  setTimeRange,
}) => {
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartDataState} options={chartOptions} height={300} />;
      case 'bar':
        return <Bar data={barChartDataState} options={barChartOptions} height={300} />;
      default:
        return <Line data={chartDataState} options={chartOptions} height={300} />;
    }
  };
  return (
    <Card sx={{ mb: 4, boxShadow: 3 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'secondary.main', letterSpacing: 0.5 }}>
            Sales Overview
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_, value) => value && setChartType(value)}
              size="small"
              aria-label="Chart Type Switcher"
            >
              <ToggleButton value="line" aria-label="Line Chart">Line</ToggleButton>
              <ToggleButton value="bar" aria-label="Bar Chart">Bar</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={(_, value) => value && setTimeRange(value)}
              size="small"
              aria-label="Time Range Switcher"
            >
              <ToggleButton value="week" aria-label="This Week">This Week</ToggleButton>
              <ToggleButton value="month" aria-label="This Month">This Month</ToggleButton>
              <ToggleButton value="year" aria-label="This Year">This Year</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <Box sx={{ flex: 1, width: '100%', minHeight: 300 }}>
          {(() => {
            const chartProps = { options: { ...chartType === 'bar' ? barChartOptions : chartOptions, maintainAspectRatio: false } };
            switch (chartType) {
              case 'line':
                return <Line data={chartDataState} {...chartProps} />;
              case 'bar':
                return <Bar data={barChartDataState} {...chartProps} />;
              default:
                return <Line data={chartDataState} {...chartProps} />;
            }
          })()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart; 