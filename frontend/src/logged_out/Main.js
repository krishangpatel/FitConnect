import React, { memo, useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import AOS from "aos/dist/aos";
import withStyles from '@mui/styles/withStyles';
import GuestNavBar from "./navigation/GuestNavBar";
import UserNavBar from "../logged_in/navigation/UserNavBar";
import Footer from "./footer/Footer";
import "aos/dist/aos.css";
import CookieRulesDialog from "./cookies/CookieRulesDialog";
import CookieConsent from "./cookies/CookieConsent";
import DialogSelector from "./register_login/DialogSelector";
import Routing from "./Routing";
import smoothScrollTop from "../shared/functions/smoothScrollTop";
import Cookies from 'js-cookie';
import AuthContext from '../shared/components/AuthContext';

AOS.init({ once: true });

const styles = (theme) => ({
  wrapper: {
    backgroundColor: theme.palette.common.darkBlack,
    overflowX: "hidden",
    margin: '0 auto',
  },
});
function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(null);
  const [isCookieRulesDialogOpen, setIsCookieRulesDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userType } = useContext(AuthContext);

  const checkAuthStatus = useCallback(() => {
    setIsAuthenticated(!!Cookies.get('authToken'));
  }, []);

  useEffect(() => {
    window.addEventListener('authChange', checkAuthStatus);

    // Check the auth status when the component mounts
    checkAuthStatus();

    return () => {
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, [checkAuthStatus]);


  useEffect(() => {
    const handleLogoutEvent = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, []);


  const selectHome = useCallback(() => {
    smoothScrollTop();
    document.title =
      "FitConnect";
    setSelectedTab("Home");
  }, [setSelectedTab]);

  const openLoginDialog = useCallback(() => {
    setDialogOpen("login");
    setIsMobileDrawerOpen(false);
  }, [setDialogOpen, setIsMobileDrawerOpen]);

  const closeDialog = useCallback(() => {
    setDialogOpen(null);
  }, [setDialogOpen]);

  const openRegisterDialog = useCallback(() => {
    setDialogOpen("register");
    setIsMobileDrawerOpen(false);
  }, [setDialogOpen, setIsMobileDrawerOpen]);

  const openTermsDialog = useCallback(() => {
    setDialogOpen("termsOfService");
  }, [setDialogOpen]);

  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);

  const openChangePasswordDialog = useCallback(() => {
    setDialogOpen("changePassword");
  }, [setDialogOpen]);

  const handleCookieRulesDialogOpen = useCallback(() => {
    setIsCookieRulesDialogOpen(true);
  }, [setIsCookieRulesDialogOpen]);

  const handleCookieRulesDialogClose = useCallback(() => {
    setIsCookieRulesDialogOpen(false);
  }, [setIsCookieRulesDialogOpen]);

  return (
    <div className={classes.wrapper}>
      {!isCookieRulesDialogOpen && (
        <CookieConsent
          handleCookieRulesDialogOpen={handleCookieRulesDialogOpen}
        />
      )}
      <DialogSelector
        openLoginDialog={openLoginDialog}
        dialogOpen={dialogOpen}
        onClose={closeDialog}
        openTermsDialog={openTermsDialog}
        openRegisterDialog={openRegisterDialog}
        openChangePasswordDialog={openChangePasswordDialog}
      />
      <CookieRulesDialog
        open={isCookieRulesDialogOpen}
        onClose={handleCookieRulesDialogClose}
      />
      {isAuthenticated ? (
        <UserNavBar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isAuthenticated={isAuthenticated}
        />
      ) : (
      <GuestNavBar
        selectedTab={selectedTab}
        selectTab={setSelectedTab}
        openLoginDialog={openLoginDialog}
        openRegisterDialog={openRegisterDialog}
        mobileDrawerOpen={isMobileDrawerOpen}
        handleMobileDrawerOpen={handleMobileDrawerOpen}
        handleMobileDrawerClose={handleMobileDrawerClose}
      />
      )}
      <Routing
        selectHome={selectHome}
      />
      <Footer />
    </div>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));