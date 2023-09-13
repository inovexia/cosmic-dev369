import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Link,
  Button,
  TextField,
  MenuItem,
  Menu,
  CircularProgress,
  Snackbar,
  Alert,
  ButtonGroup,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import Course from "../../assets/images/Course.jpg";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import theme from "../../configs/theme";

const options = [
  {
    label: "Manage",
    link: "/course/manage",
  },
  {
    label: "Update",
    link: "/course/update",
  },
];

const ITEM_HEIGHT = 48;

const AllSubmissions = () => {
  const { guid } = useParams();
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const {
    success: { main: successColor },
  } = theme.palette;
  // State Manage
  const [submissions, setSubmissions] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch All Submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      const formdata = new FormData();
      formdata.append("user_guid", "");
      formdata.append("test_guid", guid);
      formdata.append("session_id", "");  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/tests/submissions`, requestOptions);
        const result = await response.json();
        setSubmissions(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // Search Users
  const filteredResult =
  submissions &&
  submissions.filter((item) => {
      const searchVal = `${item.first_name} ${item.middle_name} ${item.last_name} ${item.guid} ${item.session_id}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();
      return searchVal.includes(searchValue);
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const lastIndex = currentPage * itemPerPage;
  const firstIndex = lastIndex - itemPerPage;
  const currentItem = filteredResult.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredResult && filteredResult.length / itemPerPage
  );
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

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
//console.log(submissions)
  return (
    <>
      <Helmet>
        <title>All Submissions</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <h1>All Submissions</h1>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                className="custom-button"
                component={Link}
                href={`/test/manage/${guid}`}
                variant="contained"
              >
                Back
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : submissions && submissions.length !== 0 ? (
            <>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Search by name, guid and session id"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
                className="manage-course"
              >
                <Grid item xs={12}>
                  {currentItem && currentItem.length !== 0 ? (
                      <Card>
                        <Box sx={{ px: 3, display:{ xs: "none", md:"block" } }} >
                            <Grid
                              container
                              sx={{
                                borderBottom: "1px solid #B8B8B8",
                                py: 2,
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid
                                item
                                xs={1}
                                md={0.5}
                                sx={{
                                  display: { xs: "flex", md: "block" },
                                  justifyContent: { xs: "space-between" },
                                }}
                              >
                                <Box className="course-image">
                                 <h4 style={{color:primaryColor}}>Sr. No</h4>
                                </Box>
                                <Grid
                                  item
                                  sx={{ display: { xs: "block" } }}
                                >
                                </Grid>
                              </Grid>
                              <Grid item xs={11} md={4.5}>
                                <h4 style={{color:primaryColor}}>
                                  Name
                                </h4>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <h4 style={{color:primaryColor}}>User ID</h4>
                              </Grid>
                              <Grid item xs={12} md={2}>
                               <h4 style={{color:primaryColor}}>Last Attempted at</h4>
                              </Grid>
                              <Grid item xs={12} md={1}>
                                
                              </Grid>
                            </Grid>
                          </Box>
                      {currentItem &&
                        currentItem.map((item, index) => (
                          <Box sx={{ px: 3 }} key={index}>
                            <Grid
                              container
                              sx={{
                                borderBottom: "1px solid #B8B8B8",
                                py: 2,
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid
                                item
                                xs={1}
                                md={0.5}
                                sx={{
                                  display: { xs: "flex", md: "block" },
                                  justifyContent: { xs: "space-between" },
                                }}
                              >
                                <Box className="course-image">
                                {index + 1 + (currentPage - 1) * itemPerPage}-
                                </Box>
                              </Grid>
                              <Grid item xs={11} md={4.5}>
                                <h4>
                                  <Link
                                    href={`/test/submission-report/${guid}?userId=${item.guid}&ses_id=${item.session_id}`}
                                    sx={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    {item.first_name} {item.last_name}
                                  </Link>
                                </h4>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <span>{item.guid}</span>
                              </Grid>
                              <Grid item xs={12} md={2} sx={{
                                  display: { xs: "flex", md: "block" },alignItems:"center"
                                }}>
                              <Typography component="h4" variant="strong" sx={{
                                  display: { xs: "block", md: "none" }, marginRight:"5px"
                                }}>Last Attempted:</Typography> {item.submit_time && item.submit_time ? item.submit_time : "Not Available"}
                              </Grid>
                              <Grid item xs={12} md={1}>
        
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                    </Card>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity="error">
                      Submission not found!
                    </Alert>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 5, justifyContent: "center" }}
              >
                <Grid item>
                  {filteredResult && filteredResult.length > itemPerPage ? (
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
                                backgroundColor:
                                  currentPage === n ? primaryColor : "",
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
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert sx={{ mt: 5 }} severity="error">
              Course not found!
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AllSubmissions;
