import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    category: 'Category A',
    price: 29.99,
    stock: 100,
    sku: 'SKU001',
  },
  {
    id: 2,
    name: 'Product 2',
    category: 'Category B',
    price: 39.99,
    stock: 50,
    sku: 'SKU002',
  },
  {
    id: 3,
    name: 'Product 3',
    category: 'Category A',
    price: 19.99,
    stock: 75,
    sku: 'SKU003',
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 130,
      valueFormatter: (params: { value: number }) => {
        const value = params.value;
        return value !== null && value !== undefined ? `₹${value.toFixed(2)}` : '₹0.00';
      },
    },
    { field: 'stock', headerName: 'Stock', width: 130 },
    { field: 'sku', headerName: 'SKU', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      sku: '',
    });
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      sku: '',
    });
  };

  const handleSave = () => {
    if (selectedProduct) {
      setProducts(
        products.map((p) => 
          p.id === selectedProduct.id 
            ? { ...formData, id: selectedProduct.id }
            : p
        )
      );
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { ...formData, id: newId }]);
    }
    handleClose();
  };

  const handleFormChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your product inventory and catalog
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Paper 
          sx={{ 
            p: 2, 
            flex: 1, 
            mr: 2,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />
        </Paper>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      <Paper 
        sx={{ 
          height: 600, 
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <DataGrid
          rows={filteredProducts}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid rgba(0, 0, 0, 0.05)',
              '& .MuiDataGrid-columnHeader': {
                fontWeight: 600,
              },
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.04)',
            },
          }}
        />
      </Paper>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          fontWeight: 600,
        }}>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Product Name"
              fullWidth
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
            <TextField
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) => handleFormChange('category', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
            <TextField
              label="Stock"
              type="number"
              fullWidth
              value={formData.stock}
              onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
            <TextField
              label="SKU"
              fullWidth
              value={formData.sku}
              onChange={(e) => handleFormChange('sku', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products; 