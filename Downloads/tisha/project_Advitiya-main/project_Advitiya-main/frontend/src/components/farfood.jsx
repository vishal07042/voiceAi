import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FarmerSurplus = () => {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiryDate: null,
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add API call here
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add Surplus Food Details - Farmer
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Food Type"
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit}
                  label="Unit"
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <MenuItem value="kg">Kilograms (kg)</MenuItem>
                  <MenuItem value="tons">Tons</MenuItem>
                  <MenuItem value="pieces">Pieces</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={(date) => setFormData({ ...formData, expiryDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" size="large">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default FarmerSurplus;