import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy";
import ReactHtmlParser from "react-html-parser";
import { styled } from "@mui/material/styles";
import {
  Box,
  RadioGroup,
  FormGroup,
  Link,
  FormControl,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress

} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import TestSidebar from "../../components/Test/TestSidebar";
import TestInstruction from "../../components/Test/testInstruction";
import { Helmet } from "react-helmet";
import Timer from "../../components/Test/Timer";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const TakeTest = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, reset } = useForm();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sidebarOptions, setSidebarOptions] = useState([]);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [checkConfirmValue, setCheckConfirmValue] = useState(false);
  const TestsidebarVisible = true;
  const sidebarVisible = false;

  const handleQuestionUpdate = (newValue) => {
    setCurrentQuestion(newValue);
  };
  const { guid } = useParams();

  // Configuration
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  // Fetch Test Details
  const timerDuration = 10;
  const [test, setTest] = useState([]);
  useEffect(() => {
    const fetchTest = async () => {
      const requestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
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
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchQuestion = async () => {
      const requestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/tests/preview/${guid}/1`,
        requestOption
      );
      const test_Data = await response.json();
      setTestData(test_Data.payload);
      setIsLoading(false);
    };
    fetchQuestion();
  }, []);

  const startTestSubmit = () => {
    alert("Test started");
  };
  function generateSessionID(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let sessionID = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      sessionID += characters[randomIndex];
    }
    return sessionID;
  }
  const handleClickStart = () => {
    const set_Session = generateSessionID(36);
    console.log(set_Session)
    setShowInstruction(false);
    setShowQuestions(true);
    localStorage.setItem("set_session", set_Session);
    // Set Session ID
    var formdata = new FormData();
    formdata.append("user_guid", CreatedBy);
    formdata.append("set_session", set_Session);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${BASE_URL}/tests/take_test/${guid}`, requestOptions).then(
      (response) => response.text()
    );
  };
  const handleChildValueChange = (value) => {
    setCheckConfirmValue(value);
  };

  // Test auto submit when duration completed
  const [timerExpired, setTimerExpired] = useState(false);
  const handleTimerExpired = () => {
    setTimerExpired(true);
    onTestSubmit(); // Call the existing onSubmit function to submit the test
  };

  // Thanks after test submitted
  const [dialogOpen, setDialogOpen] = useState(false);

  // Test Submission
  const resultType = test.settings && test.settings.show_result;
  const [open, setOpen] = useState(false);
  const [isTestSubmited, setIsTestSubmited] = useState(null);
  const session = localStorage.getItem("set_session");
  const onTestSubmit = async () => {
    const formData = new FormData();
    testData.forEach((item, index) => {
      const answerKey = `answer[${item.guid}]`;
      const choices = selectedOptions && selectedOptions[index];
      if (choices) {
        const choiceValues = Object.entries(choices)
          .filter(([key, value]) => value)
          .map(([key]) => `choice_${key}`)
          .join(",");

        if (choiceValues) {
          formData.append(answerKey, choiceValues);
        }
      }
    });
    formData.append("set_session", session);
    formData.append("user_guid", CreatedBy);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${BASE_URL}/tests/submit_test/${guid}`,
        requestOptions
      );
      const result = await response.json();
      if (result.success === true) {
        setIsTestSubmited(true);
        if (resultType === "immediately") {
          setOpen(true);
          setTimeout(() => {
            navigate(`/test/report/${guid}`);
          }, 2000);
        } else {
          setDialogOpen(true);
        }
      }
    } catch (error) {
      setIsTestSubmited(false);
    }
  };
  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSidebarOptions(selectedOptions);
  };

  const handlePrev = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = {
        ...prevSelectedOptions,
        [currentQuestion]: {
          ...prevSelectedOptions[currentQuestion],
          [option]: !prevSelectedOptions[currentQuestion]?.[option],
        },
      };

      const allOptionsUnchecked = Object.values(
        updatedOptions[currentQuestion]
      ).every((value) => !value);

      if (allOptionsUnchecked) {
        delete updatedOptions[currentQuestion];
      }

      return updatedOptions;
    });
  };
  const handleRadioChange = (option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestion]: {
        ...prevSelectedOptions[currentQuestion],
        [option]: !prevSelectedOptions[currentQuestion]?.[option],
      },
    }));
  };

  const [checked, setChecked] = useState(false);
  const handleReviewLater = (event) => {
    setChecked(event.target.checked);
  };
  const renderOptions = (choices) => {
    return testData[currentQuestion].question_type === "mcmc" ? (
      <>
        {choices.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedOptions[currentQuestion]?.[index] || false}
                onChange={() => handleCheckboxChange(index)}
              />
            }
            label={ReactHtmlParser(item.choice)}
          />
        ))}
        <FormControlLabel
          style={{ color: "#14C0CC" }}
          control={
            <Checkbox
              color="review"
              checked={selectedOptions[currentQuestion]?.review || false}
              onChange={() => handleCheckboxChange("review")}
            />
          }
          label="Visit Question Later (Mark for review)"
        />
      </>
    ) : testData[currentQuestion].question_type === "tf" ? (
      <>
        <RadioGroup style={{ marginLeft: "10px" }}>
          {choices.map((choice, i) => (
            <FormControlLabel
              key={i}
              value={choice.choice}
              control={<Radio />}
              label={choice.choice}
              checked={selectedOptions[currentQuestion]?.[i] || false}
              onChange={() => handleRadioChange(i)}
            />
          ))}
        </RadioGroup>
        <FormControlLabel
          style={{ color: "#14C0CC" }}
          control={
            <Checkbox
              color="review"
              checked={selectedOptions[currentQuestion]?.review || false}
              onChange={() => handleCheckboxChange("review")}
            />
          }
          label="Visit Question Later (Mark for review)"
        />
      </>
    ) : testData[currentQuestion].question_type === "la" ? (
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
          control={
            <Checkbox
              color="review"
              checked={selectedOptions[currentQuestion]?.review || false}
              onChange={() => handleCheckboxChange("review")}
            />
          }
          label="Visit Question Later (Mark for review)"
        />
      </>
    ) : (
      <>
        {choices.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedOptions[currentQuestion]?.[index] || false}
                onChange={() => handleCheckboxChange(index)}
              />
            }
            label={ReactHtmlParser(item.choice)}
          />
        ))}
        <FormControlLabel
          style={{ color: "#14C0CC" }}
          control={
            <Checkbox
              color="review"
              checked={selectedOptions[currentQuestion]?.review || false}
              onChange={() => handleCheckboxChange("review")}
            />
          }
          label="Visit Question Later (Mark for review)"
        />
      </>
    );
  };
  // Check if questions.length === 0 and redirect if necessary
  useEffect(() => {
    if (!isLoading && testData.length === 0) {
      console.log("Redirecting to manage test page...");
      navigate(`/test/manage/${guid}`);
    }
  }, [testData, navigate, isLoading]);

  if (isLoading) {
    return <Box sx={{height:"70vh", display:"flex", alignItems:"center", justifyContent:"center"}}><CircularProgress/></Box>;
  }

  //console.log(testData);
  console.log(testData)
  return (
    <>
      <Helmet>
        <title>Take Test</title>
      </Helmet>
      <Dialog open={dialogOpen} >
        <DialogContent>
        <Typography fullwidth sx={{textAlign:"center"}}><CheckCircleOutlinedIcon color="success" sx={{fontSize:50}} /></Typography>
          <DialogTitle color="success">Test submitted successfully.</DialogTitle>
          <Typography fullwidth sx={{textAlign:"center", pb:3}}>Result will publish after review.</Typography>
          <DialogActions sx={{alignItems:"center", justifyContent:"center"}} fullwidth>
          <Button className="custom-button" variant="outlined" component={Link} href={`/test/list`}>Go To Tests</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
      <Box sx={{ display: "flex", marginTop: "-50px" }}>
        <Box sx={{ flexGrow: 1, px: 3 }}>
          <Grid container spacing={2}>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={() => setOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={isTestSubmited === true ? "success" : "warning"}>
                {isTestSubmited === true
                  ? "Test submission Successfull"
                  : "Test submission Failed"}
              </Alert>
            </Snackbar>
          </Grid>
          <Grid container sx={{ mt: 5 }}>
            <Grid item xs={11} sx={{ display: "flex" }}>
              <Typography
                variant="h1"
                component="h5"
                sx={{ fontSize: 30, fontWeight: 600 }}
              >
                {test.title}
              </Typography>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                {!showInstruction ? (
                  <span style={{ marginLeft: "15px" }}>
                    ({currentQuestion + 1}/{testData.length})
                  </span>
                ) : (
                  ""
                )}
              </Typography>
            </Grid>
            {!showInstruction ? (
              <Grid item xs={1} sx={{ textAlign: "right" }}>
                {TestsidebarVisible ? (
                  <TestSidebar
                    data={testData}
                    updateQuestion={handleQuestionUpdate}
                    selectedOptions={sidebarOptions}
                  />
                ) : null}
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography
                variant="h1"
                component="div"
                sx={{ fontSize: 24, fontWeight: 600, display: "flex" }}
              >
                {!showInstruction &&
                test.settings &&
                test.settings.show_timer === "true" ? (
                  <>
                    <Timer
                      durationInMinutes={
                        test.settings && test.settings.test_duration
                      }
                      onTimerExpired={handleTimerExpired}
                    />
                  </>
                ) : (
                  ""
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid container={true} sx={{ mt: 5 }}>
            {showInstruction && (
              <form
                onSubmit={handleSubmit(startTestSubmit)}
                style={{ width: "100%" }}
              >
                <TestInstruction
                  test={test}
                  onValueChange={handleChildValueChange}
                />
                <span style={{ color: "#AD0000" }}>
                  {!checkConfirmValue ? "You must confirm this." : ""}
                </span>
                <Grid item xs={12} sx={{ mt: 5 }}>
                  <Button
                    className="custom-button"
                    variant="contained"
                    color="primary"
                    onClick={handleClickStart}
                    disabled={!checkConfirmValue}
                  >
                    Start Test
                  </Button>
                </Grid>
              </form>
            )}
            {showQuestions && !timerExpired && (
              <form
                onSubmit={handleSubmit(onTestSubmit)}
                style={{ width: "100%" }}
              >
                {testData[currentQuestion] && testData[currentQuestion].parent_question &&(
                  <h4>{ReactHtmlParser(testData[currentQuestion].parent_question)}</h4>
                )}
                {testData[currentQuestion] && (
                  <h4>{ReactHtmlParser(testData[currentQuestion].question)}</h4>
                )}
                {(testData[currentQuestion] && testData[currentQuestion].file_hash !== null) ||
                                  (testData[currentQuestion] &&
                                    testData[currentQuestion].file_url_path !== null) ? (
                                    <Box
                                      sx={{ width: "100%", maxWidth: "500px" }}
                                    >
                                      <img
                                          style={{
                                          maxWidth:"100%",
                                          height: "auto",
                                        }}
                                        src={
                                          testData[currentQuestion] &&
                                          testData[currentQuestion].file_url_path &&
                                          testData[currentQuestion].file_hash &&
                                          testData[currentQuestion].file_url_path + "/" + testData[currentQuestion].file_hash
                                        } 
                                      />
                                    </Box>
                                  ) : (
                                    ""
                                  )}
                {/* Display options */}
                {testData[currentQuestion] && (
                  <FormGroup>
                    {renderOptions(testData[currentQuestion].choices)}
                  </FormGroup>
                )}

                {/* Prev and Next buttons */}
                <Grid
                  container={true}
                  sx={{
                    mt: 5,
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {currentQuestion > 0 && (
                    <Button
                      className="custom-button"
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handlePrev}
                    >
                      Prev
                    </Button>
                  )}
                  {currentQuestion < testData.length - 1 ? (
                    <Button
                      className="custom-button"
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={currentQuestion === testData.length - 1}
                    >
                      Next
                    </Button>
                  ) : (
                    ""
                  )}
                  <Button
                    className="custom-button"
                    variant="contained"
                    color="success"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </form>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TakeTest;
