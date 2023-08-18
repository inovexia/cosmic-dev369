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
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert
} from "@mui/material";
//import parse from "html-react-parser";
import { Helmet } from "react-helmet";
// import BASE_URL from "../../Utils/baseUrl";
// import Token from "../../Utils/token";
// import axios from "axios";
import TestList from "../../components/Test/TestList";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network"
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import theme from "../../configs/theme";
import CheckTokenValid from "../../components/Redirect/CheckTokenValid"
import { useTheme } from '@mui/material/styles';

const Tests = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [tests, setTests] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchTests = async () => {
      const response = await fetch(
        `${BASE_URL}/tests/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Network: `${Network}`
          },
        }
      );
      const testData = await response.json();
      setTests(testData.payload && testData.payload.data);
    };
    fetchTests();
  }, []);

  // Filter By
  const [testStatus, setTestStatus] = useState("");
  const [testType, setTestType] = useState("");

  const handleStatusChange = (event) => {
    setTestStatus(event.target.value);
  };

  // const handleTypeChange = (event) => {
  //   setTestType(event.target.value);
  // };
console.log(tests)
  // Search data here
  const [searchTitle, setSearchTitle] = useState("");
  const filteredTests = tests && tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      test.details && test.details.toLowerCase().includes(searchTitle.toLowerCase())
  );

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(6);
  const lastIndex = currentPage * testsPerPage;
  const firstIndex = lastIndex - testsPerPage;
  const currentTests = filteredTests && filteredTests.slice(firstIndex, lastIndex);
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
      <CheckTokenValid/>
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
            <Button variant="contained" className="custom-button">
              <Link href="/test/create" color="inherit" underline="none">
                Create Test
              </Link>
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
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="type">Filter By Type:</InputLabel>
              <Select
                labelId="type-label"
                id="type-id"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                autoWidth
                label="Filter By Type:"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="practice">Practice</MenuItem>
                <MenuItem value="evaluated">Evaluated</MenuItem>
                <MenuItem value="quiz">Quizz</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160, ml: 3 }}>
              <InputLabel id="status">Filter By Status:</InputLabel>
              <Select
                labelId="status-label"
                id="status-id"
                value={testStatus}
                onChange={handleStatusChange}
                autoWidth
                label="Filter By Status:"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="1">Active</MenuItem>
                <MenuItem value="0">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {currentTests && currentTests.length !== 0 ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {currentTests && currentTests.map((item, index) => (
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <Alert sx={{ mt: 5 }} severity="error">
                  Test not found!
                </Alert>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
    </>
    
  );
};

export default Tests;
