import React from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Link,
  Tab,
  InputLabel,
  Divider,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Helmet } from "react-helmet";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import CommonSettings from "./CommonSettings";
import RegistrationSettings from "./RegistrationSettings"
import ThemeSettings from "./ThemeSettings"

const Index = () => {

  const [tabValue, setTabValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
                <TabContext value={tabValue}>
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
                      <ThemeSettings />
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
                          <CommonSettings/>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3 }}>
                          <Typography component="h6" variant="h5">
                            Registration Fields
                          </Typography>
                          <Divider />
                          <RegistrationSettings/>
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
