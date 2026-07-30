import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

import withStyles from "@mui/styles/withStyles";

const styles = (theme) => ({
  iconWrapper: {
    borderRadius: theme.shape.borderRadius,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    position: "relative",
    padding: theme.spacing(1) * 1.5,
    '&::before': {
      content: '""',
      display: "block",
      paddingBottom: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      borderRadius: theme.shape.borderRadius,
    },
  },
  icon: {
    position: "relative",
    zIndex: 1,
  },
  centeredText: {
    textAlign: "center",
  },
});

function FeatureCard(props) {
  const { classes, Icon, color, headline, text } = props;
  return (
    <Fragment>
      <div className={classes.iconWrapper} style={{ color: color, fill: color }}>
        <div className={classes.icon}>
          {Icon}
        </div>
      </div>
      <Typography variant="h5" paragraph className={classes.centeredText}>
        {headline}
      </Typography>
      <Typography variant="body1" color="textSecondary" className={classes.centeredText}>
        {text}
      </Typography>
    </Fragment>
  );
}

FeatureCard.propTypes = {
  classes: PropTypes.object.isRequired,
  Icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(FeatureCard);
