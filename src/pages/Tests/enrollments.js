import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Link
} from "@mui/material";
import EnrolledList from "../../components/Test/enrollments";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import { Helmet } from "react-helmet";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const Enrollments = () => {
  const { guid } = useParams();
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );
  myHeaders.append("Network", `${Network}`);
  var formdata = new FormData();
  const [enrolledUsers, setEnrolledUsers] = useState("");

  useEffect(() => {
    const fetchEnrolledUser = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
          // Add any additional headers or options as needed
        };
        const response = await fetch(
          `${BASE_URL}/tests/enrolments/${guid}`,
          requestOptions
        );
        const data = await response.json();
        setEnrolledUsers(data.payload);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchEnrolledUser();
  }, []);

  // Delete Confirmation Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const handleDeleteConfirmClose = () => {
    setAnchorEl(null);
    setDeleteConfirmOpen(false);
    setSelectedUserId("");
  };

  // Delete Enrolled User with API
  const [userDeleted, setUserDeleted] = useState(null);
  const handleDeleteUser = async (selectedUserId) => {
    try {
      var formdata = new FormData();
      formdata.append("users[0]", selectedUserId);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/tests/unenrol/${guid}`,
        requestOptions
      );
      const result = await response.json();
      //console.log(statusResult);
      if (result.success === true) {
        setAnchorEl(null);
        setUserDeleted(result.success);
        setEnrolledUsers(
          enrolledUsers.filter((user) => user.guid !== selectedUserId)
        );
      }
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  // Edit Enrolled User
  // Toggle Menu end
  const handleDeleteConfirmOpen = (userId) => {
    setAnchorEl(null);
    setSelectedUserId(userId);
    setDeleteConfirmOpen(true);
  };
  return (
    <>
    <Helmet>
        <title>Enrollments</title>
    </Helmet>
    <Box sx={{ display: "flex" }}>
      <SidebarLeft />
      <Box sx={{ flexGrow: 1, px: 3 }}>
        <Grid
          container={true}
          spacing={2}
          sx={{  width: "100%" }}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Dialog
              open={deleteConfirmOpen}
              onClose={handleDeleteConfirmClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Confirm Delete"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this user?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteConfirmClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteUser(selectedUserId)}
                  color="primary"
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <Grid container={true} spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={6}>
            <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
              Enrollments
            </Typography>
          </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Button variant="contained" size="medium" component={Link} className="custom-button" href={`/test/manage/${guid}`}>
                Back
            </Button>
            <Button sx={{ml:1}} variant="outlined" size="medium" component={Link} className="custom-button" href={`/test/enroll/${guid}`}>
                Add New
            </Button>
          </Grid>
        </Grid>
        {enrolledUsers && enrolledUsers.length > 0 ? (
          <Grid container={true} spacing={2} sx={{ mt: 3 }}>
            {enrolledUsers.map((user, index) => (
              <EnrolledList key={index} user={user} index={index} handleDeleteConfirmOpen={handleDeleteConfirmOpen} />
            ))}
          </Grid>
        ) : (
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Alert severity="info">Users not found!</Alert>
          </Grid>
        )}


      </Box>
    </Box>
    </>
  );
};
export default Enrollments;
