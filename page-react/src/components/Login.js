import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/login', {
        user: {
          email: email,
          password: password,
        },
      });
      const authToken = response.headers.authorization;
      if (authToken) {
        const token = authToken.split(' ')[1];
        sessionStorage.setItem('authToken', token);
      }
      if (response.data.status.code === 200) {
        const { id,email,name, role } = response.data.status.data.user;
        // Save the token and role to sessionStorage 
        sessionStorage.setItem('authToken', response.headers.authorization);
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('name',name);
        sessionStorage.setItem('email',email);
        console.log(id,email,name, role);
        // Redirect based on the user's role (handled by ProtectedRoute)
        if (role === 'admin') {
          navigate('/bookPage');
          window.location.reload();
        } else if (role === 'student') {
          navigate('/borrowPage');
          window.location.reload();
        } else if (role === 'librarian') {
          navigate('/bookPage');
          window.location.reload();
        } else {
          alert("Login First");
          navigate('/'); // Default redirect if role is not handled explicitly
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      const errorMsg = error.response.data || 'An unexpected error occurred';
      setError(errorMsg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
