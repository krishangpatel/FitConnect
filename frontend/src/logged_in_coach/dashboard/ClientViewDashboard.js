import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Typography, Alert, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import DailySurveyDialog from '../dailysurvey/DailySurveyDialog';
import { withRouter } from "react-router-dom";
import { withStyles } from '@mui/styles';
import useServerDate from '../../shared/functions/userServerDate';

const styles = (theme) => ({
  dateSection: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  exerciseName: {
    marginTop: theme.spacing(1),
  },
  workoutPlanTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  table: {
    minWidth: 300,
  },
  chartsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: theme.spacing(2.5),
  },
  workoutLogsContainer: {
    textAlign: 'center',
  },
});

function Dashboard(props) {
  const { classes } = props;
  const user_id = localStorage.getItem('client_id');
  const [weightData, setWeightData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [showSurveyAlert, setShowSurveyAlert] = useState(false);
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [hasWorkoutLogs, setHasWorkoutLogs] = useState(true);
  
  const serverDate = useServerDate();

  // Handlers to open and close daily survey
  const openSurveyDialog = () => {
    setShowSurveyDialog(true);
  };

  const closeSurveyDialog = () => {
    setShowSurveyDialog(false);
  };

  const firstName = localStorage.getItem('client_name');

  useEffect(() => {
    fetchData();
    fetchWorkoutLogs();
  }, [user_id]);

  const fetchData = async () => {
    if (!user_id) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/daily_survey/${user_id}/`);
      processResponseData(response.data);
      checkForTodaysSurvey(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchWorkoutLogs = async () => {
    if (!user_id) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/mostRecentWorkoutPlanView/${user_id}/`);
      if (response.data.error && response.data.error === "No workout logs found.") {
        setHasWorkoutLogs(false);
      } else {
        setWorkoutLogs(response.data.logs);
        setHasWorkoutLogs(true);
      }
    } catch (error) {
      console.error('Error fetching workout logs:', error);
      setHasWorkoutLogs(false);
    }
  };


  const checkForTodaysSurvey = (data) => {
    const hasTodaySurvey = data.some(entry => entry.recorded_date === serverDate);
    setShowSurveyAlert(!hasTodaySurvey);
  };

  const fetchDataAndUpdateCharts = async () => {
    await fetchData();
  };

  const processResponseData = (data) => {
    // Initialize arrays for each type of data
    const processedWeightData = [];
    const processedCalorieData = [];
    const processedWaterData = [];
    const processedMoodData = [];

    // Iterate through each entry in the fetched data
    data.forEach(entry => {
      const { recorded_date, calorie_amount, water_amount, weight, mood } = entry;

      processedWeightData.push({ date: recorded_date, weight: weight });
      processedCalorieData.push({ date: recorded_date, calories: calorie_amount });
      processedWaterData.push({ date: recorded_date, water: water_amount });
      let moodValue = 0;
      if (mood === 'Neutral') moodValue = 0;
      if (mood === 'Happy') moodValue = 1;
      if (mood === 'Sad') moodValue = -1;

      processedMoodData.push({ date: recorded_date, mood: moodValue });
    });

    // Sorting function
    const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);

    // Sort each array
    processedWeightData.sort(sortByDate);
    processedCalorieData.sort(sortByDate);
    processedWaterData.sort(sortByDate);
    processedMoodData.sort(sortByDate);

    // Update the state with the processed and sorted data
    setWeightData(processedWeightData);
    setCalorieData(processedCalorieData);
    setWaterData(processedWaterData);
    setMoodData(processedMoodData);
  };

  const getLastFiveEntries = (dataArray) => {
    if (dataArray.length <= 5) return dataArray;
    return dataArray.slice(-5); // Get last 5 elements
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`; // Format: 'month/day'
  };

  const moodFormatter = (value) => {
    switch (value) {
      case 1:
        return 'Happy';
      case 0:
        return 'Neutral';
      case -1:
        return 'Sad';
      default:
        return '';
    }
  };

  const customTooltipStyle = {
    backgroundColor: '#0e1111',
    border: '1px solid #ccc',
    padding: '10px',
    color: '#333'
  };

  const renderWorkoutLogTables = () => {
    const planTitle = workoutLogs.length > 0 ? workoutLogs[0].plan : 'Workout Plan';

    const logsGroupedByDate = workoutLogs.reduce((acc, log) => {
      const dateGroup = acc[log.completed_date] = acc[log.completed_date] || {};
      const exerciseLogs = dateGroup[log.exercise] = dateGroup[log.exercise] || [];
      exerciseLogs.push(log);
      return acc;
    }, {});

    if (!hasWorkoutLogs) {
      return (
        <div className={classes.dateSection}>
          <Typography variant="h6" className={classes.workoutPlanTitle}>
            Most recent workout plan: None (Complete a workout plan first!)
          </Typography>
        </div>
      );
    } else {
      // Map through each date group
      return Object.entries(logsGroupedByDate).map(([date, exercises], dateIndex) => (
        <div key={dateIndex} className={classes.dateSection}>
          <Typography variant="h6" className={classes.workoutPlanTitle}>
            Most recent workout plan: {planTitle}
          </Typography>
          <Paper className={classes.paper}>
            <Typography variant="h6">{date}</Typography>
            {Object.entries(exercises).map(([exerciseName, logs], exerciseIndex) => (
              <div key={exerciseIndex}>
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
                    {logs.map((log, logIndex) => (
                      <TableRow key={logIndex}>
                        <TableCell>{logIndex + 1}</TableCell>
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
    }
  };

  return (
    <Fragment>
      {showSurveyAlert && (
        <Alert severity="info" style={{ marginTop: '80px' }}>
          You haven't completed today's survey. <Button color="primary" onClick={openSurveyDialog}>Fill Survey</Button>
        </Alert>
      )}
      <Typography variant="h4" style={{ marginTop: '40px', marginBottom: '40px' }}>{firstName}'s - Client Info</Typography>
      <div className={classes.chartsContainer}>
        <div style={{ width: '48%' }}>
          <Typography variant="h6">Weight Tracker</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLastFiveEntries(weightData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis>
                <Label angle={-90} value="Weight (lbs)" position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip contentStyle={customTooltipStyle} />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '48%' }}>
          <Typography variant="h6">Calorie Tracker</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLastFiveEntries(calorieData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis>
                <Label angle={-90} value="Calories" position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip contentStyle={customTooltipStyle} />
              <Line type="monotone" dataKey="calories" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div style={{ width: '48%' }}>
          <Typography variant="h6">Water Intake</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLastFiveEntries(waterData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis>
                <Label angle={-90} value="Water (Oz)" position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip contentStyle={customTooltipStyle} />
              <Line type="monotone" dataKey="water" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '48%' }}>
          <Typography variant="h6">Mood Tracker</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLastFiveEntries(moodData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={[-1, 1]} tickFormatter={moodFormatter}/>
              <Tooltip contentStyle={customTooltipStyle} />
              <Line type="monotone" dataKey="mood" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={classes.workoutLogsContainer}>
        {renderWorkoutLogTables()}
      </div>
        <DailySurveyDialog
          userId={user_id}
          open={showSurveyDialog}
          onClose={closeSurveyDialog}
          onUpdate={fetchDataAndUpdateCharts}
        />
    </Fragment>
  );
}

Dashboard.propTypes = {
  selectDashboard: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(Dashboard));