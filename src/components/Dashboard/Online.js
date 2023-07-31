import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
} from "@mui/material";

const Online = ({onlineUser, bgColor, firstInitial, lastInitial}) => {
  const timestamp = onlineUser.last_active;
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    const currentTime = new Date().getTime();
    const timestampInMillis = new Date(timestamp).getTime(); // Convert the timestamp to milliseconds
    const diffInMilliseconds = currentTime - timestampInMillis;
    const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 minutes in milliseconds
    setIsActive(diffInMilliseconds <= tenMinutesInMilliseconds);
  }, [timestamp]);

  return (
    <Grid
    container
    sx={{
      borderBottom: "1px solid #B8B8B8",
      py: 2,
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Grid item xs={3}>
      <Box className="online-students">
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
              isActive ? "#65C01E" : "#FF725E",
            }}
          ></span>
          {firstInitial}
          {lastInitial}
        </Box>
      </Box>
    </Grid>
      <Grid item xs={9} className="user-detail">
      <h5>
        {onlineUser.first_name} {onlineUser.last_name}
      </h5>
      <strong>User ID:</strong> {onlineUser.guid}
    </Grid>
  </Grid>
  );
};

export default Online;
