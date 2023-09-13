import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
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
  CircularProgress,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      alignItems: "flex-start",
      alignItems: "center",
    },
  },
}));

const ShareMeeting = () => {
  const classes = useStyles();
  const { meetingGuid } = useParams();
  const navigate = useNavigate();
  // state initialization
  const [isMeetingCreated, setIsMeetingCreated] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null);
  const [meetingUsers, setMeetingUsers] = useState("");
  const isSmallDevice = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [isMeetingShared, setIsMeetingShared] = useState(null);
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  // Config
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch Meeting Users
  useEffect(() => {
    const fetchMeetingUser = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        const response = await fetch(
          `${BASE_URL}/zoom/get_users/${meetingGuid}`,
          requestOptions
        );
        const data = await response.json();
        setMeetingUsers(data.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };

    fetchMeetingUser();
  }, []);

  // Select all User for share
  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(meetingUsers.map((user) => user.guid));
    } else {
      setSelectedUsers([]);
    }
  };
  // Select one by one user for share meeting
  const handleSelectUser = (event, userId) => {
    if (event.target.checked) {
      setSelectedUsers((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  // Share function handel submit
  const handleMeetingShare = async (data) => {
    const formdata = new FormData();
    selectedUsers.forEach((userId, index) => {
      formdata.append(`users[${index}]`, userId);
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/zoom/share/${meetingGuid}`,
        requestOptions
      );
      const result = await response.json();
      setAlertOpen(result.success);
      if (result.success === true) {
        setIsMeetingShared(result.success);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(`/online-classes`);
        }, 3000);
      }
      else {
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error) {
      setAlertOpen(true);
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };
  return (
    <>
      <Helmet>
        <title>Share Class</title>
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
                onClose={() => setIsMeetingShared(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={isMeetingShared === true ? "success" : "warning"}
                >
                  {isMeetingShared === true
                    ? "Class shared Successfully"
                    : "Class shared failed. At Least one user to be selected."}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Share Class
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained">
                <Link href="/online-classes" color="inherit" underline="none">
                  Cancel
                </Link>
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {meetingUsers && meetingUsers.length > 0 ? (
                <>
                  <form
                    onSubmit={handleSubmit(handleMeetingShare)}
                    style={{ width: "100%" }}
                  >
                    <Grid item xs={12} sx={{ ml: 2, mb: 2 }}>
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selectedUsers.length > 0 &&
                          selectedUsers.length < meetingUsers.length
                        }
                        checked={selectedUsers.length === meetingUsers.length}
                        onChange={handleSelectAll}
                      />
                      Select All
                    </Grid>
                    {meetingUsers &&
                      meetingUsers.map((user) => (
                        <Grid
                          item
                          xs={12}
                          key={user.guid}
                          sx={{ ml: 2, mb: 3 }}
                        >
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
                                        color="primary"
                                        checked={selectedUsers.includes(
                                          user.guid
                                        )}
                                        onChange={(event) =>
                                          handleSelectUser(event, user.guid)
                                        }
                                      />
                                    }
                                    label={
                                      <Box sx={{ display: "flex" }}>
                                        <Typography
                                          variant="h3"
                                          color="text.primary"
                                          sx={{ fontSize: "20px" }}
                                        >
                                          {user.first_name} {user.last_name}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                  <Grid item className={classes.gridContainer}>
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
                    <Grid container sx={{ mt: 3, ml:2 }}>
                      <Grid item>
                        <Button variant="contained" size="large" type="submit">
                          Share
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </>
              ) : (
                <>
                  <Grid item xs={12} sx={{ mt: 5 }}>
                    <Alert severity="error">Users not found!</Alert>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
};
export default ShareMeeting;
