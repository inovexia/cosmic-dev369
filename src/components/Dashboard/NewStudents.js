import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Link,
  Tabs,
  Tab,
  Typography,
  Grid,
  Button,
  Tooltip,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const UpcommingOptions = [
  {
    label: "Edit",
    link: "/user/edit",
  },
  {
    label: "View",
    link: "/user/view",
  },
];

const ITEM_HEIGHT = 48;
const NewStudents = () => {
  // Action Button
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTestGuid, setCurrentTestGuid] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentTestGuid(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [newStudents, setNewStudents] = useState("");

  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  // Fetch New Students list
  useEffect(() => {
    const fetchNewStudents = async () => {
      var formdata = new FormData();
      formdata.append("status", "0");
      formdata.append("role", "student");
      formdata.append("order_by", "newest_first");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${BASE_URL}/users/list?role=student`,
          requestOptions
        );
        const result = await response.json();
        setNewStudents(result.payload);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchNewStudents();
  }, []);
  // Color Generator
  function generateColorCode(str) {
    const charCode = str.charCodeAt(0);
    const red = (charCode * 20) % 256;
    const green = (charCode * 20) % 256;
    const blue = (charCode * 40) % 256;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  return (
    <>
      <Grid container sx={{ alignItems: "center" }}>
        <Grid item xs={6}>
          <h2>New Student</h2>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Link href={"/user/create"} sx={{ mr: 2 }}>
            <AddCircleRoundedIcon
              color="primary"
              sx={{ width: "53px", height: "53px" }}
            />
          </Link>
          <Button
            className="custom-button"
            component={Link}
            href={"/user/students"}
            variant="outlined"
          >
            View All
          </Button>
        </Grid>
      </Grid>
      <Card sx={{ mt: 2.6 }}>
        <Box sx={{ p: 3 }}>
          <Grid
            container
            sx={{
              borderBottom: "1px solid #B8B8B8",
              py: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={4}>
              Name
            </Grid>
            <Grid item xs={5}>
              Email
            </Grid>
            <Grid item xs={2}>
              Status
            </Grid>
            <Grid item xs={1}>
              Action
            </Grid>
          </Grid>
          {newStudents && newStudents.data.length !== 0 ? (
            newStudents &&
            newStudents.data.map((user, index) => {
              const firstInitial = user.first_name ? user.first_name[0] : "";
              const lastInitial = user.last_name ? user.last_name[0] : "";
              const bgColor = generateColorCode(firstInitial + lastInitial);
              return (
                <Grid
                  key={index}
                  container
                  sx={{
                    borderBottom: "1px solid #B8B8B8",
                    py: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item xs={12} md={4}>
                    <Box
                      className="online-students"
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          className="student-status"
                          sx={{
                            backgroundColor: `${bgColor}`,
                            color: "#fff",
                            textTransform: "uppercase",
                          }}
                        >
                          {firstInitial}
                          {lastInitial}
                          <span
                            style={{ background: "green", display: "none" }}
                          ></span>
                        </Box>
                        <h5>
                          {user.first_name} {user.last_name}
                        </h5>
                      </Box>
                      <Box sx={{ display: { xs: "block", md: "none" } }}>
                        <IconButton
                          aria-label="more"
                          id="long-button-mob"
                          aria-controls={open ? "long-menu-mob" : undefined}
                          aria-expanded={open ? "true" : undefined}
                          aria-haspopup="true"
                          //onClick={handleClick}
                          onClick={(event) => handleClick(event, user.guid)}
                          className="no-pd"
                        >
                          <MoreVertOutlinedIcon />
                        </IconButton>
                        <Menu
                          id="long-menu-mob"
                          MenuListProps={{
                            "aria-labelledby": "long-button-mob",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          {UpcommingOptions.map((upoption, index) => {
                            const linkUrl = `${upoption.link}/${currentTestGuid}`;
                            return (
                              <MenuItem key={index} onClick={handleClose}>
                                <Link
                                  href={linkUrl}
                                  underline="none"
                                  color="inherit"
                                >
                                  {upoption.label}
                                </Link>
                              </MenuItem>
                            );
                          })}
                        </Menu>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ display: "flex" }}>
                    <Typography
                      sx={{ display: { xs: "block", md: "none" } }}
                      component="strong"
                      variant="strong"
                    >
                      Email:
                    </Typography>{" "}
                    {user.email}
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <span
                      style={{
                        color: user.status === "0" ? "#FF725E" : "#65C01E",
                      }}
                    >
                      {user.status === "0" ? "Pending" : "Active"}
                    </span>
                  </Grid>
                  <Grid item xs={12} md={1} className="new-student-action">
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        //onClick={handleClick}
                        onClick={(event) => handleClick(event, user.guid)}
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
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        {UpcommingOptions.map((upoption, index) => {
                          const linkUrl = `${upoption.link}/${currentTestGuid}`;
                          return (
                            <MenuItem key={index} onClick={handleClose}>
                              <Link
                                href={linkUrl}
                                underline="none"
                                color="inherit"
                              >
                                {upoption.label}
                              </Link>
                            </MenuItem>
                          );
                        })}
                      </Menu>
                    </Box>
                  </Grid>
                </Grid>
              );
            })
          ) : (
            <Alert sx={{ mt: 5 }} severity="error">
              Student not found!
            </Alert>
          )}
        </Box>
      </Card>
    </>
  );
};

export default NewStudents;
