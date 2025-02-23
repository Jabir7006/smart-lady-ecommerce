import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAddresses, deleteAddress } from '../services/addressService';
import toast from 'react-hot-toast';
import { useState } from 'react';
import AddressForm from './AddressForm';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Radio,
  Typography,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const AddressList = ({ onAddressSelect, selectedAddress }) => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch addresses
  const {
    data: addresses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    onSuccess: data => {
      // If no address is selected and we have addresses, select the default one
      if (!selectedAddress && data?.length > 0) {
        const defaultAddress = data.find(addr => addr.isDefault);
        if (defaultAddress) {
          onAddressSelect(defaultAddress);
        } else {
          // If no default address, select the first one
          onAddressSelect(data[0]);
        }
      }
    },
  });

  // Delete address mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses']); // Refresh data after deletion
      toast.success('Address deleted successfully!');
      if (selectedAddress) {
        onAddressSelect(null);
      }
    },
    onError: () => {
      toast.error('Failed to delete address!');
    },
  });

  const handleAddressSelect = address => {
    onAddressSelect(address);
  };

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ my: 2 }}>
        Error loading addresses! Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {!showAddForm && !editingAddress && (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          variant='text'
          color='primary'
          sx={{ mb: 3 }}
        >
          Add New Address
        </Button>
      )}

      {(showAddForm || editingAddress) && (
        <AddressForm
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress}
          onCancel={() => {
            setEditingAddress(null);
            setShowAddForm(false);
          }}
          onSuccess={address => {
            setShowAddForm(false);
            setEditingAddress(null);
            if (!selectedAddress) {
              onAddressSelect(address);
            }
          }}
        />
      )}

      {!showAddForm && !editingAddress && (
        <Stack spacing={2}>
          {addresses.length === 0 ? (
            <Paper
              variant='outlined'
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: 'grey.50',
                border: '2px dashed',
                borderColor: 'grey.300',
              }}
            >
              <Typography color='text.secondary'>
                No addresses found. Add your first address to continue.
              </Typography>
            </Paper>
          ) : (
            addresses.map(address => (
              <Paper
                key={address._id}
                variant='outlined'
                sx={{
                  p: 2,
                  borderColor:
                    selectedAddress?._id === address._id
                      ? 'primary.main'
                      : 'divider',
                  bgcolor:
                    selectedAddress?._id === address._id
                      ? 'primary.50'
                      : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Radio
                    checked={selectedAddress?._id === address._id}
                    onChange={() => handleAddressSelect(address)}
                    sx={{ mt: 0.5 }}
                    name='selectedAddress'
                  />
                  <Box sx={{ flex: 1, ml: 1 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      {address.addressType === 'Home' ? (
                        <HomeIcon
                          fontSize='small'
                          color='action'
                          sx={{ mr: 1 }}
                        />
                      ) : (
                        <BusinessIcon
                          fontSize='small'
                          color='action'
                          sx={{ mr: 1 }}
                        />
                      )}
                      <Typography variant='subtitle1' component='span'>
                        {address.fullName}
                      </Typography>
                      {address.isDefault && (
                        <Typography
                          variant='caption'
                          sx={{
                            ml: 1,
                            color: 'primary.main',
                            fontWeight: 'medium',
                          }}
                        >
                          Default
                        </Typography>
                      )}
                    </Box>

                    <Typography variant='body2' color='text.secondary'>
                      {address.phone}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {address.street}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {address.area}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {address.city}, {address.division} {address.postCode}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 1,
                      }}
                    >
                      <IconButton
                        size='small'
                        onClick={() => setEditingAddress(address)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to delete this address?'
                            )
                          ) {
                            deleteMutation.mutate(address._id);
                          }
                        }}
                        sx={{ color: 'error.main', ml: 1 }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

export default AddressList;
