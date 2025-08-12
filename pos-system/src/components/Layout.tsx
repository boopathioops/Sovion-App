import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as SalesIcon,
  Receipt as TransactionsIcon,
  Assessment as ReportsIcon,
  Inventory as ProductsIcon,
  People as CustomersIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../theme';
import { Link } from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsDrawer from './NotificationsDrawer';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/', badge: null },
  { text: 'Sales', icon: <SalesIcon />, path: '/sales', badge: 'New' },
  { text: 'Transactions', icon: <TransactionsIcon />, path: '/transactions', badge: null },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports', badge: null },
  { text: 'Products', icon: <ProductsIcon />, path: '/products', badge: null },
  { text: 'Customers', icon: <CustomersIcon />, path: '/customers', badge: null },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings', badge: null },
];

const userRole = 'admin'; // Change to 'staff' or 'user' to test different roles

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode } = useThemeMode();
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: sidebarOpen ? 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)' : 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            width: 40,
            height: 40,
            fontSize: '1.2rem',
            fontWeight: 600,
          }}
        >
          S
        </Avatar>
        {sidebarOpen && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              Sovion POS
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Point of Sale System
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                  color: isActive(item.path) ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? 'primary.dark' : 'rgba(66,133,244,0.08)',
                    color: isActive(item.path) ? 'white' : 'primary.main',
                  },
                  transition: 'all 0.2s',
                  py: 1.7,
                  px: sidebarOpen ? 2 : 0,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  minWidth: 0,
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: isActive(item.path) ? '1.1rem' : '1rem',
                  boxShadow: isActive(item.path) ? '0 2px 8px rgba(66,133,244,0.08)' : 'none',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                    minWidth: 40,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive(item.path) ? 600 : 500,
                      },
                    }}
                  />
                )}
                {item.badge && sidebarOpen && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      backgroundColor: 'secondary.main',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          {sidebarOpen && (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                admin@sovion.com
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 64}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 64}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderBottom: '1.5px solid #e0e0e0',
          minHeight: 72,
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" aria-label="home">
              <DashboardIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="notifications" onClick={() => setNotificationsDrawerOpen(true)}>
              <NotificationsIcon />
            </IconButton>
            <NotificationsDrawer open={notificationsDrawerOpen} onClose={() => setNotificationsDrawerOpen(false)} />
            <IconButton color="inherit" aria-label="cart">
              <SalesIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="profile" onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
            </Menu>
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: sidebarOpen ? drawerWidth : 64 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarOpen ? drawerWidth : 64,
              border: 'none',
              overflowX: 'hidden',
              transition: 'width 0.2s',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 5 },
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 64}px)` },
          mt: '72px',
          minHeight: 'calc(100vh - 72px)',
          background: 'background.default',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 