import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { List, ListItem, Divider, Typography, Paper, Button, Snackbar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DialogContent from '@mui/material/DialogContent'; // Add this import
import DialogContentText from '@mui/material/DialogContentText'; // Add this import


import useServerDate from '../../shared/functions/userServerDate';


const styles = {
    Paper: {
        padding: 30,
        marginBottom: 10,
    },
    StarIcon: {
        marginLeft: '10px',
    },
    Title: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    ListItemHover: {
        cursor: 'pointer',
    }
};

const WorkoutPlanList = ({ plans, onSelectPlan, onCreateNewPlan, onSelectTodaysPlan }) => {
    const [todaysPlan, setTodaysPlan] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
      });
      const [deleteDialogClose, setDeleteDialogClose] = useState(false);
      const [hoveredPlan, setHoveredPlan] = useState(null);


    const openDeleteDialog = (plan) => {
        setDeleteTarget(plan);
        setDeleteDialogOpen(true);
      };
      
      const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };
    

    const serverDate = useServerDate();


    const handleListItemClick = (plan) => {
        onSelectPlan(plan);
    };

    const handleTodaysPlanClick = (todaysPlan) => {
        onSelectTodaysPlan(todaysPlan);
    };

    const handleDeletePlan = async (plan) => {
        try {
          const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}fitConnect/plans/${plan.plan_id}`);
          if (response.status === 200) {
            closeDeleteDialog();
            setSnackbar({ open: true, message: 'Workout plan deleted successfully!', severity: 'success' });
          } else {
            setSnackbar({ open: true, message: 'Failed to delete workout plan.', severity: 'error' });
          }
        } catch (error) {
            console.error('Error deleting workout plan:', error);
            setSnackbar({ open: true, message: 'An error occurred while deleting workout plan.', severity: 'error' });
        }
        window.location.reload(true);
      };
      
    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === 'todays-plan') {
            const draggedItem = plans[source.index];
            setTodaysPlan(draggedItem);
            window.location.reload(true);
        }
    };

    useEffect(() => {
        const savedTodaysPlan = localStorage.getItem('todaysPlan');
        const savedDate = localStorage.getItem('todaysPlanDate');

        if (savedTodaysPlan && savedDate === serverDate) {
            setTodaysPlan(JSON.parse(savedTodaysPlan));
        }
    }, []);

    useEffect(() => {
        if (todaysPlan) {
            localStorage.setItem('todaysPlan', JSON.stringify(todaysPlan));
            localStorage.setItem('todaysPlanDate', serverDate);
        }
    }, [todaysPlan]);

    return (
        
        <DragDropContext onDragEnd={onDragEnd}>
            <Typography variant="h4" style={styles.Title}>Today's Plan</Typography>
            <Droppable droppableId="todays-plan">
                {(provided) => (
                    <Paper
                        elevation={1}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={styles.Paper}
                        onClick={() => handleTodaysPlanClick(todaysPlan)}
                    >
                        {todaysPlan ? (
                            <ListItem style={styles.ListItemHover}>
                                {todaysPlan.plan_name}
                                <StarIcon style={styles.StarIcon} />
                            </ListItem>
                        ) : (
                            <Typography variant="body1">No Plan (Drag a plan here)</Typography>
                        )}
                        {provided.placeholder}
                        <Dialog
  open={deleteDialogOpen}
  onClose={closeDeleteDialog}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"Delete Plan"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to delete the plan: {deleteTarget ? deleteTarget.plan_name : ''}?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeDeleteDialog} color="primary">
      Cancel
    </Button>
    <Button onClick={() => handleDeletePlan(deleteTarget)} color="primary">
      Yes, delete
    </Button>
  </DialogActions>
</Dialog>
                    </Paper>
                )}
            </Droppable>
            <Divider />
            <Typography variant="h6" style={styles.Title}>Your Workout plans</Typography>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <List {...provided.droppableProps} ref={provided.innerRef}>
                        {plans.map((item, index) => {
                            if (!item || !item.plan_id || !item.plan_name) {
                                // Handle missing data
                                return null;
                            }
                            return (
                                <Draggable key={item.plan_id} draggableId={`draggable-${item.plan_id}`} index={index}>
                                    {(provided) => (
                                        <ListItem
                                        button
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onMouseEnter={() => setHoveredPlan(item)}
                                        onMouseLeave={() => setHoveredPlan(null)}
                                        onClick={() => handleListItemClick(item)}
                                      >
                                        {item.plan_name}
                                        {hoveredPlan === item && (!todaysPlan || hoveredPlan.plan_id !== todaysPlan.plan_id) && (

                                          <DeleteIcon
                                            style={{ marginLeft: 'auto', cursor: 'pointer' }}
                                            onClick={() => openDeleteDialog(item)}
                                          />
                                        )}
                                      </ListItem>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </List>
                )}
            </Droppable>
            <Button
                variant="contained"
                color="primary"
                onClick={onCreateNewPlan}
                style={{ marginTop: '10px' }}
            >
                Create New Plan
            </Button>
        </DragDropContext>
        
    );
};

export default WorkoutPlanList;