import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Avatar,
  Typography,
  Snackbar,
  Alert,
  Link
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AvatarColored from "../../assets/images/AvatarColored.png";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy";

const ProfileMenu = () => {
  // Config
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const navigate = useNavigate();
  // User Sort Info
  const [userAvatar, setUserAvatar] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const openMenu = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Get User Details
  const [user, setUser] = useState("");
  useEffect(() => {
    const requestOption = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const fetchUser = async () => {
      const res = await fetch(
        `${BASE_URL}/users/view/${CreatedBy}`,
        requestOption
      );
      const result = await res.json();
      setUser(result.payload);
    };
    fetchUser();
  }, []);

  // Logout Function
  const [isOpen, setIsOpen] = useState(false);
  const [isUserloggedOut, setIsUserloggedOut] = useState(null);

  const submitLogoutForm = async (data) => {
    setAnchorEl(null);
    //const recaptchaValue = await recaptchaRef.current.executeAsync();
    try {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(`${BASE_URL}/auth/logout`, requestOptions);
      const result = await response.json();
      setIsOpen(true);
      if (result.success === true) {
        localStorage.setItem("token", "");
        setIsUserloggedOut(true);
        setTimeout(() => {
          navigate(`/auth/login`);
        }, 3000);
      } else {
        setIsUserloggedOut(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsUserloggedOut(false);
    }
  };

  // If user avatar not added then show initial letter First Name and Last Name

  const firstInitial =
    user && user.first_name ? user && user.first_name[0] : "";
  const lastInitial = user && user.last_name ? user && user.last_name[0] : "";
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
  const userName = firstInitial + lastInitial;
  return (
    <>
      <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={isUserloggedOut === true ? "success" : "warning"}>
          {isUserloggedOut === true
            ? "User Logged out Successfully"
            : "Something went wrong"}
        </Alert>
      </Snackbar>
      <Grid
        item
        xs={7}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Box
          sx={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            display: "inline-flex",
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: `${bgColor}`,
            alignItems: "center",
          }}
        >
          {userAvatar && userAvatar ? (
            <Avatar
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "50%",
                border: "1px solid #fff",
              }}
              alt="Remy Sharp"
              src={AvatarColored}
            />
          ) : (
            userName
          )}
        </Box>
        <Box
          sx={{
            display: "block",
            ml: 2,
          }}
        >
          <Typography
            component="span"
            sx={{ display: "block", fontWeight: "700" }}
          >
            {user && user.first_name} {user && user.last_name}
          </Typography>
          <Typography
            component="span"
            sx={{ display: "block", fontSize: "14px" }}
          >
            {user && user.email}
          </Typography>
        </Box>
        <Box>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenu ? "long-menu" : undefined}
            aria-expanded={openMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <KeyboardArrowDownIcon sx={{ color: "#fff" }} />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} href={`/my-account`}>My Account</MenuItem>
            <MenuItem onClick={submitLogoutForm}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Grid>
    </>
  );
};

export default ProfileMenu;
