import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAddress, updateAddress } from '../services/addressService';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Paper,
  Grid,
  Stack,
  FormHelperText,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  phone: yup
    .string()
    .matches(
      /^(?:\+88|88)?(01[3-9]\d{8})$/,
      'Please enter a valid Bangladeshi phone number'
    )
    .required('Phone number is required'),
  street: yup.string().required('Street address is required'),
  area: yup.string().required('Area is required'),
  city: yup.string().required('City is required'),
  division: yup
    .string()
    .oneOf(
      [
        'Dhaka',
        'Chittagong',
        'Rajshahi',
        'Khulna',
        'Barisal',
        'Sylhet',
        'Rangpur',
        'Mymensingh',
      ],
      'Please select a valid division'
    )
    .required('Division is required'),
  postCode: yup
    .string()
    .matches(/^\d{4}$/, 'Post code must be 4 digits')
    .required('Post code is required'),
  addressType: yup
    .string()
    .oneOf(['Home', 'Office'])
    .required('Address type is required'),
  isDefault: yup.boolean().default(false),
});

const AddressForm = ({
  editingAddress,
  setEditingAddress,
  onCancel,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editingAddress || {
      fullName: '',
      phone: '',
      street: '',
      area: '',
      city: '',
      division: '',
      postCode: '',
      addressType: 'Home',
      isDefault: false,
    },
  });

  const queryClient = useQueryClient();
  const addressType = watch('addressType');

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: data => {
      queryClient.invalidateQueries(['addresses']);
      toast.success('Address added successfully!');
      reset();
      if (onSuccess) {
        onSuccess(data.address);
      }
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to add address!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: data => {
      queryClient.invalidateQueries(['addresses']);
      toast.success('Address updated successfully!');
      setEditingAddress(null);
      if (onSuccess) {
        onSuccess(data.address);
      }
    },
    onError: error => {
      toast.error(error.response?.data?.message || 'Failed to update address!');
    },
  });

  const onSubmit = data => {
    if (editingAddress) {
      updateMutation.mutate({
        id: editingAddress._id,
        updatedAddress: data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        variant='outlined'
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingAddress ? (
            <EditIcon color='primary' />
          ) : (
            <AddIcon color='primary' />
          )}
          <Typography variant='h6' component='h2'>
            {editingAddress ? 'Update Address' : 'Add New Address'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Full Name'
                {...register('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocationIcon color='action' />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Phone Number'
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PhoneIcon color='action' />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Street Address'
                {...register('street')}
                error={!!errors.street}
                helperText={errors.street?.message}
                placeholder='House/Building, Road No.'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocationIcon color='action' />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Area'
                {...register('area')}
                error={!!errors.area}
                helperText={errors.area?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='City'
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label='Division'
                {...register('division')}
                error={!!errors.division}
                helperText={errors.division?.message}
                defaultValue=''
              >
                <MenuItem value=''>Select Division</MenuItem>
                <MenuItem value='Dhaka'>Dhaka</MenuItem>
                <MenuItem value='Chittagong'>Chittagong</MenuItem>
                <MenuItem value='Rajshahi'>Rajshahi</MenuItem>
                <MenuItem value='Khulna'>Khulna</MenuItem>
                <MenuItem value='Barisal'>Barisal</MenuItem>
                <MenuItem value='Sylhet'>Sylhet</MenuItem>
                <MenuItem value='Rangpur'>Rangpur</MenuItem>
                <MenuItem value='Mymensingh'>Mymensingh</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Post Code'
                {...register('postCode')}
                error={!!errors.postCode}
                helperText={errors.postCode?.message}
                placeholder='Enter 4-digit post code'
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction='row' spacing={2}>
                <TextField
                  select
                  fullWidth
                  label='Address Type'
                  {...register('addressType')}
                  error={!!errors.addressType}
                  helperText={errors.addressType?.message}
                  defaultValue='Home'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        {register('addressType').value === 'Home' ? (
                          <HomeIcon color='action' />
                        ) : (
                          <BusinessIcon color='action' />
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value='Home'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HomeIcon fontSize='small' />
                      Home
                    </Box>
                  </MenuItem>
                  <MenuItem value='Office'>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon fontSize='small' />
                      Office
                    </Box>
                  </MenuItem>
                </TextField>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox {...register('isDefault')} color='primary' />
                }
                label={
                  <Typography variant='body2'>
                    Set as default address
                  </Typography>
                }
              />
              <FormHelperText>
                This address will be used as the default shipping address
              </FormHelperText>
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            {editingAddress && (
              <Button
                variant='outlined'
                onClick={() => {
                  setEditingAddress(null);
                  reset();
                  if (onCancel) onCancel();
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type='submit'
              variant='contained'
              disabled={isSubmitting}
              sx={{
                minWidth: 120,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Fade>
  );
};

export default AddressForm;
