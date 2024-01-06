import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, Divider, TextField, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const AdminDashboard = () => {
  const [coachRequests, setCoachRequests] = useState([]);
  const [exerciseBank, setExerciseBank] = useState([]);
  const [newExercise, setNewExercise] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/manage_become_coach_request`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched exercises:", data);
        setCoachRequests(data)})
      .catch(error => console.error('Error fetching coach requests:', error));

    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/exercises`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched exercises:", data);
        setExerciseBank(data);
      })
      .catch(error => console.error('Error fetching exercises:', error));
  }, []);

  const fetchExercises = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/exercises`)
      .then(response => response.json())
      .then(data => setExerciseBank(data))
      .catch(error => console.error('Error fetching exercises:', error));
  };

  const handleAcceptRequest = (requestId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/manage_become_coach_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: requestId, is_approved: true }),
    }).then(() => {
    });
  };

  const handleRejectRequest = (requestId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/manage_become_coach_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: requestId }),
    }).then(() => {
    });
  };

  const handleAddExercise = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/edit_exercise_bank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newExercise, description: '', muscle_group: 1, equipment: 1 }),
    }).then(() => {
      setNewExercise('');
      fetchExercises();
    });
  };

  const handleRemoveExercise = (exerciseId) => {
    console.log('Attempting to remove exercise with ID:', exerciseId);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/edit_exercise_bank`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exercise_id: exerciseId }),
    }).then(() => {
      fetchExercises();
    });
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', backgroundColor: 'black', color: 'white', p: 3, boxSizing: 'border-box' }}>
      <Box mb={4}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Manage Coach Requests</Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto', backgroundColor: 'black' }}>
          <List>
            {coachRequests.map((request) => (
              <ListItem
                key={request.id}
                sx={{ borderBottom: '1px solid grey', display: 'flex', justifyContent: 'space-between' }}
              >
                <Box>{request.name} - {request.requestDate}</Box>
                <Box>
                  <StyledButton
                    variant="contained"
                    color="success"
                    onClick={() => handleAcceptRequest(request.user_id)}
                  >
                    Accept
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="error"
                    onClick={() => handleRejectRequest(request.user_id)}
                  >
                    Reject
                  </StyledButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Divider light />
      <Box mt={4} display="flex" gap={2}>
        <Box width="50%">
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Add Exercise to Exercise Bank</Typography>
          <TextField
            label="New Exercise"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            variant="outlined"
            sx={{
              input: { color: 'white' },
              label: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              mb: 2
            }}
            fullWidth
          />
          <StyledButton
            onClick={handleAddExercise}
            variant="contained"
            color="success"
          >
            Add Exercise
          </StyledButton>
        </Box>
        <Box width="50%" sx={{ overflow: 'auto', maxHeight: '300px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Exercise Bank</Typography>
          <List>
            {exerciseBank.map((exercise) => (
              <Box key={exercise.exercise_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography>{exercise.name}</Typography>
                <StyledButton
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveExercise(exercise.exercise_id)}
                >
                  Remove
                </StyledButton>
              </Box>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
