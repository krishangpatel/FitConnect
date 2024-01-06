import React, { useState, useEffect, useCallback, useRef, Fragment, useContext } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import { TextField, Button, Checkbox, Typography, FormControlLabel } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import FormDialog from "../../shared/components/FormDialog";
import HighlightedInformation from "../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../shared/components/VisibilityPasswordTextField";
import Cookies from 'js-cookie';
import AuthContext from '../../shared/components/AuthContext';

const styles = (theme) => ({
  forgotPassword: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  disabledText: {
    cursor: "auto",
    color: theme.palette.text.disabled,
  },
  formControlLabel: {
    marginRight: 0,
  },
});

function LoginDialog(props) {
  const {
    setStatus,
    history,
    classes,
    onClose,
    openChangePasswordDialog,
    status,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginEmail = useRef();
  const loginPassword = useRef();
  const isMountedRef = useRef(true);
  const { setUserType } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setStatus(null);
    const email = loginEmail.current.value;
    const password = loginPassword.current.value;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}fitConnect/login`, {
        email, password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (isMountedRef.current) {
        if (response && response.data) {
          const { token, ...otherData } = response.data;

          Cookies.set('authToken', token, { expires: 7 }); // Expires in 7 days

          Object.entries(otherData).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
          setUserType(response.data.user_type); // Assume response includes user type
          window.dispatchEvent(new Event('authChange'));
          history.push("/c/dashboard");
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        if (error.response && error.response.status === 400) {
          setStatus("invalidCredentials");
        } else {
          console.error("Login Error:", error);
          setStatus("error");
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [history, setStatus]);

  return (
    <Fragment>
      <FormDialog
        open
        onClose={onClose}
        loading={isLoading}
        onFormSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        hideBackdrop
        headline="Login"
        content={
          <Fragment>
            <TextField
              variant="outlined"
              margin="normal"
              error={status === "invalidEmail"}
              required
              fullWidth
              label="Email Address"
              inputRef={loginEmail}
              autoFocus
              autoComplete="off"
              type="email"
              onChange={() => {
                if (status === "invalidEmail") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidEmail" &&
                "This email address isn't associated with an account."
              }
              FormHelperTextProps={{ error: true }}
            />
            <VisibilityPasswordTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={status === "invalidPassword"}
              label="Password"
              inputRef={loginPassword}
              autoComplete="off"
              onChange={() => {
                if (status === "invalidPassword") {
                  setStatus(null);
                }
              }}
              helperText={
                status === "invalidPassword" ? (
                  <span>
                    Incorrect password. Try again, or click on{" "}
                    <b>&quot;Forgot Password?&quot;</b> to reset it.
                  </span>
                ) : (
                  ""
                )
              }
              FormHelperTextProps={{ error: true }}
              onVisibilityChange={setIsPasswordVisible}
              isVisible={isPasswordVisible}
            />
            <FormControlLabel
              className={classes.formControlLabel}
              control={<Checkbox color="primary" />}
              label={<Typography variant="body1">Remember me</Typography>}
            />
            {status === "verificationEmailSend" ? (
              <HighlightedInformation>
                We have send instructions on how to reset your password to your
                email address
              </HighlightedInformation>
            ) : (
              ""
            )}
          </Fragment>
        }
        actions={
          <Fragment>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              size="large"
            >
              Login
              {isLoading && <ButtonCircularProgress />}
            </Button>
            {status === "invalidCredentials" && (
              <Typography color="error" style={{ textAlign: "center" }}>
                Incorrect email or password, please try again
              </Typography>
            )}
            <Typography
              align="center"
              className={classNames(
                classes.forgotPassword,
                isLoading ? classes.disabledText : null
              )}
              color="primary"
              onClick={isLoading ? null : openChangePasswordDialog}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                // For screenreaders listen to space and enter events
                if (
                  (!isLoading && event.keyCode === 13) ||
                  event.keyCode === 32
                ) {
                  openChangePasswordDialog();
                }
              }}
            >
              Forgot Password?
            </Typography>
          </Fragment>
        }
      />
    </Fragment>
  );
}

LoginDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  openChangePasswordDialog: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.string,
};

export default withRouter(withStyles(styles)(LoginDialog));
