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
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Helmet } from "react-helmet";
import EnrolledUserList from "../../../components/Course/Enrollments/EnrolledUserList";
import theme from "../../../configs/theme";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";

const EnrolledUsers = () => {
  const { courseGuid } = useParams();
  const {
    control,
    formState: { errors },
  } = useForm();
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const [users, setUsser] = useState("");
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

  // Fetch users list
  useEffect(() => {
    const fetchUserList = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${BASE_URL}/course/enrolments/${courseGuid}`,
          requestOptions
        );
        const result = await response.json();
        setUsser(result.payload);
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
    users &&
    users.filter((user) => {
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

  // Bulk unenroll function on submit
  const handleBulkUnenroll = async () => {
    setActionConfirmOpen(false);
    const formData = serialize();
    selectedUsers.forEach((value, index) => {
      formData.append(`users[${index}]`, value);
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(`${BASE_URL}/course/unenrol/${courseGuid}`, requestOptions);
      const result = await res.json();
      setSnackbarSuccess(result.success)
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
        setTimeout(() => {
        }, 3000);
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
        <title>Enrolled Users</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {/* Bulk Delete Confirmation popup */}

        <Dialog
          open={actionConfirmOpen}
          onClose={actionConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
          Confirm Unenroll
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Are you sure you want to unenroll selected users?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={actionConfirmClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleBulkUnenroll} color="primary" autoFocus>
                Confirm
              </Button>
          </DialogActions>
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
          <Alert severity={snackbarSuccess && snackbarSuccess === true ? "success" : "warning"}>{snackbarMessage}</Alert>
        </Snackbar>
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Enrolled Users
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained" className="custom-button">
                <Link href={`/course/${courseGuid}/enroll`} color="inherit" underline="none">
                  Enroll User
                </Link>
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
                      <Grid item xs={6} sx={{ ml: 2, fontSize: "18px" }}>
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAllUsers}
                          indeterminate={
                            selectedUsers.length > 0 &&
                            selectedUsers.length < filteredUsers.length
                          }
                        />
                        Select All
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl sx={{ width: "100%" }}>
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
                                  Unenroll User
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
                          action="unenrolled"
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

export default EnrolledUsers;
