import React, { Fragment, useState } from 'react';
import { Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Snackbar, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UserImage from '../../shared/components/UserImage';

const styles = {
    card: {
        maxWidth: 345,
        margin: 'auto'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    typography: {
        padding: '8px 0',
    },
    button: {
        margin: '0 5px',
    }
};

// Function to map experience level to description
const getExperienceLevel = (level) => {
    const levels = {
        1: 'Novice',
        2: 'Intermediate',
        3: 'Expert'
    };
    return levels[level] || 'Unknown';
};

const CoachCards = ({ coach }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
    const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('');

    const handleRequestCoach = async (coachId) => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.error("User ID not found in local storage.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/requestCoach/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userId, coach: coachId })
            });

            if (response.ok) {
                console.log("Requested coach successfully");
                localStorage.setItem('hired_coach', coachId);
                setSnackbarOpen(true);
            } else {
                const errorData = await response.json();
                setSnackbarErrorMessage(errorData.message || "Failed to request coach");
                setSnackbarErrorOpen(true);
            }
        } catch (error) {
            console.error("Error making request:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCloseErrorSnackbar = () => {
        setSnackbarErrorOpen(false);
    };

    return (
        <Fragment>
            <Card style={styles.card}>
                <CardContent style={styles.content}>
                    <UserImage
                        className=""
                        iconSize={40}
                        name={`${coach.first_name} ${coach.last_name}`}
                        style={styles.avatar}
                    />
                    <Typography gutterBottom variant="h5" component="div" style={{ ...styles.typography, ...styles.name }}>
                        {coach.first_name} {coach.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={styles.typography}>
                        Experience: {getExperienceLevel(coach.experience)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={styles.typography}>
                        Specialization: {coach.goal}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={styles.typography}>
                        Price: ${coach.cost}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={styles.typography}>
                        {coach.bio}
                    </Typography>
                </CardContent>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>More Options</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            style={styles.button}
                            startIcon={<PersonAddIcon />}
                            onClick={() => handleRequestCoach(coach.coach_id)}
                        >
                            Request Coach
                        </Button>
                        <Button variant="outlined" color="primary" style={styles.button} startIcon={<SendIcon />}>
                            Message Coach
                        </Button>
                    </AccordionDetails>
                </Accordion>
            </Card>
            {/* Success Snackbar */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Requested coach successfully
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar open={snackbarErrorOpen} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
                <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarErrorMessage}
                </Alert>
            </Snackbar>
        </Fragment>
    );
};

export default CoachCards;
