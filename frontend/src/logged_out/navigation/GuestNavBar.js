import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Hidden, IconButton } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import HowToRegIcon from "@mui/icons-material/HowToReg"; 
import LockOpenIcon from "@mui/icons-material/LockOpen";
import NavigationDrawer from "../../shared/components/NavigationDrawer";

const logo = "/images/logged_out/FitConnectLogo.png"

const styles = theme => ({
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease-in-out',
    '&.scrolled': {
      boxShadow: 'none',
      backgroundColor: theme.palette.common.darkBlack
    }
  },
  toolbar: {
    justifyContent: "space-between",
    [theme.breakpoints.up('md')]: {
      margin: '0 20.75%',
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.h6.fontWeight
  },
  brandText: {
    fontFamily: "'Roboto', cursive",
    fontStyle: "bold",
    fontWeight: 650,
    marginLeft: "10px"
  },
  noDecoration: {
    textDecoration: "none !important"
  }
});

function NavBar(props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const scrolled = offset > 200;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const {
    classes,
    openRegisterDialog,
    openLoginDialog,
    handleMobileDrawerOpen,
    handleMobileDrawerClose,
    mobileDrawerOpen,
    selectedTab
  } = props;
  const menuItems = [
    {
      link: "/",
      name: "Home",
      icon: <HomeIcon className="text-white" />
    },
    {
      name: "Register",
      onClick: openRegisterDialog,
      icon: <HowToRegIcon className="text-white" />
    },
    {
      name: "Login",
      onClick: openLoginDialog,
      icon: <LockOpenIcon className="text-white" />
    }
  ];
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={`${classes.appBar} ${isScrolled ? 'scrolled' : ''}`}
        color="transparent"
      >
        <Toolbar className={classes.toolbar}>
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
          <div>
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                onClick={handleMobileDrawerOpen}
                aria-label="Open Navigation"
                size="large">
                <MenuIcon color="primary" />
              </IconButton>
            </Hidden>
            <Hidden mdDown>
              {menuItems.map(element => {
                if (element.link) {
                  return (
                    <Link
                      key={element.name}
                      to={element.link}
                      className={classes.noDecoration}
                      onClick={handleMobileDrawerClose}
                    >
                      <Button
                        color="secondary"
                        size="large"
                        classes={{ text: classes.menuButtonText }}
                      >
                        {element.name}
                      </Button>
                    </Link>
                  );
                }
                return (
                  <Button
                    color="secondary"
                    size="large"
                    onClick={element.onClick}
                    classes={{ text: classes.menuButtonText }}
                    key={element.name}
                  >
                    {element.name}
                  </Button>
                );
              })}
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        menuItems={menuItems}
        anchor="right"
        open={mobileDrawerOpen}
        selectedItem={selectedTab}
        onClose={handleMobileDrawerClose}
      />
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMobileDrawerOpen: PropTypes.func,
  handleMobileDrawerClose: PropTypes.func,
  mobileDrawerOpen: PropTypes.bool,
  selectedTab: PropTypes.string,
  openRegisterDialog: PropTypes.func.isRequired,
  openLoginDialog: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(memo(NavBar));
