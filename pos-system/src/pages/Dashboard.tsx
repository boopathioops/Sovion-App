import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  IconButton,
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tooltip,
  Alert,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Fade,
  Grow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as SalesIcon,
  Receipt as OrdersIcon,
  AttachMoney as MoneyIcon,
  People as CustomersIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  CloudDownload as CloudDownloadIcon,
  WbSunny as WeatherIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import TopProductsList from '../components/TopProductsList';
import TopCustomersList from '../components/TopCustomersList';
import RecentTransactionsList from '../components/RecentTransactionsList';
import SalesChart from '../components/SalesChart';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// TypeScript interfaces
export interface Product {
  name: string;
  sales: number;
  revenue: number;
}

export interface Customer {
  name: string;
  orders: number;
  spent: number;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: string;
  time: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'order' | 'warning' | 'success';
  time: string;
}

interface QuickAction {
  icon: React.ReactNode;
  name: string;
  color: string;
}

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#4285F4' },
  { name: 'Clothing', value: 25, color: '#34A853' },
  { name: 'Books', value: 20, color: '#FBBC05' },
  { name: 'Home', value: 15, color: '#EA4335' },
  { name: 'Sports', value: 5, color: '#9C27B0' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', time: '2 min ago' },
  { id: '#ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'processing', time: '5 min ago' },
  { id: '#ORD-003', customer: 'Bob Johnson', amount: 89.99, status: 'pending', time: '12 min ago' },
  { id: '#ORD-004', customer: 'Alice Brown', amount: 199.99, status: 'completed', time: '15 min ago' },
];

const notifications = [
  { id: 1, message: 'New order received from John Doe', type: 'order', time: '2 min ago' },
  { id: 2, message: 'Low stock alert: Product XYZ', type: 'warning', time: '10 min ago' },
  { id: 3, message: 'Payment received for order #ORD-001', type: 'success', time: '15 min ago' },
];

// Enhanced data for real-time simulation
const weatherData = {
  temperature: 28,
  condition: 'Sunny',
  humidity: 65,
  location: 'Mumbai, India'
};

const quickActions = [
  { icon: <AddIcon />, name: 'New Order', color: '#4285F4' },
  { icon: <PrintIcon />, name: 'Print Report', color: '#34A853' },
  { icon: <EmailIcon />, name: 'Send Email', color: '#FBBC05' },
  { icon: <CloudDownloadIcon />, name: 'Backup Data', color: '#EA4335' },
];

const topProducts = [
  { name: 'iPhone 13 Pro', sales: 45, revenue: 225000 },
  { name: 'Samsung Galaxy S21', sales: 38, revenue: 190000 },
  { name: 'MacBook Pro', sales: 32, revenue: 320000 },
];

const topCustomers = [
  { name: 'John Doe', orders: 12, spent: 12000 },
  { name: 'Jane Smith', orders: 10, spent: 9500 },
  { name: 'Bob Johnson', orders: 8, spent: 8000 },
];

const recentTransactions = [
  { id: '#ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', time: '2 min ago' },
  { id: '#ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'processing', time: '5 min ago' },
  { id: '#ORD-003', customer: 'Bob Johnson', amount: 89.99, status: 'pending', time: '12 min ago' },
];

// Chart.js data configurations
const chartData = {
  labels: salesData.map(item => item.name),
  datasets: [
    {
      label: 'Sales',
      data: salesData.map(item => item.sales),
      borderColor: '#4285F4',
      backgroundColor: 'rgba(66, 133, 244, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4285F4',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ]
};

const barChartData = {
  labels: salesData.map(item => item.name),
  datasets: [
    {
      label: 'Sales',
      data: salesData.map(item => item.sales),
      backgroundColor: 'rgba(66, 133, 244, 0.8)',
      borderColor: '#4285F4',
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    }
  ]
};

const doughnutData = {
  labels: categoryData.map(item => item.name),
  datasets: [
    {
      data: categoryData.map(item => item.value),
      backgroundColor: categoryData.map(item => item.color),
      borderColor: categoryData.map(item => item.color),
      borderWidth: 2,
      hoverOffset: 4,
    }
  ]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#eee' } },
  },
};

const barChartOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    y: {
      ...chartOptions.scales.y,
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#374151',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed;
          return `${label}: ${value}%`;
        },
      },
    },
  },
  cutout: '60%',
};

export const statusUtils = {
  getColor: (status: string) => {
    switch (status) {
      case 'completed': return 'success.main';
      case 'processing': return 'warning.main';
      case 'pending': return 'info.main';
      default: return 'grey.500';
    }
  },
  getIcon: (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'processing': return <ShippingIcon />;
      case 'pending': return <InventoryIcon />;
      default: return <WarningIcon />;
    }
  }
};

// Animated counter hook
function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    let frame: number;
    function animate() {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        frame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return count;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  index: number;
}> = ({ title, value, icon, color, index }) => {
  const countUpValue = useCountUp(typeof value === 'number' ? value as number : 0);
  const animatedValue = typeof value === 'number' ? countUpValue : value;
  return (
    <Fade in timeout={600 + index * 200}>
      <Card elevation={3} sx={{ transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: { xs: 2, sm: 3 } }}>
          <Avatar sx={{ bgcolor: color, mb: 2, color: 'white' }}>{icon}</Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{animatedValue}</Typography>
        </CardContent>
      </Card>
    </Fade>
  );
};

const salesDataWeek = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];
const salesDataMonth = [
  { name: 'W1', sales: 12000 },
  { name: 'W2', sales: 15000 },
  { name: 'W3', sales: 11000 },
  { name: 'W4', sales: 17000 },
];
const salesDataYear = [
  { name: 'Jan', sales: 40000 },
  { name: 'Feb', sales: 35000 },
  { name: 'Mar', sales: 42000 },
  { name: 'Apr', sales: 39000 },
  { name: 'May', sales: 45000 },
  { name: 'Jun', sales: 47000 },
  { name: 'Jul', sales: 43000 },
  { name: 'Aug', sales: 41000 },
  { name: 'Sep', sales: 48000 },
  { name: 'Oct', sales: 50000 },
  { name: 'Nov', sales: 47000 },
  { name: 'Dec', sales: 52000 },
];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [chartType, setChartType] = useState('line');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [chartDataState, setChartDataState] = useState(chartData);
  const [barChartDataState, setBarChartDataState] = useState(barChartData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [quickActionLoading, setQuickActionLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(notifications.length);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate data fetch on mount
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let data, barData;
    if (timeRange === 'week') {
      data = salesDataWeek;
    } else if (timeRange === 'month') {
      data = salesDataMonth;
    } else {
      data = salesDataYear;
    }
    setChartDataState({
      labels: data.map(item => item.name),
      datasets: [
        {
          label: 'Sales',
          data: data.map(item => item.sales),
          borderColor: '#4285F4',
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4285F4',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ]
    });
    setBarChartDataState({
      labels: data.map(item => item.name),
      datasets: [
        {
          label: 'Sales',
          data: data.map(item => item.sales),
          backgroundColor: 'rgba(66, 133, 244, 0.8)',
          borderColor: '#4285F4',
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    });
  }, [timeRange]);

  // Simulate data refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setDialogContent({
        title: 'Data Refreshed',
        message: 'All dashboard data has been updated successfully!'
      });
      setDialogOpen(true);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    setQuickActionLoading(true);
    setSnackbarMsg(`${action} action has been triggered successfully!`);
    setSnackbarOpen(true);
    setTimeout(() => {
      setQuickActionLoading(false);
    }, 1200);
  };

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ width: 200 }}>
          <LinearProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Fade in timeout={900}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, letterSpacing: 1, color: 'primary.main' }}>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <StatCard title="Today's Sales" value={2500} icon={<SalesIcon />} color="primary.main" index={0} />
          <StatCard title="Total Orders" value={150} icon={<OrdersIcon />} color="success.main" index={1} />
          <StatCard title="Average Order" value={16.67} icon={<MoneyIcon />} color="warning.main" index={2} />
          <StatCard title="New Customers" value={25} icon={<CustomersIcon />} color="error.main" index={3} />
        </Box>

        {/* Sales Chart */}
        <Grow in timeout={1200}>
          <Box>
            <SalesChart
              chartType={chartType}
              timeRange={timeRange}
              chartDataState={chartDataState}
              barChartDataState={barChartDataState}
              chartOptions={chartOptions}
              barChartOptions={barChartOptions}
              setChartType={setChartType}
              setTimeRange={setTimeRange}
            />
          </Box>
        </Grow>

        {/* Top Products & Top Customers */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <TopProductsList products={topProducts} />
          <TopCustomersList customers={topCustomers} />
        </Box>

        {/* Recent Transactions */}
        <RecentTransactionsList transactions={recentTransactions} />

        {/* Quick Actions Speed Dial */}
        <SpeedDial
          ariaLabel="Quick Actions Speed Dial"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          open={showQuickActions}
          onOpen={() => setShowQuickActions(true)}
          onClose={() => setShowQuickActions(false)}
          //disabled={quickActionLoading}
        >
          {quickActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              aria-label={action.name}
              onClick={() => handleQuickAction(action.name)}
              sx={{
                bgcolor: action.color,
                color: 'white',
                '&:hover': {
                  bgcolor: action.color,
                  opacity: 0.8,
                },
              }}
            />
          ))}
        </SpeedDial>

        {/* Menus */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 150 }
          }}
        >
          <MenuItem onClick={() => { setTimeRange('week'); handleMenuClose(); }}>
            This Week
          </MenuItem>
          <MenuItem onClick={() => { setTimeRange('month'); handleMenuClose(); }}>
            This Month
          </MenuItem>
          <MenuItem onClick={() => { setTimeRange('year'); handleMenuClose(); }}>
            This Year
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { borderRadius: 2, minWidth: 300, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <Button size="small" onClick={handleMarkAllRead} disabled={unreadNotifications === 0}>Mark all as read</Button>
          </Box>
          {notifications.map((notification, idx) => (
            <MenuItem key={notification.id} sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: notification.type === 'warning' ? 'warning.main' : 
                           notification.type === 'success' ? 'success.main' : 'info.main'
                }}>
                  {notification.type === 'warning' ? <WarningIcon /> :
                   notification.type === 'success' ? <CheckCircleIcon /> : <NotificationsIcon />}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Action Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {dialogContent.title}
            <IconButton onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {dialogContent.message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} variant="contained">
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        {/* CSS for spinning animation */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
};

export default Dashboard; 