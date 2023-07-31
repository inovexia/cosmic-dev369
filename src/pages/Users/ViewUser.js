import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Link,
} from "@mui/material";
import { Helmet } from "react-helmet";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";


const ViewUser = () => {
  const { userGuid } = useParams();
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const [currUser, setCurrUser] = useState("");

  // Get current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/users/view/${userGuid}`,
        requestOptions
      );
      const userData = await response.json();
      setCurrUser(userData.payload);
    };
    fetchCurrentUser();
  });
 
  return (
    <>
      <Helmet>
        <title>View User</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                {currUser.first_name} {currUser.last_name}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained">
                <Link href="/user/list" color="inherit" underline="none">
                  Back
                </Link>
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={12}>
              <strong>Username:</strong> {currUser.username}
            </Grid>
            <Grid item xs={12}>
            <strong>First Name:</strong> {currUser.first_name}
            </Grid>
            <Grid item xs={12}>
            <strong>Middle Name:</strong> {currUser.middle_name ? currUser.middle_name : "Not added"}
            </Grid>
            <Grid item xs={12}>
            <strong>Last Name:</strong> {currUser.last_name}
            </Grid>
            <Grid item xs={12}>
            <strong>Role:</strong>{currUser.role}
            </Grid>
            <Grid item xs={12}>
            <strong>Email:</strong> {currUser.email}
            </Grid>
            <Grid item xs={12}>
            <strong>Mobile Number:</strong> {currUser.mobile}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default ViewUser;
