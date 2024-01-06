import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import withStyles from '@mui/styles/withStyles';

import HeadSection from "./HeadSection";
import TopCoachesSection from "./TopCoachesSection";
import FeaturesSection from "./FeaturesSection";
import ExerciseBankSection from "./ExerciseBankSection";

const styles = (theme) => ({
  wrapper: {
    backgroundColor: theme.palette.common.darkBlack,
    overflowX: "hidden",
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      margin: '0 20.75%',
    },
  },
});

function Home(props) {
  const { selectHome, classes } = props;
  useEffect(() => {
    selectHome();
  }, [selectHome]);
  return (
    <Fragment>
      <HeadSection />
      <div className={classes.wrapper}>
        <FeaturesSection />
        <TopCoachesSection />
        <ExerciseBankSection />
      </div>
    </Fragment>
  );
}

Home.propTypes = {
  selectHome: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(Home);