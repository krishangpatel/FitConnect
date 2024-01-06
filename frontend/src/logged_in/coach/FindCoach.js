import React, { useState, useEffect } from 'react';
import { Paper, Grid, TextField, Button, Pagination, Accordion, 
         AccordionSummary, AccordionDetails, Select, MenuItem, 
         Slider, Typography } from '@mui/material';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CoachCard from './CoachCard';

const FindCoach = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [coaches, setCoaches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [experience, setExperience] = useState('');
    const [goal, setGoal] = useState('');
    const [costRange, setCostRange] = useState([0, 250]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/coaches`)
            .then(response => response.json())
            .then(data => setCoaches(data))
            .catch(error => console.error("Error fetching data: ", error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleExperienceChange = (event) => {
        setExperience(event.target.value);
    };

    const handleGoalChange = (event) => {
        setGoal(event.target.value);
    };

    const handleCostChange = (event, newValue) => {
        setCostRange(newValue);
    };

    // Filter coaches based on search term
    const filteredCoaches = searchTerm
        ? coaches.filter(coach =>
            coach.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coach.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
        : coaches;

    // Pagination logic
    const coachesPerPage = 12;
    const indexOfLastCoach = currentPage * coachesPerPage;
    const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;

    const paginate = (event, value) => {
        setCurrentPage(value);
    };

    const applyFilters = () => {
        return filteredCoaches.filter(coach => {
            return (
                (experience ? coach.experience === experience : true) &&
                (goal ? coach.goal === goal : true) &&
                (coach.cost >= costRange[0] && coach.cost <= costRange[1])
            );
        });
    };

    const currentCoaches = applyFilters().slice(indexOfFirstCoach, indexOfLastCoach);

    return (
        <div>
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <TextField
                            fullWidth
                            label="Search Coaches"
                            placeholder="Enter coach name"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
                            Search
                        </Button>
                    </Grid>
                </Grid>
                <Accordion style={{marginTop: '20px'}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Advanced Filters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Select
                                    fullWidth
                                    value={experience}
                                    onChange={handleExperienceChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">Any Experience</MenuItem>
                                    <MenuItem value={1}>Novice</MenuItem>
                                    <MenuItem value={2}>Intermediate</MenuItem>
                                    <MenuItem value={3}>Expert</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    fullWidth
                                    value={goal}
                                    onChange={handleGoalChange}
                                    displayEmpty
                                >
                                    <MenuItem value="">Any Goal</MenuItem>
                                    <MenuItem value="Lose Weight">Lose Weight</MenuItem>
                                    <MenuItem value="Gain Muscle">Gain Muscle</MenuItem>
                                    <MenuItem value="Flexibility">Flexibility</MenuItem>
                                    <MenuItem value="Increase Stamina">Increase Stamina</MenuItem>
                                    <MenuItem value="Reduce Stress">Reduce Stress</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography gutterBottom>Cost Range</Typography>
                                <Slider
                                    value={costRange}
                                    onChange={handleCostChange}
                                    valueLabelDisplay="auto"
                                    max={250}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs>
                                        <TextField
                                            fullWidth
                                            value={costRange[0]}
                                            onChange={(e) => setCostRange([Number(e.target.value), costRange[1]])}
                                            type="number"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            fullWidth
                                            value={costRange[1]}
                                            onChange={(e) => setCostRange([costRange[0], Number(e.target.value)])}
                                            type="number"
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Paper>
            <Grid container spacing={3}>
                {currentCoaches.map((coach, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <CoachCard coach={coach} />
                    </Grid>
                ))}
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={Math.ceil(filteredCoaches.length / coachesPerPage)}
                    page={currentPage}
                    onChange={paginate}
                />
            </div>
        </div>
    );
};

export default FindCoach;