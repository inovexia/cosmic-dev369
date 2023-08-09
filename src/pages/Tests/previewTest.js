import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  ButtonGroup,
  Link
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import ReactHtmlParser from "react-html-parser";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import BASE_URL from "../../Utils/baseUrl";
import CreatedBy from "../../Utils/createdBy";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const PreviewTest = () => {
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
  // Snackbar end

  const [isLoading, setIsLoading] = useState(true);
  const { guid } = useParams();
  const { control } = useForm({
    defaultValues: {
      title: "",
      details: "",
      status: "0",
      created_by: { CreatedBy },
    },
  });

  // Authorization Setup
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Get current test details
  const [test, setTest] = useState([]);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const requestOption = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const fetchTest = async () => {
      const res = await fetch(`${BASE_URL}/tests/view/${guid}`, requestOption);
      const testresult = await res.json();
      //console.log(testresult)
      setTest(testresult.payload);
    };
    fetchTest();
  }, []);

  useEffect(() => {
    const requestOption = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
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

  const totalMarks = questions.reduce((acc, curr) => {
    return acc + parseInt(curr.marks);
  }, 0);
  const duration = questions.reduce((acc, curr) => {
    return acc + parseInt(curr.time);
  }, 0);
  const testTime = duration / 60;
  const formattedTime = parseFloat(testTime.toFixed(0));

  // Select single row
  const [selected, setSelected] = useState([]);
  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };
  // Selection all row
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = questions.map((question) => question.guid);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };
  // Delete Question
  const [isDeleting, setIsDeleting] = useState(null);
  function handleDelete(id) {
    setIsDeleting(id);
    var formdata = new FormData();
    formdata.append("questions[0]", id);
    formdata.append("updated_by", CreatedBy);
    const deleteOption = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch(`${BASE_URL}/tests/remove_question/${guid}`, deleteOption)
      .then((response) => {
        setIsDeleting(null);
        setQuestions(questions.filter((question) => question.guid !== id));
      })
      .catch((error) => {
        console.error(error);
        setIsDeleting(null);
      });
  }

  const deleteBulkQuestion = async () => {
    const formdata = new FormData();
    selected.forEach((item, index) => {
      formdata.append(`questions[${index}]`, item);
    });
    formdata.append("updated_by", CreatedBy);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/tests/remove_question/${guid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "Question deleted Successfully");
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => {
            if (!selected.includes(question.guid)) {
              return true; // Keep the question in state if it's not in selected array
            }
            return false; // Remove the question from state if it's in selected array
          })
        );
      } else {
        showSnackbar(
          "warning",
          "Question not deleted, At least 1 item should be selected!"
        );
        setTimeout(() => {}, 3000);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };
console.log(questions)
  return (
    <>
      <Helmet>
        <title>Preview Test</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={hideSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={
              snackbarSuccess && snackbarSuccess === true
                ? "success"
                : "warning"
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={0} sx={{ mt: 5 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                  {test && test.title}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{textAlign:"right"}}>
                <Button className="custom-button" variant="contained" component={Link} href={`/test/manage/${guid}`}>Back</Button>
              </Grid>
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
                    <Grid item xs={12}>
                      <ButtonGroup
                        variant="contained"
                        color="primary"
                        aria-label="contained primary button group"
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              indeterminate={
                                selected.length > 0 &&
                                selected.length < questions.length
                              }
                              checked={selected.length === questions.length}
                              onChange={handleSelectAll}
                              inputProps={{ "aria-label": "select all rows" }}
                            />
                          }
                          label="Check All"
                        />
                        <Button
                          onClick={deleteBulkQuestion}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </Grid>
                    {questions.map((question, index) => (
                      <Grid item xs={12} key={index}>
                        <FormControlLabel
                          control={
                            // <Checkbox
                            // checked={checkedQues[question.guid]}
                            // onChange={(event) => handleCheckboxChange(event, question.guid)}
                            //   name={question.guid}
                            //   control={control}
                            //   //onChange={({ target: { checked } }) => {}}
                            //   className="option-label"
                            //   value={question.guid}
                            // />

                            <Checkbox
                              checked={selected.indexOf(question.guid) !== -1}
                              onChange={() => handleSelect(question.guid)}
                              inputProps={{
                                "aria-labelledby": `select ${question.question}`,
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: "flex" }}>
                              {index + 1}. {ReactHtmlParser(question.question)}
                            </Box>
                          }
                        />

                        <Button onClick={() => handleDelete(question.guid)}>
                          {isDeleting === question.guid ? (
                            <CachedIcon size={20} color="#fff" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </Button>
                        <ol
                          style={{
                            listStyleType: "lower-alpha",
                            paddingLeft: "45px",
                          }}
                        >
                          {question.choices.map((choice, index) => {
                            return (
                              question.question_type === "tf" ? index < 2 &&(<li
                              style={{
                                color:
                                  choice.correct_answer === "1"
                                    ? "#A6CD4E"
                                    : "",
                              }}
                              key={index}
                            >
                              {ReactHtmlParser(choice.choice)}
                            </li>) : (<li
                              style={{
                                color:
                                  choice.correct_answer === "1"
                                    ? "#A6CD4E"
                                    : "",
                              }}
                              key={index}
                            >
                              {ReactHtmlParser(choice.choice)}
                            </li>)
                              
                            )
                            
                          })}
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
export default PreviewTest;
