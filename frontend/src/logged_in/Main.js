import React, { memo, useCallback, useState, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from '@mui/styles/withStyles';
import Routing from "./Routing";
import NavBar from "./navigation/UserNavBar";
import ConsecutiveSnackbarMessages from "../shared/components/ConsecutiveSnackbarMessages";
import smoothScrollTop from "../shared/functions/smoothScrollTop";

const styles = (theme) => ({
  main: {
    marginTop: '100px',
    marginLeft: theme.spacing(9),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
});
function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);

  const selectDashboard = useCallback(() => {
    smoothScrollTop();
    document.title = "FitConnect - User Dashboard";
    setSelectedTab("Dashboard");
  }, [setSelectedTab]);

  const selectCoach = useCallback(() => {
    smoothScrollTop();
    document.title = "FitConnect - Coaches";
    setSelectedTab("Coaches");
  }, [setSelectedTab]);

  const selectWorkoutPlan = useCallback(() => {
    smoothScrollTop();
    document.title = "FitConnect - Workout Plan";
    setSelectedTab("Workout Plan");
  }, [setSelectedTab]);


  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );

  return (
    <Fragment>
      <NavBar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        messages={[]}
      />
      <ConsecutiveSnackbarMessages
        getPushMessageFromChild={getPushMessageFromChild}
      />
      <main className={classNames(classes.main)}>
        <Routing
          pushMessageToSnackbar={pushMessageToSnackbar}
          selectDashboard={selectDashboard}
          selectCoach={selectCoach}
          selectWorkoutPlan={selectWorkoutPlan}
        />
      </main>
    </Fragment>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));