import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Link,
  Tab,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Helmet } from "react-helmet";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
//import ColorPicker from 'material-ui-color-picker';

const Index = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("student")
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeRole = (event) => {
    setUserRole(event.target.value);
  };

  const handleThemeSetting = () => {
    ""
  }
  const handleCommonSetting = () => {
    ""
  }
  const handleRegSetting = () => {
    ""
  }

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Settings
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained" className="custom-button">
                <Link href="/" color="inherit" underline="none">
                  Cancel
                </Link>
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Theme" value="1" />
                      <Tab label="Authentication" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Box>
                      <InputLabel>Change accent color</InputLabel>
                    </Box>
                  </TabPanel>
                  <TabPanel value="2" sx={{ p: 0 }}>
                    <Grid container spacing={2} sx={{ p: 0, mt: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3 }}>
                          <Typography component="h6" variant="h5">
                            Common Settings
                          </Typography>
                          <Divider />
                          <form onSubmit={handleSubmit(handleCommonSetting)}>
                          <FormGroup
                            style={{
                              alignItems: "flex-start",
                              marginTop: "20px",
                            }}
                          >
                            <FormControlLabel
                                style={{ marginLeft: "0" }}
                                name="single_device_login"
                              control={<Switch defaultChecked />}
                              label="Use Single Device Login"
                              labelPlacement="start" // This places the label before the switch
                            />
                            <FormControlLabel
                                style={{ marginLeft: "0" }}
                                name="allow_user_registration"
                              control={<Switch />}
                              label="Allow User Registration"
                              labelPlacement="start" // This places the label before the switch
                            />
                            <FormControlLabel
                                style={{ marginLeft: "0" }}
                                name="auto_generate_username"
                              control={<Switch />}
                              label="Auto Generate Username"
                              labelPlacement="start" // This places the label before the switch
                            />
                            <FormControlLabel
                                style={{ marginLeft: "0" }}
                                name="auto_approve_user"
                              control={<Switch />}
                              label="Auto Approve"
                              labelPlacement="start" // This places the label before the switch
                            />
                          </FormGroup>
                          <FormControl fullWidth sx={{mt:2}}>
                            <InputLabel id="user-role">
                              User Role
                            </InputLabel>
                            <Select
                              labelId="user-role"
                                id="user-role-select"
                                name="default_user_role"
                              value={userRole}
                              label="User Role"
                              onChange={handleChangeRole}
                              autoFocus
                            >
                              <MenuItem value="admin">Admin</MenuItem>
                              <MenuItem value="teacher">Teacher</MenuItem>
                              <MenuItem value="student">Student</MenuItem>
                            </Select>
                            </FormControl>
                            <Button type="submit" className="custom-button" variant="outlined" sx={{mt:3}}>Save</Button>
                          </form>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3 }}>
                          <Typography component="h6" variant="h5">
                            Registration Fields
                          </Typography>
                          <Divider />
                          <form onSubmit={handleSubmit(handleCommonSetting)}>
                          <FormGroup
                            style={{
                              alignItems: "flex-start",
                              marginTop: "20px",
                            }}
                          >
                            <FormControlLabel
                              style={{ marginLeft: "0" }}
                              control={<Switch defaultChecked />}
                              label="Use Mobile Number Field"
                              labelPlacement="start" // This places the label before the switch
                            />
                            <FormControlLabel
                              style={{ marginLeft: "0" }}
                              control={<Switch />}
                              label="Use Email Field"
                              labelPlacement="start" // This places the label before the switch
                            />
                            </FormGroup>
                            <Button type="submit" className="custom-button" variant="outlined" sx={{mt:3}}>Save</Button>
                          </form>
                        </Card>
                      </Grid>
                    </Grid>
                  </TabPanel>
                </TabContext>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Index;
