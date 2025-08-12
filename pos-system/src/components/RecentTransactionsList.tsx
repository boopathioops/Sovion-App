import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemAvatar, Avatar, Divider, ListItemText } from '@mui/material';
import { Transaction } from '../pages/Dashboard';
import { getColor, getIcon } from '../utils/statusUtils';


const RecentTransactionsList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => (
  <Card elevation={2}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
        Recent Transactions
      </Typography>
      <Box sx={{ overflowX: { xs: 'auto', md: 'visible' } }}>
        <List sx={{ minWidth: 320 }}>
          {transactions.map((tx, idx) => (
            <React.Fragment key={tx.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getColor(tx.status), color: 'white' }}>{getIcon(tx.status)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{tx.customer}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>₹{tx.amount}</Typography>
                    </Box>
                  }
                  secondary={tx.time}
                />
              </ListItem>
              {idx < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </CardContent>
  </Card>
);

export default RecentTransactionsList; 