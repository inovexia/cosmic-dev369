import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  FormControl,
  Box,
  Grid,
  Typography,
  Link,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Button,
  Input,
  IconButton,
  FormHelperText,
  MenuItem,
  InputAdornment,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Snackbar,
  Alert,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import { serialize } from "object-to-formdata";
//import TrueFalse from "../Tests/Type/trueFalse";
import Essay from "../../Tests/Type/essay";
import FormEditorField from "../../../components/Common/formEditorField";
import FormTextField from "../../../components/Common/formTextField";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import CreatedBy from "../../../Utils/createdBy";
import { Helmet } from "react-helmet";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});
const errorStyle = {
  color: "red",
};

const CourseEditQuestion = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mtValue = params.get("mt");
  const { guid } = useParams();
  const { qid } = useParams();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      choice: {
        0: "0",
        1: "0",
        2: "0",
        3: "0",
        4: "0",
        5: "0",
      },
      correct_answer: {
        0: "0",
        1: "0",
        2: "0",
        3: "0",
        4: "0",
        5: "0",
      },
      order: {
        0: "0",
        1: "0",
        2: "0",
        3: "0",
        4: "0",
        5: "0",
      },
      userfile: undefined,
      question: "",
      question_type: "",
      feedback: "",
      answer_feedback: "",
      created_by: CreatedBy,
    },
  });
  const { question_type, parent_id, choice, correct_answer, userfile } =
    watch();

  // Get current question
  const [currentQuestion, setCurrentQuestion] = useState("");
  useEffect(() => {
    var requestOption = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const fetchQuestion = async () => {
      const res = await fetch(
        `${BASE_URL}/tests/get_question/${qid}/1`,
        requestOption
      );
      const questions = await res.json();
      //console.log(testresult)
      setCurrentQuestion(questions.payload);
      reset(questions.payload);
    };
    fetchQuestion();
  }, []);

  useEffect(() => {
    // Assuming fetchedData contains your fetched data
    if (currentQuestion) {
      // Set values for individual fields
      setValue("question", currentQuestion.question);
      setValue("question_type", currentQuestion.question_type);
      setValue("marks", currentQuestion.marks);
      setValue("neg_marks", currentQuestion.neg_marks);
      setValue("time", currentQuestion.time);

      // Set values for choice fields (assuming you have multiple choice questions)
      if (currentQuestion && currentQuestion.choices) {
        currentQuestion.choices.forEach((choice, index) => {
          setValue(`choice[${index}]`, choice.choice);
          setValue(`correct_answer[${index}]`, choice.correct_answer);
        });
      }
    }
  }, [currentQuestion, setValue]);
  //const [options, setOptions] = useState(["Choice1", "Choice2"]);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(
      Array.from(
        { length: choice && choice.length },
        (_, index) => `Choice${index + 1}`
      )
    );
  }, [choice]);

  // Upload file in question
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const [selectedFile] = e.target.files;
      setValue("userfile", selectedFile); 
    }
  }
  // End Upload file
  // Search Parent ID
  const handleSearchChange = (event) => {
    setValue("parent_id", event.target.value);
  };

  //Multiple Checkbox creation
  // Array of data for checkboxes
  const [errorcheck, setErrorcheck] = useState(null);
  const [checkedItems, setCheckedItems] = useState({}); // useState hook to manage checked state
  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    }); // Update checked state
  };
  const handleAddOption = () => {
    const newOption = `Choice${options.length + 1}`;
    setOptions([...options, newOption]); // Add new option to the options array
    setCheckedItems({ ...checkedItems, [newOption]: false }); // Add new option to the checkedItems object with false value
  };

  // Search value
  const handleSearch = (event) => {
    setValue("parent_id", "1234");
  };
  // End Search

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const [isTestCreated, setIsTestCreated] = useState(null);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const navigate = useNavigate();
  const handleFormSubmit = async (data) => {
    //const formData = serialize(data);
    const formdata = new FormData();
    formdata.append("question", data.question);
    formdata.append("question_type", data.question_type);
    for (let i = 0; i < options.length; i++) {
      formdata.append(`choice[${i}]`, data.choice[i]);
      formdata.append(`correct_answer[${i}]`, data.correct_answer[i]);
    }
    formdata.append("created_by", CreatedBy);
    formdata.append("userfile", userfile);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    const content = editorRef.current.getContent();
    if (content.trim() === "") {
      alert("Question field should not be empty");
    } else {
      try {
        const response = await fetch(
          `${BASE_URL}/tests/create_question/${guid}/${qid}`,
          requestOptions
        );
        const result = await response.json();
        setIsTestCreated(true);
        setTimeout(() => {
          setIsTestCreated(false);
          //window.location.reload();
        }, 1000);
        reset();
      } catch (error) {
        setIsTestCreated(false);
      }
    }
  };

  const filename = watch("userfile");
  return (
    <>
      <Helmet>
        <title>Edit Question</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Edit Question
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
             
                <Button variant="contained" component={Link} href={`/course/test/manage/${guid}`} className="custom-button">
                  Cancel
                </Button>
        
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ mt: 0, width: "100%" }}
            alignItems="center"
          >
            <Grid item>
              <Snackbar
                //severity={isTestCreated === true ? "success" : "warning"}
                open={isTestCreated}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={1000}
                onClose={() => setIsTestCreated(false)}
              >
                <Alert
                  severity={isTestCreated === true ? "success" : "warning"}
                >
                  {isTestCreated === true
                    ? "Question created successfully."
                    : "Question cretion failled!"}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <Grid container spacing={2} className="add-question-form">
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                      <input
                        type="hidden"
                        name="created_by"
                        value={CreatedBy}
                      />
                      <StyledFormControl sx={{ width: "100%" }}>
                        <label
                          htmlFor="question"
                          sx={{
                            fontSize: 24,
                            fontWeight: 600,
                            fontFamily: "Arial",
                            mt: 5,
                          }}
                        >
                          Question
                        </label>
                        <FormEditorField
                          control={control}
                          name="question"
                          onInit={(evt, editor) => (editorRef.current = editor)}
                        />
                      </StyledFormControl>
                      <div className="add-file">
                        <Input
                          name="userfile"
                          id="file-input"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <strong>Upload File</strong>
                        <label htmlFor="file-input">
                          <IconButton component="span">
                            <FileUploadIcon
                              sx={{
                                color: "#EAC43D",
                                width: "50px",
                                height: "50px",
                                cursor: "pointer",
                              }}
                            />
                          </IconButton>
                        </label>
                        <span>
                          {filename ? filename.name : "No file selected"}
                        </span>
                      </div>
                      <div className="select-type">
                        <FormControl sx={{ my: 3, width: "100%" }}>
                          <FormTextField
                            control={control}
                            name="question_type"
                            label="Type"
                            required
                            select
                            onChange={({ target: { value } }) => {
                              setValue("question_type", value);
                              if (value === "tf") {
                                setValue("choice[0]", "true");
                                setValue("choice[1]", "false");
                                setValue("correct_answer[0]", "0");
                                setValue("correct_answer[1]", "0");
                              }
                            }}
                          >
                            <MenuItem value={`tf`}>True False</MenuItem>
                            <MenuItem selected value={`mcmc`}>
                              Multi Chioce
                            </MenuItem>
                            <MenuItem value={`la`}>Essay</MenuItem>
                            <MenuItem value={`comp`}>Comprehension</MenuItem>
                          </FormTextField>
                        </FormControl>

                        {question_type === "comp" ? (
                          <></>
                        ) : question_type === "tf" ? (
                          <>
                            <Typography component="h4">
                              True Or False
                            </Typography>
                            <RadioGroup aria-label="options" name="correct-ans">
                              <FormControlLabel
                                value="true"
                                control={
                                  <Radio
                                    onChange={({ target: { checked } }) => {
                                      setValue(
                                        "correct_answer[0]",
                                        checked ? "1" : "0"
                                      );
                                      setValue("correct_answer[1]", "0");
                                    }}
                                  />
                                }
                                label="True"
                              />
                              <FormControlLabel
                                value="false"
                                control={
                                  <Radio
                                    onChange={({ target: { checked } }) => {
                                      setValue(
                                        "correct_answer[1]",
                                        checked ? "1" : "0"
                                      );
                                      setValue("correct_answer[0]", "0");
                                    }}
                                  />
                                }
                                label="False"
                              />
                            </RadioGroup>
                          </>
                        ) : question_type === "la" ? (
                          <Essay />
                        ) : (
                          <>
                            <Typography component="h4">
                              Multi Choice Question
                            </Typography>
                            <FormGroup>
                              {options &&
                                options.map((option, index) => (
                                  <div key={index}>
                                    {/* Your choice input fields go here */}
                                    <input
                                      type="hidden"
                                      name={`order[${index}]`}
                                      value={`order[${index}]`}
                                    />
                                    <Controller
                                      control={control}
                                      name={`correct_answer[${index}]`}
                                      render={({ field }) => (
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              name={`correct_answer[${index}]`}
                                              control={control}
                                              onChange={({
                                                target: { checked },
                                              }) => {
                                                setValue(
                                                  `correct_answer[${index}]`,
                                                  checked ? "1" : "0"
                                                );
                                              }}
                                              className="option-label"
                                              checked={
                                                correct_answer &&
                                                correct_answer[`${index}`] ===
                                                  "1"
                                                  ? true
                                                  : false
                                              }
                                              // Check the correct_answer value for each option
                                              value={option}
                                            />
                                          }
                                          label={option}
                                        />
                                      )}
                                    />
                                    <StyledFormControl sx={{ width: "100%" }}>
                                      <Editor
                                        control
                                        name={`choice[${index}]`}
                                        pattern="[A-Za-z]{1,}"
                                        init={{
                                          height: 250,
                                        }}
                                        value={choice && choice[`${index}`]}
                                        onEditorChange={(content, editor) => {
                                          setValue(`choice[${index}]`, content);
                                        }}
                                      />
                                    </StyledFormControl>
                                    <FormHelperText error={Boolean(errorcheck)}>
                                      {errorcheck}
                                    </FormHelperText>
                                  </div>
                                ))}

                              <Button
                                variant="outlined"
                                sx={{ width: "150px" }}
                                onClick={handleAddOption}
                              >
                                Add Option
                              </Button>
                            </FormGroup>
                          </>
                        )}
                      </div>
                      {question_type !== "comp" ? (
                        <>
                          <StyledFormControl sx={{ width: "100%", mt: 3 }}>
                            <TextField
                              label="Search"
                              name="parent_id"
                              value={parent_id}
                              autoFocus
                              onChange={handleSearchChange}
                            />
                            {/* <TextField
                              label="Parent Question Sub Category Of"
                              variant="outlined"
                              value={parent_id}
                              {...register("parent_id")}
                              onChange={handleSearch}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton>
                                      <SearchIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            /> */}
                          </StyledFormControl>

                          <StyledFormControl sx={{ width: "100%" }}>
                            <Accordion>
                              <AccordionSummary
                                sx={{
                                  backgroundColor: "#14C0CC",
                                  color: "#fff",
                                }}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography>Feedback</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <StyledFormControl
                                  sx={{ mt: 3, width: "100%" }}
                                >
                                  <label
                                    htmlFor="question"
                                    sx={{
                                      fontSize: 24,
                                      fontWeight: 600,
                                      fontFamily: "Arial",
                                      mt: 3,
                                    }}
                                  >
                                    Question Feedback
                                    <Tooltip
                                      title="Add question feedback"
                                      placement="right-start"
                                    >
                                      <IconButton>
                                        <ErrorIcon sx={{ color: "#EAC43D" }} />
                                      </IconButton>
                                    </Tooltip>
                                  </label>
                                  <FormEditorField
                                    control={control}
                                    name="feedback"
                                  />
                                </StyledFormControl>
                                <StyledFormControl
                                  sx={{ mt: 3, width: "100%" }}
                                >
                                  <label
                                    htmlFor="question"
                                    sx={{
                                      fontSize: 24,
                                      fontWeight: 600,
                                      fontFamily: "Arial",
                                      mt: 3,
                                    }}
                                  >
                                    Answer Feedback
                                    <Tooltip
                                      title="Add answer feedback"
                                      placement="right-start"
                                    >
                                      <IconButton>
                                        <ErrorIcon sx={{ color: "#EAC43D" }} />
                                      </IconButton>
                                    </Tooltip>
                                  </label>
                                  <FormEditorField
                                    control={control}
                                    name="answer_feedback"
                                  />
                                </StyledFormControl>
                                <StyledFormControl sx={{ width: "100%" }}>
                                  <FormTextField
                                    control={control}
                                    label="Marks"
                                    defaultValue="1"
                                    variant="outlined"
                                    name="marks"
                                    pattern="[A-Za-z]{1,}"
                                  />
                                </StyledFormControl>
                                <StyledFormControl sx={{ width: "100%" }}>
                                  <FormTextField
                                    control={control}
                                    label="Negative Marks"
                                    variant="outlined"
                                    defaultValue="0"
                                    name="neg_marks"
                                    pattern="[A-Za-z]{1,}"
                                  />
                                </StyledFormControl>
                                <StyledFormControl sx={{ width: "100%" }}>
                                  <FormTextField
                                    control={control}
                                    label="Time Duration (in seconds)"
                                    variant="outlined"
                                    name="time"
                                    pattern="[A-Za-z]{1,}"
                                    defaultValue="0"
                                  />
                                </StyledFormControl>
                              </AccordionDetails>
                            </Accordion>
                          </StyledFormControl>
                        </>
                      ) : (
                        ""
                      )}

                      <Button variant="contained" type="submit" className="custom-button">
                        Update Question
                      </Button>
                    </form>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CourseEditQuestion;
