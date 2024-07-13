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
  Container,
  Box,
  TextField,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';

function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page
  const [bookId, setBookId] = useState(''); // State for storing the entered Book ID
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, bookId]); // Fetch transactions when page, rowsPerPage or bookId changes

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3002/allTransactions', {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        },
        params: {
          book_id: bookId 
        }
      });
      setTransactions(response.data.borrows);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      navigate('/');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const handleSearch = () => {
    // Perform search or filter based on bookId
    fetchTransactions();
  };

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transaction History ({transactions.length})
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Enter ISBN"
            variant="outlined"
            size="small"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UserID</TableCell>
                <TableCell>BookID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Return Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : transactions
              ).map((transaction) => (
                <TableRow key={transaction.ID}>
                  
                  <TableCell>{transaction.UserID}</TableCell>
                  <TableCell>{transaction.BookID}</TableCell>
                  <TableCell>{transaction.Book.Title}</TableCell>
                  <TableCell>{transaction.Book.Author}</TableCell>
                  <TableCell>{new Date(transaction.BorrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span style={{ color: transaction.ReturnDate ? 'initial' : 'red' }}>
                      {transaction.ReturnDate ? new Date(transaction.ReturnDate).toLocaleDateString() : 'Not Returned'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={transactions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Container>
  );
}

export default TransactionHistoryPage;
