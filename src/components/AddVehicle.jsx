import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, TextField, Grid, Container, Typography, 
  List, ListItem, ListItemText, Dialog, DialogActions, 
  DialogContent, DialogTitle, MenuItem, Select, 
  FormControl, InputLabel, CircularProgress, Checkbox, ListItemIcon 
} from '@mui/material';
import apiService from '../services/api-services';

const AddVehicleRepair = () => {
  const [vehicle, setVehicle] = useState({
    vin: '',
    model: '',
    year: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [components, setComponents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehicleError, setVehicleError] = useState('');
  const [componentError, setComponentError] = useState('');
  const [issueError, setIssueError] = useState('');
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [issue, setIssue] = useState({
    description: '',
    component_choice: '',
    component: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);

  const fetchVehicles = useCallback(() => {
    setLoading(true);
    apiService.get('api/vehicles/')
      .then(response => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(() => {
        setVehicleError('Error fetching vehicles');
        setLoading(false);
      });
  }, []);

  const fetchComponents = useCallback(() => {
    apiService.get('api/components/')
      .then(response => {
        setComponents(response.data);
      })
      .catch(() => {
        setComponentError('Error fetching components');
      });
  }, []);

  const fetchServices = useCallback(() => {
    apiService.get(`pay/services/`)
      .then(response => {
        const serviceArray = Object.keys(response.data).map(key => ({
          id: key,
          service: response.data[key].service,
          approx_charges: response.data[key].approx_charges
        }));
        setServices(serviceArray);
      })
      .catch(() => {
        setIssueError('Error fetching services');
      });
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchComponents();
  }, [fetchVehicles, fetchComponents]);

  useEffect(() => {
    if (selectedVehicleId) {
      fetchServices();
    }
  }, [selectedVehicleId, fetchServices]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueInputChange = (e) => {
    const { name, value } = e.target;
    setIssue(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIssue = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setOpenIssueDialog(true);
  };

  const handleSubmitIssue = () => {
    if (!issue.description || !issue.component_choice || (issue.component_choice === 'new' && !issue.component)) {
      setIssueError('All fields are required');
      return;
    }

    setLoading(true);
    setIssueError('');
    const issueData = {
      description: issue.description,
      component_choice: issue.component_choice,
      component: issue.component || null
    };

    apiService.post(`api/vehicles/${selectedVehicleId}/issues/`, issueData)
      .then(() => {
        setLoading(false);
        setOpenIssueDialog(false);
        fetchVehicles();
        setIssue({ description: '', component_choice: '', component: '' });
      })
      .catch(() => {
        setIssueError('Error reporting issue');
        setLoading(false);
      });
  };

  const handleCloseDialog = () => {
    setOpenIssueDialog(false);
    setIssue({ description: '', component_choice: '', component: '' });
  };

  const handleSubmitVehicle = (e) => {
    e.preventDefault();
    setLoading(true);
    apiService.post('api/vehicles/', vehicle)
      .then(() => {
        setLoading(false);
        fetchVehicles();
        setVehicle({ vin: '', model: '', year: '' });
        alert('Vehicle added successfully');
      })
      .catch(() => {
        setVehicleError('Error adding vehicle');
        setLoading(false);
      });
  };

  const handlePay = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setOpenPayDialog(true);
  };

  const handleServiceChange = (event) => {
    const value = event.target.value;
    setSelectedServices(typeof value === 'string' ? value.split(',') : value);
  };

  const handlePaySubmit = () => {
    if (selectedServices.length === 0) {
      setIssueError('Please select at least one service');
      return;
    }

    setLoading(true);
    const paymentData = {
      services: selectedServices,
    };

    apiService.get(`pay/calculate/${selectedVehicleId}/`, paymentData)
      .then(response => {
        setLoading(false);
        setTotalPrice(response.data.total_price);
      })
      .catch(() => {
        setIssueError('Error processing payment');
        setLoading(false);
      });
  };

  const handlePayment = () => {
    apiService.post(`pay/process_payment/${selectedVehicleId}/`, { amount: totalPrice })
    .then(response => {
      alert(`Payment of ₹${totalPrice} processed successfully.`);
      setOpenPayDialog(false);
    })
    .catch(() => {
      setIssueError('Error processing payment');
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Vehicle Repair Details
      </Typography>

      {vehicleError && <p style={{ color: 'red' }}>{vehicleError}</p>}
      {componentError && <p style={{ color: 'red' }}>{componentError}</p>}

      <form onSubmit={handleSubmitVehicle}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Vehicle VIN"
              name="vin"
              value={vehicle.vin}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Model"
              name="model"
              value={vehicle.model}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Year"
              name="year"
              value={vehicle.year}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save Vehicle'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h5" gutterBottom sx={{ marginTop: '20px' }}>
        Vehicle List
      </Typography>

      <List>
        {vehicles.map(vehicle => (
          <ListItem key={vehicle.id}>
            <ListItemText
              primary={`VIN: ${vehicle.vin}`}
              secondary={`Model: ${vehicle.model} | Year: ${vehicle.year}`}
            />
            {vehicle.payment_status === true ? (
              <Typography variant="body1" color="green">
                Payment Completed
              </Typography>
            ) : (
              <>
                {vehicle.issues && vehicle.issues.length > 0 ? (
                  <>
                    <Button variant="outlined" color="primary" onClick={() => handlePay(vehicle.id)}>
                      Pay
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleAddIssue(vehicle.id)}>
                      Report Another Issue
                    </Button>
                  </>
                ) : (
                  <Button variant="outlined" color="secondary" onClick={() => handleAddIssue(vehicle.id)}>
                    Report Issue
                  </Button>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>

      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)}>
        <DialogTitle>Proceed to Payment for Vehicle {selectedVehicleId}</DialogTitle>
        <DialogContent>
          {issueError && <p style={{ color: 'red' }}>{issueError}</p>}

          <Typography variant="h6">Issues for this Vehicle:</Typography>
          <List>
            {vehicles.find(v => v.id === selectedVehicleId)?.issues.map(issue => (
              <ListItem key={issue.id}>
                <ListItemText primary={issue.description} />
              </ListItem>
            ))}
          </List>

          <FormControl fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel>Services</InputLabel>
            <Select
              multiple
              value={selectedServices}
              onChange={handleServiceChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {services.map(service => (
                <MenuItem key={service.id} value={service.id}>
                  <Checkbox checked={selectedServices.indexOf(service.id) > -1} />
                  <ListItemText primary={service.service} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {totalPrice !== null && (
            <Typography variant="h6" color="green">
              Total Price: ₹{totalPrice}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayDialog(false)} color="primary">
            Cancel
          </Button>
          {totalPrice === null ? (
            <Button onClick={handlePaySubmit} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Calculate Price'}
            </Button>
          ) : (
            <Button onClick={handlePayment} color="primary">
              Pay ₹{totalPrice}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openIssueDialog} onClose={handleCloseDialog}>
        <DialogTitle>Report Issue for Vehicle {selectedVehicleId}</DialogTitle>
        <DialogContent>
          {issueError && <p style={{ color: 'red' }}>{issueError}</p>}
          
          <TextField
            label="Issue Description"
            fullWidth
            name="description"
            value={issue.description}
            onChange={handleIssueInputChange}
            sx={{ marginBottom: '20px' }}
            multiline
            rows={4}
          />

          <FormControl fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel>Component Choice</InputLabel>
            <Select
              value={issue.component_choice}
              name="component_choice"
              onChange={handleIssueInputChange}
              fullWidth
            >
              <MenuItem value="repair">Repair</MenuItem>
              <MenuItem value="new">New Component</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel>Component</InputLabel>
            <Select
              value={issue.component}
              name="component"
              onChange={handleIssueInputChange}
              fullWidth
            >
              {components.map(comp => (
                <MenuItem key={comp.id} value={comp.id}>
                  {comp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitIssue} color="primary">
            Submit Issue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddVehicleRepair;
