import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  TextField,
  Button,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useThemeMode, ThemeColor } from '../theme';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [storeSettings, setStoreSettings] = useState({
    name: 'My Store',
    address: '123 Main St',
    phone: '+1 234 567 890',
    email: 'store@example.com',
    currency: 'INR',
    taxRate: '8.5',
  });

  const [theme, setTheme] = useState('light');

  const themeColors: ThemeColor[] = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];

  const { mode, setMode, primaryColor, setPrimaryColor } = useThemeMode();

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleStoreSettingChange = (
    field: keyof typeof storeSettings,
    value: string
  ) => {
    setStoreSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Store Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Store Name"
                fullWidth
                value={storeSettings.name}
                onChange={(e) =>
                  handleStoreSettingChange('name', e.target.value)
                }
              />
              <TextField
                label="Address"
                fullWidth
                value={storeSettings.address}
                onChange={(e) =>
                  handleStoreSettingChange('address', e.target.value)
                }
              />
              <TextField
                label="Phone"
                fullWidth
                value={storeSettings.phone}
                onChange={(e) =>
                  handleStoreSettingChange('phone', e.target.value)
                }
              />
              <TextField
                label="Email"
                fullWidth
                value={storeSettings.email}
                onChange={(e) =>
                  handleStoreSettingChange('email', e.target.value)
                }
              />
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={storeSettings.currency}
                  label="Currency"
                  onChange={(e) =>
                    handleStoreSettingChange('currency', e.target.value)
                  }
                >
                  <MenuItem value="INR">INR (₹)</MenuItem>
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Tax Rate (%)"
                fullWidth
                type="number"
                value={storeSettings.taxRate}
                onChange={(e) =>
                  handleStoreSettingChange('taxRate', e.target.value)
                }
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <Switch
                  edge="end"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive push notifications"
                />
                <Switch
                  edge="end"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive notifications via SMS"
                />
                <Switch
                  edge="end"
                  checked={notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        <Box>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Theme"
                  secondary="Choose your preferred theme and color"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
                    />
                  }
                  label="Dark Mode"
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Theme Color" secondary="Select a primary color" />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {themeColors.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: color,
                        border: primaryColor === color ? '3px solid #222' : '2px solid #eee',
                        cursor: 'pointer',
                        transition: 'border 0.2s',
                        boxShadow: primaryColor === color ? '0 0 0 2px #222' : 'none',
                      }}
                    />
                  ))}
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Language"
                  secondary="Select your preferred language"
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <Select value="en" size="small">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security"
                />
                <Switch edge="end" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Security"
                  secondary="Manage payment security settings"
                />
                <Button variant="outlined" size="small">
                  Configure
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings; 