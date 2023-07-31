import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { serialize } from "object-to-formdata";
import {
  Box,
  TextField,
  Snackbar,
  Typography,
  Grid,
  Button,
  Link,
  Alert,
  Icon,
  Step,
  Stepper,
  StepLabel,
} from "@mui/material";
import illustartion from "../../../assets/images/Illustration.png";
import BASE_URL from "../../../Utils/baseUrl";
import Network from "../../../Utils/network";
import { MuiOtpInput } from "mui-one-time-password-input";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const steps = ["Step1", "Step2", "Step3"];

export default function ForgotPassword() {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      otp: "",
      token: "",
      password: "",
    },
  });
  //const token = watch("token");
  // Authorization Setup
  var myHeaders = new Headers();
  //myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  // End Authorization

  // State variables for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSuccess, setSnackbarSuccess] = useState(null);

  // Function to show the Snackbar
  const showSnackbar = (severity, message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Function to hide the Snackbar
  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };

  // UseEffect to close the Snackbar after a certain duration
  useEffect(() => {
    if (snackbarOpen) {
      const snackbarTimeout = setTimeout(() => {
        hideSnackbar();
      }, 3000); // Snackbar will be visible for 3 seconds (3000 ms)

      return () => {
        clearTimeout(snackbarTimeout);
      };
    }
  }, [snackbarOpen]);
  // OTP States
  const [otpGenerated, setOtpGenerated] = useState("");
  const [tokenGenerated, setTokenGenerated] = useState("");
  // const handleChange = (newValue) => {
  //   setOtpGenerated(newValue);
  // };
  // Stepper Start
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Stepper End

  // Verify User
  const [userName, setUserName] = useState(null);
  const handleVerifyUser = async (data) => {
    setUserName(data.username);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/auth/password/verify_username`,
        requestOptions
      );
      const result = await response.json();
      setSnackbarOpen(true);
      if (result.success === true) {
        setSnackbarSuccess(true);
        setSnackbarMessage("Username verified, and OTP sent.");
        setOtpGenerated(result.payload.otp);
      } else {
        setSnackbarSuccess(false);
        setSnackbarMessage("Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarSuccess(false);
      setSnackbarMessage("Something went wrong!");
    }
  };

  // Verify OTP and username
  const handleVerifyOTP = async (data) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/auth/password/verify_otp`,
        requestOptions
      );
      const result = await response.json();
      setSnackbarOpen(true);
      if (result.success === true) {
        setValue("token",result.payload.token)
        setSnackbarSuccess(true);
        setSnackbarMessage("OTP verification successfull.");
      } else {
        setSnackbarSuccess(false);
        setSnackbarMessage("Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarSuccess(false);
      setSnackbarMessage("Something went wrong!");
    }
  };

  // Save Password
  const handlePasswordReset = async (data) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/auth/password/change`,
        requestOptions
      );
      const result = await response.json();
      setSnackbarOpen(true);
      if (result.success === true) {
        setSnackbarSuccess(true);
        setSnackbarMessage("Password changed successfully.");
      } else {
        setSnackbarSuccess(false);
        setSnackbarMessage("Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarSuccess(false);
      setSnackbarMessage("Something went wrong!");
    }
  };
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbarSuccess && snackbarSuccess === true ? "success" : "warning"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ maxWidth: "500px", margin: "0px auto" }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <img
            alt="forgot password"
            style={{ maxWidth: 200 }}
            src={illustartion}
          />
        </Box>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: "center", my: 3 }}
        >
          Reset Password
        </Typography>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Box sx={{ width: "100%", textAlign: "center", mt: 3 }}>
              <Icon
                style={{
                  fontSize: "85px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CheckCircleOutlineIcon
                  color="success"
                  sx={{ width: "65px", height: "65px", fontSize: "65px" }}
                />
              </Icon>
            </Box>
            <Typography
              component="h5"
              variant="h5"
              color="#049478"
              sx={{ mt: 2, mb: 1, textAlign: "center" }}
            >
              Password changed successfully.
            </Typography>
            <Box sx={{ display: "flex",pt: 2, justifyContent:"center" }}>
              <Button className="custom-button" variant="outlined" component={Link} href={`/auth/login`}>Login</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography
              component="h3"
              variant="h6"
              sx={{ my: 2, textAlign: "center" }}
            >
              {activeStep === 0
                ? "Enter username or email"
                : activeStep === 1
                ? "Enter OTP"
                : activeStep === 2
                ? "Enter New Password"
                : ""}
            </Typography>
            {activeStep === 0 ? (
              <form onSubmit={handleSubmit(handleVerifyUser)}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email/Username"
                  {...register("username", { required: true })}
                  helperText={errors.username && "Username is required"}
                  autoComplete="username"
                />
                <Grid
                  container
                  sx={{
                    textAlign: "center",
                    mt: 3,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    className="custom-button"
                    disabled={activeStep === 0}
                    onClick={handleReset}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="custom-button"
                  >
                    SEND OTP
                  </Button>
                </Grid>
              </form>
            ) : activeStep === 1 ? (
              <form onSubmit={handleSubmit(handleVerifyOTP)}>
                <Typography sx={{ textAlign: "center", mb: 3, color: "green" }}>
                  OTP is {otpGenerated}
                </Typography>
                <Controller
                  name="otp"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MuiOtpInput
                      {...field}
                      length={6}
                      onChange={(value) => field.onChange(value)}
                      vvalue={field.value || ""}
                    />
                  )}
                />
                {/* ... */}
                <Grid
                  container
                  sx={{
                    textAlign: "center",
                    mt: 3,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    className="custom-button"
                    disabled={activeStep === 0}
                    onClick={handleReset}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="custom-button"
                  >
                    SUBMIT OTP
                  </Button>
                </Grid>
              </form>
            ) : (
              <form onSubmit={handleSubmit(handlePasswordReset)}>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    type="password"
                    fullWidth
                    label="Password"
                    {...register("password", { required: true })}
                    helperText={errors.password && "Password is required"}
                  />
                </Grid>
                <Grid
                  container
                  sx={{
                    textAlign: "center",
                    mt: 3,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    className="custom-button"
                    disabled={activeStep === 0}
                    //onClick={handleBack}
                    onClick={handleReset}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="custom-button"
                  >
                    SAVE
                  </Button>
                </Grid>
              </form>
              )}
              <Box sx={{mt:3}}><Typography component="h6" variant="h6">If you don't want to reset password <Link href={`/auth/login`}>login</Link> here.</Typography></Box>
            <Box sx={{ display: "none", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </>
  );
}
