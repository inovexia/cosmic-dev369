import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import { Editor } from "@tinymce/tinymce-react";
import { styled } from "@mui/material/styles";
import TestSidebar from "./TestSidebar";
import BASE_URL from "../../../src/Utils/baseUrl"
import token from "../../../src/Utils/token"
import Network from "../../../src/Utils/network"

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const TakeTestQuestion = ({ guid }) => {
  const TestsidebarVisible = true;
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
  const [testData, setTestData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    const currentCorrectAnswer = testData[currentQuestion];
    if (selectedOption === currentCorrectAnswer) {
      setScore(score + 1);
    }
    setSelectedOption("");
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevQuestion = () => {
    setSelectedOption("");
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleFinishQuiz = () => {
    const currentCorrectAnswer = testData[currentQuestion].correctAnswer;
    if (selectedOption === currentCorrectAnswer) {
      setScore(score + 1);
    }
    setSelectedOption("");
    setCurrentQuestion(0);
  };
  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const currentQuizItem = testData[currentQuestion];
  //console.log(testData);
  return (
    <Grid container sx={{justifyContent:"space-between"}}>
      <Grid item xs={12}>
        <Typography variant="h5" style={{ fontSize: "20px" }}>
          {currentQuizItem && ReactHtmlParser(currentQuizItem.question)}
        </Typography>
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          {currentQuizItem && currentQuizItem.question_type === "mcmc" ? (
            <>
              {currentQuizItem &&
                currentQuizItem.choices.map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        value={selectedOption}
                        checked={index.isChecked}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={ReactHtmlParser(choice.choice)}
                  />
                ))}
              <FormControlLabel
                control={
                  <Checkbox name="read_instruction" className="option-label" />
                }
                label={
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: "1em",
                        fontWeight: 400,
                        color: "#14C0CC",
                      }}
                    >
                      I have read this instruction
                    </Typography>
                  </Box>
                }
              />
            </>
          ) : currentQuizItem && currentQuizItem.question_type === "tf" ? (
            <>
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                {currentQuizItem &&
                  currentQuizItem.choices.map((choice, index) => (
                    <FormControlLabel
                      key={index}
                      value={choice.choice}
                      control={<Radio />}
                      label={ReactHtmlParser(choice.choice)}
                    />
                  ))}
              </RadioGroup>
              <FormControlLabel
                control={
                  <Checkbox name="read_instruction" className="option-label" />
                }
                label={
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: "1em",
                        fontWeight: 400,
                        color: "#14C0CC",
                      }}
                    >
                      I have read this instruction
                    </Typography>
                  </Box>
                }
              />
            </>
          ) : currentQuizItem && currentQuizItem.question_type === "la" ? (
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
            </>
          ) : (
            <>
              {currentQuizItem &&
                currentQuizItem.choices.map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={index.isChecked}
                        onChange={() => handleCheckboxChange(choice.choice)}
                      />
                    }
                    label={ReactHtmlParser(choice.choice)}
                  />
                ))}
              <FormControlLabel
                control={
                  <Checkbox name="read_instruction" className="option-label" />
                }
                label={
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: "1em",
                        fontWeight: 400,
                        color: "#14C0CC",
                      }}
                    >
                      I have read this instruction
                    </Typography>
                  </Box>
                }
              />
            </>
          )}
        </FormControl>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          sx={{ mt: 5 }}
        >
          {currentQuestion > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevQuestion}
            >
              Previous
            </Button>
          )}
          {currentQuestion < testData.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinishQuiz}
            >
              Finish Quiz
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default TakeTestQuestion;
