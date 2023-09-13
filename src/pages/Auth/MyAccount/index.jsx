import React, { useState, useEffect } from "react";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  FormHelperText,
  Button,
} from "@mui/material";
import { Helmet } from "react-helmet";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import CreatedBy from "../../../Utils/createdBy";
import CheckTokenValid from "../../../../src/components/Redirect/CheckTokenValid";
import FormTextField from "../../../components/Common/formTextField";
import { useForm } from "react-hook-form";
import UpdatePassword from "./UpdatePassword";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Index = () => {
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
  // Update Name
  const handleUpdate = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append only the specific fields you want to include
    formData.append("first_name", data.first_name);
    formData.append("middle_name", data.middle_name);
    formData.append("last_name", data.last_name);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/users/update/${CreatedBy}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "User updated Successfully");

        // Update the user state with the new data
        setUser({
          ...user,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
        });
      } else {
        showSnackbar("warning", "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Get User Details
  const [user, setUser] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const requestOption = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        const res = await fetch(
          `${BASE_URL}/users/view/${CreatedBy}`,
          requestOption
        );
        if (res.ok) {
          const result = await res.json();
          setUser(result.payload);
          reset(result.payload);
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    };
    fetchUser();
  }, []);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <CheckTokenValid />
      <Helmet>
        <title>My Account</title>
      </Helmet>
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
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box
          sx={{ flexGrow: 1, px: 3, mt: 1, width: "100%" }}
          className="my-account"
        >
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h4">
                My Account
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                }}
              >
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: "divider" }}
                >
                  <Tab label="My Account" {...a11yProps(0)} />
                  <Tab label="Edit Account" {...a11yProps(1)} />
                  <Tab label="Change Password" {...a11yProps(2)} />
                </Tabs>
                <TabPanel
                  value={value}
                  index={0}
                  sx={{ width: "-moz-available" }}
                >
                  {user && user ? (
                    <Box sx={{ mt: "0", width: "100%" }}>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ p: 0, mb: 1 }}>
                          <strong style={{ marginRight: "5px" }}>
                            Username:
                          </strong>
                          <ListItemText primary={user.username} />
                        </ListItem>
                      </List>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ p: 0, mb: 1 }}>
                          <strong style={{ marginRight: "5px" }}>
                            First name:
                          </strong>
                          <ListItemText primary={user.first_name} />
                        </ListItem>
                      </List>
                      {user.middle_name ? (
                        <List sx={{ p: 0 }}>
                          <ListItem sx={{ p: 0, mb: 1 }}>
                            <strong style={{ marginRight: "5px" }}>
                              Middle Name:
                            </strong>
                            <ListItemText primary={user.middle_name} />
                          </ListItem>
                        </List>
                      ) : (
                        ""
                      )}
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ p: 0, mb: 1 }}>
                          <strong style={{ marginRight: "5px" }}>
                            Last Name:
                          </strong>
                          <ListItemText primary={user.last_name} />
                        </ListItem>
                      </List>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ p: 0, mb: 1 }}>
                          <strong style={{ marginRight: "5px" }}>Email:</strong>
                          <ListItemText primary={user.email} />
                        </ListItem>
                      </List>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ p: 0, mb: 1 }}>
                          <strong style={{ marginRight: "5px" }}>
                            Mobile:
                          </strong>
                          <ListItemText primary={user.mobile} />
                        </ListItem>
                      </List>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ p: 0, mb: 1 }}>
                          <strong style={{ marginRight: "5px" }}>Role:</strong>
                          <ListItemText primary={user.role} />
                        </ListItem>
                      </List>
                    </Box>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity="error">
                      Data not found!
                    </Alert>
                  )}
                </TabPanel>
                <TabPanel
                  value={value}
                  index={1}
                  sx={{ width: "-moz-available" }}
                >
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
                </TabPanel>
                <TabPanel
                  value={value}
                  index={2}
                  sx={{ width: "-moz-available" }}
                >
                  <UpdatePassword userId={CreatedBy} />
                </TabPanel>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Index;
