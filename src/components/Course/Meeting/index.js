import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { serialize } from "object-to-formdata";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactHtmlParser from "react-html-parser";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

function extractHrefFromString(str) {
  const regex = /<p>(https?:\/\/[^\s]+)<\/p>/g; // Regex pattern to match URLs
  const matches = str.match(regex); // Find all matches in the string

  if (matches && matches.length > 0) {
    return matches[0]; // Return the first match (the URL)
  }

  return null; // Return null if no match found
}

const Index = ({ item, courseGuid }) => {
  // Configuration
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
    },
  });

  // Action perform
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedMeetingId, setselectedMeetingId] = useState("");

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
  const handleDeleteMeeting = async (meetingId) => {
    var formdata = new FormData();
    formdata.append("meeting[0]", meetingId);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/zoom/delete_meetings/${courseGuid}`,
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

  // Remove Meeting
  const handleRemoveMeeting = async (meetingId) => {
    var formdata = new FormData();
    formdata.append("meeting[0]", meetingId);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/zoom/remove_classes/${courseGuid}`,
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
  // Action Button
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTestId, setCurrentTestId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleConfirmOpen = (event, id) => {
    setCurrentTestId(id);
    setSelectedAction(event.target.getAttribute("value"));
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
  };

  // Change Date Test bulk
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleChangeDate = async (data) => {
    const formattedStartDate = dayjs(data.start_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndDate = dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss");
    const formData = new FormData();
    formData.append(`meeting[0][guid]`, currentTestId);
    formData.append(`meeting[0][start_date]`, formattedStartDate);
    formData.append(`meeting[0][end_date]`, formattedEndDate);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/zoom/change_dates/${courseGuid}`,
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
      setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
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
        <DialogTitle id="alert-dialog-title">
          {selectedAction && selectedAction === "delete"
            ? "Confirm Delete"
            : selectedAction && selectedAction === "remove"
            ? "Confirm Remove"
            : "Date Change"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedAction && selectedAction === "delete" ? (
              "Are you sure you want to delete this online class?"
            ) : selectedAction && selectedAction == "remove" ? (
              "Are you sure you want to remove this online class?"
            ) : (
              <form onSubmit={handleSubmit(handleChangeDate)}>
                <Grid container spacing={2} sx={{ py: 3 }}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="start_date"
                        control={control}
                        defaultValue={dayjs()} // Set default value to current date and time
                        rules={{ required: "Start date is required" }}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="Start Date"
                            fullWidth
                            showTodayButton
                            error={!!errors.start_date}
                            helperText={errors.start_date?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="end_date"
                        control={control}
                        defaultValue={dayjs()} // Set default value to current date and time
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="End Date"
                            fullWidth
                            showTodayButton
                            error={!!errors.end_date}
                            helperText={errors.end_date?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      onClick={handleDeleteConfirmClose}
                      variant="outlined"
                      className="custom-button"
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "right" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      className="custom-button"
                      color="primary"
                      autoFocus
                    >
                      Change
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {selectedAction && selectedAction === "delete" ? (
            <Button onClick={handleDeleteConfirmClose} color="primary">
              Cancel
            </Button>
          ) : selectedAction && selectedAction === "remove" ? (
            <Button onClick={handleDeleteConfirmClose} color="primary">
              Cancel
            </Button>
          ) : (
            ""
          )}

          {selectedAction && selectedAction === "delete" ? (
            <Button
              onClick={() => handleDeleteMeeting(currentTestId)}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          ) : selectedAction && selectedAction === "remove" ? (
            <Button
              onClick={() => handleRemoveMeeting(currentTestId)}
              color="primary"
              autoFocus
            >
              Remove
            </Button>
          ) : (
            ""
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setIsMeetingDeleted(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {selectedAction && selectedAction === "delete" ? (
          <Alert severity={isMeetingDeleted === true ? "success" : "warning"}>
            {isMeetingDeleted === true
              ? "Class deleted Successfully"
              : "Class deleted failed"}
          </Alert>
        ) : selectedAction && selectedAction === "remove" ? (
          <Alert severity={isMeetingDeleted === true ? "success" : "warning"}>
            {isMeetingDeleted === true
              ? "Class removed Successfully"
              : "Class remove failed"}
          </Alert>
        ) : (
          <Alert severity={isMeetingDeleted === true ? "success" : "warning"}>
            {isMeetingDeleted === true
              ? "Date changed Successfully"
              : "Date change failed"}
          </Alert>
        )}
      </Snackbar>

      <Box sx={{ px: 3, backgroundColor: "#fff " }} key={item.guid}>
        <Grid
          container={true}
          sx={{
            borderBottom: "1px solid #B8B8B8",
            py: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6.5}
              sx={{
                display: { xs: "flex", md: "block" },
                justifyContent: { xs: "space-between" },
              }}
            >
              <Grid item xs={11} md={12}>
                <h3>
                  <Link
                    href={`/course/manage/${item.guid}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {item.title}
                  </Link>
                </h3>
              </Grid>
              <Grid item xs={1} sx={{ display: { xs: "block", md: "none" } }}>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={(event) => handleClick(event, item.guid)}
                  className="no-pd"
                >
                  <MoreVertOutlinedIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    value="changeDate"
                    onClick={(event) => handleConfirmOpen(event, item.guid)}
                  >
                    Chnage Date
                  </MenuItem>
                  <MenuItem
                    value="remove"
                    onClick={(event) => handleConfirmOpen(event, item.guid)}
                  >
                    Remove
                  </MenuItem>
                  <MenuItem
                    value="delete"
                    onClick={(event) => handleConfirmOpen(event, item.guid)}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={2.5}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography
                component="h5"
                variant="span"
                sx={{
                  display: { xs: "block", md: "none", marginRight: "5px" },
                }}
              >
                Start Date:{" "}
              </Typography>
              <span>{item.created_on}</span>
            </Grid>
            <Grid
              item
              xs={12}
              md={2.5}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography
                component="h5"
                variant="span"
                sx={{
                  display: { xs: "block", md: "none", marginRight: "5px" },
                }}
              >
                End Date:{" "}
              </Typography>
              <span>{item.updated_on}</span>
            </Grid>
            <Grid item xs={12} md={0.5}>
              <Grid item sx={{ display: { xs: "none", md: "block" } }}>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={(event) => handleClick(event, item.guid)}
                  className="no-pd"
                >
                  <MoreVertOutlinedIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    value="changeDate"
                    onClick={(event) => handleConfirmOpen(event, item.guid)}
                  >
                    Chnage Date
                  </MenuItem>
                  <MenuItem
                    value="remove"
                    onClick={(event) => handleConfirmOpen(event, item.guid)}
                  >
                    Remove
                  </MenuItem>
                  <MenuItem
                    value="delete"
                    onClick={(event) => handleConfirmOpen(event, item.guid)}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                component={Link}
                to={`/class/edit/${item.guid}?ci=${courseGuid}`}
                color="primary"
                sx={{ mr: 2 }}
              >
                <EditRoundedIcon />
                Edit
              </Button>
              <Button
                component={Link}
                to={`/class/share/${item.guid}`}
                color="primary"
                sx={{ mr: 2 }}
              >
                <ShareRoundedIcon />
                Share
              </Button>
              <Button
                component={Link}
                to={`/class/share/${item.guid}`}
                color="success"
              >
                Start
                <PlayArrowIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Index;
