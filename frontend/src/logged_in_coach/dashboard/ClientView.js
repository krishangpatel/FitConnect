import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Grid, Divider } from '@mui/material';
import withStyles from '@mui/styles/withStyles';

import WorkoutPlanList from "./WorkoutPlanList";
import ReadWorkoutPlan from "./ReadWorkoutPlan";
import UpdateWorkoutPlan from "./UpdateWorkoutPlan";
import EditWorkoutPlan from "./EditWorkoutPlan";
import CreateWorkoutPlan from "./CreateWorkoutPlan";

const styles = (theme) => ({
  PlanList: {
    width: "300px",
    height: '100vh',
  },
});

function WorkoutPlan(props) {
  const { classes } = props;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [viewMode, setViewMode] = useState('viewingPlan');

  const userId = localStorage.getItem('client_id');

  const fetchWorkoutPlans = async () => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/users/${userId}/plans`, { signal: controller.signal });
      if (!isMounted) return;

      const data = await response.json();
      setWorkoutPlans(data);
    } catch (error) {
      if (isMounted) {
        console.error('Error fetching workout plans:', error);
      }
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  useEffect(() => {
    const cleanup = fetchWorkoutPlans();
    return cleanup;
  }, []);


  // Function to handle selection of a plan
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setViewMode('viewingPlan');
  };

  // Function to handle creating a new plan
  const handleCreateNewPlan = () => {
    setSelectedPlan(null);
    setViewMode('creatingPlan');
  };

  // Function to handle selection of today's plan
  const handleSelectTodaysPlan = (plan) => {
    setSelectedPlan(plan);
    setViewMode('updatingPlan');
  };

  // Function to handle saving of a new plan
  const handleSaveNewPlan = (newPlan) => {
    setWorkoutPlans([...workoutPlans, newPlan]);
    setViewMode('viewingPlan');
    fetchWorkoutPlans();
  };

  const handleEditPlan = (plan) => {
    setViewMode('viewingPlan');
    fetchWorkoutPlans();
  };

  const handleCancel = (plan) => {
    setSelectedPlan(plan);
    setViewMode('viewingPlan')
  }

  // Initialize selectedPlan and viewMode based on today's plan
  useEffect(() => {
    const savedTodaysPlan = localStorage.getItem('todaysPlan');
    if (savedTodaysPlan) {
      setSelectedPlan(JSON.parse(savedTodaysPlan));
      setViewMode('updatingPlan');
    } else {
      setViewMode('viewingPlan');
    }
  }, []);

  return (
    <Fragment>
      <Grid container className={classes.fullHeight}>
        <Grid item className={classes.PlanList}>
          <WorkoutPlanList
            plans={workoutPlans}
            onSelectPlan={handleSelectPlan}
            onCreateNewPlan={handleCreateNewPlan}
            onSelectTodaysPlan={handleSelectTodaysPlan}
          />  
        </Grid>
        
        <Divider orientation="vertical" flexItem className={classes.fullHeight} />
        <Grid item xs className={classes.fullHeight}>
          {viewMode === 'creatingPlan' && <CreateWorkoutPlan onSave={handleSaveNewPlan} />}
          {viewMode === 'updatingPlan' && <UpdateWorkoutPlan plan={selectedPlan} />}
          {viewMode === 'editingPlan' && <EditWorkoutPlan plan={selectedPlan} onSave={handleEditPlan} onCancel={handleCancel} />}
          {viewMode === 'viewingPlan' && <ReadWorkoutPlan plan={selectedPlan} editHandler={()=> setViewMode('editingPlan')} />}
        </Grid>
      </Grid>
    </Fragment>
  );
}

WorkoutPlan.propTypes = {
  pushMessageToSnackbar: PropTypes.func,
  selectWorkoutPlan: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(WorkoutPlan));