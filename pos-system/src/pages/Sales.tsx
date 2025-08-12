import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Autocomplete,
  Collapse,
  Snackbar,
  Alert,
  Stack,
  Grid,
  Fade,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import CategoryFilter from '../components/CategoryFilter';
import { Product, CartItem } from '../types/index';

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 29.99,
    image: 'https://via.placeholder.com/150',
    category: 'Category A',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 39.99,
    image: 'https://via.placeholder.com/150',
    category: 'Category B',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 19.99,
    image: 'https://via.placeholder.com/150',
    category: 'Category A',
  },
];

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

const Sales: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sales_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('sales_searchTerm') || '');
  const categories = Array.from(new Set(initialProducts.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const saved = localStorage.getItem('sales_selectedCategory');
    return saved ? saved : null;
  });
  const [barcode, setBarcode] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'error' }>({ open: false, message: '' });
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [lastRemoved, setLastRemoved] = useState<CartItem | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // Save cart, searchTerm, and selectedCategory to localStorage
  useEffect(() => {
    localStorage.setItem('sales_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('sales_searchTerm', searchTerm);
  }, [searchTerm]);
  useEffect(() => {
    if (selectedCategory)
      localStorage.setItem('sales_selectedCategory', selectedCategory);
    else
      localStorage.removeItem('sales_selectedCategory');
  }, [selectedCategory]);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setSnackbar({ open: true, message: `${product.name} added to cart`, severity: 'success' });
  };

  const handleRemoveFromCart = (productId: string) => {
    const removedItem = cart.find(item => item.product.id === productId) || null;
    setLastRemoved(removedItem);
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setSnackbar({ open: true, message: `${removedItem?.product.name || 'Product'} removed from cart`, severity: 'info' });
  };

  const handleUndoRemove = () => {
    if (lastRemoved) {
      setCart((prevCart) => [...prevCart, lastRemoved]);
      setSnackbar({ open: true, message: `${lastRemoved.product.name} restored to cart`, severity: 'success' });
      setLastRemoved(null);
    }
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const avgOrder = cart.length ? total / cart.length : 0;
  const animatedTotal = useCountUp(total);
  const animatedItems = useCountUp(totalItems);
  const animatedAvg = useCountUp(avgOrder);

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode.trim()) {
      const foundProduct = products.find(p => p.barcode === barcode.trim());
      if (foundProduct) {
        handleAddToCart(foundProduct);
        setBarcode('');
      } else {
        setSnackbar({ open: true, message: 'Product not found for barcode', severity: 'error' });
      }
    }
  };

  // Print/Export functionality (simple window.print for now)
  const handlePrint = () => {
    window.print();
  };

  // Handle payment and print receipt
  const handleConfirmAndComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessDialogOpen(true);
      setCart([]);
      setCheckoutDialogOpen(false);
      setSnackbar({ open: true, message: 'Order completed!', severity: 'success' });
      setTimeout(() => {
        handlePrint();
      }, 500);
    }, 1800);
  };

  // Product quick view modal open/close
  const handleQuickViewOpen = (product: Product) => setQuickViewProduct(product);
  const handleQuickViewClose = () => setQuickViewProduct(null);

  return (
    <Box>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Sales
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process sales, scan barcodes, and manage your cart
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ textTransform: 'none' }}>Refresh</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }} onClick={handlePrint}>Export</Button>
          <Button variant="outlined" startIcon={<PrintIcon />} sx={{ textTransform: 'none' }} onClick={handlePrint}>Print Receipt</Button>
        </Stack>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Fade in timeout={700}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <MonetizationOnIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">Today's Sales</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>₹{animatedTotal.toFixed(2)}</Typography>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Fade in timeout={900}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <ShoppingCartIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">Total Items</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{animatedItems}</Typography>
            </Paper>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Fade in timeout={1100}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <ListAltIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">Avg. Order Value</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>₹{animatedAvg.toFixed(2)}</Typography>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Filters & Search */}
      <Fade in timeout={1200}>
        <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <TextField
              label="Scan or Enter Barcode"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeInput}
              variant="outlined"
              size="small"
              aria-label="Barcode input"
              sx={{ maxWidth: 300 }}
            />
            <Button variant="outlined" startIcon={<QrCodeScannerIcon />} sx={{ textTransform: 'none' }}>
              Scan Barcode
            </Button>
            <TextField
              label="Search Products"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ flex: 1, minWidth: 220 }}
            />
          </Stack>
        </Paper>
      </Fade>

      {/* Product List & Cart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Fade in timeout={1400}>
            <Box>
              <ProductList
                products={filteredProducts}
                cart={cart}
                handleAddToCart={handleAddToCart}
                selectedCategory={selectedCategory}
                onQuickView={handleQuickViewOpen}
              />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} md={4}>
          <Fade in timeout={1600}>
            <Box>
              <Cart
                cart={cart}
                handleRemoveFromCart={handleRemoveFromCart}
                handleClearCart={() => setCart([])}
                handleUpdateQuantity={handleUpdateQuantity}
              />
              {/* Order Notes */}
              <TextField
                label="Order Notes"
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                multiline
                minRows={2}
                fullWidth
                sx={{ mt: 2 }}
              />
              {/* Empty State Illustration */}
              {cart.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                  <InfoOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body1">Your cart is empty. Add products to get started!</Typography>
                </Box>
              )}
            </Box>
          </Fade>
        </Grid>
      </Grid>

      {/* Floating Action Button for Checkout */}
      <Zoom in={cart.length > 0}>
        <Fab
          color="primary"
          aria-label="checkout"
          sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}
          onClick={() => setCheckoutDialogOpen(true)}
        >
          <ShoppingCartCheckoutIcon />
        </Fab>
      </Zoom>

      {/* Checkout Dialog */}
      <Dialog
        open={checkoutDialogOpen}
        onClose={() => setCheckoutDialogOpen(false)}
        TransitionComponent={Slide}
        keepMounted
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Checkout
          <IconButton onClick={() => setCheckoutDialogOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Order Summary</Typography>
          {cart.map(item => (
            <Paper key={item.product.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1 }}>
              <img src={item.product.image} alt={item.product.name} width={40} height={40} style={{ borderRadius: 4, marginRight: 12 }} />
              <Typography sx={{ flex: 1 }}>{item.product.name}</Typography>
              <IconButton onClick={() => handleUpdateQuantity(item.product.id, -1)} disabled={item.quantity <= 1}><RemoveIcon /></IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton onClick={() => handleUpdateQuantity(item.product.id, 1)}><AddIcon /></IconButton>
              <IconButton onClick={() => handleRemoveFromCart(item.product.id)}><DeleteIcon /></IconButton>
              <Typography sx={{ minWidth: 60, textAlign: 'right' }}>₹{(item.product.price * item.quantity).toFixed(2)}</Typography>
            </Paper>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">Order Notes: {orderNotes || '-'}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Total: ₹{total.toFixed(2)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleConfirmAndComplete}
            loading={isProcessing}
          >
            Confirm & Complete
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle>Payment Successful</DialogTitle>
        <DialogContent>
          <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>Thank you for your purchase!</Typography>
          <Typography>Your receipt is being printed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Product Quick View Modal */}
      <Dialog open={!!quickViewProduct} onClose={handleQuickViewClose} maxWidth="xs" fullWidth>
        <DialogTitle>{quickViewProduct?.name}</DialogTitle>
        <DialogContent>
          <img src={quickViewProduct?.image} alt={quickViewProduct?.name} width="100%" style={{ borderRadius: 8, marginBottom: 16 }} />
          <Typography variant="body1">Price: ₹{quickViewProduct?.price.toFixed(2)}</Typography>
          <Typography variant="body2" color="text.secondary">Category: {quickViewProduct?.category}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuickViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar with Undo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={lastRemoved && (
          <Button color="secondary" size="small" onClick={handleUndoRemove}>
            UNDO
          </Button>
        )}
      >
        <Alert severity={snackbar.severity || 'info'} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales; 