import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, 
         TableCell, TableHead, TableRow, 
         Paper, Button, Toolbar } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    table: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        marginBottom: 20,
        marginLeft: 20,
    },
    Paper: {
        padding: "10px",
        marginTop: 40,
        marginBottom: 40
    },
    dateSection: {
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(2),
    },
    exerciseName: {
        fontWeight: 'bold',
        margin: theme.spacing(1, 0),
    },
    viewLogsButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    }
});


const ReadWorkoutPlan = ({ plan, classes, editHandler }) => {
    const [showLogs, setShowLogs] = useState(false);
    const [items, setItems] = useState([]);
    const [todaysPlanId, setTodaysPlanId] = useState('');

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const todaysPlan = localStorage.getItem('todaysPlan');
        const parsedPlan = JSON.parse(todaysPlan);
        if (parsedPlan) {
            setTodaysPlanId(parsedPlan.plan_id);
        }
    }, []);


    useEffect(() => {
        setShowLogs(false);

        const fetchWorkoutLogs = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/view_workout_logs/${plan.plan_id}`);

                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching workout logs:', error);
            }
        };

        if (plan ) {
            fetchWorkoutLogs();
        }
        return () => setItems([]);
    }, [userId, plan]);

    const handleToggleLogs = () => {
        setShowLogs(!showLogs);
    };

    const renderWorkoutLogTables = () => {
        // Group logs by date
        const logsGroupedByDate = items.reduce((acc, log) => {
            const dateGroup = acc[log.completed_date] = acc[log.completed_date] || {};
            const exerciseLogs = dateGroup[log.exercise] = dateGroup[log.exercise] || [];
            exerciseLogs.push(log);
            return acc;
        }, {});

        if (items.length === 0) {
            return (
              <div className={classes.dateSection}>
                <Paper className={classes.Paper}>
                  <Typography variant="subtitle1" className={classes.exerciseName}>No Logs</Typography>
                </Paper>
              </div>
            );
          }
        // Map through each date group
        return Object.entries(logsGroupedByDate).map(([date, exercises]) => (
            <div key={date} className={classes.dateSection}>
                <Paper className={classes.Paper}>
                <Typography variant="h6">{date}</Typography>
                {Object.entries(exercises).map(([exerciseName, logs], index) => (
                    <div key={index}>
                        <Typography variant="subtitle1" className={classes.exerciseName}>{exerciseName}</Typography>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Set</TableCell>
                                    <TableCell>Reps</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Duration (mins)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{log.reps}</TableCell>
                                        <TableCell>{log.weight}</TableCell>
                                        <TableCell>{log.duration_minutes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ))}
                </Paper>
            </div>
        ));
    };

    if (!plan) {
        return <div className={classes.container}>
        <div>
            <p>Select a workout plan.</p>
        </div>
    </div>
    }
    if (!plan.exercises || plan.exercises.length === 0) {
        return <div className={classes.container}>
        <div>
            <p>No exercises found for {plan.plan_name}.</p>
            <Button
                variant="contained"
                color="primary"
                onClick={editHandler}
                style={{ marginTop: '10px' }}
            >
                Edit Plan
            </Button>
        </div>
    </div>
    }
    
    return (
        <div className={classes.container}>
            <Paper className={classes.Paper}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h4">{plan.plan_name}</Typography>
                    {(todaysPlanId === null) || plan.plan_id !== todaysPlanId && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editHandler}
                            style={{ marginTop: '10px' }}
                        >
                            Edit Plan
                        </Button>
                    )}
                    
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

            <Button onClick={handleToggleLogs} className={classes.viewLogsButton}>
                {showLogs ? 'Hide Logs' : 'View Logs'}
            </Button>

            {showLogs && (
                <div>
                    {renderWorkoutLogTables()}
                </div>
            )}
        </div>
    );
};

export default withStyles(styles)(ReadWorkoutPlan);
