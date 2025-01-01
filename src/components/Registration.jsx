import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Container, Typography } from '@mui/material';
import apiService from '../services/api-services';

const ComponentForm = ({ componentId, onSave }) => {
  const [component, setComponent] = useState({
    name: '',
    description: '',
    purchase_price: '',
    repair_price: '',
    stock_quantity: '',
    component_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (componentId) {
      setLoading(true);
      setError('');
      apiService.get(`/api/components/${componentId}/`)
        .then(response => {
          setComponent(response.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          setError('Error fetching component data.');
          console.error("Error fetching component:", error);
        });
    }
  }, [componentId]);

  const handleChange = (e) => {
    setComponent({
      ...component,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setComponent({
      ...component,
      component_image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    for (const key in component) {
      formData.append(key, component[key]);
    }

    try {
      if (componentId) {
        const response = await apiService.put(`/api/components/${componentId}/`, formData);
        alert("Component updated successfully!");
        onSave();
        navigate('/inventory');
      } else {
        const response = await apiService.post('/api/components/', formData);
        alert("Component added successfully!");
        onSave();
        navigate('/inventory');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error("Error saving component:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {componentId ? 'Update Component' : 'Add New Component'}
      </Typography>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Component Name"
              variant="outlined"
              fullWidth
              name="name"
              value={component.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Purchase Price"
              variant="outlined"
              fullWidth
              name="purchase_price"
              value={component.purchase_price}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Repair Price"
              variant="outlined"
              fullWidth
              name="repair_price"
              value={component.repair_price}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock Quantity"
              variant="outlined"
              fullWidth
              name="stock_quantity"
              value={component.stock_quantity}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={component.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : componentId ? 'Update' : 'Add'} Component
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ComponentForm;
