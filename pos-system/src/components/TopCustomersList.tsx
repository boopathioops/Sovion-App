import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Customer } from '../pages/Dashboard';

const TopCustomersList: React.FC<{ customers: Customer[] }> = ({ customers }) => (
  <Card elevation={2}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
        Top Customers
      </Typography>
      <Box sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <List sx={{ minWidth: 280 }}>
          {customers.map((customer) => (
            <ListItem key={customer.name}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}><PersonIcon /></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={customer.name}
                secondary={`${customer.orders} orders, ₹${customer.spent.toLocaleString()} spent`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </CardContent>
  </Card>
);

export default TopCustomersList; 