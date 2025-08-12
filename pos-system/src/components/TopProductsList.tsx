import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Product } from '../pages/Dashboard';

const TopProductsList: React.FC<{ products: Product[] }> = ({ products }) => (
  <Card elevation={2}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
        Top Products
      </Typography>
      <Box sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <List sx={{ minWidth: 280 }}>
          {products.map((product) => (
            <ListItem key={product.name}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}><InventoryIcon /></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`${product.sales} sold, ₹${product.revenue.toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </CardContent>
  </Card>
);

export default TopProductsList; 