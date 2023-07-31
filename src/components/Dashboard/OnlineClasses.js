import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Alert,
  Typography,
  Grid,
  Link,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
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


function extractHrefFromString(str) {
  const regex = /(https?:\/\/[^\s]+)/g; // Regex pattern to match URLs
  const matches = str.match(regex); // Find all matches in the string

  if (matches && matches.length > 0) {
    return matches[0]; // Return the first match (the URL)
  }

  return null; // Return null if no match found
}

const OnlineClasses = () => {

  // States
  const [classes, setClasses] = useState("");
  const [loading, setLoading] = useState(true);
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch Course list
  useEffect(() => {
    const fetchClasses = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/zoom/list`, requestOptions);
        const result = await response.json();
        setClasses(result.payload.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchClasses();
  },[]);
  return (
    <>
      <Grid container sx={{ alignItems: "center" }}>
        <Grid item xs={6}>
          <h2>Online Class</h2>
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
          <Button className="custom-button" component={Link} href={"/meeting/create"} variant="contained">
          Add Online Class
              </Button>
        </Grid>
      </Grid>
      <Card sx={{ mt: 4.7 }}>
        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : classes && classes.length !== 0 ? (
            classes &&
            classes.slice(0, 5).map((item, index) => {
              const title = item.details.split(" ");
              const truncatedTitle = title.slice(0, 5).join(" ");
              return (
                <Grid
                  key={index}
                  container
                  sx={{
                    borderBottom: "1px solid #B8B8B8",
                    pb: 1,
                    pt: 0.5,
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <h3>
                      Title:
                      <span style={{ color: "#888888" }}>
                        {" "}
                        {truncatedTitle}...
                      </span>
                    </h3>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Details</Typography>
                          <b>{"Meeting ID:"}</b> <em>{item.guid}</em>
                          <br />
                          <b>{"Meeting Details:"}</b> <em>{item.details}</em>
                          <br />
                          <b>{"Created On:"}</b> <em>{item.created_on}</em>
                        </React.Fragment>
                      }
                      placement="right-start"
                    >
                      <InfoOutlinedIcon
                        sx={{ color: "#B8B8B8", ml: 2, mb: 1 }}
                      />
                    </HtmlTooltip>
                  </Box>
                  <Button
                    variant="outlined"
                    component={Link}
                    href={extractHrefFromString(item.details)}
                  >
                    Start
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Alert sx={{ mt: 5 }} severity="error">
              Classes not found!
            </Alert>
          )}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Button variant="outlined" className="custom-button" component={Link} href={`/online-classes`}>View All Classes</Button>
          </Grid>
        </Box>
      </Card>
    </>
  );
};

export default OnlineClasses;
