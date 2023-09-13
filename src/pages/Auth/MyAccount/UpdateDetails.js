import React, { useState } from "react";
import {
  Box,
  Grid,
  Alert,
  Snackbar,
  FormHelperText,
  Button,
} from "@mui/material";
import { serialize } from "object-to-formdata";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import FormTextField from "../../../components/Common/formTextField";
import { useForm } from "react-hook-form";

const UpdateDetails = ({ user, userId }) => {
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

  // Update Password
  const handleUpdate = async (data, e) => {
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
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <FormTextField
                            fullWidth
                              label="First Name"
                              control={control}
                              name="first_name"
                              variant="outlined"
                              required
                              pattern="[A-Za-z]{1,}"
                            />
                            {validationErrors.first_anme && (
                              <FormHelperText error>
                                {validationErrors.first_name}
                              </FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormTextField
                            fullWidth
                              label="Middle Name"
                              control={control}
                              name="middle_name"
                              variant="outlined"
                              required
                              pattern="[A-Za-z]{1,}"
                            />
                            {validationErrors.middle_name && (
                              <FormHelperText error>
                                {validationErrors.middle_name}
                              </FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormTextField
                            fullWidth
                              label="Last Name"
                              control={control}
                              name="last_name"
                              variant="outlined"
                              required
                              pattern="[A-Za-z]{1,}"
                            />
                            {validationErrors.last_name && (
                              <FormHelperText error>
                                {validationErrors.last_name}
                              </FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12}><Button className="custom-button" variant="outlined" type="submit">Save</Button></Grid>
                      </Grid>
                    </form>
                  </Box>
    </>
  );
};

export default UpdateDetails;
