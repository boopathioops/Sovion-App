import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import React from 'react';

export function getColor(status: string) {
  switch (status) {
    case 'completed': return 'success.main';
    case 'processing': return 'warning.main';
    case 'pending': return 'info.main';
    default: return 'grey.500';
  }
}

export function getIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircleIcon />;
    case 'processing': return <ShippingIcon />;
    case 'pending': return <InventoryIcon />;
    default: return <WarningIcon />;
  }
} 