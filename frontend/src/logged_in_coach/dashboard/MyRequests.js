import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
} from "@mui/material";

function MyRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientRequests, setClientRequests] = useState([]);
  const coachId = localStorage.getItem('user_id');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/coaches/${coachId}/requests`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched client requests data:", data); 
        setClientRequests(Array.isArray(data) ? data : [data]);
      })
      .catch(error => console.error('Error fetching client requests:', error));
  }, [coachId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAccept = (userId) => {
    const payload = { user: userId, coach:  coachId  };
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/acceptClient/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Client accepted:", data);
      //   refresh requests list
    })
    .catch(error => console.error('Error accepting client:', error));
  };

  const handleDecline = (userId) => {
    const payload = { user: userId, coach: coachId };
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/declineClient/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
    })
    .then(data => {
        console.log("Client declined:", data);
        setClientRequests(prevRequests => prevRequests.filter(client => client.user_id !== userId));
    })
    .catch(error => {
        console.error('Error declining client:', error);
    });
};

  const filteredRequests = clientRequests.filter((client) =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ bgcolor: 'black', color: 'white', minHeight: '100vh', minWidth: '100%', py: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Client Requests
      </Typography>
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Clients"
          value={searchTerm}
          onChange={handleSearchChange}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
      </Box>
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2, bgcolor: 'grey.900', color: 'white' }}>
            <Grid container>
              <Grid item xs={8}>
                <CardContent>
                  <Typography variant="subtitle1">{`${request.first_name} ${request.last_name}`}</Typography>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>Email: {request.email}</Typography>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>Goal: {request.goal}</Typography>
                </CardContent>
              </Grid>
              <Grid item xs={4}>
                <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Button variant="contained" color="success" sx={{ mx: 1 }} onClick={() => handleAccept(request.user_id)}>
                    Accept
                  </Button>
                  <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => handleDecline(request.user_id)}>
                    Deny
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        ))
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={5}>
          
          <Typography variant="h5" sx={{ color: 'grey.500', mt: 3 }}>
            No client requests at the moment
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default MyRequests;
