import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import ReactHtmlParser from "react-html-parser";
import { styled } from "@mui/material/styles";
import {
  Box,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import TestSidebar from "../../components/Test/TestSidebar";
import TestInstruction from "../../components/Test/testInstruction";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const TakeTest = () => {
  const TestsidebarVisible = true;
  const sidebarVisible = false;
  const [isUserEnrolled, setIsUserEnrolled] = useState(null);
  const { guid } = useParams();
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      answer: [],
    },
  });

  const [answer, setAnswer] = useState([]);
  const currentStep = watch("currentStep", 0);
  // Get current test details
  const [test, setTest] = useState([]);
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );
  myHeaders.append("Network", `${Network}`);
  const requestOption = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  // Fetch Test Details
  useEffect(() => {
    const fetchTest = async () => {
      const response = await fetch(
        `${BASE_URL}/tests/view/${guid}`,
        requestOption
      );
      const testDetails = await response.json();
      setTest(testDetails.payload);
      reset(testDetails.payload);
    };
    fetchTest();
  }, [reset]);
  // End test details

  // Get all questions
  const [testData, setTestData] = useState([]);
  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await fetch(
        `${BASE_URL}/tests/preview/${guid}/1`,
        requestOption
      );
      const test_Data = await response.json();
      setTestData(test_Data.payload);
    };
    fetchQuestion();
  }, []);

  const onSubmit = (data) => {
    // Handle form submission here
    console.log(data); // Access the form data
  };

  // const handleCheckboxChange = (event, index) => {
  //   const isChecked = event.target.checked;
  //   setAnswers((prevAnswers) => {
  //     const newAnswers = [...prevAnswers];
  //     newAnswers[index] = isChecked;
  //     return newAnswers;
  //   });
  // };

  // Show and hide
  const [showInstruction, setShowInstruction] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const handleNextClick = () => {
    setShowInstruction(false);
    setShowQuestions(true);
  };

  //const [checkedItems, setCheckedItems] = React.useState({});

  const handleCheckboxChange = (questionId, selectedAnswer) => {
    //console.log(questionId, selectedAnswer)
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
      [questionId]: selectedAnswer,
    }));
    // setCheckedItems((prevState) => ({
    //   ...prevState,
    //   [event.target.name]: event.target.checked,
    // }));
  };
 

  const [checkedReview, setCheckedReview] = useState(false);
  const handleReviewLater = (event) => {
    setCheckedReview(event.target.checked);
  };
  const [checkConfirmValue, setCheckConfirmValue] = useState(false);

  const handleChildValueChange = (value) => {
    setCheckConfirmValue(value);
  };

  const currentIndex = testData[currentStep];
  const handleNextQs = () => {
    setValue("currentStep", currentStep + 1);
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, px: 3 }}>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                {test.title}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              {TestsidebarVisible ? <TestSidebar data={testData} /> : null}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Snackbar
              open={isUserEnrolled}
              autoHideDuration={3000}
              onClose={() => setIsUserEnrolled(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={isUserEnrolled === true ? "success" : "warning"}>
                {isUserEnrolled === true
                  ? "Test submitted Successfully"
                  : "Test submission failed"}
              </Alert>
            </Snackbar>
          </Grid>
          <Grid container sx={{ mt: 5 }}>
            {showInstruction && (
              <>
                <TestInstruction
                  test={test}
                  onValueChange={handleChildValueChange}
                />
                <span style={{ color: "#AD0000" }}>
                  {!checkConfirmValue ? "You must confirm this." : ""}
                </span>
                <Grid item xs={12} sx={{ mt: 5 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextClick}
                    disabled={!checkConfirmValue}
                  >
                    Next
                  </Button>
                </Grid>
              </>
            )}
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              {showQuestions && (
                <>
                  {currentIndex && (
                    <Grid container>
                      <Grid item>
                        <div>
                          <input
                            type="hidden"
                            name={`answer[${currentIndex.ID}]`}
                          />
                          <h3>{ReactHtmlParser(currentIndex.question)}</h3>
                          {currentIndex.question_type === "mcmc" ? (
                            <>
                              {currentIndex &&
                                currentIndex.choices.map((choice, i) => (
                                  <div key={i}>
                                    <label
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Checkbox
                                          name={`choice_[${i}]`}
                                          {...register(`choice_[${i}]`)}
                                          onChange={(e) =>
                                            handleCheckboxChange(currentIndex.ID, i)
                                          }
                                        />
                                      {ReactHtmlParser(choice.choice)}
                                    </label>
                                  </div>
                                ))}
                              <FormControlLabel
                                style={{ color: "#14C0CC" }}
                                sx={{ ml: 0 }}
                                control={
                                  <Checkbox
                                    color="review"
                                    checked={checkedReview}
                                    onChange={handleReviewLater}
                                  />
                                }
                                label="Visit Question Later (Mark for review)"
                              />
                            </>
                          ) : currentIndex.question_type === "tf" ? (
                            <>
                              <RadioGroup style={{ marginLeft: "10px" }}>
                                {currentIndex &&
                                  currentIndex.choices.map((choice, i) => (
                                    <FormControlLabel
                                      key={i}
                                      value={choice.choice}
                                      control={<Radio />}
                                      label={choice.choice}
                                    />
                                  ))}
                              </RadioGroup>
                              <FormControlLabel
                                style={{ color: "#14C0CC" }}
                                sx={{ ml: 0 }}
                                control={
                                  <Checkbox
                                    color="review"
                                    checked={checkedReview}
                                    onChange={handleReviewLater}
                                  />
                                }
                                label="Visit Question Later (Mark for review)"
                              />
                            </>
                          ) : currentIndex.question_type === "la" ? (
                            <>
                              <StyledFormControl sx={{ width: "100%" }}>
                                <Editor
                                  sx={{ width: "100%" }}
                                  control
                                  name="la"
                                  pattern="[A-Za-z]{1,}"
                                  init={{
                                    height: 250,
                                  }}
                                  // onEditorChange={(content, editor) => {
                                  //   setValue(`choice[${index}]`, content);
                                  // }}
                                />
                              </StyledFormControl>
                              <FormControlLabel
                                style={{ color: "#14C0CC" }}
                                sx={{ ml: 0 }}
                                control={
                                  <Checkbox
                                    color="review"
                                    checked={checkedReview}
                                    onChange={handleReviewLater}
                                  />
                                }
                                label="Visit Question Later (Mark for review)"
                              />
                            </>
                          ) : (
                            <>
                              {currentIndex &&
                                currentIndex.choices.map((choice, i) => (
                                  <div key={i}>
                                    <label
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                     <Checkbox
                                          name={`choice_[${i}]`}
                                          {...register(`choice_[${i}]`)}
                                          onChange={(e) =>
                                            handleCheckboxChange(e, i)
                                          }
                                        />
                                      {ReactHtmlParser(choice.choice)}
                                    </label>
                                  </div>
                                ))}
                              <FormControlLabel
                                style={{ color: "#14C0CC" }}
                                sx={{ ml: 0 }}
                                control={
                                  <Checkbox
                                    color="review"
                                    checked={checkedReview}
                                    onChange={handleReviewLater}
                                  />
                                }
                                label="Visit Question Later (Mark for review)"
                              />
                            </>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  )}
                  <Grid
                    container
                    sx={{
                      mt: 5,
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentStep === 0}
                      onClick={() => setValue("currentStep", currentStep - 1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={currentStep === testData.length - 1}
                      onClick={handleNextQs}
                    >
                      Next
                    </Button>
                    <Button variant="contained" color="success" type="submit">
                      Submit
                    </Button>
                  </Grid>
                </>
              )}
            </form>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default TakeTest;
