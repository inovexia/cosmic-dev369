import React, { useState, useEffect, useLayoutEffect } from "react";
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
  FormControl,
  Snackbar,
} from "@mui/material";
import { serialize } from "object-to-formdata";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Helmet } from "react-helmet";
import ExistingTestList from "../../../components/Course/Tests/ExistingTestList";
import theme from "../../../configs/theme";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { styled } from "@mui/material/styles";

const DeleteIcon = styled(DeleteRoundedIcon)(({ theme }) => ({
  color: theme.palette.danger.main, // Replace 'primary' with the desired theme color
}));

const AddTests = () => {
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
  const [allTests, setAllTests] = useState("");
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
    const fetchAllTests = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/tests/list`, requestOptions);
        const result = await response.json();
        setAllTests(result.payload.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchAllTests();
  }, []);


  // Search Test
  const filteredTests =
    allTests &&
    allTests.filter((test) => {
      const fullName = `${test.title} ${test.details}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();
      return fullName.includes(searchValue);
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10);
  const lastIndex = currentPage * testsPerPage;
  const firstIndex = lastIndex - testsPerPage;
  const currentTests = filteredTests.slice(firstIndex, lastIndex);
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
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleTestSelect = (testId) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter((guid) => guid !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };

  const handleSelectAllTests = () => {
    if (!selectAll) {
      const alltestIds = filteredTests.map((test) => test.guid);
      setSelectedTests(alltestIds);
    } else {
      setSelectedTests([]);
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
    selectedTests.forEach((value, index) => {
      formData.append(`tests[${index}][guid]`, value);
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/add_test/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success)
      if (result.success === true) {
        showSnackbar("success", "Test added Successfully");
        setTimeout(() => {
          navigate(`/course/${courseGuid}/test/list`);
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

  console.log(selectedTests);
  return (
    <>
      <Helmet>
        <title>Add Existing Tests</title>
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
                Tests
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
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
              {currentTests && currentTests.length !== 0 ? (
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
                                  onChange={handleSelectAllTests}
                                  indeterminate={
                                    selectedTests.length > 0 &&
                                    selectedTests.length < filteredTests.length
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
                    {currentTests &&
                      currentTests.map((test, index) => (
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
                                      checked={selectedTests.includes(
                                        test.guid
                                      )}
                                      onChange={() =>
                                        handleTestSelect(test.guid)
                                      }
                                    />
                                    <Box
                                      sx={{
                                        display: { xs: "block", md: "none" },
                                      }}
                                    >
                                      <h3>
                                        <Link
                                          href={`/course/manage/`}
                                          sx={{
                                            textDecoration: "none",
                                            color: "inherit",
                                          }}
                                        >
                                          {test.title}
                                        </Link>
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
                                        <Link
                                          href={`/course/manage/`}
                                          sx={{
                                            textDecoration: "none",
                                            color: "inherit",
                                          }}
                                        >
                                          {test.title}
                                        </Link>
                                      </h3>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={3.5}>
                                    <Box>{test.created_on}</Box>
                                  </Grid>
                                  <Grid item xs={12} md={3.5}>
                                    <Box>{test.updated_on}</Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      ))}
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
                  Test not found or all added earlier!
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

export default AddTests;
