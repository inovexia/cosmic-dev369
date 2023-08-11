import React, { useState, useEffect } from "react";
import SidebarLeft from "../components/Sidebar/SidebarLeft";
import { Box, Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import AllCourses from "../components/Dashboard/AllCourses";
import TestsTab from "../components/Dashboard/TestsTab";
import OnlineClasses from "../components/Dashboard/OnlineClasses";
import NewStudents from "../components/Dashboard/NewStudents";
import OnlineUser from "../components/Dashboard/OnlineUser";
import Widgets from "../components/Dashboard/Widgets";
import BASE_URL from "../Utils/baseUrl";
import token from "../Utils/token";
import Network from "../Utils/network";
import CheckTokenValid from "../../src/components/Redirect/CheckTokenValid"

const HomePage = () => {
  // States
  const [courses, setCourses] = useState("");
  const [classes, setClasses] = useState("");
  const [tests, setTests] = useState("");
  const [students, setStudents] = useState("");
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch Course list
  useEffect(() => {
    const fetchCourses = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/course/list`, requestOptions);
        const result = await response.json();
        setCourses(result.payload);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch Class list
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
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch Test list
  useEffect(() => {
    const fetchTests = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/tests/list`, requestOptions);
        const result = await response.json();
        setTests(result.payload);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchTests();
  }, []);

  // Fetch Students list
  useEffect(() => {
    const fetchStudents = async () => {
      var formdata = new FormData();
      //formdata.append("role", "student");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        //body: formdata,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/users/list`, requestOptions);
        const result = await response.json();
        setStudents(result.payload);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <>
      <CheckTokenValid/>
      <Helmet>
        <title>Cosmic Academy</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, px: 3, mt: 1 }} className="dashboard">
        <Grid container  sx={{ mt: 5 }}>
            <Grid item xs={12}>
            <AllCourses courses={courses && courses} />
            </Grid>
          </Grid>
          {/* Test and Online classes */}
          <Grid container spacing={4} sx={{ mt: 5 }}>
            <Grid item xs={12} md={6}>
              <TestsTab />
            </Grid>
            <Grid item xs={12} md={6}>
              <OnlineClasses />
            </Grid>
          </Grid>

          {/* New students and Online students */}
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <NewStudents />
            </Grid>
            <Grid item xs={12} md={4}>
              <OnlineUser />
            </Grid>
          </Grid>
          {/* Widgets */}
          <Widgets
            courses={courses && courses.data}
            classes={classes && classes.data}
            tests={tests && tests.data}
            students={students && students.data}
          />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
