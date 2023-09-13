import React from "react";
import SidebarLeft from "../components/Sidebar/SidebarLeft";
import {
  Box,
  Grid,
  Button,
  Link,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import CheckTokenValid from "../../src/components/Redirect/CheckTokenValid";

const NotFound = () => {
  return (
    <>
      <CheckTokenValid />
      <Helmet>
        <title>404</title>
        <body id="not-found-page" />
      </Helmet>
      <Box sx={{ display: "flex", height: "70vh" }}>
        <SidebarLeft />
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={5} sx={{textAlign:"center"}}>
            <Box elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
              <Typography variant="h4" gutterBottom>
                <Typography component="h1" variant="h1">
                  404
                </Typography>
                Page Not Found
              </Typography>
              <Typography variant="body1">
                Sorry, the page you are looking for does not exist.
              </Typography>
              <Button sx={{mt:5}} className="custom-button" variant="contained" component={Link} href={`/dashboard`}>Go To Dashboard</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default NotFound;
