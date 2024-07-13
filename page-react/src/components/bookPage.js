import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
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
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BookPage() {
  useEffect(() => {
    fetchBooks();
  }, []);
  const [books, setBooks] = useState([]);
  var [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [genre, setGenre] = useState('');
  var [availability, setAvailability] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();


  const fetchBooks = async () => {
    try {
      console.log(sessionStorage.getItem('authToken'));
      const response = await axios.get('http://localhost:3002/view', {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        }
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      navigate('/');
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editId) {
        
        isbn = parseInt(isbn);
        availability = parseInt(availability);
        await axios.put(`http://localhost:3002/book/${editId}`, {
          isbn,
          title,
          author,
          publication_date: publicationDate,
          genre,
          availability
        }, {
          headers: {
            Authorization: `${sessionStorage.getItem('authToken')}`
          }
        });
      } else {
        isbn = parseInt(isbn);
        availability = parseInt(availability);
        await axios.post('http://localhost:3002/book', {
          isbn,
          title,
          author,
          publication_date: publicationDate,
          genre,
          availability
        }, {
          headers: {
            Authorization: `${sessionStorage.getItem('authToken')}`
          }
        });
      }

      fetchBooks();
      resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditId(book.ID);
    setIsbn(book.ISBN);
    setTitle(book.Title);
    setAuthor(book.Author);
    setPublicationDate(book.PublicationDate.split('T')[0]);
    setGenre(book.Genre);
    setAvailability(book.Availability);
    
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/book/${id}`, {
        headers: {
          Authorization: `${sessionStorage.getItem('authToken')}`
        }
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setIsbn('');
    setTitle('');
    setAuthor('');
    setPublicationDate('');
    setGenre('');
    setAvailability('');
  };

  return (
    
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book Management
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ISBN"
            type="number"
            fullWidth
            margin="normal"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Author"
            fullWidth
            margin="normal"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <TextField
            label="Publication Date"
            type="date"
            fullWidth
            margin="normal"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Genre"
            fullWidth
            margin="normal"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          <TextField
            label="Availability"
            type="number"
            fullWidth
            margin="normal"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {editId ? 'Update Book' : 'Add Book'}
          </Button>
          {editId && (
            <Button onClick={resetForm} variant="contained" color="secondary" fullWidth>
              Cancel Edit
            </Button>
          )}
        </form>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Books List
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
                    <Button onClick={() => handleEdit(book)} variant="contained" color="primary">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(book.ID)} variant="contained" color="secondary">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default BookPage;
