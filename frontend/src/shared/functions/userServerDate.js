import { useState, useEffect } from 'react';
import axios from 'axios';

const useServerDate = () => {
    const [serverDate, setServerDate] = useState('');

    useEffect(() => {
        const fetchServerDate = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}fitConnect/serverTimeView`);
                const dateString = response.data.server_time;
                const dateObject = new Date(dateString);
                const formattedDate = dateObject.toISOString().split('T')[0];
                setServerDate(formattedDate);
            } catch (error) {
                console.error('Error fetching server date:', error);
                setServerDate('');
            }
        };

        fetchServerDate();
    }, []);

    return serverDate;
};

export default useServerDate;