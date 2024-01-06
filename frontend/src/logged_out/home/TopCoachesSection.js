import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { withTheme } from "@mui/styles";
import axios from 'axios';
import TopCoachesCard from './TopCoachesCard';
import useMediaQuery from "@mui/material/useMediaQuery";
import UserImage from "../../shared/components/UserImage";

function TopCoachesSection(props) {
  const [coaches, setCoaches] = useState([]);
  const { theme } = props;
  const isWidthUpMd = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}fitConnect/coaches`)
      .then(response => {
        const topCoaches = response.data.slice(0, 5);
        setCoaches(topCoaches);
      })
      .catch(error => {
        console.error('There was an error fetching the coaches data:', error);
      });
  }, []);

  return (
    <div id="TopCoachesSection" style={{ backgroundColor: "#0e1111" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom" color="#FFFFFF">
          Our Top Coaches
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {coaches.map((coach, index) => (
            <div
              key={coach.coach_id}
              data-aos="flip-right"
              data-aos-delay={isWidthUpMd ? (index * 200).toString() : "0"}
            >
              <TopCoachesCard
                image={<UserImage iconSize={50} name={`${coach.first_name} ${coach.last_name}`} />}
                headline={`${coach.first_name} ${coach.last_name}`}
                text={coach.bio}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withTheme(TopCoachesSection);