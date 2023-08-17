import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { serialize } from "object-to-formdata";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Snackbar,
  Typography,
  Grid,
  Button,
  Alert,
  Link,
} from "@mui/material";
import registration from "../../../assets/images/registerimg.png";
import { MuiTelInput } from "mui-tel-input";
import BASE_URL from "../../../Utils/baseUrl";
import CreatedBy from "../../../Utils/createdBy";
import Network from "../../../Utils/network";

export default function Register() {
  const [value, setValue] = React.useState("");
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      device_name: "device",
      middle_name: "",
    },
  });

  // Configuration
  const myHeaders = new Headers();
  myHeaders.append("Network", `${Network}`);

  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(null);

  // Get common settings
  const [settingData, setSettingData] = useState(null);
  useEffect(() => {
    const commonSettings = async () => {
      try {
        var requestOption = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        const response = await fetch(
          `${BASE_URL}/settings/registration/common`,
          requestOption
        );
        const commonData = await response.json();
        setSettingData(commonData.payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    commonSettings();
  }, []);

  // Get required fields
  const [requiredFields, setRequiredFields] = useState(null);
  useEffect(() => {
    const requiredValue = async () => {
      try {
        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        const response = await fetch(
          `${BASE_URL}/settings/registration/valid_fields`,
          requestOptions
        );
        const requiredData = await response.json();
        setRequiredFields(requiredData.payload.fields);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    requiredValue();
  }, []);

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

  const submitRegisterForm = async (data) => {
    try {
      const formData = serialize(data);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(`${BASE_URL}/auth/register`, requestOptions);
      const result = await response.json();
      setOpen(true);
      if (result.success === true) {
        setIsUserRegistered(true);
        setTimeout(() => {
          navigate(`/auth/login`);
        }, 3000);
      } else {
        setIsUserRegistered(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsUserRegistered(false);
    }
  };

  console.log(settingData);
  return (
    <>
      {settingData && settingData.allow_user_registration === "true" ? (
        <>
          <Grid
            container
            maxWidth={600}
            sx={{ mx: "auto", justifyContent: "center" }}
            className={`login-page`}
          >
            <Grid
              item
              sx={{
                padding: "15px",
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                alt="Registration"
                style={{ maxWidth: 200 }}
                src={registration}
              />
              <Typography component="h1" variant="h5" sx={{ my: 2 }}>
                Sign up to new account
              </Typography>
              <form onSubmit={handleSubmit(submitRegisterForm)}>
                {settingData &&
                settingData.auto_generate_username === "true" ? (
                  ""
                ) : (
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    {...register("username", { required: true })}
                    helperText={errors.username && "Username is required"}
                    autoComplete="username"
                    autoFocus
                  />
                )}
                <TextField
                  margin="normal"
                  fullWidth
                  label="Mobile No"
                  {...register("mobile", {
                    required:
                      requiredFields && requiredFields.mobile === "true"
                        ? true
                        : false,
                  })}
                  helperText={errors.mobile && "Mobile number is required"}
                  autoComplete="mobile"
                  autoFocus
                />
                {/* <MuiTelInput
                  sx={{mb:1}}
                  fullWidth
                  label="Mobile No"
                  defaultCountry={countryCode}
                  {...register("mobile", {
                    required:
                      requiredFields && requiredFields.mobile === "true"
                        ? true
                        : false,
                  })}
                  helperText={errors.mobile && "Mobile number is required"}
                  value={value}
                  onChange={handleChange}
                /> */}
                <TextField
                  margin="normal"
                  fullWidth
                  label="Email"
                  {...register("email", {
                    required:
                      requiredFields && requiredFields.email === "true"
                        ? true
                        : false,
                  })}
                  helperText={errors.email && "Email is required"}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  {...register("first_name", { required: true })}
                  helperText={errors.first_name && "First name is required"}
                  label="First Name"
                  autoComplete="first_name"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  {...register("middle_name", { required: false })}
                  label="Middle Name"
                  autoComplete="middle_name"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  {...register("last_name", { required: true })}
                  helperText={errors.last_name && "Last name is required"}
                  label="Last Name"
                  autoComplete="last_name"
                />
                <TextField
                  margin="normal"
                  fullWidth
                  type="password"
                  {...register("password", { required: true })}
                  helperText={errors.password && "Password is required"}
                  label="Password"
                  autoComplete="password"
                  InputProps={{
                    inputProps: {
                      minLength: 8,
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  CREATE ACCOUNT
                </Button>
              </form>
              <Grid container sx={{ justifyContent: "center", mb: 3 }}>
                <Grid item>
                  Do have account?
                  <Link
                    href="/auth/login"
                    variant="body2"
                    sx={{ pl: 1, textDecoration: "none" }}
                  >
                    Sign In
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={() => setOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity={isUserRegistered === true ? "success" : "warning"}
              >
                {isUserRegistered === true
                  ? "Registration Successfull"
                  : "Registration Failed"}
              </Alert>
            </Snackbar>
          </Grid>
        </>
      ) : (
        <>
          <Grid
            container
            maxWidth={600}
            sx={{ mx: "auto", justifyContent: "center" }}
            className={`login-page`}
          >
            <Grid item sx={{textAlign:"center"}}>
              <img
                alt="Registration"
                style={{ maxWidth: 200 }}
                src={registration}
              />
              <Typography component="h1" variant="h5" sx={{ my: 2 }}>
                Registration not allow!
                </Typography>
                <Button sx={{mt:2}} variant="contained" component={Link} className="custom-button" href={`/auth/login`}>Go To Login</Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
