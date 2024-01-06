import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardActionArea, CardMedia, Typography, Button, Modal, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import {
  TextField
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#111',
    minHeight: '100vh',
    padding: theme.spacing(3),
  },
  card: {
    backgroundColor: '#222',
    color: 'white',
    margin: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#333',
    },
  },
  media: {
    height: 140,
    backgroundSize: 'cover',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
  },
  paper: {
    backgroundColor: '#000',
    color: 'white',
    padding: theme.spacing(2),
    outline: 'none',
    maxWidth: '500px',
    margin: 'auto',
  },
  button: {
    margin: theme.spacing(1),
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  editButton: {
    backgroundColor: theme.palette.warning.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  createButton: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  avatar: {
    height: 140,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '2rem',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: theme.spacing(4),
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    maxWidth: '600px',
},
buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing(2),
},
button: {
    flex: 1,
    margin: theme.spacing(1),
},
}));

function ClientModule() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const coachId = localStorage.getItem('user_id');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/coaches/${coachId}/clients`)
      .then(response => response.json())
      .then(data => {
        const clientsWithColor = data.map(client => ({
          ...client,
          color: getRandomColor(),
        }));
        setClients(clientsWithColor);
      })
      .catch(error => console.error('Error fetching clients:', error));
  }, [coachId]);

  const navigateToClientInfo = () => {
    history.push('/c/clientviewdashboard');
    handleClose();
};

const navigateToWorkoutInfo = () => {
    history.push('/c/clientview');
    handleClose();
};
const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
};

const filteredClients = clients.filter(client =>
  client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.email.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleOpen = (client) => {
    setSelectedClient(client);
    console.log("Selected client:", client);
    localStorage.setItem('client_id', client.user_id);
    localStorage.setItem('client_name', client.first_name);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const generateInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  const getRandomColor = () => {
    const colors = ['#e57373', '#ba68c8', '#7986cb', '#4fc3f7', '#aed581', '#ff8a65', '#d4e157', '#ffd54f']; // Add more colors as needed
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Box className={classes.root}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Clients"
        value={searchTerm}
        onChange={handleSearchChange}
        InputLabelProps={{ style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
        sx={{ mb: 2 }}
      />
      {filteredClients.length > 0 ? (
      <Grid container spacing={2}>
        {filteredClients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Card className={classes.card}>
              <CardActionArea onClick={() => handleOpen(client)}>
              <Box className={classes.avatar} style={{ backgroundColor: client.color }}>
                  {generateInitials(client.first_name, client.last_name)}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                  {client.first_name} {client.last_name}
                  </Typography>
                  <Typography variant="body2">
                    {client.email}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      ) : (
        <Typography variant="h6" style={{ color: 'white', marginTop: '20px', textAlign: 'center' }}>
          No clients found.
        </Typography>
      )}

      {selectedClient && (
        <Modal
          open={open}
          onClose={handleClose}
          className={classes.modal}
        >
          <Box className={classes.modalContent}>
            <Typography variant="h6">{selectedClient.first_name} {selectedClient.last_name}</Typography>
            <Box className={classes.buttonContainer}>
              <Button onClick={navigateToClientInfo} variant="contained" color="primary" className={classes.button}>
                View Client Info
              </Button>
              <Button onClick={navigateToWorkoutInfo} variant="contained" color="primary" className={classes.button}>
                Client Workout Info
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default ClientModule;
