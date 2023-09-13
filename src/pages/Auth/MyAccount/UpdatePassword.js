import React, { useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Alert,
  Snackbar,
  FormHelperText,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { serialize } from "object-to-formdata";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import FormTextField from "../../../components/Common/formTextField";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UpdatePassword = ({ userId }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  // Config
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

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

  // Edit account
  const [validationErrors, setValidationErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const handlePasswordVisibilityToggle = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordVisibilityToggle2 = () => {
    setShowPassword2(!showPassword2);
  };

  // Update Password
  const handleUpdatePass = async (data, e) => {
    e.preventDefault(); // Prevent the form from submitting
    const formdata = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/users/change_password/${userId}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "Password updated Successfully");
        setTimeout(() => {
          //navigate(`/course/${courseGuid}/test/list`);
        }, 1000);
      } else {
        setTimeout(() => {
          showSnackbar("warning", result.messages.password);
        }, 1000);

        setTimeout(() => {
          showSnackbar("warning", result.messages.password_confirm);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
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
      <Box>
        <form onSubmit={handleSubmit(handleUpdatePass)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                {...register("password", { required: true })}
                helperText={errors.password && "Password is required"}
                type={showPassword ? "text" : "password"}
                label="New Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handlePasswordVisibilityToggle}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                {...register("password_confirm", { required: true })}
                helperText={errors.password_confirm && "Password is required"}
                type={showPassword2 ? "text" : "password"}
                label="Confirm Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handlePasswordVisibilityToggle2}
                        edge="end"
                      >
                        {showPassword2 ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                className="custom-button"
                variant="outlined"
                type="submit"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default UpdatePassword;
