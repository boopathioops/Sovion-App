import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, Badge, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';

const mockNotifications = [
  { id: 1, message: 'New order received from John Doe', type: 'order', time: '2 min ago', read: false },
  { id: 2, message: 'Low stock alert: Product XYZ', type: 'warning', time: '10 min ago', read: false },
  { id: 3, message: 'Payment received for order #ORD-001', type: 'success', time: '15 min ago', read: true },
];

function getIcon(type: string) {
  switch (type) {
    case 'warning': return <WarningIcon color="warning" />;
    case 'success': return <CheckCircleIcon color="success" />;
    default: return <InfoIcon color="info" />;
  }
}

const NotificationsDrawer: React.FC<{ open: boolean; onClose: () => void; }>
  = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleToggleRead = (id: number) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
          <Button size="small" onClick={handleMarkAllRead}>Mark all as read</Button>
        </Box>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} alignItems="flex-start" sx={{ bgcolor: notification.read ? 'background.paper' : 'rgba(66,133,244,0.08)' }}>
              <ListItemAvatar>
                <Avatar>
                  {getIcon(notification.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.message}
                secondary={notification.time}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleToggleRead(notification.id)}>
                  {notification.read ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default NotificationsDrawer; 