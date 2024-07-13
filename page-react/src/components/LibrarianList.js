import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import librarianService from './librarianService';

const LibrarianList = () => {
  const [librarians, setLibrarians] = useState([]);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false); // State for add dialog
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      const data = await librarianService.getAll();
      setLibrarians(data);
    } catch (error) {
      console.error('Error fetching librarians:', error);
    }
  };

  const handleEditClick = (id) => {
    librarianService.getOne(id)
      .then((librarian) => {
        setSelectedLibrarian(librarian);
        setFormData({
          name: librarian.name,
          email: librarian.email,
          password: ''
        });
        setOpenEditDialog(true);
      })
      .catch((error) => {
        console.error('Error fetching librarian:', error);
      });
  };

  const handleDeleteClick = (id) => {
    librarianService.delete(id)
      .then(() => {
        fetchLibrarians();
      })
      .catch((error) => {
        console.error('Error deleting librarian:', error);
      });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async () => {
    const updatedData = {
      name: formData.name,
      email: formData.email
    };

    if (formData.password) {
      updatedData.password = formData.password;
    }

    try {
      await librarianService.update(selectedLibrarian.id, updatedData);
      setOpenEditDialog(false);
      fetchLibrarians();
    } catch (error) {
      console.error('Error updating librarian:', error);
    }
  };

  const handleAddLibrarian = async () => {
    const updatedData = {
      name: formData.name,
      email: formData.email,
      password : formData.password
    }

    try {
      await librarianService.add(updatedData); 
      setOpenAddDialog(false); 
      fetchLibrarians(); 
    } catch (error) {
      console.error('Error adding librarian:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row.id)}>Edit</Button>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row.id)}>Delete</Button>
          
        </div>
      )
    }
  ];

  return (
    <div style={{ height: 400, width: '100%'}}>
      <Button variant="outlined" onClick={() => setOpenAddDialog(true)}>Add Librarian</Button>
      <DataGrid
        rows={librarians}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
              <Button  onClick={() => setOpenAddDialog(true)}>Add Librarian</Button>
            </GridToolbarContainer>
          )
        }}
      />
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Librarian</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            name="password"
            fullWidth
            value={formData.password}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding librarian */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Librarian</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            name="password"
            fullWidth
            value={formData.password}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddLibrarian} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LibrarianList;
