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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import {tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import ReactHtmlParser from "react-html-parser";

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

// function extractHrefFromString(str) {
//   const regex = /(https?:\/\/[^\s]+)/g; // Regex pattern to match URLs
//   const matches = str.match(regex); // Find all matches in the string

//   if (matches && matches.length > 0) {
//     return matches[0]; // Return the first match (the URL)
//   }
//   return null; // Return null if no match found
// }

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
        setClasses(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);
  function extractUrlFromHtml(htmlContent) {
    const urlPattern = /https?:\/\/\S+(?=<\/p>)/; // Match URL until </p>
    const match = htmlContent.match(urlPattern);
    return match ? match[0] : "";
  }
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
          <Link href={"/class/create"} sx={{ mr: 2 }}>
            <AddCircleRoundedIcon
              color="primary"
              sx={{ width: "53px", height: "53px" }}
            />
          </Link>
          <Button
              variant="outlined"
              className="custom-button"
              component={Link}
              href={`/online-classes`}
            >
              View All Classes
            </Button>
        </Grid>
      </Grid>
      <Card sx={{ mt: 4.7 }}>
        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : classes && classes.data.length !== 0 ? (
            classes &&
            classes.data.slice(0, 5).map((item, index) => {
              const title = item.title.split(" ");
              //const truncatedTitle = title.slice(0, 10).join(" ");
              const extractedUrl = extractUrlFromHtml(item.details);
              const exactUrl = ReactHtmlParser(extractedUrl);
              return (
                <Grid
                  key={index}
                  container
                  sx={{
                    borderBottom: "1px solid #B8B8B8",
                    pb: 1.7,
                    pt: 0.5,
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1.5
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component="h3" variant="strong" sx={{display:"flex", alignItems:"baseline"}}>
                      Title:
                      <span style={{ color: "#888888",paddingLeft:"5px" }}>
                        {" "}
                        {ReactHtmlParser(title)}
                      </span>
                    </Typography>
                    <HtmlTooltip
                      className="dashboard-tooltip"
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Details</Typography>
                          <b>{"Class ID:"}</b> <em>{item.guid}</em>
                          <br />
                          <b>{"Class Details:"}</b> <em>{ReactHtmlParser(item.details)}</em>
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
                  <Box sx={{display:"block"}}>
                  <Button
                    sx={{ display: "inline-block" }}
                    variant="outlined"
                    component={Link}
                    href={extractedUrl}
                    target="_blank"
                      rel="noopener noreferrer"
                  >
                    Start
                  </Button>
                 </Box>
                </Grid>
              );
            })
          ) : (
            <Alert sx={{ mt: 5 }} severity="error">
              Classes not found!
            </Alert>
          )}
        </Box>
      </Card>
    </>
  );
};

export default OnlineClasses;
