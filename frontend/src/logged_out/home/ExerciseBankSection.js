import React, { useState } from 'react';
import { withStyles } from '@mui/styles';
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';
import classNames from 'classnames';
import ExerciseBank from '../../shared/components/ExerciseBank';

const styles = (theme) => ({
  searchContainer: {
    padding: theme.spacing(2),
  },
  gridContainer: {
    maxWidth: 'calc(100% - 16px)',
    margin: 'auto',
  },
});

function ExerciseBankSection(props) {
  const { classes } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExercise(null);
  };

  return (
    <div className="lg-p-top" style={{ backgroundColor: "#0e1111" }}>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="exercise-dialog-title"
        aria-describedby="exercise-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="exercise-dialog-description">
            {selectedExercise ? selectedExercise.description : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h3" align="center" className={classNames("lg-mg-bottom", classes.textWhite)}>
        Exercises
      </Typography>
      <div data-aos="fade-down">
        <ExerciseBank
          classes={classes}
          onExerciseClick={handleExerciseClick}
        />
      </div>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(ExerciseBankSection);