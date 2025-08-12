import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Toolbar,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Search as SearchIcon, Refresh as RefreshIcon, Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';

interface Transaction {
  id: number;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: 'Completed' | 'Pending' | 'Refunded';
  paymentMethod: string;
}

const initialTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-06-01 10:30',
    customer: 'John Doe',
    items: 3,
    total: 89.97,
    status: 'Completed',
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    date: '2024-06-01 11:15',
    customer: 'Jane Smith',
    items: 2,
    total: 49.98,
    status: 'Pending',
    paymentMethod: 'Cash',
  },
  {
    id: 3,
    date: '2024-06-01 12:00',
    customer: 'Bob Johnson',
    items: 5,
    total: 149.95,
    status: 'Refunded',
    paymentMethod: 'Debit Card',
  },
  {
    id: 4,
    date: '2024-06-01 13:20',
    customer: 'Alice Brown',
    items: 1,
    total: 19.99,
    status: 'Completed',
    paymentMethod: 'UPI',
  },
];

const statusColor = {
  Completed: 'success',
  Pending: 'warning',
  Refunded: 'error',
};

const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'UPI'];
const statusOptions = ['Completed', 'Pending', 'Refunded'];

const Transactions: React.FC = () => {
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<Transaction[]>(initialTransactions);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'info'|'error'}>({open: false, message: '', severity: 'success'});
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const theme = useTheme();

  // Filter logic
  const filteredRows = rows.filter(row => {
    const matchesSearch =
      row.customer.toLowerCase().includes(search.toLowerCase()) ||
      row.status.toLowerCase().includes(search.toLowerCase()) ||
      row.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
      row.date.includes(search);
    const matchesStatus = filterStatus ? row.status === filterStatus : true;
    const matchesDate = filterDate ? row.date.startsWith(filterDate) : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 160 },
    { field: 'customer', headerName: 'Customer', width: 180 },
    { field: 'items', headerName: 'Items', width: 90, type: 'number' },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      type: 'number',
      valueFormatter: (params: { value: number }) => `₹${params.value.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColor[params.value as keyof typeof statusColor] as 'success' | 'warning' | 'error' | 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    { field: 'paymentMethod', headerName: 'Payment', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}><EditIcon /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}><DeleteIcon /></IconButton>
        </Stack>
      ),
    },
  ];

  // Handlers
  const handleRowClick = (params: GridRowParams) => {
    setSelected(params.row as Transaction);
    setDetailsOpen(true);
  };
  const handleEdit = (row: Transaction) => {
    setSelected(row);
    setEditOpen(true);
  };
  const handleDelete = (row: Transaction) => {
    setSelected(row);
    setDeleteOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (selected) {
      setRows(rows.filter(r => r.id !== selected.id));
      setSnackbar({open: true, message: 'Transaction deleted', severity: 'success'});
      setDeleteOpen(false);
      setSelected(null);
    }
  };
  const handleAdd = (newTx: Transaction) => {
    setRows([{...newTx, id: rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1}, ...rows]);
    setSnackbar({open: true, message: 'Transaction added', severity: 'success'});
    setAddOpen(false);
  };
  const handleEditSave = (edited: Transaction) => {
    setRows(rows.map(r => r.id === edited.id ? edited : r));
    setSnackbar({open: true, message: 'Transaction updated', severity: 'success'});
    setEditOpen(false);
    setSelected(null);
  };
  const handleExportCSV = () => {
    const csv = [
      ['ID','Date','Customer','Items','Total','Status','Payment'],
      ...rows.map(r => [r.id, r.date, r.customer, r.items, r.total, r.status, r.paymentMethod])
    ].map(e => e.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add/Edit form state
  const getNow = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };
  const [form, setForm] = useState<Transaction>({
    id: 0,
    date: getNow(),
    customer: '',
    items: 1,
    total: 0,
    status: 'Completed',
    paymentMethod: paymentMethods[0],
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name as string]: value }));
  };

  // UI
  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Transactions
      </Typography>
      <Paper elevation={2} sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
        <Toolbar disableGutters sx={{ flexWrap: 'wrap', gap: 2 }}>
          <TextField
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer, status, payment..."
            size="small"
            sx={{ minWidth: 220, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={e => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            type="date"
            size="small"
            label="Date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setRows(initialTransactions)}
            sx={{ textTransform: 'none' }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setForm({ ...form, id: 0 }); setAddOpen(true); }}
            sx={{ textTransform: 'none' }}
          >
            Add Transaction
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            sx={{ textTransform: 'none' }}
          >
            Export CSV
          </Button>
        </Toolbar>
      </Paper>
      <Paper elevation={3} sx={{ height: 500, width: '100%', p: 1 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme.palette.grey[100],
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: theme.palette.action.hover,
            },
            '& .MuiDataGrid-footerContainer': {
              bgcolor: theme.palette.grey[50],
            },
          }}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
        {filteredRows.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            No transactions found.
          </Typography>
        )}
      </Paper>
      {/* Details Modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={2}>
              <Typography><b>ID:</b> {selected.id}</Typography>
              <Typography><b>Date:</b> {selected.date}</Typography>
              <Typography><b>Customer:</b> {selected.customer}</Typography>
              <Typography><b>Items:</b> {selected.items}</Typography>
              <Typography><b>Total:</b> ₹{selected.total.toFixed(2)}</Typography>
              <Typography><b>Status:</b> <Chip label={selected.status} color={statusColor[selected.status] as 'success'|'warning'|'error'|'default'} size="small" /></Typography>
              <Typography><b>Payment:</b> {selected.paymentMethod}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Customer" name="customer" value={form.customer} onChange={handleInputChange} fullWidth />
            <TextField label="Date" name="date" value={form.date} onChange={handleInputChange} fullWidth />
            <TextField label="Items" name="items" type="number" value={form.items} onChange={handleInputChange} fullWidth />
            <TextField label="Total" name="total" type="number" value={form.total} onChange={handleInputChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} label="Status" onChange={handleSelectChange}>
                {statusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Payment</InputLabel>
              <Select name="paymentMethod" value={form.paymentMethod} label="Payment" onChange={handleSelectChange}>
                {paymentMethods.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { handleEditSave({ ...form, id: selected?.id || 0 }); }}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Add Modal */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Customer" name="customer" value={form.customer} onChange={handleInputChange} fullWidth />
            <TextField label="Date" name="date" value={form.date} onChange={handleInputChange} fullWidth />
            <TextField label="Items" name="items" type="number" value={form.items} onChange={handleInputChange} fullWidth />
            <TextField label="Total" name="total" type="number" value={form.total} onChange={handleInputChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} label="Status" onChange={handleSelectChange}>
                {statusOptions.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Payment</InputLabel>
              <Select name="paymentMethod" value={form.paymentMethod} label="Payment" onChange={handleSelectChange}>
                {paymentMethods.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { handleAdd(form); }}>Add</Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirm Modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this transaction?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions; 