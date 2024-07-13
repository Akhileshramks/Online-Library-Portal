import axios from 'axios';

const API_URL = 'http://localhost:3001'; 

const librarianService = {
    getAll: async () => {
        try {
          const response = await axios.get(`${API_URL}/users/librarian`, {
            headers: { Authorization: `${sessionStorage.getItem('authToken')}` }
          });
          return response.data; // Directly return the array of librarians
        } catch (error) {
          console.error('Error fetching librarians:', error);
          throw error; // Optionally, you can throw the error to be handled by the caller
        }
      },

  getOne: async (id) => {
    const response = await axios.get(`${API_URL}/users/librarian/${id}`,{
        headers: { Authorization: `${sessionStorage.getItem('authToken')}` }
      });
    return response.data;
  },

  add: async (librarianData) => {
    const response = await axios.post(`${API_URL}/users/librarian`,  librarianData,{
        headers: { Authorization: `${sessionStorage.getItem('authToken')}` }
     });
    return response.data;
  },

  update: async (id, librarianData) => {
    const response = await axios.put(`${API_URL}/users/librarian/${id}`, 
      librarianData, // Send data directly in the correct format
      { headers: { Authorization: `${sessionStorage.getItem('authToken')}` } } // Set headers correctly
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/users/librarian/${id}`,{
        headers: { Authorization: `${sessionStorage.getItem('authToken')}` }
      });
    return response.data;
  }
};

export default librarianService;
