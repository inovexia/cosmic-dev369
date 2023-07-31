import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import CreatedBy from "../../Utils/createdBy";
import ReactHtmlParser from "react-html-parser";
import { styled } from "@mui/material/styles";
import {
  Box,
  RadioGroup,
  FormGroup,
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
import Network from "../../Utils/network";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const TakeTest = () => {
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
  const requestOption = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  // Fetch Test Details
  const [test, setTest] = useState([]);
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

  const startTestSubmit = () => {
    alert("Test started");
  };
  // const handleNextClick = () => {
  //   setShowInstruction(false);
  //   setShowQuestions(true);
  // };
  function generateToken(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  }
  const handleClickStart = () => {
    const set_Session = generateToken(36);
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
    //.then((result) => console.log(result))
    //.catch((error) => console.log("error", error));
  };
  const handleChildValueChange = (value) => {
    setCheckConfirmValue(value);
  };
  // const onSubmit = (data) => {
  //   const formData = testData.map((item, index) => ({
  //     question: item.ID,
  //     options: selectedOptions[index],
  //   }));
  //   console.log(formData);
  // };
  const session = localStorage.getItem("set_session");
  // const onSubmit = () => {
  //   const formData = new FormData();

  //   testData.forEach((item, index) => {
  //     const answerKey = `answer[${item.ID}]`;
  //     const choices = selectedOptions && selectedOptions[index];

  //     if (!choices) {
  //       formData.append(answerKey, "");
  //     } else {
  //       const choiceValues = Object.entries(choices)
  //         .filter(([key, value]) => value)
  //         .map(([key]) => key)
  //         .join(",");
  //       formData.append(answerKey, `choice_${choiceValues}`);
  //     }
  //   });

  //   formData.append("set_session", session);
  //   formData.append("user_guid", CreatedBy);

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: formData,
  //     redirect: 'follow'
  //   };

  //   fetch("https://developer1.website/dev/caapis/public/tests/submit_test/TS80", requestOptions)
  //     .then(response => response.text())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));
  // };

  const onSubmit = () => {
    const formData = new FormData();

    testData.forEach((item, index) => {
      const answerKey = `answer[${item.ID}]`;
      const choices = selectedOptions && selectedOptions[index];

      if (!choices) {
        formData.append(answerKey, "");
      } else {
        const choiceValues = Object.entries(choices)
          .filter(([key, value]) => value)
          .map(([key]) => `choice_${key}`)
          .join(",");
        formData.append(answerKey, choiceValues);
      }
    });

    formData.append("set_session", session);
    formData.append("user_guid", CreatedBy);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch(
      "https://developer1.website/dev/caapis/public/tests/submit_test/TS80",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
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
  //console.log(selectedOptions)

  // const renderOptions = (options) => {
  //   return options.map((option, index) => (
  //     <FormControlLabel
  //       key={index}
  //       control={
  //         <Checkbox
  //           checked={selectedOptions[currentQuestion]?.[option] || false}
  //           onChange={() => handleCheckboxChange(option)}
  //         />
  //       }
  //       label={option}
  //     />
  //   ));
  // };

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
  //console.log(sidebarOptions);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, px: 3 }}>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                {test.title}
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
              <Grid item xs={6} sx={{ textAlign: "right" }}>
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
            {showQuestions && (
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                {testData[currentQuestion] && (
                  <h2>{ReactHtmlParser(testData[currentQuestion].question)}</h2>
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
                  <Button variant="contained" color="success" type="submit">
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
