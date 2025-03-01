import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}
    >
      <Typography variant="h1" component="h2" color="error">
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/" 
        sx={{ mt: 2 }}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;
