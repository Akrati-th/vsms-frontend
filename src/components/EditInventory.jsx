import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, Typography, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/api-services';

const EditComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [component, setComponent] = useState({
    name: '',
    purchase_price: '',
    repair_price: '',
    stock_quantity: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiService.get(`/api/components/${id}/`)
      .then(response => {
        setComponent(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching component details.');
        setLoading(false);
        console.error("Error fetching component:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    apiService.put(`/api/components/${id}/`, component)
      .then(response => {
        navigate('/inventory');
      })
      .catch(error => {
        setError('Error updating component.');
        setLoading(false);
        console.error("Error updating component:", error);
      });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComponent({
      ...component,
      [name]: value
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Component
      </Typography>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading indicator */}
      {loading && <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Component Name"
              variant="outlined"
              fullWidth
              name="name"
              value={component.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Purchase Price"
              variant="outlined"
              fullWidth
              name="purchase_price"
              type="number"
              value={component.purchase_price}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Repair Price"
              variant="outlined"
              fullWidth
              name="repair_price"
              type="number"
              value={component.repair_price}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Stock Quantity"
              variant="outlined"
              fullWidth
              name="stock_quantity"
              type="number"
              value={component.stock_quantity}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditComponent;
