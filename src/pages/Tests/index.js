import React, { useState, useEffect } from "react";
//import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Link,
  TextField,
  FormControl,
  MenuItem,
  Alert,
  InputLabel,
  Select,
  CircularProgress
} from "@mui/material";
import { Helmet } from "react-helmet";
import TestList from "../../components/Test/TestList";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import CheckTokenValid from "../../components/Redirect/CheckTokenValid";
import { useTheme } from "@mui/material/styles";

const Tests = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [tests, setTests] = useState([]);
  //const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchTests = async () => {
      const response = await fetch(`${BASE_URL}/tests/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Network: `${Network}`,
        },
      });
      const testData = await response.json();
      setTests(testData.payload && testData.payload.data);
      setIsLoading(false);
    };
    fetchTests();
  }, []);

  // Filter By
  const [testStatus, setTestStatus] = useState("all");
  const [testType, setTestType] = useState("all");
  const handleFilterTypeChange = (event) => {
    setTestType(event.target.value);
  };
  const handleFilterStatusChange = (event) => {
    setTestStatus(event.target.value);
  };

  // Search data here
  const [searchTitle, setSearchTitle] = useState("");
  // const filteredTests = tests && tests.filter(
  //   (test) =>
  //     test.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
  //     test.details && test.details.toLowerCase().includes(searchTitle.toLowerCase())
  // );

  const filteredTests =
    tests &&
    tests.filter((test) => {
      const searchVal = `${test.title} ${test.details}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();

      // Check if the test title or details match the search query
      const searchMatch = searchVal.includes(searchValue);

      // Check if the test type matches the selected filter or if the filter is "all"
      const typeMatch =
        testType === "all" || test.type.toLowerCase() === testType;

      // Check if the test status matches the selected filter or if the filter is "all"
      const statusMatch =
        testStatus === "all" || test.status.toLowerCase() === testStatus;

      // Return true if all conditions are met, otherwise return false
      return searchMatch && typeMatch && statusMatch;
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(6);
  const lastIndex = currentPage * testsPerPage;
  const firstIndex = lastIndex - testsPerPage;
  const currentTests =
    filteredTests && filteredTests.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredTests.length / testsPerPage);
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

  //console.log(data);
  return (
    <>
      <CheckTokenValid />
      <Helmet>
        <title>Tests</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Test List
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained" component={Link} className="custom-button" href="/test/create">
                Create Test
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={4}>
              <TextField
                label="Search by title"
                placeholder="Search by title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={8} sx={{ textAlign: "right" }}>
              <Grid container spacing={2} sx={{ justifyContent: "end" }}>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="filter-label">Filter by Status</InputLabel>
                    <Select
                      labelId="filter-label"
                      label="Filter by Status"
                      id="filter-select"
                      value={testStatus}
                      onChange={handleFilterStatusChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="1">Published</MenuItem>
                      <MenuItem value="0">Unpublished</MenuItem>
                      <MenuItem value="2">Archive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="filter-label">Filter by Type</InputLabel>
                    <Select
                      labelId="filter-label"
                      label="Filter by Type"
                      id="filter-select"
                      value={testType}
                      onChange={handleFilterTypeChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="practice">Practice</MenuItem>
                      <MenuItem value="evaluated">Evaluated</MenuItem>
                      <MenuItem value="quiz">Quizz</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {isLoading ? (
            <Box sx={{height:"70vh", display:"flex", alignItems:"center", justifyContent:"center"}}><CircularProgress/></Box>
          ): (
            currentTests && currentTests.length !== 0 ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {currentTests &&
                      currentTests.map((item, index) => (
                        <TestList key={index} item={item} />
                      ))}
                  </Grid>
                </Grid>
  
                {/* Pagination */}
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
                        <Button onClick={prePage} disabled={currentPage === 1}>
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert sx={{ mt: 5 }} severity="error">
                    Test not found!
                  </Alert>
                </Grid>
              </Grid>
            ) 
          )}
        </Box>
      </Box>
    </>
  );
};

export default Tests;
