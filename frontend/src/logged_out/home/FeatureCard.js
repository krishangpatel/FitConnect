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

// function shadeColor(hex, percent) {
//   const f = parseInt(hex.slice(1), 16);

//   const t = percent < 0 ? 0 : 255;

//   const p = percent < 0 ? percent * -1 : percent;

//   const R = f >> 16;

//   const G = (f >> 8) & 0x00ff;

//   const B = f & 0x0000ff;
//   return `#${(
//     0x1000000 +
//     (Math.round((t - R) * p) + R) * 0x10000 +
//     (Math.round((t - G) * p) + G) * 0x100 +
//     (Math.round((t - B) * p) + B)
//   )
//     .toString(16)
//     .slice(1)}`;
// }

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
