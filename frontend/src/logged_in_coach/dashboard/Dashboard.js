import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Typography, Alert, Button } from '@mui/material';
import DailySurveyDialog from '../dailysurvey/DailySurveyDialog';
function Dashboard(props) {
  const { selectDashboard, user_id } = props;
  const [weightData, setWeightData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [showSurveyAlert, setShowSurveyAlert] = useState(false);
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);

  // Handlers to open and close daily survey
  const openSurveyDialog = () => {
    setShowSurveyDialog(true);
  };

  const closeSurveyDialog = () => {
    setShowSurveyDialog(false);
  };

  const firstName = localStorage.getItem('first_name');

  useEffect(() => {
    selectDashboard();
    fetchData();
  }, [selectDashboard, user_id]);

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

  const checkForTodaysSurvey = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const hasTodaySurvey = data.some(entry => entry.recorded_date === today);
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

  return (
    <Fragment>
      {showSurveyAlert && (
        <Alert severity="info" style={{ marginTop: '80px' }}>
          You haven't completed today's survey. <Button color="primary" onClick={openSurveyDialog}>Fill Survey</Button>
        </Alert>
      )}
      <Typography variant="h4" style={{ marginTop: '40px', marginBottom: '40px' }}>Welcome back, {firstName}</Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
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
  // weightData: PropTypes.array.isRequired,
  // calorieData: PropTypes.array.isRequired,
  // waterData: PropTypes.array.isRequired,
  // moodData: PropTypes.array.isRequired,
  selectDashboard: PropTypes.func.isRequired,
};

export default Dashboard;
