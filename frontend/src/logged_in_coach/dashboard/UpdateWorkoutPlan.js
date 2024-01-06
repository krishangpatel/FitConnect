import React, { Fragment, useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell,
    TableHead, TableRow, IconButton, Toolbar, 
    Typography, TextField, Button, Alert
} from '@mui/material';
import { withRouter } from "react-router-dom";
import { withStyles } from '@mui/styles';
import axios from 'axios';
import useServerDate from '../../shared/functions/userServerDate';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete'
// import CheckIcon from '@mui/icons-material/Check';
// import EditIcon from '@mui/icons-material/Edit';

const styles = (theme) => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
    title: {
        marginBottom: 20,
        marginLeft: 20,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    Paper: {
        padding: "10px",
        marginTop: 40,
        marginBottom: 40
    },
    narrowTextField: {
        width: '100px',
        marginRight: theme.spacing(1),
    },
    horizontalFlexContainer: {
        display: 'flex',
        alignItems: 'center',
    },
});

const UpdateWorkoutPlan = (props) => {
    const { classes, plan } = props;
	const [exerciseEntries, setExerciseEntries] = useState(() =>
		plan && plan.exercises ? plan.exercises.map(exercise =>
			Array(exercise.sets).fill().map(() => ({
				reps: exercise.reps,
				weight: exercise.weight,
				duration: exercise.duration_minutes,
			}))
		) : []
	);
	const [recentLogs, setRecentLogs] = useState([]);
	const todaysPlanDate = localStorage.getItem('todaysPlanDate');

	const serverDate = useServerDate();

    const addExerciseEntry = (exerciseIndex) => {
        const newEntries = [...exerciseEntries];
        newEntries[exerciseIndex].push({ set: newEntries[exerciseIndex].length + 1, reps: '', weight: '', duration: '' });
        setExerciseEntries(newEntries);
    };

    const deleteExerciseEntry = (exerciseIndex, entryIndex) => {
        const updatedEntries = [...exerciseEntries];
        updatedEntries[exerciseIndex].splice(entryIndex, 1); // Remove the entry at entryIndex
        setExerciseEntries(updatedEntries);
    };

    const handleFieldChange = (exerciseIndex, entryIndex, field, value) => {
        const updatedEntries = [...exerciseEntries];
        updatedEntries[exerciseIndex][entryIndex][field] = value;
        setExerciseEntries(updatedEntries);
    };

	const submitExerciseEntries = async (exerciseIndex, exerciseId) => {
		const userId = localStorage.getItem('client_id');

		try {
			const responses = await Promise.all(
				exerciseEntries[exerciseIndex].map(entry => {
					const postData = {
						user: userId,
						exercise_in_plan: exerciseId,
						reps: entry.reps,
						weight: entry.weight,
						duration_minutes: entry.duration,
						completed_date: serverDate,
					};

					return axios.post(`${process.env.REACT_APP_API_BASE_URL}fitConnect/create_workout_log/`, postData, {
						headers: {
							'Content-Type': 'application/json',
						},
					});
				})
			);

			console.log('Entries for exercise ' + exerciseId + ' submitted:', responses.map(response => response.data));

			await fetchAndCheckWorkoutLogs();

		} catch (error) {
			console.error('Error submitting entries:', error.response ? error.response.data : error);
		}
	};


    const fetchAndCheckWorkoutLogs = async () => {
        const userId = localStorage.getItem('client_id');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}fitConnect/mostRecentWorkoutPlanView/${userId}`);
            setRecentLogs(response.data.logs || []);
        } catch (error) {
            console.error('Error fetching workout logs:', error);
        }
    };

    const getIncompleteExercises = () => {

        if (plan && Array.isArray(plan.exercises)) {
            return plan.exercises.filter(exercise =>
                !recentLogs.some(log => log.exercise === exercise.exercise.name && log.completed_date === serverDate)
            ).map(exercise => exercise.exercise.name);
        }

        return [];
    };

    useEffect(() => {
        fetchAndCheckWorkoutLogs();
    }, []);

	const incompleteExercises = getIncompleteExercises();

    if (!plan || !plan.exercises || plan.exercises.length === 0) {
        return <div className={classes.container}>No exercises found for this plan.</div>;
    }

    return (
        <Fragment>
			{incompleteExercises.length === 0 ? (
				<Alert severity="success">Great job! You have completed your entire workout plan for today.</Alert>
			) : (
				<Alert severity="warning">
					You still need to complete the following exercises today: {incompleteExercises.join(', ')}.
				</Alert>
			)}
            <div className={classes.container}>
                <Paper className={classes.Paper}>
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="h4">{plan.plan_name}</Typography>
                    </Toolbar>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Exercise Name</TableCell>
                                <TableCell>Sets</TableCell>
                                <TableCell>Reps</TableCell>
                                <TableCell>Weight</TableCell>
                                <TableCell>Duration (mins)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plan.exercises.map((exercise, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className={classes.toolbar}>
                                            <Typography variant="subtitle1">{exercise.exercise.name}</Typography>
                                        </div>
                                    </TableCell>
                                    <TableCell>{exercise.sets}</TableCell>
                                    <TableCell>{exercise.reps}</TableCell>
                                    <TableCell>{exercise.weight}</TableCell>
                                    <TableCell>{exercise.duration_minutes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
				{plan.exercises.map((exercise, exerciseIndex) => {
					const completedExercise = recentLogs.find(log =>
						log.exercise === exercise.exercise.name && log.completed_date === todaysPlanDate
					);
					const completedExerciseLogs = recentLogs.filter(log =>
						log.exercise === exercise.exercise.name && log.completed_date === todaysPlanDate
					);

					return (
						<Paper key={exerciseIndex} className={classes.Paper}>
							<Toolbar className={classes.toolbar}>
								<Typography variant="h6">{exercise.exercise.name}</Typography>
								{!completedExercise && (
									<>
										<Button onClick={() => submitExerciseEntries(exerciseIndex, exercise.exercise_in_plan_id)} color="primary">Submit Entries</Button>
										<IconButton onClick={() => addExerciseEntry(exerciseIndex)}>
											<AddCircleOutlineIcon />
											<Typography variant="subtitle2">Add Entry</Typography>
										</IconButton>
									</>
								)}
							</Toolbar>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Set</TableCell>
										<TableCell>Reps</TableCell>
										<TableCell>Weight</TableCell>
										<TableCell>Duration (mins)</TableCell>
										{!completedExercise && (
										<TableCell></TableCell>
										)}
									</TableRow>
								</TableHead>
								<TableBody>
									{completedExerciseLogs.length > 0 ? (
										completedExerciseLogs.map((logEntry, logIndex) => (
											<TableRow key={logIndex}>
												<TableCell>
													{logIndex + 1} / {exercise.sets}
												</TableCell>
												<TableCell>{logEntry.reps}</TableCell>
												<TableCell>{logEntry.weight}</TableCell>
												<TableCell>{logEntry.duration_minutes}</TableCell>
											</TableRow>
										))
									) : (
										exerciseEntries[exerciseIndex].map((entry, entryIndex) => {
											return (
											<TableRow key={entryIndex}>
												<TableCell>
													<div className={classes.horizontalFlexContainer}>
														<Typography variant="subtitle1">
															{entry.set}{' / '}{exercise.sets}
														</Typography>
													</div>    
												</TableCell>
												<TableCell>
													<div className={classes.horizontalFlexContainer}>
														<TextField
															type="number"
															value={entry.reps}
															variant="standard"
															onChange={(e) => handleFieldChange(exerciseIndex, entryIndex, 'reps', e.target.value)}
															className={classes.narrowTextField}
														/>
														<Typography
															variant="subtitle1"
														>
															/ {exercise.reps}
														</Typography>
													</div>
												</TableCell>
												<TableCell>
													<div className={classes.horizontalFlexContainer}>
														<TextField
															type="number"
															value={entry.weight}
															variant="standard"
															onChange={(e) => handleFieldChange(exerciseIndex, entryIndex, 'weight', e.target.value)}
															className={classes.narrowTextField}
														/>
														<Typography
															variant="subtitle1"
														>
															/ {exercise.weight}
														</Typography>
													</div>
												</TableCell>
												<TableCell>
													<div className={classes.horizontalFlexContainer}>
														<TextField
															type="number"
															value={entry.duration}
															variant="standard"
															onChange={(e) => handleFieldChange(exerciseIndex, entryIndex, 'duration', e.target.value)}
															className={classes.narrowTextField}
														/>
														<Typography
															variant="subtitle1"
														>
															/ {exercise.duration_minutes}
														</Typography>
													</div>
												</TableCell>
												<TableCell>
													<IconButton
														onClick={() => deleteExerciseEntry(exerciseIndex, entryIndex)}
														aria-label="Delete entry"
													>
														<DeleteIcon />
													</IconButton>
												</TableCell>
											</TableRow>
											);
										})
									)}
								</TableBody>
							</Table>
						</Paper>
					);
				})}
            </div>
        </Fragment>
    );
};

export default withRouter(withStyles(styles)(UpdateWorkoutPlan));