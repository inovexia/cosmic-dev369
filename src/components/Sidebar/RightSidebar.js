// Sidebar.js
import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const RightSidebar = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{position:"relative"}}>
      <Drawer
        className="right-sidebar"
        variant="persistent"
        anchor="right"
        open={open}
        sx={{visibility:"visible"}}
      >
        <Box className="drawer-inner">
          <IconButton onClick={handleToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <List>
          <ListItem button>
            <ListItemText primary="Item 1" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Item 2" />
          </ListItem>
          {/* Add more sidebar items here */}
        </List>
      </Drawer>
    </Box>
  );
};

export default RightSidebar;
