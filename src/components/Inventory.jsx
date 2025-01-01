import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api-services';

const ComponentList = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    apiService.get('/api/components/')
      .then(response => {
        setComponents(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching components.');
        setLoading(false);
        console.error("Error fetching components:", error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      setLoading(true);
      setError('');
      apiService.delete(`/api/components/${id}/`)
        .then(() => {
          setComponents(components.filter(component => component.id !== id));
          setLoading(false);
        })
        .catch(error => {
          setError('Error deleting component.');
          setLoading(false);
          console.error("Error deleting component:", error);
        });
    }
  };

  const handleAddClick = () => {
    navigate('/add-to-inventory');
  };

  const handleEditClick = (id) => {
    navigate(`/edit-component/${id}`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Component List
      </Typography>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading indicator */}
      {loading && <p>Loading...</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>Repair Price</TableCell>
              <TableCell>Stock Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {components.map(component => (
              <TableRow key={component.id}>
                <TableCell>{component.name}</TableCell>
                <TableCell>{component.purchase_price}</TableCell>
                <TableCell>{component.repair_price}</TableCell>
                <TableCell>{component.stock_quantity}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(component.id)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(component.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleAddClick} 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ComponentList;
