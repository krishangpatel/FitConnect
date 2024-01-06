import React, { useState } from 'react';
import { TextField, Button, Typography, Table, TableBody, 
         TableCell, TableHead, TableRow, Toolbar, IconButton, 
         Dialog, Snackbar, Alert, Paper } from '@mui/material';
import { withStyles } from '@mui/styles';
import ExerciseBank from '../../shared/components/ExerciseBank';
import axios from 'axios';
import useServerDate from '../../shared/functions/userServerDate';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
    textField: {
        marginBottom: theme.spacing(2),
        width: '100%',
    },
    button: {
        marginBottom: theme.spacing(2),
    },
    table: {
        marginTop: theme.spacing(2),
    },
    toolbar: {
        justifyContent: 'space-between',
        padding: theme.spacing(1),
    },
    Paper: {
        padding: "10px"
    }
});

const userId = localStorage.getItem('user_id');

const CreateWorkoutPlan = ({ onSave, classes }) => {
    const [planTitle, setPlanTitle] = useState('');
    const [exercises, setExercises] = useState([]);
    const [openExerciseBank, setOpenExerciseBank] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const serverDate = useServerDate();

    const handleAddExercise = exercise => {
        setExercises([...exercises, { ...exercise, editMode: true }]);
        setOpenExerciseBank(false);
    };

    const toggleExerciseBankDialog = () => {
        setOpenExerciseBank(!openExerciseBank);
    };

    const handleFieldChange = (index, field, value) => {
        const updatedExercises = exercises.map((exercise, idx) => {
            if (idx === index) {
                return { ...exercise, [field]: value };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    const toggleEditMode = (index) => {
        const updatedExercises = exercises.map((exercise, idx) => {
            if (idx === index) {
                return { ...exercise, editMode: !exercise.editMode };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    const handleSave = async () => {

        const workoutPlanData = {
            user: userId,
            planName: planTitle,
            creationDate: serverDate,
            exercises: exercises.map(exercise => ({
                exercise: exercise.exercise_id,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                durationMinutes: exercise.duration 
            }))
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}fitConnect/create_workout_plan`, workoutPlanData);
            if (response.data.status === 'success') {
                onSave(response.data.newPlan);
                setSnackbar({ open: true, message: 'Workout plan saved successfully!', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: 'Failed to save workout plan.', severity: 'error' });
            }
        } catch (error) {
            console.error('Error saving workout plan:', error);
            setSnackbar({ open: true, message: 'An error occurred while saving.', severity: 'error' });
        }
    };


    return (
        <div className={classes.container}>
            <Paper className={classes.Paper}>
                <Typography variant="h6">Create New Workout Plan</Typography>
                <TextField
                    label="Plan Title"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    margin="normal"
                    className={classes.textField}
                />
                <Button variant="contained" color="primary" onClick={handleSave} className={classes.button}>
                    Save Plan
                </Button>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6">Workout Plan</Typography>
                    <IconButton color="primary" onClick={toggleExerciseBankDialog}>
                        <AddCircleOutlineIcon />
                        <Typography variant="subtitle2">Add Exercise</Typography>
                    </IconButton>
                </Toolbar>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Exercise Name</TableCell>
                            <TableCell>Sets</TableCell>
                            <TableCell>Reps</TableCell>
                            <TableCell>Weight</TableCell>
                            <TableCell>Duration (mins)</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises.map((exercise, index) => (
                            <TableRow key={index}>
                                <TableCell>{exercise.name}</TableCell>
                                {['sets', 'reps', 'weight', 'duration'].map(field => (
                                    <TableCell key={field}>
                                        {exercise.editMode ? (
                                            <TextField
                                                value={exercise[field] || ''}
                                                onChange={(e) => handleFieldChange(index, field, e.target.value)}
                                                type="number"
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        ) : (
                                            exercise[field] || ''
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <IconButton onClick={() => toggleEditMode(index)}>
                                        {exercise.editMode ? <CheckIcon /> : <EditIcon />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Dialog
                    open={openExerciseBank}
                    onClose={toggleExerciseBankDialog}
                    maxWidth="lg"
                    fullWidth
                >
                    <ExerciseBank
                        onAddExercise={handleAddExercise}
                        isDialogMode={true}
                    />
                </Dialog>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </div>
    );
};

export default withStyles(styles, { withTheme: true })(CreateWorkoutPlan);