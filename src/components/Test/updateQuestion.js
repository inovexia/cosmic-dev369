import React, { Fragment, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FormControl,
  Box,
  Grid,
  MenuItem,
  TextField,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  FormHelperText,
  Input,
  Radio,
  Button,
  Modal,
  DialogTitle,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { serialize } from "object-to-formdata";
import { Editor } from "@tinymce/tinymce-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { styled } from "@mui/material/styles";
import Essay from "../../pages/Tests/Type/essay";
import FormEditorField from "../../components/Common/formEditorField";
import FormTextField from "../../components/Common/formTextField";
import CreatedBy from "../../Utils/createdBy";

const UpdateQuestion = ({
  importedQuestion,
  setImportedQuestion,
  openEditQuestion,
  setOpenEditQuestion,
  questionDetails,
  closePopup,
  selectedQ,
  selectedQIndex,
}) => {
  const { guid } = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userfile: undefined,
      question: "",
      question_type: "mcmc",
      choice: [],
      correct_answer: [],
      order: [0, 1, 2, 3, 4], // Use an array to store order values
      feedback: "",
      answer_feedback: "",
      created_by: CreatedBy, // Removed unnecessary curly braces
      parent_id: undefined,
      marks: "1",
      neg_marks: "0",
      time: "0",
      currIndex: selectedQIndex,
    },
  });
  const { userfile, question_type, parent_id, choice, currIndex } = watch();
  // Style
  const StyledFormControl = styled(FormControl)({
    marginBottom: "16px",
  });
  const errorStyle = {
    color: "red",
  };
  // Create repeater field
  const [options, setOptions] = useState(["Choice1", "Choice2", "Choice3"]); // Array of data for checkboxes
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
  // End repeater
  // Upload file in question
  const [file, setFile] = useState(null);
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  // End Upload file
  // Search Parent ID
  const handleSearchChange = (event) => {
    setValue("parent_id", event.target.value);
    //console.log(event.target.value);
  };
  // Search Question
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  // Modal Popup
  const handleClose = () => {
    closePopup();
  };
  // Edit questions
  const handleQuestionSubmit = async (data) => {};
  useEffect(() => {
    selectedQ && reset(selectedQ);
  }, [selectedQ]);
  //console.log(selectedQ, watch(`correct_answer[${1}]`))

  // Update Question

  // const handleQuestionUpdate = (data) => {
  //   const updatedQuestions = {};
  //   Object.values(importedQuestion).map((question, i) => {
  //     if (i === selectedQIndex - 1) {
  //       // When updating the question, increment the index by 1
  //       updatedQuestions[i + 1] = {
  //         ...question,
  //         question: data.question,
  //         order: i + 1,
  //       };
  //     } else {
  //       // When not updating the question, just keep the original order
  //       updatedQuestions[i + 1] = {
  //         ...question,
  //         order: question.order || i + 1,
  //       };
  //     }
  //   });

  //   setImportedQuestion(updatedQuestions);
  //   setTimeout(() => {
  //     closePopup();
  //   }, 1000);
  // };


  const handleQuestionUpdate = (data) => {
    const updatedQuestions = { ...importedQuestion };
  
    if (selectedQIndex in updatedQuestions) {
      updatedQuestions[selectedQIndex] = {
        ...updatedQuestions[selectedQIndex],
        question: data.question,
        choice: data.choice, // Update the choice property
        correct_answer: data.correct_answer, // Update the correct_answer property
        order: selectedQIndex,
      };
    }
  
    setImportedQuestion(updatedQuestions);
    setTimeout(() => {
      closePopup();
    }, 1000);
  };
  

  return (
    <>
      <Modal open={openEditQuestion} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 1024,
            height: "90%",
            overflowY: "scroll",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container>
            <Grid item xs={6}>
              <DialogTitle sx={{ pl: 0 }}>Edit Question</DialogTitle>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button onClick={handleClose}>
                <HighlightOffOutlinedIcon />
              </Button>
            </Grid>
          </Grid>

          <Fragment>
            <form onSubmit={handleSubmit(handleQuestionUpdate)}>
              <input type="hidden" name="created_by" defaultValue={CreatedBy} />
              <input
                type="hidden"
                name="currIndex"
                defaultValue={selectedQIndex}
              />
              <Box style={{ mt: 5, width: "100%", marginBottom: "16px" }}>
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
              </Box>

              <div className="add-file">
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFile}
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
                <span>{file ? file.name : "No file selected"}</span>
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
                    <Typography component="h4">True Or False</Typography>
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
                      {choice &&
                        choice.map((item, index) => (
                          <div key={index}>
                            <input
                              type="hidden"
                              name={`order[${index}]`}
                              value={item}
                            />
                            <FormControlLabel
                              control={
                                // <Checkbox
                                //   name={`correct_answer[${index}]`}
                                //   //checked={`correct_answer[${index}]` === "1"}
                                //   checked={
                                //     `correct_answer[${index}]` === 1
                                //       ? true
                                //       : false
                                //   }
                                //   control={control}
                                //   onChange={({ target: { checked } }) => {
                                //     setValue(
                                //       `correct_answer[${index}]`,
                                //       checked ? "1" : "0"
                                //     );
                                //   }}
                                //   className={`correct_answer[${index}]`}
                                //   value={`choice ${index}`}
                                // />
                                <Checkbox
                                  name={`correct_answer[${index}]`}
                                  checked={
                                    watch(`correct_answer[${index}]`) === 1
                                      ? true
                                      : false
                                  }
                                  onChange={({ target: { checked } }) => {
                                    setValue(
                                      `correct_answer[${index}]`,
                                      checked ? 1 : 0
                                    );
                                  }}
                                  className={`correct_answer[${index}]`}
                                  value={`choice ${index}`}
                                />
                              }
                              label={`Choice ${index + 1}`}
                            />

                            <Box
                              style={{ width: "100%", marginBottom: "16px" }}
                            >
                              <Editor
                                control
                                value={item}
                                name={`choice[${index}]`}
                                init={{
                                  height: 250,
                                }}
                                onEditorChange={(content, editor) => {
                                  setValue(`choice[${index}]`, content);
                                }}
                              />
                            </Box>
                            <FormHelperText error={Boolean(errorcheck)}>
                              {errorcheck}
                            </FormHelperText>
                          </div>
                        ))}
                      <Button
                        variant="outlined"
                        sx={{ width: "150px", mb: 5 }}
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
                  <Box style={{ width: "100%", mt: 3, marginBottom: "16px" }}>
                    <TextField
                      label="Search"
                      name="parent_id"
                      value={parent_id}
                      onChange={handleSearchChange}
                      style={{ width: "100%" }}
                    />
                  </Box>

                  <Box style={{ width: "100%", marginBottom: "16px" }}>
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
                        <Box
                          style={{ mt: 3, width: "100%", marginBottom: "16px" }}
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
                          <FormEditorField control={control} name="feedback" />
                        </Box>
                        <Box
                          style={{ mt: 3, width: "100%", marginBottom: "16px" }}
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
                        </Box>
                        <Box style={{ width: "100%", marginBottom: "16px" }}>
                          <FormTextField
                            control={control}
                            label="Marks"
                            defaultValue="1"
                            variant="outlined"
                            name="marks"
                            pattern="[A-Za-z]{1,}"
                            style={{ width: "100%" }}
                          />
                        </Box>
                        <Box style={{ width: "100%", marginBottom: "16px" }}>
                          <FormTextField
                            control={control}
                            label="Negative Marks"
                            variant="outlined"
                            defaultValue="0"
                            name="neg_marks"
                            pattern="[A-Za-z]{1,}"
                            style={{ width: "100%" }}
                          />
                        </Box>
                        <Box style={{ width: "100%", marginBottom: "16px" }}>
                          <FormTextField
                            control={control}
                            label="Time Duration (in seconds)"
                            variant="outlined"
                            name="time"
                            pattern="[A-Za-z]{1,}"
                            defaultValue="0"
                            style={{ width: "100%" }}
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </>
              ) : (
                ""
              )}

              <Button variant="contained" type="submit">
                Save Question
              </Button>
            </form>
          </Fragment>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateQuestion;
