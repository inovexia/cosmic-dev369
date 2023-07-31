import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { MuiTelInput } from "mui-tel-input";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import CreatedBy from "../../Utils/createdBy";
import token from "../../Utils/token";
import { serialize } from "object-to-formdata";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const CreateUser = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    role: "student",
    status: "",
    mobile: "",
    email: { CreatedBy },
  });
  const { mobile } = watch();
  const [validationErrors, setValidationErrors] = useState({});
  const [isUserCreated, setIsUserCreated] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null);

  // Phone Number
  const [value, setValue] = React.useState("");
  const handleChangePhone = (newValue) => {
    setValue(newValue);
  };
  //
  const navigate = useNavigate();
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const formdata = new FormData();

  // Get current location country code
  const [countryCode, setCountryCode] = useState(null);
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://geolocation-db.com/json/");
        const data = await response.json();
        const countryCode = data.country_code;
        setCountryCode(countryCode);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  const [emailError, setEmailError] = useState(null);
  const [MobileError, setMobileError] = useState(null);
  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${BASE_URL}/users/add`, requestOptions);
      const result = await response.json();
      setAlertOpen(true);
      setEmailError(result.message.email);
      setMobileError(result.message);
      if (result.success === true) {
        setIsUserCreated(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(`/user/list`);
        }, 3000);
      } else {
        setIsUserCreated(false);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error) {
      setIsUserCreated(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Create User</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: "100%" }}
            alignItems="center"
          >
            <Grid item>
              <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setIsUserCreated(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={isUserCreated === true ? "success" : "warning"}
                >
                  {isUserCreated === true
                    ? "User created Successfully"
                    : emailError && emailError
                    ? emailError
                    : MobileError && MobileError
                    ? MobileError
                    : "User creation failled!"}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Create User
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained">
                <Link href="/user/list" color="inherit" underline="none">
                  Cancel
                </Link>
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input type="hidden" name="created_by" value={CreatedBy} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="type-select-label">User Role</InputLabel>
                      <Controller
                        name="role"
                        control={control}
                        defaultValue="student" // Default value set to 'student'
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="type-select-label"
                            id="type-select"
                            label="User Role"
                            required
                          >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="instructor">Teacher</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="type-select-status">Status</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue="0"
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="type-select-status"
                            id="type-select"
                            label="Status"
                            required
                          >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        {...register("first_name")}
                        label="First Name"
                        variant="outlined"
                        name="first_name"
                        pattern="[A-Za-z]{1,}"
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        {...register("middle_name")}
                        label="Middle Name"
                        variant="outlined"
                        name="middle_name"
                        pattern="[A-Za-z]{1,}"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        {...register("last_name")}
                        label="Last Name"
                        variant="outlined"
                        name="last_name"
                        pattern="[A-Za-z]{1,}"
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      {/* <TextField
                        {...register("mobile")}
                        label="Contact No"
                        variant="outlined"
                        name="mobile"
                        pattern="[A-Za-z]{1,}"
                      /> */}
                      <MuiTelInput
                        fullWidth
                        label="Mobile No"
                        defaultCountry={countryCode}
                        {...register("mobile", { required: true })}
                        helperText={
                          errors.mobile && "Mobile number is required"
                        }
                        value={value}
                        onChange={handleChangePhone}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        {...register("email")}
                        label="Email"
                        variant="outlined"
                        name="email"
                        pattern="[A-Za-z]{1,}"
                        required
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  sx={{ mt: 5 }}
                >
                  Create User
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default CreateUser;
