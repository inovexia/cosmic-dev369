import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Toolbar,
  TextField,
  Snackbar,
  Alert,
  Grid,
  Avatar,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { serialize } from "object-to-formdata";
import { useLocation, useNavigate } from "react-router-dom";
import Network from "../../Utils/network";
import BASE_URL from "../../Utils/baseUrl";
import ProfileMenu from "./ProfileMenu";
import CosmicBrand from "../../assets/images/CosmicBrand.jpg";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SidebarLeft() {
  const location = useLocation();
  const currentPathname = location.pathname;
  const pathParts = currentPathname.split("/");
  const firstPath = pathParts[1];
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const isLinkActive = (link) => {
    return location.pathname === link;
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpenSubmenus(false);
    setOpen(false);
  };
  // Submenu
  const toggleSubmenu = (index) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on window width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [sidebarMenu, setSidebarMenu] = useState([
    {
      label: "Dashboard",
      link: "/dashboard",
      menuIcon: <DashboardIcon />,
    },
    {
      label: "Courses",
      link: "/course/list",
      menuIcon: <MenuBookIcon />,
    },
    {
      label: "Tests",
      link: "/test/list",
      menuIcon: <LaptopChromebookIcon />,
      submenus: [
        {
          label: "All Test",
          link: "/test/list",
          menuIcon: <LaptopChromebookIcon />,
        },
        {
          label: "Category",
          link: "/test/category/list",
          menuIcon: <CategoryIcon />,
        },
      ],
    },
    {
      label: "Online Classes",
      link: "/online-classes",
      menuIcon: <LaptopChromebookIcon />,
    },
    {
      label: "Users",
      link: "/user/list",
      menuIcon: <PersonIcon />,
    },
    {
      label: "Setting",
      link: "/auth/settings",
      menuIcon: <SettingsIcon />,
    },
  ]);
  const [searchTitle, setSearchTitle] = useState("");

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Grid container sx={{ alignItems: "center" }}>
            <Grid item xs={5} sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 1,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  width: "200px",
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  alt="Cosmic Brand"
                  src={CosmicBrand}
                />
              </Box>
              <TextField
                sx={{ ml: 3, display: "none" }}
                label="Search"
                placeholder="Search"
                value={searchTitle}
                //onChange={(e) => setSearchTitle(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchOutlinedIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <ProfileMenu />
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        
          {sidebarMenu.map((item, index) => (
            <React.Fragment key={index}>
              {item.submenus ? (
                <>
                  <ListItemButton onClick={() => toggleSubmenu(index)} sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    firstPath != "" && item.link.includes(firstPath)
                      ? "#f1f1f1"
                      : "transparent",
                }}>
                    <ListItemIcon>{item.menuIcon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openSubmenus[index] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItemButton>
                  <Collapse
                    className="demo"
                    sx={{ pl: "35px" }}
                    in={openSubmenus[index]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.submenus.map((submenuItem, submenuIndex) => (
                        <ListItemButton key={submenuIndex} onClick={() => toggleSubmenu(index)} component="a" href={submenuItem.link} sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                          backgroundColor:
                            firstPath != "" && item.link.includes(firstPath)
                              ? "#f1f1f1"
                              : "transparent",
                        }}>
                          <ListItemIcon>{submenuItem.menuIcon}</ListItemIcon>
                          <ListItemText primary={submenuItem.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton component="a" href={item.link} sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    firstPath != "" && item.link.includes(firstPath)
                      ? "#f1f1f1"
                      : "transparent",
                }}>
                  <ListItemIcon>{item.menuIcon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
