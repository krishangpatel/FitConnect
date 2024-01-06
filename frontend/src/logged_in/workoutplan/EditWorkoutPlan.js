import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Table, TableBody, 
         TableCell, TableHead, TableRow, Toolbar, IconButton, 
         Dialog, Snackbar, Alert, Paper, Checkbox } from '@mui/material';
import { withStyles } from '@mui/styles';
import ExerciseBank from '../../shared/components/ExerciseBank';
import axios from 'axios';

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


const EditWorkoutPlan = (props) => {
    const { classes, plan, onSave, onCancel } = props;

    const [planTitle, setPlanTitle] = useState(plan.plan_name);
    const [exercises, setExercises] = useState(plan.exercises);
    const [openExerciseBank, setOpenExerciseBank] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const [checkedExercises, setCheckedExercises] = useState([]);

  const handleToggleCheckbox = (exerciseId) => {
    const newCheckedExercises = checkedExercises.includes(exerciseId)
      ? checkedExercises.filter(id => id !== exerciseId)
      : [...checkedExercises, exerciseId];

    setCheckedExercises(newCheckedExercises);
  };

    useEffect(() => {
        const editedExercises = plan.exercises.map((item) => {
            return {...item, duration_minutes: item.duration_minutes, name: item.exercise.name, description: item.exercise.description, editMode: false};
        });
        setExercises(editedExercises);
    }, [plan])
    


    const handleAddExercise = exercise => {
        setExercises([...exercises, { ...exercise, editMode: true }]);
        setOpenExerciseBank(false);
    };

    const toggleExerciseBankDialog = () => {
        setOpenExerciseBank(!openExerciseBank);
    };

    const handleFieldChange = (index, field, value) => {
        const editedExercises = exercises.map((exercise, idx) => {
            if (idx === index) {
                return { ...exercise, [field]: value };
            }
            return exercise;
        });
        setExercises(editedExercises);
    };

    const handleCancel = () => {
        onCancel(plan)
    };


    const handleDeleteCheckedExercises = async () => {
        try {
          const deletePromises = checkedExercises.map(async (exerciseId) => {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}fitConnect/exercise_in_plan/${exerciseId}`);
            
            if (response.status !== 204) {
              console.error(`Failed to delete exercise with ID ${exerciseId}`);
              // Handle error as needed
            }
          });
      
          await Promise.all(deletePromises);
      
          // Update local state to reflect deletions
          const updatedExercises = exercises.filter(exercise => !checkedExercises.includes(exercise.exercise_in_plan_id));
          setExercises(updatedExercises);
          setSnackbar({ open: true, message: 'Exercises deleted successfully!', severity: 'success' });
          setCheckedExercises([]); // Clear checked exercises after deletion
          onSave();  // Perform any action after all deletions are successful
          window.location.reload();
        } catch (error) {
          console.error('Error deleting exercises:', error);
          setSnackbar({ open: true, message: 'An error occurred while deleting exercises.', severity: 'error' });
        }
      };
    const toggleEditMode = (index) => {
        const editedExercises = exercises.map((exercise, idx) => {
            if (idx === index) {
                return { ...exercise, editMode: !exercise.editMode };
            }
            return exercise;
        });
        setExercises(editedExercises);
    };

    const handleSave = async () => {
            try {
                for (const exercise of exercises) {
                    const workoutPlanData = {
                        plan: plan.plan_id,
                        plan_id: plan.plan_id,
                        exercise_in_plan_id: exercise.exercise_in_plan_id,
                        exercise: exercise.exercise_id,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        weight: exercise.weight,
                        duration_minutes: exercise.duration_minutes,
                    };
                    console.log(workoutPlanData)
                    if (!workoutPlanData.exercise_in_plan_id){
                        delete exercise.exercise_in_plan_id;
                        delete exercise.plan;
                        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}fitConnect/exercise_in_plan/`, workoutPlanData);
                        if (response.status !== 201) {
                            console.error(`Failed to insert new exercise to workoutplan`);
                        }
                        continue;
                    }
                    delete exercise.plan_id
                    delete exercise.exercise
                    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}fitConnect/exercise_in_plan/${exercise.exercise_in_plan_id}`, workoutPlanData);
        
                    if (response.status !== 200) {
                        console.error(`Failed to update workout plan for exercise with ID ${exercise.exercise_in_plan_id}`);
                    }
                }
                onSave();
                setSnackbar({ open: true, message: 'Workout plans updated successfully!', severity: 'success' });
            } catch (error) {
                console.error('Error updating workout plans:', error);
                setSnackbar({ open: true, message: 'An error occurred while updating workout plans.', severity: 'error' });
            }
        };
   
    return (
        <div className={classes.container}>
            <Paper className={classes.Paper}>
                <Typography variant="h6">Edit {planTitle}</Typography>                
                <Button variant="contained" color="primary" onClick={handleSave} className={classes.button}>
                    Update Plan
                </Button>
                <Button variant="outlined" color="primary" onClick={handleCancel} className={classes.button}>
                    Cancel
                </Button>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6">Workout Plan</Typography>
                    <IconButton color="primary" onClick={toggleExerciseBankDialog}>
                        <AddCircleOutlineIcon />
                        <Typography variant="subtitle2">Add Exercise</Typography>
                    </IconButton>
                    <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteCheckedExercises}
          disabled={checkedExercises.length === 0}
        >
          Delete Checked Exercises
        </Button>
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
                                {['sets', 'reps', 'weight', 'duration_minutes'].map(field => (
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
                                <TableCell>
                <Checkbox
                  checked={checkedExercises.includes(exercise.exercise_in_plan_id)}
                  onChange={() => handleToggleCheckbox(exercise.exercise_in_plan_id)}
                />
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

export default withStyles(styles, { withTheme: true })(EditWorkoutPlan);