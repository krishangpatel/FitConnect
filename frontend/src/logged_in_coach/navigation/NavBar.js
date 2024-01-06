import React, { useEffect, Fragment, useRef, useCallback, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Tooltip,
  Box,
  Menu,
  MenuItem
} from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import MessagePopperButton from "./MessagePopperButton";
import SideDrawer from "./SideDrawer";
import NavigationDrawer from "../../shared/components/NavigationDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cookies from 'js-cookie';
import UserImage from "../../shared/components/UserImage";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import SportsIcon from '@mui/icons-material/Sports';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Email from '@mui/icons-material/Email';
import RecentActors from '@mui/icons-material/RecentActors';

const logo = "/images/logged_out/FitConnectLogo.png"

const styles = (theme) => ({
  appBar: {
    boxShadow: 'none',
    backgroundColor: theme.palette.common.darkBlack,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: 0,
    },
  },
  appBarToolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.common.darkBlack,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  accountAvatar: {
    height: 42,
    width: 42,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
  },
  drawerPaper: {
    height: "100%vh",
    whiteSpace: "nowrap",
    border: 0,
    width: theme.spacing(7),
    overflowX: "hidden",
    marginTop: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
    backgroundColor: theme.palette.common.black,
  },
  smBordered: {
    [theme.breakpoints.down("sm")]: {
      borderRadius: "50% !important",
    },
  },
  menuLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  iconListItem: {
    width: "auto",
    borderRadius: theme.shape.borderRadius,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },
  mobileItemSelected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  brandText: {
    fontFamily: "'Roboto', cursive",
    fontStyle: "bold",
    fontWeight: 650,
    marginLeft: "10px"
  },
  username: {
    paddingLeft: 0,
    paddingRight: theme.spacing(2),
  },
  justifyCenter: {
    justifyContent: "center",
  },
  permanentDrawerListItem: {
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

function NavBar(props) {
  const { selectedTab, setSelectedTab, messages, classes, theme } = props;
  // Will be use to make website more accessible by screen readers
  const links = useRef([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const isWidthUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshMessages, setRefreshMessages] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const triggerRefresh = () => {
    setRefreshMessages(prev => !prev); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();
  const currentPathname = location.pathname;

  const history = useHistory();

  useEffect(() => {
    const tabMap = {
      "/c/dashboard": "Dashboard",
      "/c/coaches": "Coaches",
      "/c/workoutplan": "Workout Plan",
      "/c/my-requests": "My Requests",
      "/c/my-clients": "My Clients",
    };

    setSelectedTab(tabMap[currentPathname]);
  }, [currentPathname]);

  const navigate = useCallback((path) => {
    history.push(path);
    handleMenuClose();
  }, [history]);

  const handleLogout = useCallback(async () => {
  const userId = localStorage.getItem('user_id');

    if (userId) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fitConnect/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          // Clearing local storage and cookies
          localStorage.clear();
          Cookies.remove('authToken');
          history.push('');
        } else {
          console.error('Logout failed');
          console.log(response)
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  }, [history]);

  useEffect(() => {
    const storedFirstName = localStorage.getItem('first_name');
    const storedLastName = localStorage.getItem('last_name');
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
    if (storedLastName) {
      setLastName(storedLastName);
    }
  }, []);


  const openMobileDrawer = useCallback(() => {
    setIsMobileOpen(true);
  }, [setIsMobileOpen]);

  const closeMobileDrawer = useCallback(() => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  const closeDrawer = useCallback(() => {
    setIsSideDrawerOpen(false);
  }, [setIsSideDrawerOpen]);

  const menuItems = [
    {
      link: "/c/dashboard",
      name: "Dashboard",
      onClick: closeMobileDrawer,
      icon: {
        desktop: (
          <DashboardIcon
            className={
              selectedTab === "Dashboard" ? classes.textPrimary : "text-white"
            }
            fontSize="small"
          />
        ),
        mobile: <DashboardIcon className="text-white" />,
      },
    },
    {
      link: "/c/coaches",
      name: "Coaches",
      onClick: closeMobileDrawer,
      icon: {
        desktop: (
          <SportsIcon
            className={
              selectedTab === "Coaches" ? classes.textPrimary : "text-white"
            }
            fontSize="small"
          />
        ),
        mobile: <SportsIcon className="text-white" />,
      },
    },
    {
      link: "/c/workoutplan",
      name: "Workout Plan",
      onClick: closeMobileDrawer,
      icon: {
        desktop: (
          <FitnessCenterIcon
            className={
              selectedTab === "Workout Plan" ? classes.textPrimary : "text-white"
            }
            fontSize="small"
          />
        ),
        mobile: <FitnessCenterIcon className="text-white" />,
      },
    },
    {
      link: "/c/my-requests",
      name: "My Requests",
      onClick: closeMobileDrawer,
      icon: {
        desktop: (
          <Email
            className={
              selectedTab === "My Requests" ? classes.textPrimary : "text-white"
            }
            fontSize="small"
          />
        ),
        mobile: <Email className="text-white" />,
      },
    },
    {
      link: "/c/my-clients",
      name: "My Clients",
      onClick: closeMobileDrawer,
      icon: {
        desktop: (
          <RecentActors
            className={
              selectedTab === "My Clients" ? classes.textPrimary : "text-white"
            }
            fontSize="small"
          />
        ),
        mobile: <RecentActors className="text-white" />,
      },
    },
  ];

  const accountItems = [
    {
      link: "/c/dashboard",
      name: "Dashboard",
      onClick: () => navigate("/c/dashboard"),
      icon: {
        desktop: <DashboardIcon className="text-white" fontSize="small" />,
        mobile: <DashboardIcon className="text-white" />,
      },
    },
    {
      link: "/c/account",
      name: "Account",
      onClick: () => navigate("/c/account"),
      icon: {
        desktop: <AccountCircleIcon className="text-white" fontSize="small" />,
        mobile: <AccountCircleIcon className="text-white" />,
      },
    },
    {
      name: "Logout",
      onClick: handleLogout,
      icon: {
        desktop: <ExitToAppIcon className="text-white" fontSize="small" />,
        mobile: <ExitToAppIcon className="text-white" />,
      },
    },
  ];

  return (
    <Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.appBarToolbar}>
          <Box display="flex" alignItems="center">
            <Hidden smUp>
              <Box mr={1}>
                <IconButton
                  aria-label="Open Navigation"
                  onClick={openMobileDrawer}
                  color="primary"
                  size="large"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Hidden>
            <Hidden smDown>
              <div className={classes.logoContainer}>
                <Link
                  to="/"
                >
                  <img alt="FitConnect" src={logo} style={{ width: "40px" }} />
                </Link>
                <Link
                  to="/"
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="h4"
                    className={classes.brandText}
                    display="inline"
                    color="secondary"
                  >
                  FitConnect
                  </Typography>
                </Link>
              </div>
            </Hidden>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="100%"
          >
            <MessagePopperButton messages={messages} />
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <UserImage
                className={classes.accountAvatar}
                iconSize={23}
                name={`${firstName} ${lastName}`}
              />
              {isWidthUpSm && (
                <ListItemText
                  className={classes.username}
                  primary={
                    <Typography color="textPrimary">{firstName || 'User'}</Typography>
                  }
                />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              style={{ marginTop: '45px' }}
            >
              {accountItems.map((item) => (
                <MenuItem key={item.name} onClick={item.onClick}>
                  <ListItemIcon>
                    {item.icon.desktop}
                  </ListItemIcon>
                  <Typography variant="inherit">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SideDrawer open={isSideDrawerOpen} onClose={closeDrawer} />
        </Toolbar>
      </AppBar>
      <Hidden smDown>
        {location.pathname !== "/" && location.pathname !== "/login" && (
        <Drawer //  both drawers can be combined into one for performance
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          open={false}
        >
            <List>
              {menuItems.map((element, index) => (
                <Link
                  to={element.link}
                  className={classes.menuLink}
                  onClick={() => {
                    console.log(element.name);
                    element.onClick();               
                    props.setSelectedTab(element.name);
                  }}
                  key={index}
                  ref={(node) => {
                    links.current[index] = node;
                  }}
                >
                  <Tooltip
                    title={element.name}
                    placement="right"
                    key={element.name}
                  >
                    <ListItem
                      selected={selectedTab === element.name}
                      button
                      divider={index !== menuItems.length - 1}
                      className={classes.permanentDrawerListItem}
                    >
                      <ListItemIcon className={classes.justifyCenter}>
                        {element.icon.desktop}
                      </ListItemIcon>
                    </ListItem>
                  </Tooltip>
                </Link>
              ))}
            </List>
        </Drawer>
          )}
      </Hidden>
      <NavigationDrawer
        menuItems={menuItems.map((element) => ({
          link: element.link,
          name: element.name,
          icon: element.icon.mobile,
          onClick: element.onClick,
        }))}
        anchor="left"
        open={isMobileOpen}
        selectedItem={selectedTab}
        onClose={closeMobileDrawer}
      />
      <MessagePopperButton refreshTrigger={refreshMessages} onRefresh={triggerRefresh} />
    </Fragment>
  );
}

NavBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(NavBar);