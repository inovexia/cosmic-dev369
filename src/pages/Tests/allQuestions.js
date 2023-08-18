import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Alert, Button, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import ReactHtmlParser from "react-html-parser";
import CachedIcon from "@mui/icons-material/Cached";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy"
import { Helmet } from "react-helmet";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const AllQuestions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { guid } = useParams();
  const { control } = useForm({
    defaultValues: {
      title: "",
      details: "",
      status: "0",
      created_by: {CreatedBy},
    },
  });

  // Authorization Setup
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );
  myHeaders.append("Network", `${Network}`);

  // Get current test details
  const [test, setTest] = useState([]);
  const [questions, setQuestions] = useState([]);
  const requestOption = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  useEffect(() => {
    const fetchTest = async () => {
      const res = await fetch(
        `${BASE_URL}/tests/view/${guid}`,
        requestOption
      );
      const testresult = await res.json();
      //console.log(testresult)
      setTest(testresult.payload);
    };
    fetchTest();
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await fetch(
        `${BASE_URL}/tests/preview/${guid}/1`,
        requestOption
      );
      const testData = await response.json();
      setQuestions(testData.payload);
      setIsLoading(false);
    };
    fetchQuestion();
  }, []);

  const [testNotFound, setTestNotFound] = useState("");
  const totalMarks = questions.reduce((acc, curr) => {
    return acc + parseInt(curr.marks);
  }, 0);
  const duration = questions.reduce((acc, curr) => {
    return acc + parseInt(curr.time);
  }, 0);
  const testTime = duration / 60;
  const formattedTime = parseFloat(testTime.toFixed(0));

  //console.log(test);

  return (
    <>
    <Helmet>
        <title>All Questions</title>
    </Helmet>
    <Box sx={{ display: "flex" }}>
      <SidebarLeft />
      <Box sx={{ flexGrow: 1, px: 3 }}>
        <Grid
          container
          sx={{ width: "100%", mt: 5 }}
          alignItems="center"
        ></Grid>
        <Grid container sx={{mt:2}}>
          <Grid item xs={6} sx={{ pt: 0 }}>
            <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
              {test && test.title}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Button variant="contained">
              <Link
                href={`/test/add-question/${guid}`}
                color="inherit"
                underline="none"
              >
                Add Question
              </Link>
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={0} sx={{ mt: 5 }}>
          <Grid item xs={6}>
            <Typography
              variant="h5"
              sx={{ fontSize: 18, lineHeight: "22px", fontWeight: 400 }}
            >
              Test Duration:{formattedTime}min
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography
              variant="h5"
              sx={{ fontSize: 18, lineHeight: "22px", fontWeight: 400 }}
            >
              Test Marks:{totalMarks}
            </Typography>
          </Grid>
        </Grid>
        {isLoading ? (
          <Grid item xs={12} sx={{ textAlign: "center", py: 5 }}>
            <CachedIcon />
          </Grid>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mt: 5 }}>
              {questions.length > 0 ? (
                <>
                  {questions.map((question, index) => (
                    <Grid item xs={12} key={index} sx={{mb:3}}>
                      <Box sx={{ display: "flex", fontSize:"18px" }}>
                        ({index + 1}). <span>{ReactHtmlParser(question.question)}</span>
                      </Box>
                      <ol
                        style={{
                          listStyleType: "lower-alpha",
                          paddingLeft: "45px",
                        }}
                      >
                        {question.choices.map((choice, index) => (
                          <li
                            style={{
                              color:
                                choice.correct_answer === "1" ? "#A6CD4E" : "",
                            }}
                            key={index}
                          >
                            {ReactHtmlParser(choice.choice)}
                          </li>
                        ))}
                      </ol>
                    </Grid>
                  ))}
                </>
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">Questions not found!</Alert>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>
    </Box>
    </>
  );
};
export default AllQuestions;
