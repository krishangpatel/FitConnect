import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import withStyles from '@mui/styles/withStyles';
import Dashboard from "./dashboard/Dashboard";
import Coach from "./coach/Coach";
import WorkoutPlan from "./workoutplan/WorkoutPlan"
import MyRequests from "./dashboard/MyRequests";
import MyClients from "./dashboard/MyClients";
import Clients from "./dashboard/ClientView";
import ClientsDashboard from "./dashboard/ClientViewDashboard";
import PropsRoute from "../shared/components/PropsRoute";
import useLocationBlocker from "../shared/functions/useLocationBlocker";

const styles = (theme) => ({
  wrapper: {
    width: '100%',
    height: '100vh', 
    margin: 0, 
    padding: 0, 
    overflow: 'hidden',
  },
});

function Routing(props) {
  const {
    classes,
    pushMessageToSnackbar,
    selectDashboard,
    selectCoach,
    selectWorkoutPlan,
  } = props;
  useLocationBlocker();
  const [storedUserId, setStoredUserId] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setStoredUserId(userId);
  }, []);
  
  return (
    <div className={classes.wrapper}>
      <Switch>
      <PropsRoute
          path="/c/dashboard"
          user_id={storedUserId}
          component={Dashboard}
          selectDashboard={selectDashboard}
        />
        <PropsRoute
          path="/c/coaches"
          component={Coach}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectCoach={selectCoach}
        />
        <PropsRoute
          path="/c/workoutplan"
          component={WorkoutPlan}
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectWorkoutPlan={selectWorkoutPlan}
        />
        <PropsRoute
          path="/c/my-requests"
          user_id={storedUserId}
          component={MyRequests}
          selectDashboard={selectDashboard}
        />
        <PropsRoute
          path="/c/my-clients"
          user_id={storedUserId}
          component={MyClients}
          selectDashboard={selectDashboard}
        />
        <PropsRoute
          path="/c/clientview"
          user_id={storedUserId}
          component={Clients}
          selectDashboard={selectWorkoutPlan}
        />
        <PropsRoute
          path="/c/clientviewdashboard"
          user_id={storedUserId}
          component={ClientsDashboard}
          selectDashboard={selectWorkoutPlan}
        />
      </Switch>
    </div>
  );
}

Routing.propTypes = {
  classes: PropTypes.object.isRequired,
  EmojiTextArea: PropTypes.elementType,
  ImageCropper: PropTypes.elementType,
  Dropzone: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  pushMessageToSnackbar: PropTypes.func,
  toggleAccountActivation: PropTypes.func,
  selectDashboard: PropTypes.func.isRequired,
  selectCoach: PropTypes.func.isRequired,
  selectWorkoutPlan: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Routing));