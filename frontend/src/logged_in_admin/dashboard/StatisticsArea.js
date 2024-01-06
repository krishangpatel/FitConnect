import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";

import withTheme from '@mui/styles/withTheme';

function StatisticsArea({ theme, CardChart, data = { profit: [], views: [] } }) {
  return (
    CardChart &&
    data.profit.length >= 2 &&
    data.views.length >= 2 && (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CardChart
            data={data.profit}
            color={theme.palette.secondary.light}
            height="70px"
            title="Number of Cases"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardChart
            data={data.views}
            color={theme.palette.primary.light}
            height="70px"
            title="Number of Leads"
          />     
        </Grid>
        <Grid item xs={12} md={6}>
          <CardChart
            data={data.views}
            color={theme.palette.primary.light}
            height="70px"
            title="Lead Conversion Rate"
          />     
        </Grid>
        <Grid item xs={12} md={6}>
          <CardChart
            data={data.views}
            color={theme.palette.primary.light}
            height="70px"
            title="Case Completion Time by Employee"
          />     
        </Grid>                
      </Grid>
    )
  );
}

StatisticsArea.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.shape({
    profit: PropTypes.array.isRequired,
    views: PropTypes.array.isRequired
  }).isRequired,
  CardChart: PropTypes.elementType
};

export default withTheme(StatisticsArea);
