import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import registerimg from "../../assets/images/registerimg.png";
import {
  TextField,
  Snackbar,
  Typography,
  Grid,
  Button,
  Alert,
  Link,
} from "@mui/material";

const RegistrationForm = () => {
  const methods = useForm();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = methods;
  const currentStep = watch("currentStep", 0);

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ maxWidth: 450, margin: "auto" }}
      >
        {currentStep === 0 && (
          <>
            <Grid
              container
              maxWidth="100%"
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
                  width: "100%",
                }}
              >
                <img alt="Login" style={{ maxWidth: 200 }} src={registerimg} />
                <Typography component="h2" variant="h5" sx={{ my: 2 }}>
                  Sign up to new account
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Mobile No"
                  {...register("username", { required: true })}
                  helperText={errors.username && "Username is required"}
                  autoComplete="username"
                  autoFocus
                />
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid item>
                    <Link
                      href="/auth/login"
                      variant="body2"
                      sx={{ textDecoration: "none" }}
                    >
                      Already a Member?
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() =>
                    methods.setValue("currentStep", currentStep + 1)
                  }
                >
                  Send OTP
                </Button>

                <Grid container sx={{ justifyContent: "center", mb: 3 }}>
                  <Grid item>
                    Do have account?
                    <Link
                      href="/auth/register"
                      variant="body2"
                      sx={{ textDecoration: "none", pl: 1 }}
                    >
                      Sign In
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Grid
              container
              maxWidth="100%"
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
                  width: "100%",
                }}
              >
                <img alt="Login" style={{ maxWidth: 200 }} src={registerimg} />
                <Typography component="h2" variant="h5" sx={{ my: 2 }}>
                Enter OTP
                </Typography>
                <TextField
                  sx={{width:"100%", mb:2}}
              type="text"
              id="otp"
              {...register('otp', { required: true })}
              error={!!errors.otp}
              helperText={errors.otp && 'This field is required'}
            />
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid item>
                  OTP Not Received?
                    <Link
                      href="/auth/login"
                      variant="body2"
                      sx={{ textDecoration: "none", pl:1 }}
                    >
                     Resend
                    </Link>
                  </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid item>
                  Resend Valid for 10 Minutes
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() =>
                    methods.setValue("currentStep", currentStep + 1)
                  }
                >
                  SUBMIT
                </Button>

                <Grid container sx={{ justifyContent: "center", mb: 3 }}>
                  <Grid item>
                    Do have account?
                    <Link
                      href="/auth/register"
                      variant="body2"
                      sx={{ textDecoration: "none", pl: 1 }}
                    >
                      Sign In
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <button
              type="button"
              onClick={() => methods.setValue("currentStep", currentStep + 1)}
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => methods.setValue("currentStep", currentStep - 1)}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("currentStep", currentStep + 1)}
            >
              Next
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Grid
              container
              maxWidth="100%"
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
                  width: "100%",
                }}
              >
                <img alt="Login" style={{ maxWidth: 200 }} src={registerimg} />
                <Typography component="h2" variant="h5" sx={{ my: 2 }}>
                Provide Your Information
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Enter Your Email"
                  {...register("email", { required: true })}
                  helperText={errors.email && "Email is required"}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Enter Password"
                  {...register("password", { required: true })}
                  helperText={errors.password && "Password is required"}
                  autoComplete="password"
                  autoFocus
                />
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid item>
                  Generate Strong Password?
                    <Link
                      href="/auth/login"
                      variant="body2"
                      sx={{ textDecoration: "none", pl:1 }}
                    >
                       Generate
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() =>
                    methods.setValue("currentStep", currentStep + 1)
                  }
                >
                  CREATE
                </Button>

                <Grid container sx={{ justifyContent: "center", mb: 3 }}>
                  <Grid item>
                    Do have account?
                    <Link
                      href="/auth/register"
                      variant="body2"
                      sx={{ textDecoration: "none", pl: 1 }}
                    >
                      Sign In
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <button
              type="button"
              onClick={() => methods.setValue("currentStep", currentStep + 1)}
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => methods.setValue("currentStep", currentStep - 1)}
            >
              Back
            </button>
            <button type="submit">Submit</button>
          </>
        )}
      </form>
    </FormProvider>
  );
};

export default RegistrationForm;
