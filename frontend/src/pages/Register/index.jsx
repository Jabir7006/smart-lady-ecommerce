import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthContext';
import GlobalContext from '../../context/GlobalContext';
import { registerSchema } from '../../validations/authSchema';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const Register = () => {
  const {
    register: registerUser,
    registerError,
    registerIsLoading,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async data => {
    try {
      await registerUser(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className='section signInPage signUpPage'>
      <div className='shape-bottom'>
        <svg fill='#fff' id='Layer_1' x='0px' y='0px' viewBox='0 0 1921 819.8'>
          {' '}
          <path
            className='st0'
            d='M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z'
          ></path>{' '}
        </svg>
      </div>
      <div className='container'>
        <div className='box card p-3 shadow border-8'>
          <div className='text-center'>
            <img src={logo} className='w-50' alt='logo' />
          </div>

          {registerError && (
            <Alert severity='error' className='mb-3'>
              {registerError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='mt-3'>
            <h2 className='mb-4'>Register</h2>

            <div className='row'>
              <div className='col-md-6'>
                <TextField
                  label='Full Name *'
                  variant='standard'
                  className='w-100'
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              </div>
              <div className='col-md-6'>
                <TextField
                  label='Phone *'
                  variant='standard'
                  className='w-100'
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </div>
            </div>

            <div className='form-group position-relative'>
              <TextField
                label='Email *'
                variant='standard'
                className='w-100'
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>

            <div className='form-group'>
              <TextField
                label='Password *'
                type='password'
                variant='standard'
                className='w-100'
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </div>

            <div className='d-flex align-items-center mt-3 mb-3'>
              <Button
                className='col btn-big btn-blue btn-lg'
                type='submit'
                disabled={registerIsLoading}
              >
                {registerIsLoading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  'Register'
                )}
              </Button>

              <Link to='/'>
                <Button
                  className='col btn-big btn-blue btn-lg ml-3'
                  variant='outlined'
                  disabled={registerIsLoading}
                >
                  Cancel
                </Button>
              </Link>
            </div>

            <p className='txt'>
              Already Registered?{' '}
              <Link to='/login' className='border-effect'>
                Login
              </Link>
            </p>

            {/* TODO: add google login */}

            {/* <h6 className='mt-4 text-center font-weight-bold'>
              Or continue with social account
            </h6>
            <Button className='mt-2 loginWithGoogle' variant='outlined'>
              <img
                src='data:image/png;base64,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'
                alt='google'
              />
              Login with Google
            </Button> */}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
