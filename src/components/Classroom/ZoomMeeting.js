import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import ReactHtmlParser from "react-html-parser";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";

// const extractHrefValue = (htmlString) => {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(htmlString, "text/html");
//   const linkElement = doc.querySelector("a");
//   if (linkElement) {
//     return linkElement.getAttribute("href");
//   }
// };

function extractHrefFromString(str) {
  const regex = /<p>(https?:\/\/[^\s]+)<\/p>/g; // Regex pattern to match URLs
  const matches = str.match(regex); // Find all matches in the string

  if (matches && matches.length > 0) {
    return matches[0]; // Return the first match (the URL)
  }

  return null; // Return null if no match found
}

const ZoomMeeting = ({ item }) => {
  // Configuration
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Delete test
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedMeetingId, setselectedMeetingId] = useState("");
  const handleDeleteConfirmOpen = (meetingId) => {
    setselectedMeetingId(meetingId);
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setselectedMeetingId("");
  };

  // Action completed message
  const [isMeetingDeleted, setIsMeetingDeleted] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null);

  // Delete action function
  const navigate = useNavigate();
  const [testDeleted, setTestDeleted] = useState(null);
  const handleDeleteTest = async (meetingId, createdBy, meetingDetails) => {
    var formdata = new FormData();
    formdata.append("details", meetingDetails);
    formdata.append("created_by", createdBy);
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/zoom/delete/${meetingId}`,
        requestOptions
      );
      const statusResult = await res.json();
      setAlertOpen(true);
      if (statusResult.success === true) {
        setIsMeetingDeleted(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        setTestDeleted(statusResult.success);
      }
      setDeleteConfirmOpen(false);
    } catch (error) {
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  return (
    <>
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this meeting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleDeleteTest(selectedMeetingId, item.created_by, item.details)
            }
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setIsMeetingDeleted(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={isMeetingDeleted === true ? "success" : "warning"}>
          {isMeetingDeleted === true
            ? "Meeting deleted Successfully"
            : "Meeting deleted failed"}
        </Alert>
      </Snackbar>

      <Card className="zoom-meeting" sx={{ my: 3 }} key={item.guid}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                color="inherit"
                underline="none"
                sx={{
                  fontSize: 20,
                  fontWeight: 500,
                  fontFamily: "Arial",
                }}
              >
                {item.title ? (item.title) : "Title not available"}
                {/* {ReactHtmlParser(item.details)} */}
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography component="h4">
                <strong style={{ paddingRight: "10px" }}>Meeting ID:</strong>
                {item.guid}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography component="span">
                <strong>Start Date/Time:</strong>01-07-2023
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography component="span">
                <strong>End Date/Tine:</strong>01-07-2023
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ mt: 1 }}
            className={`meeting-action`}
          >
            <Grid item>
              <Button
                component={Link}
                to={`/meeting/edit/${item.guid}`}
                color="warning"
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "Arial",
                  color: "#F29913",
                }}
              >
                <EditRoundedIcon />
                Edit
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => handleDeleteConfirmOpen(item.guid)}
                color="primary"
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "Arial",
                }}
              >
                <DeleteRoundedIcon />
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to={`/meeting/share/${item.guid}`}
                color="success"
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "Arial",
                  color: "#049478",
                }}
              >
                <ShareRoundedIcon />
                Share
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                className="custom-button"
                component={Link}
                color="primary"
                href={extractHrefFromString(item.details)}
                target="_blank"
              >
                START
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ZoomMeeting;
