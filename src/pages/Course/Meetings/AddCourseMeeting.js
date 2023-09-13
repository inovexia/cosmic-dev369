import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  TextField,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Link,
  CircularProgress,
  Checkbox,
  Card,
  Snackbar,
} from "@mui/material";
import { serialize } from "object-to-formdata";
import { useForm } from "react-hook-form";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Helmet } from "react-helmet";
import theme from "../../../configs/theme";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";




const AddCourseMeeting = () => {
  const { courseGuid } = useParams();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const [allMeetings, setAllMeetings] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // State variables for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSuccess, setSnackbarSuccess] = useState(null);

  // Function to show the Snackbar
  const showSnackbar = (severity, message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Function to hide the Snackbar
  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };

  // UseEffect to close the Snackbar after a certain duration
  useEffect(() => {
    if (snackbarOpen) {
      const snackbarTimeout = setTimeout(() => {
        hideSnackbar();
      }, 3000); // Snackbar will be visible for 3 seconds (3000 ms)

      return () => {
        clearTimeout(snackbarTimeout);
      };
    }
  }, [snackbarOpen]);

  // Fetch All Test Data
  useEffect(() => {
    const fetchAllMeetings = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/zoom/list`, requestOptions);
        const result = await response.json();
        setAllMeetings(result.payload.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchAllMeetings();
  }, []);


  // Search Test
  const filteredTests =
    allMeetings &&
    allMeetings.filter((meeting) => {
      const fullName = `${meeting.title} ${meeting.details}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();
      return fullName.includes(searchValue);
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10);
  const lastIndex = currentPage * testsPerPage;
  const firstIndex = lastIndex - testsPerPage;
  const currentMeetings = filteredTests.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredTests && filteredTests.length / testsPerPage
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

  // Bulk selection feature
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleMeetingSelect = (meetingId) => {
    if (selectedMeetings.includes(meetingId)) {
      setSelectedMeetings(selectedMeetings.filter((guid) => guid !== meetingId));
    } else {
      setSelectedMeetings([...selectedMeetings, meetingId]);
    }
  };

  const handleSelectallMeetings = () => {
    if (!selectAll) {
      const allmeetingIds = filteredTests.map((meeting) => meeting.guid);
      setSelectedMeetings(allmeetingIds);
    } else {
      setSelectedMeetings([]);
    }
    setSelectAll(!selectAll);
  };

  // Bulk Actions
  const [selectedAction, setSelectedAction] = useState("");
  function handleActionChange(event) {
    setSelectedAction(event.target.value);
  }

  // Add function on submit
  const handleAddTest = async () => {
    const formData = serialize();
    selectedMeetings.forEach((value, index) => {
      formData.append(`meeting[${index}][guid]`, value);
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/zoom/add_class/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success)
      if (result.success === true) {
        showSnackbar("success", "Class added Successfully");
        setTimeout(() => {
          navigate(`/course/${courseGuid}/class/list`);
        }, 1000);
      } else {
        showSnackbar(
          "warning",
          "Test added failed, Atleast 1 item should be selected!"
        );
        setTimeout(() => {
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Existing Classes</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbarSuccess && snackbarSuccess === true ? "success" : "warning"}>{snackbarMessage}</Alert>
        </Snackbar>
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Classes
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: "flex", md: "block" }, justifyContent: { xs: "space-between" }, textAlign: { md: "right" } }}>
            <Button variant="contained" className="custom-button">
                <Link
                  href={`/course/manage/${courseGuid}`}
                  color="inherit"
                  underline="none"
                >
                  Back
                </Link>
              </Button>
              <Button
                variant="outlined"
                className="custom-button"
                sx={{ ml: 2 }}
                onClick={handleAddTest}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by First Name or Last Name"
                placeholder="Search by First Name or Last Name"
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
              {currentMeetings && currentMeetings.length !== 0 ? (
                <>
                  <Box className="user-list-outer" sx={{ mt: 5 }}>
                    <Grid container spacing={2} className="manage-course">
                      <Grid item xs={12}>
                        <Card sx={{ borderRadius: "0px" }}>
                          <Box sx={{ px: 3 }}>
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
                                xs={12}
                                md={0.5}
                                sx={{
                                  display: { xs: "flex", md: "flex" },
                                  justifyContent: { xs: "start" },
                                  alignItems: { xs: "center" },
                                }}
                              >
                                <Checkbox
                                  checked={selectAll}
                                  onChange={handleSelectallMeetings}
                                  indeterminate={
                                    selectedMeetings.length > 0 &&
                                    selectedMeetings.length < filteredTests.length
                                  }
                                />
                                <Box
                                  sx={{ display: { xs: "block", md: "none" } }}
                                >
                                  Select All
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4.5}
                                sx={{ display: { xs: "none", md: "block" } }}
                              >
                                <b>Name</b>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={3.5}
                                sx={{ display: { xs: "none", md: "block" } }}
                              >
                                <Box>
                                  <b>Start Date</b>
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={3.5}
                                sx={{ display: { xs: "none", md: "block" } }}
                              >
                                <Box>
                                  <b>End Date</b>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                    {currentMeetings &&
                        currentMeetings.map((meeting, index) => {
                          return (
                            <Grid
                            container
                            spacing={2}
                            key={index}
                            className="manage-course"
                          >
                            <Grid item xs={12}>
                              <Card sx={{ borderRadius: "0px" }}>
                                <Box sx={{ px: 3 }}>
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
                                      xs={12}
                                      md={0.5}
                                      sx={{
                                        display: { xs: "flex", md: "flex" },
                                        justifyContent: { xs: "start" },
                                        alignItems: { xs: "center" },
                                      }}
                                    >
                                      <Checkbox
                                        checked={selectedMeetings.includes(
                                          meeting.guid
                                        )}
                                        onChange={() =>
                                          handleMeetingSelect(meeting.guid)
                                        }
                                      />
                                      <Box
                                        sx={{
                                          display: { xs: "block", md: "none" },
                                        }}
                                      >
                                        <h3>
                                        {meeting.title && meeting.title ? meeting.title : meeting.guid }
                                        </h3>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4.5}>
                                      <Box
                                        sx={{
                                          display: { xs: "none", md: "block" },
                                        }}
                                      >
                                        <h3>
                                        {meeting.title && meeting.title ? meeting.title : meeting.guid }
                                        </h3>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3.5}>
                                      <Box>{meeting.created_on}</Box>
                                    </Grid>
                                    <Grid item xs={12} md={3.5}>
                                      <Box>{meeting.updated_on}</Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>
                          )
                          
                        })}
                  </Box>
                  {filteredTests && filteredTests.length > testsPerPage ? (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          marginTop: "30px",
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
                </>
              ) : (
                <Alert sx={{ mt: 5 }} severity="error">
                  Class not found or added earlier!
                </Alert>
              )}
            </>
          )}
          <Grid container spacing={2}></Grid>
        </Box>
      </Box>
    </>
  );
};

export default AddCourseMeeting;
