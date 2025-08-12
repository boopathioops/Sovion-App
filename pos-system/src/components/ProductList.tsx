import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Product, CartItem } from '../types/index';

interface ProductListProps {
  products: Product[];
  cart: CartItem[];
  handleAddToCart: (product: Product) => void;
  selectedCategory: string | null;
  onQuickView?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, cart, handleAddToCart, selectedCategory, onQuickView }) => (
  <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap={2}>
    {products
      .filter(product => !selectedCategory || product.category === selectedCategory)
      .map(product => {
        const inCart = cart.some(item => item.product.id === product.id);
        return (
          <Card key={product.id} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' }, border: inCart ? '2px solid #34A853' : 'none', boxShadow: inCart ? '0 0 8px #34A85344' : undefined }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
                sx={{ cursor: 'zoom-in', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                aria-label={`View image of ${product.name}`}
                onClick={onQuickView ? () => onQuickView(product) : undefined}
              />
              {inCart && (
                <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'success.main', color: 'white', px: 1, borderRadius: 1, fontSize: 12 }}>
                  In Cart
                </Box>
              )}
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h6">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹{(product.price || 0).toFixed(2)}
              </Typography>
              <Button
                variant={inCart ? 'contained' : 'outlined'}
                color={inCart ? 'success' : 'primary'}
                startIcon={<AddIcon />}
                onClick={() => handleAddToCart(product)}
                sx={{ mt: 1, width: '100%' }}
                aria-label={`Add ${product.name} to cart`}
                disabled={inCart}
              >
                {inCart ? 'Added' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
  </Box>
);

export default ProductList; 