import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function BorrowPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  useEffect(() => {
    const currentUser = {
      name: sessionStorage.getItem('name'),
      email: sessionStorage.getItem('email'),
    };
    setUser(currentUser);
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page) => {
    try {
      const response = await axios.get('http://localhost:3002/viewStudent', {
        headers: { Authorization: `${sessionStorage.getItem('authToken')}` }
      });
      const fetchedBooks = response.data.books;
      const updatedBooks = await Promise.all(
        fetchedBooks.map(async (book) => {
          const isBorrowedResponse = await axios.get(`http://localhost:3002/isBookBorrowed?book_id=${book.ID}`, {
            headers: { Authorization: `${sessionStorage.getItem('authToken')}` }
          });
          const isBorrowed = isBorrowedResponse.data.is_borrowed === 1;
          return { ...book, isBorrowed };
        })
      );
      setBooks(updatedBooks);
      const totalCount = response.data.totalCount;
      setTotalPages(Math.ceil(totalCount / rowsPerPage));
    } catch (error) {
      console.error('Error fetching books:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/');
      } else {
        setSnackbarMessage('Failed to fetch books. Please try again.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleBorrow = async (id) => {
    try {
      await axios.post('http://localhost:3002/borrow', { book_id: id }, {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      fetchBooks(currentPage);
      setSnackbarMessage('Book borrowed successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error borrowing book:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/');
      } else {
        setSnackbarMessage('Failed to borrow book. Please try again.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };


  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Borrow Books
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ISBN</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Publication Date</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.ID}>
                  <TableCell>{book.ISBN}</TableCell>
                  <TableCell>{book.Title}</TableCell>
                  <TableCell>{book.Author}</TableCell>
                  <TableCell>{new Date(book.PublicationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{book.Genre}</TableCell>
                  <TableCell>{book.Availability}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleBorrow(book.ID)}
                      variant="contained"
                      color="primary"
                      disabled={book.Availability === 0 || book.isBorrowed}
                    >
                      {book.isBorrowed ? 'BORROWED' : book.Availability > 0 ? 'BORROW' : 'Not Available'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Container>
  );
}

export default BorrowPage;
