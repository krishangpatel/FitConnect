import React from "react";
import { Typography, Grid } from "@mui/material";
import { withTheme } from "@mui/styles";
import FeatureCard from "./FeatureCard";
import ArticleIcon from '@mui/icons-material/Article';
import SportsIcon from '@mui/icons-material/Sports';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
// import useWidth from "../../shared/functions/useWidth";
import useMediaQuery from "@mui/material/useMediaQuery";

const iconSize = 80;

const features = [
  {
    icon: <ArticleIcon style={{ fontSize: iconSize }} />,
    color: "#1975B5",
    headline: "Create a Workout Plan",
    text: "Customize your personal workout plan.",
    mdDelay: "0",
    smDelay: "0",
  },
  {
    icon: <SportsIcon style={{ fontSize: iconSize }} />,
    color: "#00C853",
    headline: "Hire a Coach",
    text: "Connect with professional fitness coaches.",
    mdDelay: "200",
    smDelay: "200",
  },
  {
    icon: <MonitorHeartIcon style={{ fontSize: iconSize }} />,
    color: "#AA1F2F",
    headline: "Track Your Physical and Mental State",
    text: "Monitor your health and wellness journey.",
    mdDelay: "400",
    smDelay: "0",
  }
];
function FeaturesSection(props) {
  const { theme } = props;
  // const width = useWidth();
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div id="FeaturesSection" style={{ backgroundColor: "#0e1111" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom" style={{ color: "#FFFFFF" }}>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              data-aos="zoom-in-up"
              data-aos-delay={isWidthUpMd ? feature.mdDelay : feature.smDelay}
              key={feature.headline}
            >
              <FeatureCard
                Icon={feature.icon}
                color={feature.color}
                headline={feature.headline}
                text={feature.text}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

FeaturesSection.propTypes = {};

export default withTheme(FeaturesSection);
