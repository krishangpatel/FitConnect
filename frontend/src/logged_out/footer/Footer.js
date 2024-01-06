import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
} from "@mui/material";
import withStyles from "@mui/styles/withStyles";
// import WaveBorder from "../../shared/components/WaveBorder";
import useMediaQuery from "@mui/material/useMediaQuery";
import classNames from "classnames";

const styles = (theme) => ({
  footerInner: {
    backgroundColor: theme.palette.common.black,
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(10),
      paddingLeft: theme.spacing(16),
      paddingRight: theme.spacing(16),
      paddingBottom: theme.spacing(10),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  },
  blackBg: {
    backgroundColor: theme.palette.common.black,
  },
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.common.black,
    paddingBottom: theme.spacing(2),
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100px",
      backgroundColor: "#0e1111",
      transform: "skewY(1deg)",
      transformOrigin: "100%",
      zIndex: 3
    },
  },
});

function Footer(props) {
  const { classes, theme } = props;
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <footer className={classNames("lg-p-top", classes.wrapper)}>
      {/* <WaveBorder
        upperColor="#0e1111"
        lowerColor={theme.palette.common.black}
        animationNegativeDelay={4}
      /> */}
      <div className={classes.footerInner}>
        <Grid container spacing={isWidthUpMd ? 10 : 5} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Typography variant="h6" paragraph className="text-white">
              FitConnect
            </Typography>
            <Typography style={{ color: "#8f9296" }} paragraph>
              A fitness application dedicated to tracking your mental and physical well-being.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Footer);
