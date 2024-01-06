import React, { useState, useCallback, useRef } from "react";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import { TextField, Button, Checkbox, Typography, FormControlLabel } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import VisibilityPasswordTextField from "../../shared/components/VisibilityPasswordTextField";
import ButtonCircularProgress from "../../shared/components/ButtonCircularProgress";
import Cookies from 'js-cookie';

const styles = (theme) => ({
    pageContainer: {
        margin: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
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
    formControlLabel: {
        marginRight: 0,
    },
    centerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
});

function LoginPage(props) {
    const { classes, history } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [status, setStatus] = useState(null);
    const loginEmail = useRef();
    const loginPassword = useRef();
    const isMountedRef = useRef(true);

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
        <div className={classes.centerContainer}>
            <div className={classes.pageContainer}>
                <Typography variant="h4">Login</Typography>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        inputRef={loginEmail}
                        autoFocus
                        autoComplete="off"
                        type="email"
                    />
                    <VisibilityPasswordTextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        inputRef={loginPassword}
                        autoComplete="off"
                        onVisibilityChange={setIsPasswordVisible}
                        isVisible={isPasswordVisible}
                    />
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Remember me"
                    />
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
                    {status === "error" && (
                        <Typography color="error" align="center">
                            Login failed. Please try again.
                        </Typography>
                    )}
                    <Typography
                        align="center"
                        className={classes.forgotPassword}
                        onClick={() => {/* Forgot password logic here */ }}
                    >
                        Forgot Password?
                    </Typography>
                </form>
            </div>
        </div>
    );
}

export default withRouter(withStyles(styles)(LoginPage));