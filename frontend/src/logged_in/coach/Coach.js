import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import FindCoach from "./FindCoach";
import ViewCoach from "./ViewCoach";

function Coach(props) {
  const { selectCoach } = props;
  const [hasCoach, setHasCoach] = useState(localStorage.getItem("has_coach") === "true");
  const [coachData, setCoachData] = useState(null);

  const handleCoachFired = () => {
    setHasCoach(false);
    setCoachData(null);
  };

  useEffect(() => {
    selectCoach();

    const fetchCoachClients = async () => {
      const hiredCoachId = localStorage.getItem("hired_coach");
      if (!hiredCoachId) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/coaches/${hiredCoachId}/clients`);
        if (!response.ok) throw new Error('Failed to fetch coach clients');

        const clients = await response.json();
        const userId = localStorage.getItem("user_id");
        const matchedClient = clients.find(client => client.user_id.toString() === userId);

        if (matchedClient) {
          localStorage.setItem("has_coach", "true");
          setHasCoach(true);
          await fetchCoachDetails(hiredCoachId);  // Fetch details of the hired coach
        }
      } catch (error) {
        console.error("Error fetching coach clients:", error);
      }
    };

    const fetchCoachDetails = async (coachId) => {
      try {
        const coachResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/coaches/${coachId}`);
        if (!coachResponse.ok) throw new Error('Failed to fetch coach details');

        const coachDetails = await coachResponse.json();
        setCoachData(coachDetails);
      } catch (error) {
        console.error("Error fetching coach details:", error);
      }
    };

    fetchCoachClients();
  }, [selectCoach]);

  return (
    <Fragment>
      {!hasCoach && <FindCoach />}
      {hasCoach && coachData && <ViewCoach coach={coachData} onCoachFired={handleCoachFired} />}
    </Fragment>
  );
}

Coach.propTypes = {
  selectCoach: PropTypes.func.isRequired,
};

export default Coach;
