import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import withStyles from '@mui/styles/withStyles';
import Dashboard from "./dashboard/Dashboard";
import Coach from "./coach/Coach";
import WorkoutPlan from "./workoutplan/WorkoutPlan"
import PropsRoute from "../shared/components/PropsRoute";
import useLocationBlocker from "../shared/functions/useLocationBlocker";

const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    width: "auto",
    [theme.breakpoints.up("xs")]: {
      width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "90%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "82.5%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      width: "70%",
      marginLeft: "auto",
      marginRight: "auto",
    },
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
      </Switch>
    </div>
  );
}

Routing.propTypes = {
  classes: PropTypes.object.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  toggleAccountActivation: PropTypes.func,
  selectDashboard: PropTypes.func.isRequired,
  selectCoach: PropTypes.func.isRequired,
  selectWorkoutPlan: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Routing));
