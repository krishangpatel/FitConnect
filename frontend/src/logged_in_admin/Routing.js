import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import withStyles from '@mui/styles/withStyles';
import Dashboard from "./dashboard/Dashboard";
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
// what is /c/ when creating paths?
// the highlight around dashboard tab