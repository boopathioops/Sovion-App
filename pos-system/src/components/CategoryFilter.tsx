import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, setSelectedCategory }) => (
  <Autocomplete
    options={categories}
    value={selectedCategory}
    onChange={(_, value) => setSelectedCategory(value)}
    renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
    sx={{ minWidth: 180 }}
    isOptionEqualToValue={(option, value) => option === value}
  />
);

export default CategoryFilter; 