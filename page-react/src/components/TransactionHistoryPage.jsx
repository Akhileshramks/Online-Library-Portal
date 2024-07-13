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
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';

function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage]); // Fetch transactions when page or rowsPerPage changes

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3002/borrow/user', {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        },
        params: {
          page: page + 1, // API pagination starts from 1, but useState starts from 0
          limit: rowsPerPage
        }
      });
      setTransactions(response.data.borrows);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      navigate('/transactionHistoryPage');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); 
  };
  return (
    <Container>
      <Box sx={{ mt: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transaction History ({transactions.length})
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ISBN</TableCell>
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
                  <TableCell>{transaction.Book.ISBN}</TableCell>
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
