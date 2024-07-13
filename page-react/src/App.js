import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Login from './components/Login';
import Signup from './components/Signup';
import BookPage from './components/bookPage';
import ReturnPage from './components/ReturnPage';
import TransactionHistoryPage from './components/TransactionHistoryPage';
import BorrowPage from './components/BorrowPage';
import AllTransactions from './components/TransactionAllHistrory';
import LibrarianList from './components/LibrarianList';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = (role) => {
    sessionStorage.setItem('userRole', role);
    setUserRole(role);
    navigate('/'); 
  };

  const handleLogout = async () => {
    try {
      const response = await axios.delete('http://localhost:3001/logout', {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        }
      });
      console.log('Logout successful:', response.data.message);

      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('email');
      setUserRole(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const storedUserRole = sessionStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const userName = sessionStorage.getItem('name');
  const userEmail = sessionStorage.getItem('email');

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            ONLINE LIBRARY PORTAL
          </Typography>
          {userRole == null ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              {userRole === 'admin' && (
                <>
                  <Button color="inherit" component={Link} to="/LibrarianList">
                    Manage Librarian
                  </Button>
                  <Button color="inherit" component={Link} to="/bookPage">
                    Books
                  </Button>
                  <Button color="inherit" component={Link} to="/allTransactions">
                    Student Transactions
                  </Button>
                </>
              )}
              {userRole === 'librarian' && (
                <>
                  <Button color="inherit" component={Link} to="/bookPage">
                    Books
                  </Button>
                  <Button color="inherit" component={Link} to="/allTransactions">
                    Student Transactions
                  </Button>
                </>
              )}
              {userRole === 'student' && (
                <>
                  <Button color="inherit" component={Link} to="/borrowPage">
                    Borrow
                  </Button>
                  <Button color="inherit" component={Link} to="/returnPage">
                    Return
                  </Button>
                  <Button color="inherit" component={Link} to="/transactionHistoryPage">
                    Transactions
                  </Button>
                </>
              )}
              <IconButton color="inherit" onClick={handleMenuClick}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>{userRole}</MenuItem>
                <MenuItem disabled>{userName}</MenuItem>
                <MenuItem disabled>{userEmail}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ mt: 2 }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/bookPage" element={<BookPage />} />
            <Route path="/borrowPage" element={<BorrowPage />} />
            <Route path="/returnPage" element={<ReturnPage />} />
            <Route path="/transactionHistoryPage" element={<TransactionHistoryPage />} />
            <Route path="/allTransactions" element={<AllTransactions />} />
            <Route path="/LibrarianList" element={<LibrarianList />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Box>
      </Container>
    </div>
  );
}

function Home() {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Library Portal.
      </Typography>
      <Typography variant="body1">
        This is the home page. Use the navigation bar to log in or sign up.
      </Typography>
    </Container>
  );
}

export default App;
