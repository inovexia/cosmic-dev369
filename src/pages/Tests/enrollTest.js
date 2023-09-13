import React, { useState, useEffect } from "react";
import {
  TextField,
  Snackbar,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Link,
  useMediaQuery,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { serialize } from "object-to-formdata";
import "react-datepicker/dist/react-datepicker.css";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import { Helmet } from "react-helmet";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const EnrollTest = () => {
  const { guid } = useParams();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
    },
  });
  // Snackbar set
  const [isUserEnrolled, setIsUserEnrolled] = useState(null);
  // End Snackbar set
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery((theme) => theme.breakpoints.down("md"));
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  var formdata = new FormData();
  const [enrolledUsers, setEnrolledUsers] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
          // Add any additional headers or options as needed
        };
        const response = await fetch(
          `${BASE_URL}/tests/notenroled/${guid}`,
          requestOptions
        );
        const data = await response.json();
        setEnrolledUsers(data.payload);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUsers();
  }, []);

  const [showFirstPart, setShowFirstPart] = useState(true);
  const handleNext = () => {
    setShowFirstPart(false);
  };
  const handleBack = () => {
    setShowFirstPart(true);
  };

  // useEffect(() => {
  //   const users = [enrolledUsers];
  //   users.forEach((user, index) => {
  //     setValue(`users[${index}]`, user);
  //   });
  // }, [setValue]);

  const handleEnrollSubmit = async (data) => {
    const formData = new FormData();
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    data.users.forEach((user, i) => {
      formData.append(`users[${i}]`, user);
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/tests/enrol/${guid}`,
        requestOptions
      );
      const result = await response.json();
      if (result.success === true) {
        setIsUserEnrolled(result.success);
        // setTimeout(() => {
        //   navigate(`/test/enrollments/${guid}`);
        // }, 1000);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Enroll</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, px: 3 }}>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                New Enroll
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                className="custom-button"
                component={Link}
                href={`/test/enrollments/${guid}`}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Snackbar
              open={isUserEnrolled}
              autoHideDuration={3000}
              onClose={() => setIsUserEnrolled(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={isUserEnrolled === true ? "success" : "warning"}>
                {isUserEnrolled === true
                  ? "Users Enrolled Successfully"
                  : "User Enrolled failed"}
              </Alert>
            </Snackbar>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleEnrollSubmit)}>
                {showFirstPart ? (
                  <div>
                    {enrolledUsers && enrolledUsers.length > 0 ? (
                      <Grid container spacing={2} sx={{ mt: 5 }}>
                        {enrolledUsers.map((user, index) => (
                          <Grid item xs={12} key={index}>
                            <Card style={{ width: "100%" }}>
                              <CardContent
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Grid item xs={12}>
                                  <Box
                                    display={isSmallDevice ? "block" : "flex"}
                                    justifyContent="space-between"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name={`users[${index}]`}
                                          onChange={({
                                            target: { checked },
                                          }) => {
                                            setValue(
                                              `users[${index}]`,
                                              user.guid
                                            );
                                          }}
                                          className="option-label"
                                          value={user.guid}
                                        />
                                      }
                                      label={
                                        <Box sx={{ display: "flex" }}>
                                          <Typography
                                            variant="h3"
                                            color="text.primary"
                                            sx={{ fontSize: "22px" }}
                                          >
                                            {user.first_name} {user.last_name}
                                          </Typography>
                                        </Box>
                                      }
                                    />
                                    <Grid display="flex" item xs={12} md={4}>
                                      <Typography
                                        variant="strong"
                                        color="text.primary"
                                        sx={{ fontSize: "16px" }}
                                      >
                                        Student ID:
                                      </Typography>
                                      <Typography
                                        variant="span"
                                        color="text.secondary"
                                        sx={{ fontSize: "16px" }}
                                      >
                                        {user.guid}
                                      </Typography>
                                    </Grid>
                                  </Box>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Grid item xs={12} sx={{ mt: 5 }}>
                        <Alert severity="info">Users not found!</Alert>
                      </Grid>
                    )}
                    <br />
                    {enrolledUsers && enrolledUsers.length > 0 ? (
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={handleNext}
                        //disabled={users.length > 0 ? false : true}
                      >
                        Next
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <Box style={{ marginTop: "30px", display: "block" }}>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["MobileDateTimePicker"]}>
                      <DemoItem label="Start Date & Time">
                        <MobileDateTimePicker
                          defaultValue={dayjs("2023-04-17T15:30")}
                          name="start_date"
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider> */}
                    <Box sx={{ display: "block", width: "100%" }}>
                      <Controller
                        sx={{ width: "100%" }}
                        control={control}
                        name="start_date"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Start Date and Time"
                            type="datetime-local"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Box>
                    <Box sx={{ display: "block", width: "100%", mt: 5 }}>
                      <Controller
                        sx={{ width: "100%" }}
                        control={control}
                        name="end_date"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="End Date and Time"
                            type="datetime-local"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </Box>
                    <br />

                    <Button
                      variant="contained"
                      size="medium"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      type="submit"
                      sx={{ ml: 3 }}
                    >
                      Submit
                    </Button>
                  </Box>
                )}
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default EnrollTest;
