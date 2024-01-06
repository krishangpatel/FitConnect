// DatePicker.js
import React from 'react';
import { TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

function DatePicker({ label, value, onChange }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                label={label}
                inputFormat="yyyy-MM-dd"
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
        </LocalizationProvider>
    );
}

export default DatePicker;