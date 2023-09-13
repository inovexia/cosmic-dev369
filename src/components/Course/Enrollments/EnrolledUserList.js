import React, { useState, useEffect } from "react";
import {
  Checkbox,
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
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const EnrolledUserList = ({
  user,
  onUserSelect,
  selectedUsers,
  courseGuid,
  action,
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const firstInitial = user.first_name ? user.first_name[0] : "";
  const lastInitial = user.last_name ? user.last_name[0] : "";
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const navigate = useNavigate();

  function generateColorCode(str) {
    const charCode = str.charCodeAt(0);
    const red = (charCode * 20) % 256;
    const green = (charCode * 20) % 256;
    const blue = (charCode * 40) % 256;
    return `rgb(${red}, ${green}, ${blue})`;
  }
  const bgColor = generateColorCode(firstInitial + lastInitial);

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
    },
  });
  const { start_date, end_date } = watch();

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

  // UseEffect to close the Snackbar after a certain duration
  useEffect(() => {
    if (snackbarOpen) {
      const snackbarTimeout = setTimeout(() => {
        hideSnackbar();
      }, 3000); // Snackbar will be visible for 3 seconds (3000 ms)

      return () => {
        clearTimeout(snackbarTimeout);
      };
    }
  }, [snackbarOpen]);

  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const [selectedUserId, setselectedUserId] = useState("");
  const handleConfirmOpen = (userId) => {
    setselectedUserId(userId);
    setDeleteConfirmOpen(true);
  };
  const actionConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  // Unenroll function on submit
  const handleUnenrollSingleUser = async (id) => {
    var formdata = new FormData();
    formdata.append("users[0]", id);
    setDeleteConfirmOpen(false);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/unenrol/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "User Unenrolled Successfully");
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        showSnackbar(
          "warning",
          "User Unenrolled failed, Atleast 1 item should be selected!"
        );
        setTimeout(() => {}, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Enroll function on submit
  const handleEnrollSingleUser = async (data) => {
    var formData = new FormData();
    const formattedStartDate = dayjs(data.start_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndDate = dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss");
    formData.append("users[0]", selectedUserId);
    formData.append("start_date", formattedStartDate);
    formData.append("end_date", formattedEndDate);
    setDeleteConfirmOpen(false);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/enrol/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "User Enrolled Successfully");
        setTimeout(() => {
          navigate(`/course/${courseGuid}/enrolled-users`);
        }, 1000);
      } else {
        showSnackbar(
          "warning",
          "User Enrolled failed, Atleast 1 item should be selected!"
        );
        setTimeout(() => {}, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  return (
    <>
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
      <Dialog
        className="enroll-date-outer"
        open={deleteConfirmOpen}
        onClose={actionConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {action && action === "enroll" ? (
          <>
            <form onSubmit={handleSubmit(handleEnrollSingleUser)}>
              <DialogTitle id="alert-dialog-title">
                Select date and confirm
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <label>Start Date</label>
                    <Controller
                      fullWidth
                      name="start_date"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          className="enroll-date"
                          sx={{ width: "100%" }}
                          {...field}
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="yyyy-MM-dd HH:mm:ss"
                          placeholderText="YYYY-MM-DD HH:mm:ss" // Add the placeholder
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <label>End Date</label>
                    <Controller
                      fullWidth
                      name="end_date"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          className="enroll-date"
                          sx={{ width: "100%" }}
                          {...field}
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date); // Update the field value directly
                          }}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="yyyy-MM-dd HH:mm:ss" // Set the desired display format
                          placeholderText="YYYY-MM-DD HH:mm:ss" // Add the placeholder
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={actionConfirmClose} color="primary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  autoFocus
                  disabled={!watch("start_date") || !watch("end_date")}
                >
                  Confirm
                </Button>
                {/* <Button
                onClick={() => handleEnrollSingleUser(selectedUserId)}
                color="primary"
                autoFocus
              >
                Confirm
              </Button> */}
              </DialogActions>
            </form>
          </>
        ) : (
          <>
            <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to Unenroll this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={actionConfirmClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => handleUnenrollSingleUser(selectedUserId)}
                color="primary"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Grid item xs={12} className="user-items">
        <Card className="user-listing listing" sx={{ my: 3 }} key={`item`}>
          <CardContent style={{ paddingBottom: "15px" }}>
            <Grid container spacing={2} className="user-list-details">
              <Grid item xs={0} lg={1.5} className="user-selection">
                <Box>
                  <Checkbox
                    checked={selectedUsers.includes(user.guid)}
                    onChange={() => onUserSelect(user.guid)}
                  />
                </Box>
                <Box
                  className="user-logo"
                  sx={{
                    fontSize: 20,
                    fontWeight: 500,
                    fontFamily: "Arial",
                    // backgroundColor: getRandomColor(),
                    backgroundColor: `${bgColor}`,
                    color: "#fff",
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    position: "relative",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="active-status"
                    style={{
                      backgroundColor:
                        user.status === "1" ? "#65C01E" : "#FF725E",
                    }}
                  ></span>
                  {firstInitial}
                  {lastInitial}
                </Box>
              </Grid>
              <Grid item className="user-data" xs={0} md={10.5}>
                <Grid container>
                  <Grid item xs={12} className="user-data">
                    <Box
                      color="inherit"
                      underline="none"
                      sx={{
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        className="user-role"
                        sx={{
                          fontSize: "18px",
                          lineHeight: "26px",
                          fontWeight: 400,
                          letterSpacing: "0.1px",
                          position: "relative",
                        }}
                      >
                        {user.first_name} {user.last_name}
                        <span
                          className="user-role-class"
                          style={{
                            backgroundColor:
                              user.role === "admin" ? "#FF725E" : "#5A6DF9",
                          }}
                        >
                          {user.role === "admin" ? "A" : "S"}
                        </span>
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>{user.email}</Box>
                    <Box>
                      <strong style={{ marginRight: "5px" }}>User id:</strong>
                      {user.guid}
                    </Box>
                    <Box className="action-btn">
                      {action && action === "enroll" ? (
                        <Button
                          onClick={() => handleConfirmOpen(user.guid)}
                          color="success"
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                            fontFamily: "Arial",
                          }}
                        >
                          <PersonAddIcon sx={{ mr: 1 }} />
                          Enroll
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConfirmOpen(user.guid)}
                          color="secondary"
                          sx={{
                            fontSize: 16,
                            fontWeight: 500,
                            fontFamily: "Arial",
                          }}
                        >
                          <PersonOffIcon sx={{ mr: 1 }} />
                          Unenroll
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default EnrolledUserList;
