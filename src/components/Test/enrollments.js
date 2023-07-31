import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const EnrolledList = ({ user, index, handleDeleteConfirmOpen}) => {
  const isSmallDevice = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const handleEditUser = () => { };
   // Toggle Menu start
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
     setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
     setAnchorEl(null);
   };
   // Toggle Menu end

  return (
    <Grid item xs={12} key={index}>
      <Card style={{ width: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <Grid item xs={11}>
            <Typography
              variant="h3"
              color="text.primary"
              sx={{ fontSize: "22px", pb: 2 }}
            >
              {user.first_name} {user.last_name}
            </Typography>
            <Box
              display={isSmallDevice ? "block" : "flex"}
              justifyContent="space-between"
            >
              <Grid display="flex" item xs={12} md={4}>
                <Typography
                  variant="strong"
                  color="text.primary"
                  sx={{ fontSize: "16px" }}
                >
                  Student ID:
                </Typography>
                <Typography
                  variant="span"
                  color="text.secondary"
                  sx={{ fontSize: "16px" }}
                >
                  {user.guid}
                </Typography>
              </Grid>
              <Grid display="flex" item xs={12} md={4}>
                <Typography
                  variant="strong"
                  color="text.primary"
                  sx={{ fontSize: "16px" }}
                >
                  Start Date/Time:
                </Typography>
                <Typography
                  variant="span"
                  color="text.secondary"
                  sx={{ fontSize: "16px" }}
                >
                  {user.start_date}
                </Typography>
              </Grid>
              <Grid display="flex" item xs={12} md={4}>
                <Typography
                  variant="strong"
                  color="text.primary"
                  sx={{ fontSize: "16px" }}
                >
                  End Date/Time:
                </Typography>
                <Typography
                  variant="span"
                  color="text.secondary"
                  sx={{ fontSize: "16px" }}
                >
                  {user.end_date}
                </Typography>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="end">
              <IconButton
                onClick={(event) => handleDeleteConfirmOpen(user.guid)}
              >
                <DeleteIcon color="primary" sx={{ fontSize: "20px" }} />
              </IconButton>
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default EnrolledList;
