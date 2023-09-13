import React, { useState, useEffect, useLayoutEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import { Helmet } from "react-helmet";
import UserList from "../../components/Users";
import theme from "../../configs/theme";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import CheckTokenValid from "../../components/Redirect/CheckTokenValid"

const Users = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const [allUsers, setAllUsers] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(null);
  const [isActionSuccess, setIsActionSuccess] = useState(null);
  const navigate = useNavigate();
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch classes list
  useEffect(() => {
    const fetchUserList = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/users/list`, requestOptions);
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
  allUsers.data.filter((user) => {
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

  // Bulk delete
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const handleBulkConfirmOpen = () => {
    setActionConfirmOpen(true);
  };
  const actionConfirmClose = () => {
    setActionConfirmOpen(false);
  };

  // Bulk Delete function on submit
  const handleBulkDeleteUser = async () => {
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
      const res = await fetch(`${BASE_URL}/users/delete`, requestOptions);
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Bulk Archive function on submit
  const handleBulkArchiveUser = async () => {
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
      const res = await fetch(`${BASE_URL}/users/archive`, requestOptions);
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

   // Bulk Deactivate function on submit
   const handleBulkDeactivateUser = async () => {
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
      const res = await fetch(`${BASE_URL}/users/deactivate`, requestOptions);
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

   // Bulk Activate function on submit
   const handleBulkActivateUser = async () => {
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
      const res = await fetch(`${BASE_URL}/users/activate`, requestOptions);
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
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
      <CheckTokenValid/>
      <Helmet>
        <title>Users</title>
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
            {selectedAction && selectedAction === "delete"
              ? "Confirm Delete"
              : selectedAction && selectedAction === "archive"
              ? "Confirm Archive"
              : selectedAction && selectedAction === "deactivate"
              ? "Confirm Deactivate"
              : selectedAction && selectedAction === "active"
              ? "Confirm Activate"
              : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {selectedAction && selectedAction === "delete"
                ? "Are you sure you want to delete selected users?"
                : selectedAction && selectedAction === "archive"
                ? "Are you sure you want to archive selected users?"
                : selectedAction && selectedAction === "active"
                ? "Are you sure you want to activate selected users?"
                : selectedAction && selectedAction === "deactivate"
                ? "Are you sure you want to deactivate selected users?"
                : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={actionConfirmClose} color="primary">
              Cancel
            </Button>
            {selectedAction && selectedAction === "delete" ? (
              <Button onClick={handleBulkDeleteUser} color="primary" autoFocus>
                Confirm
              </Button>
            ) : selectedAction && selectedAction === "archive" ? (
              <Button onClick={handleBulkArchiveUser} color="primary" autoFocus>
                Confirm
              </Button>
            ) : selectedAction && selectedAction === "active" ? (
              <Button onClick={handleBulkActivateUser} color="primary" autoFocus>
                Confirm
              </Button>
            ) : selectedAction && selectedAction === "deactivate" ? (
              <Button onClick={handleBulkDeactivateUser} color="primary" autoFocus>
                Confirm
              </Button>
            ) : (
              ""
            )}
          </DialogActions>
        </Dialog>
        {/* End Bulk Delete popup */}
        {/* Bulk Archive Confirmation popup */}
        {/* End bulk archive popup */}
        <Grid item>
          <Snackbar
            open={alertOpen}
            autoHideDuration={3000}
            onClose={() => setIsActionSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <>
            {selectedAction && selectedAction === "delete" ? (
              <Alert
                severity={isActionSuccess === true ? "success" : "warning"}
              >
                {isActionSuccess === true
                  ? "Users Deleted Successfully"
                  : "User not deleted. At Least one user to be selected."}
              </Alert>
            ) : selectedAction && selectedAction === "archive" ? (
              <Alert
                severity={isActionSuccess === true ? "success" : "warning"}
              >
                {isActionSuccess === true
                  ? "Users Archived Successfully"
                  : "User not archived. At Least one user to be selected."}
              </Alert>
            ) : selectedAction && selectedAction === "active" ? (
              <Alert
                severity={isActionSuccess === true ? "success" : "warning"}
              >
                {isActionSuccess === true
                  ? "Users Activated Successfully"
                  : "User not activated. At Least one user to be selected."}
              </Alert>
            ) : selectedAction && selectedAction === "deactivate" ? (
              <Alert
                severity={isActionSuccess === true ? "success" : "warning"}
              >
                {isActionSuccess === true
                  ? "Users Deactivated Successfully"
                  : "User not deactivated. At Least one user to be selected."}
              </Alert>
            ) : (
              ""
              )}
              </>
          </Snackbar>
        </Grid>
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Users
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained" component={Link} href="/user/create" className="custom-button">
                  Add User
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
                                  value="active"
                                  onClick={handleBulkConfirmOpen}
                                >
                                  Active
                                </MenuItem>
                                <MenuItem
                                  value="deactivate"
                                  onClick={handleBulkConfirmOpen}
                                >
                                  Deactivate
                                </MenuItem>
                                <MenuItem
                                  value="archive"
                                  onClick={handleBulkConfirmOpen}
                                >
                                  Archive
                                </MenuItem>
                                <MenuItem
                                  value="delete"
                                  onClick={handleBulkConfirmOpen}
                                >
                                  Delete
                                </MenuItem>
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    {currentUsers &&
                      currentUsers.map((user, index) => (
                        <UserList
                          onUserSelect={handleUserSelect}
                          selectedUsers={selectedUsers}
                          key={index}
                          user={user}
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

export default Users;
