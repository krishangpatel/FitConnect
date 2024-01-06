import React, { useState, Fragment } from 'react';
import { withStyles } from '@mui/styles';
import { Typography, Button, Dialog, DialogActions, 
         DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import UserImage from '../../shared/components/UserImage';

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
    avatar: {
        margin: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
    },
    typography: {
        padding: theme.spacing(1),
    },
    name: {
        fontWeight: 'bold',
    }
});

const getExperienceLevel = (level) => {
    const levels = {
        1: 'Novice',
        2: 'Intermediate',
        3: 'Expert'
    };
    return levels[level] || 'Unknown';
};

const ViewCoach = ({ classes, coach, onCoachFired }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFireCoach = async () => {
        const userId = localStorage.getItem('user_id');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/fireCoach/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ has_coach: false, hired_coach: null })
            });

            if (response.ok) {
                localStorage.setItem('has_coach', 'false');
                localStorage.setItem('hired_coach', null);
                onCoachFired();
            } else {
                console.error('Failed to fire coach');
            }
        } catch (error) {
            console.error('Error firing coach:', error);
        }
        handleCloseDialog();
    };


    return (
        <Fragment>
            <div className={classes.container}>
                <UserImage
                    className={classes.avatar}
                    iconSize={60} // Increased size
                    name={`${coach.first_name} ${coach.last_name}`}
                />
                <Typography gutterBottom variant="h4" component="div" className={classes.name}>
                    {coach.first_name} {coach.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" className={classes.typography}>
                    Experience: {getExperienceLevel(coach.experience)}
                </Typography>
                <Typography variant="body1" color="text.secondary" className={classes.typography}>
                    Specialization: {coach.goal}
                </Typography>
                <Typography variant="body1" color="text.secondary" className={classes.typography}>
                    Price: ${coach.cost}
                </Typography>
                <Typography variant="body1" color="text.secondary" className={classes.typography}>
                    Coach Bio: {coach.bio}
                </Typography>
                <Button color="primary" variant="contained" onClick={handleOpenDialog}>
                    Fire Coach
                </Button>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{"Are you sure you want to fire your coach?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone. Please confirm if you wish to proceed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleFireCoach} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default withStyles(styles)(ViewCoach);