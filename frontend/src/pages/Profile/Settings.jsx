import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useUser } from '../../hooks/useUser';
import { useForm } from 'react-hook-form';

const Settings = () => {
  const {
    profile,
    updateProfile,
    isUpdating,
    updatePassword,
    isChangingPassword,
  } = useUser();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      fullName: profile?.fullName || '',
      email: profile?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const onProfileSubmit = data => {
    updateProfile(data);
  };

  const onPasswordSubmit = data => {
    updatePassword(data, {
      onSuccess: () => {
        setShowPasswordForm(false);
        resetPassword();
      },
    });
  };

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Account Settings
      </Typography>

      {/* Profile Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Profile Information
        </Typography>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
          <Stack spacing={3}>
            <TextField
              label='Full Name'
              {...registerProfile('fullName', {
                required: 'Full name is required',
              })}
              error={!!profileErrors.fullName}
              helperText={profileErrors.fullName?.message}
              fullWidth
            />
            <TextField
              label='Email'
              type='email'
              {...registerProfile('email', { required: 'Email is required' })}
              error={!!profileErrors.email}
              helperText={profileErrors.email?.message}
              fullWidth
              disabled
            />
            <Box>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={isUpdating}
              >
                Save Changes
              </LoadingButton>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* Password Settings */}
      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Password Settings
        </Typography>
        {!showPasswordForm ? (
          <Button variant='outlined' onClick={() => setShowPasswordForm(true)}>
            Change Password
          </Button>
        ) : (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <Stack spacing={3}>
              <TextField
                type='password'
                label='Current Password'
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword?.message}
                fullWidth
              />
              <TextField
                type='password'
                label='New Password'
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword?.message}
                fullWidth
              />
              <TextField
                type='password'
                label='Confirm New Password'
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value, formValues) =>
                    value === formValues.newPassword ||
                    'Passwords do not match',
                })}
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword?.message}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  loading={isChangingPassword}
                >
                  Update Password
                </LoadingButton>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setShowPasswordForm(false);
                    resetPassword();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Settings;
