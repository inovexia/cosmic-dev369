import React, { useState, useEffect} from "react";
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Link,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import ZoomMeeting from "../../components/Classroom/ZoomMeeting";
import { Helmet } from "react-helmet";
import theme from "../../configs/theme";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";


const OnlineClasses = () => {
  const { primary: { main: primaryColor } } = theme.palette;
  const [meetings, setMeetings] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch meetings list
  useEffect(() => {
    const fetchMeetingList = async () => {
      const formdata = new FormData();
      formdata.append("result_per_page", "15");
      formdata.append("page", "1");
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/zoom/list`, requestOptions);
        const result = await response.json();
        setMeetings(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchMeetingList();
  }, []);
  

  // Search Classroom
  const filteredMeetings =
    meetings &&
    meetings.data.filter((meeting) =>
      meeting.details.toLowerCase().includes(searchTitle.toLowerCase())
    );

    // Pagination here
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(6);
    const lastIndex = currentPage * testsPerPage;
    const firstIndex = lastIndex - testsPerPage;
    const currentMeeting =
      filteredMeetings && filteredMeetings.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(
      (filteredMeetings && filteredMeetings.length) / testsPerPage
    );
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
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

  return (
    <>
      <Helmet>
        <title>Meetings</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Zoom Meeting
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained">
                <Link href="/meeting/create" color="inherit" underline="none">
                  Create Meeting
                </Link>
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by title"
                placeholder="Search by title"
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
              {currentMeeting && currentMeeting.length !== 0 ? (
                <>
                  
                      {currentMeeting &&
                        currentMeeting.map((item, index) => (
                          <ZoomMeeting key={index} item={item} />
                        ))}
                    
                  {filteredMeetings && filteredMeetings.length > testsPerPage ? (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
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
                              backgroundColor: currentPage === n ? primaryColor : ''
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
                  No Meeting found!
                </Alert>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default OnlineClasses;
