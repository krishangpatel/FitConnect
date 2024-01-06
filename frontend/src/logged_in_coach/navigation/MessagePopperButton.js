import React, { Fragment, useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Popover,
  IconButton,
  AppBar,
  List,
  Divider,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import MessageIcon from "@mui/icons-material/Message";
import MessageHistory from "./MessageHistory";

const styles = (theme) => ({
  tabContainer: {
    overflowY: "auto",
    maxHeight: 'calc(100vh - 100px)',
  },
  popoverPaper: {
    width: '100%',
    maxWidth: 700,
    maxHeight: '80vh',
    position: 'fixed',
    bottom: 0,
    left: 0,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
    zIndex: 1000,
    overflowY: 'auto',
    [theme.breakpoints.down('md')]: {
      maxWidth: 500,
    },
  },
  divider: {
    marginTop: -2,
  },
  noShadow: {
    boxShadow: "none !important",
  },
});


function MessagePopperButton(props) {
  const { classes } = props;
  const anchorEl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const senderId = Number(localStorage.getItem('user_id'));

  useEffect(() => {
    console.log("Sender ID:", senderId);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/contactHistory/${senderId}/`)
        .then(response => response.json())
        .then(data => setUsers(data)) // Assuming the response is an array of users
        .catch(error => console.error('Error fetching users:', error));
}, []);
console.log("Users:", users)
  const handleUserSelect = (userId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/get_messages/${senderId}/${userId}/`)
        .then(response => response.json())
        .then(data => {
            setMessageHistory(data.messages);
            setSelectedUser(userId);
        })
        .catch(error => console.error('Error fetching messages:', error));
};

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleClickAway = useCallback((event) => {
    if (anchorEl.current && (anchorEl.current.contains(event.target) || event.target === anchorEl.current)) {
      return;
    }
    setIsOpen(false);
  }, [setIsOpen]);

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setMessageHistory([]);
  };

  const id = isOpen ? "scroll-playground" : null;
  return (
    <Fragment>
      <IconButton
        onClick={handleClick}
        aria-label="Open Messages"
        aria-describedby={id}
        color="primary"
        size="large">
        <MessageIcon />
      </IconButton>
      <Popover
        disableScrollLock
        id={id}
        open={isOpen}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: classes.popoverPaper }}
        onClose={handleClickAway}
      >
        <AppBar position="static" color="inherit" className={classes.noShadow}>
          <Box pt={1} pl={2} pb={1} pr={1}>
            <Typography variant="subtitle1">Messages</Typography>
          </Box>
          <Divider className={classes.divider} />
        </AppBar>
        <List dense className={classes.tabContainer}>
          {selectedUser === null ? (
            users.map((user) => (
              <ListItem key={user.user_id} button onClick={() => handleUserSelect(user.user_id)}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))
          ) : (
            <MessageHistory history={messageHistory} onBack={handleBackToUsers} senderId={senderId} recipientId={selectedUser} />
          )}
        </List>
      </Popover>
    </Fragment>
  );
}

MessagePopperButton.propTypes = {
  classes: PropTypes.object.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  senderId: PropTypes.number.isRequired,
};

MessagePopperButton.defaultProps = {
  messages: [],
};

export default withStyles(styles, { withTheme: true })(MessagePopperButton);
