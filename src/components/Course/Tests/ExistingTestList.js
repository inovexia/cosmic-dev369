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
import { useNavigate, Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { styled } from "@mui/material/styles";

const ViewIcon = styled(RemoveRedEyeRoundedIcon)(({ theme }) => ({
  color: theme.palette.primary.main, // Replace 'primary' with the desired theme color
}));
const EditIcon = styled(EditRoundedIcon)(({ theme }) => ({
  color: theme.palette.warning.main, // Replace 'primary' with the desired theme color
}));
const DeleteIcon = styled(DeleteRoundedIcon)(({ theme }) => ({
  color: theme.palette.danger.main, // Replace 'primary' with the desired theme color
}));
const ExistingTestList = ({ user, onUserSelect, selectedUsers }) => {
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

  function generateColorCode(str) {
    const charCode = str.charCodeAt(0);
    const red = (charCode * 20) % 256;
    const green = (charCode * 20) % 256;
    const blue = (charCode * 40) % 256;
    return `rgb(${red}, ${green}, ${blue})`;
  }
  const bgColor = generateColorCode(firstInitial + lastInitial);

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

  // Delete function on submit
  const handleDeleteUser = async () => {
    setDeleteConfirmOpen(false);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/users/delete/${selectedUserId}`,
        requestOptions
      );
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsUserDeleted(true);
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
      console.log(result);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setIsUserDeleted(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={isUserDeleted === true ? "success" : "warning"}>
          {isUserDeleted === true
            ? "Users Deleted Successfully"
            : "User not deleted."}
        </Alert>
      </Snackbar>
      <Dialog
        open={deleteConfirmOpen}
        onClose={actionConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={actionConfirmClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteUser(selectedUserId)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} className="user-items">
        <Card className="user-listing" sx={{ my: 3 }} key={`item`}>
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
                      <Button
                        component={Link}
                        to={`/user/view/${user.guid}`}
                        color="primary"
                        sx={{
                          fontSize: 16,
                          fontWeight: 500,
                          fontFamily: "Arial",
                        }}
                      >
                        <ViewIcon />
                        View
                      </Button>
                      <Button
                        component={Link}
                        to={`/user/edit/${user.guid}`}
                        color="warning"
                        sx={{
                          fontSize: 16,
                          fontWeight: 500,
                          fontFamily: "Arial",
                        }}
                      >
                        <EditIcon />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleConfirmOpen(user.guid)}
                        color="danger"
                        sx={{
                          fontSize: 16,
                          fontWeight: 500,
                          fontFamily: "Arial",
                        }}
                      >
                        <DeleteIcon />
                        Delete
                      </Button>
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

export default ExistingTestList;
