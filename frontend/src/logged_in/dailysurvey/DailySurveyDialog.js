import React, { useState, Fragment } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import MoodIcon from '@mui/icons-material/Mood';
import axios from 'axios';
import useServerDate from '../../shared/functions/userServerDate';

const styles = {
    dialogBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    },
    moodButton: {
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px',
        height: '100px',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        '&.selected': {
            backgroundColor: (theme) => theme.palette.action.selected,
        }
    },
    textField: {
        marginBottom: 2,
    }
};

const DailySurveyDialog = ({ userId, open, onClose, onUpdate }) => {
    const [surveyData, setSurveyData] = useState({
        calorie_amount: '',
        water_amount: '',
        mood: '',
        weight: ''
    });

    const serverDate = useServerDate();

    const handleInputChange = (e) => {
        setSurveyData({ ...surveyData, [e.target.name]: e.target.value });
    };

    const selectMood = (mood) => {
        setSurveyData({ ...surveyData, mood });
    };

    const handleSubmit = async () => {

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}fitConnect/daily_survey/${userId}/`, {
                ...surveyData,
                recorded_date: serverDate
            });
            console.log(response.data);
            onClose();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <Fragment>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Daily Survey</DialogTitle>
                <DialogContent>
                    <Box component="form" noValidate autoComplete="off" sx={styles.dialogBox}>
                        <TextField
                            label="Calorie Amount"
                            type="number"
                            name="calorie_amount"
                            value={surveyData.calorie_amount}
                            onChange={handleInputChange}
                            fullWidth
                            sx={styles.textField}
                        />
                        <TextField
                            label="Water Amount (Oz)"
                            type="number"
                            name="water_amount"
                            value={surveyData.water_amount}
                            onChange={handleInputChange}
                            fullWidth
                            sx={styles.textField}
                        />
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button
                                variant="outlined"
                                onClick={() => selectMood('Sad')}
                                sx={styles.moodButton}
                                className={surveyData.mood === 'Sad' ? 'selected' : ''}
                            >
                                <MoodBadIcon /><br />Sad
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => selectMood('Neutral')}
                                sx={styles.moodButton}
                                className={surveyData.mood === 'Neutral' ? 'selected' : ''}
                            >
                                <SentimentNeutralIcon /><br />Neutral
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => selectMood('Happy')}
                                sx={styles.moodButton}
                                className={surveyData.mood === 'Happy' ? 'selected' : ''}
                            >
                                <MoodIcon /><br />Happy
                            </Button>
                        </Box>
                        <TextField
                            label="Weight (lbs)"
                            type="number"
                            name="weight"
                            value={surveyData.weight}
                            onChange={handleInputChange}
                            fullWidth
                            sx={styles.textField}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Submit</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default DailySurveyDialog;
