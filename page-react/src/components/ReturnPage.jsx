import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Box,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ReturnPage() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3002/borrow/user', {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        }
      });
      setBorrowedBooks(response.data.borrows.filter(book => !book.ReturnDate));
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      navigate('/');
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await axios.put(`http://localhost:3002/return`, {borrow_id:borrowId}, {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        }
      });
      fetchBorrowedBooks();
      setSnackbarMessage('Returned Successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Borrowed Books ({borrowedBooks.length})
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ISBN</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrowedBooks.map((book) => (
                <TableRow key={book.ID}>
                  <TableCell>{book.Book.ISBN}</TableCell>
                  <TableCell>{book.Book.Title}</TableCell>
                  <TableCell>{book.Book.Author}</TableCell>
                  <TableCell>{new Date(book.BorrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleReturn(book.ID)}
                    >
                      Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      />
    </Container>
  );
}

export default ReturnPage;
