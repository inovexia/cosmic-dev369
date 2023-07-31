import React, { useState, useEffect } from "react";
//import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Tabs,
  Tab,
  Link,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
//import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy";
import SummaryReport from "../../components/Test/SummaryReport";
import DetailsReport from "../../components/Test/DetailsReport";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const SubmissionReports = () => {
  const { guid } = useParams();
  const sidebarVisible = true;
  const [selectedTab, setSelectedTab] = useState(0);
  const [testResult, setTestResult] = useState("");
  const current_sessionId = localStorage.getItem("set_session");

  // Authorization Setup
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Get Reports
  useEffect(() => {
    const formdata = new FormData();
    formdata.append("user_guid", CreatedBy);
    formdata.append("session_id", current_sessionId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    const fetchTest = async () => {
      const res = await fetch(
        `${BASE_URL}/tests/report/${guid}`,
        requestOptions
      );
      const testresult = await res.json();
      //console.log(testresult.payload);
      setTestResult(testresult.payload);
    };
    fetchTest();
  }, []);

  // Test Details
  const [testDetails, setTestDetails] = useState("");
  useEffect(() => {
    const requestOption = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    const fetchTestDetails = async () => {
      const result = await fetch(
        `${BASE_URL}/tests/view/${guid}`,
        requestOption
      );
      const testresults = await result.json();
      //console.log(testresult)
      setTestDetails(testresults.payload);
    };
    fetchTestDetails();
  }, []);

  const incorrect = (testResult && testResult.num_wrong * 100)/(testDetails && testDetails.stats.questions)
  const correct = (testResult && testResult.num_correct * 100)/(testDetails && testDetails.stats.questions)
  const unanswered = (testResult && testResult.num_not_attempted * 100)/(testDetails && testDetails.stats.questions)

  const tabs = [
    {
      label: "Summary",
      content: (
        <SummaryReport
          incorrectColor="#2A5C99"
          correctColor="#A6CD4E"
          noansweredColor="#14C0CC"
          incorrectValue={incorrect}
          correctValue={correct}
          unansweredValue={unanswered}
          testResult = {testResult}
          testDetails = {testDetails}
        />
      ),
    },
    { label: "Details", content: <DetailsReport testResult = {testResult} testDetails = {testDetails} /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {sidebarVisible && <SidebarLeft />}
      <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h1"
              sx={{ fontSize: 30, fontWeight: 600, textAlign: "left" }}
            >
              Test Report
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs
              value={selectedTab}
              onChange={(event, newValue) => setSelectedTab(newValue)}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
            <Box sx={{ mt: 5 }}>{tabs[selectedTab].content}</Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SubmissionReports;
