import React, { useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Divider, Button, Box, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartItem } from '../types/index';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

interface CartProps {
  cart: CartItem[];
  handleRemoveFromCart: (productId: string) => void;
  handleClearCart: () => void;
  handleUpdateQuantity: (productId: string, change: number) => void;
}

const Cart: React.FC<CartProps> = ({ cart, handleRemoveFromCart, handleClearCart, handleUpdateQuantity }) => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [confirmRemove, setConfirmRemove] = useState<{ open: boolean; productId: string | null }>({ open: false, productId: null });
  const [confirmClear, setConfirmClear] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleRemoveClick = (productId: string) => {
    setConfirmRemove({ open: true, productId });
  };
  const handleConfirmRemove = () => {
    if (confirmRemove.productId) {
      handleRemoveFromCart(confirmRemove.productId);
      setSnackbar({ open: true, message: 'Item removed from cart.' });
    }
    setConfirmRemove({ open: false, productId: null });
  };
  const handleClearClick = () => {
    setConfirmClear(true);
  };
  const handleConfirmClear = () => {
    handleClearCart();
    setSnackbar({ open: true, message: 'Cart cleared.' });
    setConfirmClear(false);
  };
  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 100 }, alignSelf: 'flex-start' }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Cart</Typography>
          <Button size="small" color="error" onClick={handleClearClick} aria-label="Clear cart">Clear Cart</Button>
        </Box>
        <List>
          {cart.map((item) => (
            <Collapse key={item.product.id} in={true} timeout={400}>
              <ListItem>
                <ListItemText
                  primary={item.product.name}
                  secondary={`Qty: ${item.quantity} | ₹${((item.product.price || 0) * item.quantity).toFixed(2)}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton aria-label={`Decrease quantity of ${item.product.name}`} onClick={() => handleUpdateQuantity(item.product.id, -1)} disabled={item.quantity <= 1}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton aria-label={`Increase quantity of ${item.product.name}`} onClick={() => handleUpdateQuantity(item.product.id, 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label={`Remove ${item.product.name} from cart`} onClick={() => handleRemoveClick(item.product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider />
            </Collapse>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Subtotal: ₹{subtotal.toFixed(2)}</Typography>
          <Typography variant="body2">Tax (5%): ₹{tax.toFixed(2)}</Typography>
          <Typography variant="h6">Total: ₹{total.toFixed(2)}</Typography>
        </Box>
      </Paper>
      {/* Confirmation Dialogs */}
      <Dialog open={confirmRemove.open} onClose={() => setConfirmRemove({ open: false, productId: null })}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove this item from the cart?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemove({ open: false, productId: null })}>Cancel</Button>
          <Button color="error" onClick={handleConfirmRemove}>Remove</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to clear the cart?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClear(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmClear}>Clear</Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Cart; 