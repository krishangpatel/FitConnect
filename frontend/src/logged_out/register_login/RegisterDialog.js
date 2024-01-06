import React, { useEffect, useState, useCallback, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import {
  FormHelperText,
  TextField,
  Button,
  Checkbox,
  Typography,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box
} from "@mui/material";
import VisibilityPasswordTextField from '../../shared/components/VisibilityPasswordTextField';
import withStyles from "@mui/styles/withStyles";
import FormDialog from "../../shared/components/FormDialog";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid } from 'date-fns';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import PersonIcon from '@mui/icons-material/Person';
import SportsIcon from '@mui/icons-material/Sports';

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.white,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.white,
    },
  },
  textBlack: {
    color: theme.palette.common.black,
  },
});

function RegisterDialog(props) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('')
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const { setStatus, theme, onClose, openTermsDialog, status, classes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const registerTermsCheckbox = useRef();
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [coachGoal, setCoachGoal] = useState('');
  const [coachBio, setCoachBio] = useState('');
  const [coachExperience, setCoachExperience] = useState('');
  const [coachCost, setCoachCost] = useState('');
  const [goalId, setGoalId] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const history = useHistory();

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
  };

  const userTypeButtonStyle = (type) => ({
    border: `1px solid ${selectedUserType === type ? 'primary' : 'default'}`,
    backgroundColor: selectedUserType === type ? 'lightgrey' : 'white',
    padding: '10px',
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '120px',
    height: '120px',
  });

  const showSuccessMessage = () => {
    setIsRegistrationSuccessful(true);

    setTimeout(() => setIsRegistrationSuccessful(false), 5000);
  };

  const handleNextOrSubmit = () => {
    let isValidStep = false;

    switch (currentStep) {
      case 1:
        isValidStep = validateRegistrationForm();
        break;
      case 2:
        isValidStep = validateInitialSurvey();
        break;
      case 3:
        isValidStep = validateUserTypeSelection();
        break;
      case 4:
        isValidStep = selectedUserType === 'coach' ? validateCoachSurvey() : validateUserTypeSelection();
        break;
      default:
        isValidStep = true;
    }

    if (!isValidStep) return;

    // Proceed to next step or registration
    if (currentStep === 4 && selectedUserType === 'coach') {
      register();
    } else if (currentStep < 4 || (currentStep === 4 && selectedUserType === 'user')) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderActionButton = () => {
    if ((currentStep === 4 && selectedUserType === 'coach') || (currentStep === 3 && selectedUserType === 'user')) {
      return (
        <Button onClick={register} color="primary" variant="contained">
          Submit
        </Button>
      );
    } else if (currentStep < 4 || (currentStep === 4 && selectedUserType === 'user')) {
      return (
        <Button onClick={handleNextOrSubmit} color="primary" variant="contained">
          Next
        </Button>
      );
    }
    return null;
  };

  const validateRegistrationForm = () => {
    if (!email || !firstName || !lastName || !password || !passwordRepeat) {
      setErrorMessage('Please fill all the required (*) fields.');
      return false;
    }
    if (password !== passwordRepeat) {
      setErrorMessage('Passwords do not match.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateInitialSurvey = () => {
    if (!weight || !height || !goalId) {
      setErrorMessage('Please complete the initial survey.');
      return false;
    }
    return true;
  };

  const validateUserTypeSelection = () => {
    if (!selectedUserType) {
      setErrorMessage('Please select a user type.');
      return false;
    }
    return true;
  };

  const validateCoachSurvey = () => {
    if (!coachGoal || !coachBio || !coachExperience || !coachCost) {
      setErrorMessage('Please complete the coach survey.');
      return false;
    }
    return true;
  };


  const handleBack = () => setCurrentStep(currentStep - 1);

  const renderRegistrationForm = () => (
    <Fragment>
      <TextField
        InputLabelProps={{
          className: classes.textWhite
        }}
        InputProps={{
          className: classes.textWhite
        }}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        error={status === "invalidEmail"}
        label="Email Address"
        autoFocus
        autoComplete="off"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        FormHelperTextProps={{ error: true }}
      />
      {/* First Name Field */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        required
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
      />
      {/* Last Name Field */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        required
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
      />
      {/* Gender Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Gender</InputLabel>
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          label="Gender"
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          {/* <MenuItem value="other">Other</MenuItem> Other not currently available on database */}
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date of Birth"
          onChange={(newDate) => {
            if (isValid(newDate)) {
              setBirthDate(format(newDate, 'yyyy-MM-dd'));
            }
          }}
          outputFormat="yyyy-MM-dd"
          slotProps={{ textField: { fullWidth: true } }}
        />
      </LocalizationProvider>
      <VisibilityPasswordTextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        error={
          status === "passwordTooShort" || status === "passwordsDontMatch"
        }
        label="Password"
        autoComplete="off"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (
            status === "passwordTooShort" ||
            status === "passwordsDontMatch"
          ) {
            setStatus(null);
          }
        }}
        helperText={(() => {
          if (status === "passwordTooShort") {
            return "Create a password at least 6 characters long.";
          }
          if (status === "passwordsDontMatch") {
            return "Your passwords dont match.";
          }
          return null;
        })()}
        FormHelperTextProps={{ error: true }}
        isVisible={isPasswordVisible}
        onVisibilityChange={setIsPasswordVisible}
      />
      <VisibilityPasswordTextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        error={
          status === "passwordTooShort" || status === "passwordsDontMatch"
        }
        label="Repeat Password"
        autoComplete="off"
        value={passwordRepeat}
        onChange={(e) => {
          setPasswordRepeat(e.target.value);
          if (
            status === "passwordTooShort" ||
            status === "passwordsDontMatch"
          ) {
            setStatus(null);
          }
        }}
        helperText={(() => {
          if (status === "passwordTooShort") {
            return "Create a password at least 6 characters long.";
          }
          if (status === "passwordsDontMatch") {
            return "Your passwords don't match.";
          }
          return null;
        })()}
        FormHelperTextProps={{ error: true }}
        isVisible={isPasswordVisible}
        onVisibilityChange={setIsPasswordVisible}
      />
      <FormControlLabel
        style={{ marginRight: 0 }}
        control={
          <Checkbox
            color="primary"
            inputRef={registerTermsCheckbox}
            onChange={() => {
              setHasTermsOfServiceError(false);
            }}
          />
        }
        label={
          <Typography variant="body1">
            I agree to the
            <span
              className={classes.link}
              onClick={isLoading ? null : openTermsDialog}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                // For screenreaders listen to space and enter events
                if (
                  (!isLoading && event.keyCode === 13) ||
                  event.keyCode === 32
                ) {
                  openTermsDialog();
                }
              }}
            >
              {" "}
              terms of service
            </span>
          </Typography>
        }
      />
      {hasTermsOfServiceError && (
        <FormHelperText
          error
          style={{
            display: "block",
            marginTop: theme.spacing(-1),
          }}
        >
          In order to create an account, you have to accept our terms of
          service.
        </FormHelperText>
      )}
      {isRegistrationSuccessful && (
        <Typography color="primary" align="center">
          Registration Successful!
        </Typography>
      )}
    </Fragment>
  );

  const renderInitialSurvey = () => (
    <Fragment>
      {/* Weight Field (in pounds) */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Weight (lbs)"
        placeholder="Enter your weight in pounds"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        helperText="Example: 150"
      />
      {/* Height Field (in feet and inches) */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        label="Height (in)"
        placeholder="Enter your height in centimeters"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        helperText="Example: 72"
      />
      {/* Goal Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Goal</InputLabel>
        <Select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          label="Goal"
        >
          <MenuItem value={1}>Lose Weight</MenuItem>
          <MenuItem value={2}>Gain Muscle</MenuItem>
          <MenuItem value={3}>Flexibility</MenuItem>
          <MenuItem value={4}>Increase Stamina</MenuItem>
          <MenuItem value={5}>Reduce Stress</MenuItem>
        </Select>
      </FormControl>
    </Fragment>
  );

  const renderUserTypeStep = () => (
    <Fragment>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button 
          onClick={() => handleUserTypeSelect('user')} 
          style={userTypeButtonStyle('user')}
        >
          <PersonIcon fontSize="large" />
          <Box mt={1}>Client</Box>
        </Button>
        <Button 
          onClick={() => handleUserTypeSelect('coach')} 
          style={userTypeButtonStyle('coach')}
        >
          <SportsIcon fontSize="large" />
          <Box mt={1}>Coach</Box>
        </Button>
      </Box>
    </Fragment>
  );

  const handleExperienceSelect = (level) => {
    setCoachExperience(level);
  };

  const experienceButtonStyle = (level) => ({
    border: `1px solid ${coachExperience === level ? 'primary' : 'default'}`,
    backgroundColor: coachExperience === level ? 'lightgrey' : 'white',
    margin: '5px',
    padding: '10px',
  });

  const renderCoachSurveyStep = () => (
    <Fragment>
      <FormControl fullWidth margin="normal">
        <InputLabel id="coach-specialization-label">Specialization</InputLabel>
        <Select
          labelId="coach-specialization-label"
          value={coachGoal}
          onChange={(e) => setCoachGoal(e.target.value)}
          label="Specialization"
        >
          <MenuItem value={1}>Lose Weight</MenuItem>
          <MenuItem value={2}>Gain Muscle</MenuItem>
          <MenuItem value={3}>Flexibility</MenuItem>
          <MenuItem value={4}>Increase Stamina</MenuItem>
          <MenuItem value={5}>Reduce Stress</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Bio"
        multiline
        fullWidth
        margin="normal"
        rows={4}
        variant="outlined"
        value={coachBio}
        onChange={(e) => setCoachBio(e.target.value)}
      />
      <Box display="flex" justifyContent="center" alignItems="center" margin="normal">
        <Button style={experienceButtonStyle('novice')} onClick={() => handleExperienceSelect(1)}>
          Novice
        </Button>
        <Button style={experienceButtonStyle('intermediate')} onClick={() => handleExperienceSelect(2)}>
          Intermediate
        </Button>
        <Button style={experienceButtonStyle('expert')} onClick={() => handleExperienceSelect(3)}>
          Expert
        </Button>
      </Box>
      <TextField
        label="Cost"
        type="number"
        fullWidth
        margin="normal"
        variant="outlined"
        value={coachCost}
        onChange={(e) => setCoachCost(e.target.value)}
      />
    </Fragment>
  );


  // Function to get the content of the current step
  const getStepContent = (step) => {
    switch (step) {
      case 1:
        return renderRegistrationForm();
      case 2:
        return renderInitialSurvey();
      case 3:
        return renderUserTypeStep();
      case 4:
        return renderCoachSurveyStep();
      default:
        return 'Unknown Step';
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}fitConnect/login`, {
        email, password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (isMountedRef.current && response && response.data) {
        const { token, ...otherData } = response.data;

        Cookies.set('authToken', token, { expires: 7 }); // Expires in 7 days

        Object.entries(otherData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });

        history.push("/c/dashboard");
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Login Error:", error);
        setStatus("loginError");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const register = useCallback(() => {
    // Check for terms of service agreement
    if (registerTermsCheckbox.current && !registerTermsCheckbox.current.checked) {
      setHasTermsOfServiceError(true);
      return;
    }

    if (password !== passwordRepeat) {
      setStatus("passwordsDontMatch");
      return;
    }

    setStatus(null);
    setIsLoading(true);

    const userData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
    };

    if (gender) {
      userData.gender = gender;
    }

    if (birthDate) {
      userData.birth_date = birthDate
    }

    // Function to handle initial survey submission
    const handleInitialSurveySubmission = (userId) => {
      const surveyData = {
        user_id: userId,
        goal_id: goalId,
        weight: weight,
        height: height,
      };

      return fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/initial_survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            return { success: true, userId: userId };
          } else {
            return { success: false, error: 'surveySubmissionError' };
          }
        })
        .catch(error => {
          return { success: false, error: 'serverError' };
        });
    };

    const handleCoachRegistration = (userId) => {
      const coachData = {
        user: userId,
        goal: parseInt(coachGoal),
        experience: parseInt(coachExperience),
        cost: parseFloat(coachCost),
        bio: coachBio,
      };

      fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/become_coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coachData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setIsLoading(false);
            showSuccessMessage();
            onClose();
          } else {
            setIsLoading(false);
            setStatus('coachRegistrationError');
          }
        })
        .catch(error => {
          setIsLoading(false);
          setStatus('serverError');
        });
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}fitConnect/create_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.user_id) {
          handleInitialSurveySubmission(data.user_id)
            .then(async surveyResult => {
              if (surveyResult.success) {
                if (selectedUserType === 'coach') {
                  handleCoachRegistration(surveyResult.userId);
                  await login(email, password);
                } else {
                  setIsLoading(false);
                  showSuccessMessage();
                  await login(email, password);
                  onClose();
                }
              } else {
                setIsLoading(false);
                setStatus(surveyResult.error);
              }
            });
        } else {
          setIsLoading(false);
          setStatus(data.error);
        }
      })
      .catch(error => {
        setIsLoading(false);
        setStatus('serverError');
      });
  }, [
    email, firstName, lastName, password, passwordRepeat, gender, birthDate,
    selectedUserType, coachGoal, coachBio, coachExperience, coachCost
  ]);

  // Adjusted dialog title based on the current step
  const getDialogTitle = () => {
    switch (currentStep) {
      case 2:
        return "Initial Survey";
      case 3:
        return "User Type";
      case 4:
        return selectedUserType === 'coach' ? "Coach Survey" : "Complete Registration";
      default:
        return "Register";
    }
  };

  return (
    <FormDialog
      loading={isLoading}
      onClose={props.onClose}
      open
      headline={getDialogTitle()}
      onFormSubmit={(e) => {
        e.preventDefault();
        register();
      }}
      hideBackdrop
      hasCloseIcon
      content={getStepContent(currentStep)}
      actions={
        <Fragment>
          <Box display="flex" justifyContent="space-between">
            {currentStep > 1 && (
              <Button onClick={handleBack} variant="contained">
                Back
              </Button>
            )}
            {errorMessage && (
              <Typography color="error" align="center">
                {errorMessage}
              </Typography>
            )}
            {renderActionButton()}
          </Box>
        </Fragment>
      }
    />
  );
}

RegisterDialog.propTypes = {
  theme: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openTermsDialog: PropTypes.func.isRequired,
  status: PropTypes.string,
  setStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RegisterDialog);
