import React, { useState, useEffect } from "react";
import {
  Box,
  Alert,
  TextField,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Link,
  CircularProgress,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar,
} from "@mui/material";
import { serialize } from "object-to-formdata";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Helmet } from "react-helmet";
import EnrolledUserList from "../../../components/Course/Enrollments/EnrolledUserList";
import theme from "../../../configs/theme";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const EnrollUsers = () => {
  const { courseGuid } = useParams();
  const navigate = useNavigate();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
    },
  });
  const { start_date, end_date } = watch();
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const [allUsers, setAllUsers] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  // Authorization
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

  // Fetch unenrolled users list
  useEffect(() => {
    const fetchUserList = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${BASE_URL}/course/notenroled/${courseGuid}`,
          requestOptions
        );
        const result = await response.json();
        setAllUsers(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchUserList();
  }, []);

  // Search Users
  const filteredUsers =
    allUsers &&
    allUsers.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();
      return fullName.includes(searchValue);
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10);
  const lastIndex = currentPage * testsPerPage;
  const firstIndex = lastIndex - testsPerPage;
  const currentUsers = filteredUsers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredUsers && filteredUsers.length / testsPerPage
  );
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  }

  // Bulk selection feature
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((guid) => guid !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAllUsers = () => {
    if (!selectAll) {
      const allUserIds = filteredUsers.map((user) => user.guid);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
    setSelectAll(!selectAll);
  };

  // Bulk Actions
  const [selectedAction, setSelectedAction] = useState("");
  function handleActionChange(event) {
    setSelectedAction(event.target.value);
  }

  // Bulk Unenroll
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const handleBulkConfirmOpen = () => {
    setActionConfirmOpen(true);
  };
  const actionConfirmClose = () => {
    setActionConfirmOpen(false);
  };

  // Bulk enroll function on submit
  const handleBulkEnroll = async (data) => {
    const formattedStartDate = dayjs(data.start_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndDate = dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss");
    setActionConfirmOpen(false);
    const formData = serialize();
    selectedUsers.forEach((value, index) => {
      formData.append(`users[${index}]`, value);
    });
    formData.append("start_date", formattedStartDate);
    formData.append("end_date", formattedEndDate);
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
          "User enrolled failed, Atleast 1 item should be selected!"
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
      <Helmet>
        <title>Enroll Users</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {/* Bulk Delete Confirmation popup */}

        <Dialog
          className="enroll-date-outer"
          sx={{ height: "auto", overflowY: "auto" }}
          open={actionConfirmOpen}
          onClose={actionConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <form onSubmit={handleSubmit(handleBulkEnroll)}>
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
              <Button type="submit" color="primary" autoFocus disabled={!watch("start_date") || !watch("end_date")}>
                Confirm
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        {/* End Bulk Delete popup */}
        {/* Bulk Archive Confirmation popup */}
        {/* End bulk archive popup */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={
              snackbarSuccess && snackbarSuccess === true
                ? "success"
                : "warning"
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Enroll Users
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                className="custom-button"
                component={Link}
                href={`/course/${courseGuid}/enrolled-users`}
              >
                Back
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by First Name or Last Name"
                placeholder="Search by First Name or Last Name"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {currentUsers && currentUsers.length !== 0 ? (
                <>
                  <Box className="user-list-outer" sx={{ mt: 5 }}>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        mb: 3,
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Grid item xs={6} sx={{ fontSize: "18px" }}>
                        <ButtonGroup
                          disableElevation
                          variant="contained"
                          aria-label="Disabled elevation buttons"
                        >
                          <Button variant="outlined">
                            <Checkbox
                              sx={{ padding: "0" }}
                              checked={selectAll}
                              onChange={handleSelectAllUsers}
                              indeterminate={
                                selectedUsers.length > 0 &&
                                selectedUsers.length < filteredUsers.length
                              }
                            />
                          </Button>
                          <Button sx={{opacity:selectedUsers.length !== 0 ? "1" : "0.5",pointerEvents:selectedUsers.length !== 0 ? "auto" : "none"}} onClick={handleBulkConfirmOpen}>
                            Enroll User
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl sx={{ width: "100%", display: "none" }}>
                          <InputLabel id="type-select-label">Action</InputLabel>
                          <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId="type-select-label"
                                id="type-select"
                                label="Action"
                                onChange={handleActionChange}
                                defaultValue=""
                              >
                                <MenuItem
                                  value="unenrolluser"
                                  onClick={handleBulkConfirmOpen}
                                >
                                  Enroll Users
                                </MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    {currentUsers &&
                      currentUsers.map((user, index) => (
                        <EnrolledUserList
                          onUserSelect={handleUserSelect}
                          selectedUsers={selectedUsers}
                          key={index}
                          user={user}
                          courseGuid={courseGuid}
                          action="enroll"
                        />
                      ))}
                  </Box>
                  {filteredUsers && filteredUsers.length > testsPerPage ? (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          marginTop: "30px",
                        }}
                      >
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                          className="pagination-button"
                        >
                          <Button
                            onClick={prePage}
                            disabled={currentPage === 1}
                          >
                            PREV
                          </Button>
                          {numbers.map((n, i) => (
                            <Button
                              className={currentPage === n ? "active" : ""}
                              key={i}
                              onClick={() => changeCPage(n)}
                              style={{
                                backgroundColor:
                                  currentPage === n ? primaryColor : "",
                              }}
                            >
                              {n}
                            </Button>
                          ))}
                          <Button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                          >
                            NEXT
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <Alert sx={{ mt: 5 }} severity="error">
                  User not found!
                </Alert>
              )}
            </>
          )}
          <Grid container spacing={2}></Grid>
        </Box>
      </Box>
    </>
  );
};

export default EnrollUsers;
