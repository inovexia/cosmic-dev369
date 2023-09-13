import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Link,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { serialize } from "object-to-formdata";
import ReactHtmlParser from "react-html-parser";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import EditIcon from "@mui/icons-material/Edit";
import UpdateQuestion from "../../components/Test/updateQuestion";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const ImportQuestion = () => {
  const navigate = useNavigate();
  var myHeaders = new Headers();
  const { guid } = useParams();
  const {
    handleSubmit,
    setValue: setValueStep1,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userfile: undefined,
    },
  });
  const { userfile } = watch();

  // Modal Popup
  const [openEditQuestion, setOpenEditQuestion] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [questionDetails, setQuestionDetails] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const handleOpen = (q_id) => {
    setOpenEditQuestion(true);
    setSelectedQuestionId(q_id);
    setQuestionDetails(q_id);
  };

  // Upload file in question
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setValueStep1("userfile", selectedFile);
    setSelectedFile(selectedFile.name);
    setImportedQuestion(null)
  };
  // End Upload file

  // File imported
  const [importedQuestion, setImportedQuestion] = useState();
  const [isQuestionsSaved, setIsQuestionsSaved] = useState(null);
  const [testGuid, setTestGuid] = useState("");
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  // Save questions
  const handleFormSubmit = async (data) => {
    try {
      if (!importedQuestion) {
        const formData = serialize(data);
        formData.append("created_by", CreatedBy);
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formData,
          redirect: "follow",
        };
        const res = await fetch(
          `${BASE_URL}/tests/upload_questions/${guid}`,
          requestOptions
        );
        const saveResult = await res.json();
        if (saveResult.success === true) {
          const questionsAll = saveResult.payload[0];
          setImportedQuestion(questionsAll);
          reset(questionsAll);
        }
      } else {
        const formData = serialize({ questions: importedQuestion });
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formData,
          redirect: "follow",
        };
        const response = await fetch(
          `${BASE_URL}/tests/save_uploaded_questions/${guid}`,
          requestOptions
        );
        const result = await response.json();
        setIsQuestionsSaved(true);
        setTimeout(() => {
          navigate(`/test/manage/${guid}`);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  const sampleFileUrl = "/path/to/sample/file.txt";
  const [selectedQ, setSelectedQ] = useState(undefined);

  const Question = ({ allQues, qData, questionNumber, q_id }) => {
    const { question, parent_id, choice, question_type, correct_answer } =
      qData;
    // Render parent question or child question
    if (parent_id === 0 && question_type === "comp") {
      // Render parent directions
      return (
        <Box className="parent-q">
          <strong>{ReactHtmlParser(question)}</strong>
          <Button
            onClick={() => {
              handleOpen(q_id);
              setSelectedQ(allQues && Object.values(allQues)[q_id - 1]);
            }}
          >
            <EditIcon />
          </Button>
        </Box>
      );
    } else {
      // Render child question
      return (
        <Box className="child-q" sx={{ mb: 3, mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
            {questionNumber}. {ReactHtmlParser(question)}
            <Button
              onClick={() => {
                handleOpen(q_id);
                setSelectedQ(allQues && Object.values(allQues)[q_id - 1]);
              }}
            >
              <EditIcon />
            </Button>
          </Box>

          <ol
            style={{
              listStyleType: "lower-alpha",
              paddingLeft: "20px",
              marginTop: "10px",
            }}
          >
            {choice &&
              choice.map((item, i) => (
                <li
                  style={{ color: correct_answer[i] === 1 ? "#A6CD4E" : "" }}
                  key={i}
                >
                  {ReactHtmlParser(item)}
                </li>
              ))}
          </ol>
        </Box>
      );
    }
  };
  //const [questionData, setQuestionData] = useState("")
  const QuestionList = ({ questionData }) => {
    let childQuestionCounter = 0;

    return (
      <Box>
        {questionData &&
          Object.values(questionData).map((qData, index) => {
            if (qData.parent_id === 0 && qData.question_type === "comp") {
              // Render parent directions
              return (
                <Question
                  key={index}
                  allQues={questionData}
                  q_id={index + 1}
                  qData={qData}
                />
              );
            } else {
              // Increment child question counter and render child question
              childQuestionCounter++;
              return (
                <Question
                  key={index}
                  q_id={index + 1}
                  qData={qData}
                  allQues={questionData}
                  questionNumber={`Q${childQuestionCounter}`}
                />
              );
            }
          })}
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Import Question
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained">
                <Link
                  href={`/test/manage/${guid}`}
                  color="inherit"
                  underline="none"
                >
                  Cancel
                </Link>
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Snackbar
              open={isQuestionsSaved}
              autoHideDuration={3000}
              onClose={() => setIsQuestionsSaved(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity={isQuestionsSaved === true ? "success" : "warning"}
              >
                {isQuestionsSaved === true
                  ? "Question added Successfully"
                  : "Question not saved"}
              </Alert>
            </Snackbar>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input
                  name="userfile"
                  onChange={handleFileChange}
                  type="file"
                  id="file-upload"
                  hidden
                  //helperText={errors.userfile && "File is required"}
                />
                <label
                  htmlFor="file-upload"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FileUploadIcon
                    sx={{
                      color: "#EAC43D",
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                  />
                  Import File
                </label>
                <Box sx={{ mt: 1 }}>
                  {selectedFile ? selectedFile : "No file selected"}
                </Box>
                <Box
                  sx={{
                    minWidth: "150px",
                    mt: 5,
                  }}
                >
                  <Grid container spacing={2}>
                    {importedQuestion &&
                    Object.values(importedQuestion).length > 0 ? (
                      <Grid item>
                        <Button variant="contained" type="submit">
                          Save Questions
                        </Button>
                      </Grid>
                    ) : (
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          sx={{
                            pointerEvents:
                              selectedFile !== null ? "auto" : "none",
                            opacity: selectedFile !== null ? "1" : "0.5",
                          }}
                        >
                          Upload & Preview
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Link href={sampleFileUrl} download="mySampleFile.txt">
                    Download Sample File
                  </Link>
                </Box>
              </form>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item>
              <QuestionList questionData={importedQuestion} />
            </Grid>
          </Grid>
        </Box>
      </Box>

      <UpdateQuestion
        openEditQuestion={selectedQ !== undefined}
        closePopup={() => {
          setSelectedQ(undefined);
        }}
        setOpenEditQuestion={setOpenEditQuestion}
        questionDetails={questionDetails}
        importedQuestion={importedQuestion}
        setImportedQuestion={setImportedQuestion}
        selectedQ={selectedQ}
        selectedQIndex={questionDetails}
      />
    </>
  );
};

export default ImportQuestion;
