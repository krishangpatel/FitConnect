import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid, Paper, Typography, TextField, Button, Pagination,
    Dialog, DialogActions, DialogContent
} from '@mui/material';
import { withStyles } from '@mui/styles'
import SearchIcon from '@mui/icons-material/Search';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CableIcon from '@mui/icons-material/Cable';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AdjustIcon from '@mui/icons-material/Adjust';
import classNames from 'classnames';

const styles = (theme) => ({
    searchContainer: {
        padding: theme.spacing(2),
    },
    exerciseBox: {
        padding: theme.spacing(1),
        textAlign: 'center',
        width: '100%',
        aspectRatio: '1 / 1',
        border: '1px solid #ddd',
        backgroundColor: 'transparent',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'default',
        '&:hover': {
            transform: 'scale(1.05)',
            cursor: 'pointer',
        },
    },
    icon: {
        fontSize: 40,
    },
    gridContainer: {
        maxWidth: 'calc(100% - 16px)',
        margin: 'auto',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(2),
    },
});

function ExerciseBox({ exercise, classes, onExerciseClick }) {
    const Icon = getIconForEquipmentName(exercise.equipment_name);

    return (
        <Grid item xs={6} sm={4} md={2} lg={1.714}>
            <Paper className={classes.exerciseBox} onClick={() => onExerciseClick(exercise)}>
                <Icon className={classes.icon} />
                <Typography variant="subtitle2" style={{ marginTop: "10px" }}>{exercise.name}</Typography>
            </Paper>
        </Grid>
    );
}

function getIconForEquipmentName(equipmentName) {
    switch (equipmentName.toLowerCase()) {
        case 'none': return DirectionsRunIcon;
        case 'barbell': return FitnessCenterIcon;
        case 'dumbbells': return FitnessCenterIcon;
        case 'cables': return CableIcon;
        case 'band': return LineWeightIcon;
        case 'kettlebell': return LocalMallIcon;
        case 'plate': return AdjustIcon;
        default: return DirectionsRunIcon;
    }
}

function ExerciseBank({ classes, onExerciseClick, isDialogMode, onAddExercise }) {
    const [exercises, setExercises] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}fitConnect/exercises`)
            .then(response => {
                const exercisesWithId = response.data.map((exercise, index) => ({
                    ...exercise,
                    exercise_id: index + 1
                }));
                setExercises(exercisesWithId);
                setFilteredExercises(exercisesWithId);
            })
            .catch(error => console.log(error));
    }, []);


    useEffect(() => {
        const filtered = exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.muscle_group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.equipment_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredExercises(filtered);
        setCurrentPage(1);
    }, [searchTerm, exercises]);

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedExercise(null);
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const paginate = (event, value) => {
        setCurrentPage(value);
    };

    const exercisesPerPage = 14;
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

    const handleAddExercise = (exercise) => {
        if (isDialogMode && onAddExercise) {
            onAddExercise(exercise);
        }
    };

    return (
        <div className={classNames("container-fluid", classes.containerFix, classes.textWhite)}>
            <Paper className={classes.searchContainer}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <TextField
                            fullWidth
                            label="Find an exercise"
                            placeholder="Search for exercises by name, muscle group, or equipment type"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
                            Search
                        </Button>
                    </Grid>
                </Grid>
            <Grid container spacing={3} className={classes.gridContainer}>
                {currentExercises.map(exercise => (
                    <ExerciseBox
                        key={exercise.name}
                        exercise={exercise}
                        classes={classes}
                        onExerciseClick={handleExerciseClick}
                        isDialogMode={isDialogMode}
                    />
                ))}
            </Grid>
            <div className={classes.paginationContainer}>
                <Pagination
                    count={Math.ceil(filteredExercises.length / exercisesPerPage)}
                    page={currentPage}
                    onChange={paginate}
                    color="primary"
                />
            </div>
            </Paper>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="exercise-dialog-title"
                aria-describedby="exercise-dialog-description"
            >
                <DialogContent>
                    <Typography variant='h6' style={{ marginBottom: "10px" }}>Exercise: {selectedExercise ? selectedExercise.name : ''}</Typography>
                    <Typography variant='subtitle1'>Muscle Group: {selectedExercise ? selectedExercise.muscle_group_name : ''}</Typography>
                    <Typography variant='subtitle1'>Equipment: {selectedExercise ? selectedExercise.equipment_name : ''}</Typography>
                    <Typography variant='subtitle1' style={{ marginTop: "10px" }}>
                        Description: {selectedExercise ? selectedExercise.description : ''}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {isDialogMode && (
                        <Button onClick={() => handleAddExercise(selectedExercise)} color="primary">
                            Add Exercise
                        </Button>
                    )}
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default withStyles(styles, { withTheme: true })(ExerciseBank);