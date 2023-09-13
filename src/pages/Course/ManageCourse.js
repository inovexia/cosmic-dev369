import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ReactHtmlParser from "html-react-parser";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  FormControl,
  Divider,
  Link,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Alert,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Helmet } from "react-helmet";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ClassIcon from "@mui/icons-material/Class";
import QuizIcon from "@mui/icons-material/Quiz";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { tooltipClasses } from "@mui/material/Tooltip";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const ManageCourse = () => {
  const { courseGuid } = useParams();
  const [questions, setQuestions] = useState([]);
  // Authorization Setup
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Get current course details
  const [currentCourse, setCurrentCourse] = useState("");
  const [courseStatus, setCourseStatus] = useState("0");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourse = async () => {
      const requestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const res = await fetch(
        `${BASE_URL}/course/view/${courseGuid}`,
        requestOption
      );
      const result = await res.json();
      setCurrentCourse(result && result.payload);
      setLoading(false);
      //console.log(testresult.payload.status);
      setCourseStatus(result && result.payload.status);
    };
    fetchCourse();
  }, []);
  // Get current test details
  const [test, setTest] = useState([]);
  const [testStatus, setTestStatus] = useState("0");
  useEffect(() => {
    const fetchTest = async () => {
      const requestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const res = await fetch(
        `${BASE_URL}/tests/view/${courseGuid}`,
        requestOption
      );
      const testresult = await res.json();
      setTest(testresult && testresult.payload);
      setTestStatus(testresult.payload && testresult.payload.status);
    };
    fetchTest();
  }, []);

  // Publish And Unpublish

  // Total Marks
  const totalMarks = questions.reduce((acc, curr) => {
    return acc + parseInt(curr.marks);
  }, 0);

  const postStatus = async (newStatus) => {
    const formdata = new FormData();
    formdata.append("status", newStatus);
    formdata.append("updated_by", CreatedBy);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/status/${courseGuid}`,
        requestOptions
      );
      const statusResult = await res.json();
      //console.log(statusResult);
      if (statusResult.success === true) {
        setIsTestPublished(statusResult.success);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };
  // Delete test
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTestId, setselectedTestId] = useState("");
  const handleDeleteConfirmOpen = (courseId) => {
    setselectedTestId(courseId);
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setselectedTestId("");
  };

  const navigate = useNavigate();
  const [courseDeleted, setCourseDeleted] = useState(null);
  const handleDeletetest = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/delete/${courseGuid}`,
        requestOptions
      );
      const statusResult = await res.json();
      //console.log(statusResult);
      if (statusResult.success === true) {
        setCourseDeleted(statusResult.success);
      }
      setDeleteConfirmOpen(false);
      setTimeout(() => {
        navigate(`/course/list`);
      }, 2000);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Snackbar
  const [isTestPublished, setIsTestPublished] = useState(null);

  return (
    <>
      <Helmet>
        <title>Manage Course</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {loading ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
              </Box>
            </Grid>
          </Grid>
        ) : (
          currentCourse && (
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Grid container sx={{ mt: 3 }}>
                <Grid item sx={{ mt: 0, width: "100%" }} alignItems="center">
                  <Grid item xs={12}>
                    <Snackbar
                      open={isTestPublished}
                      autoHideDuration={3000}
                      onClose={() => setIsTestPublished(false)}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <Alert
                        severity={
                          currentCourse.status === "1" ? "success" : "warning"
                        }
                      >
                        {currentCourse.status === "1"
                          ? "Course Published"
                          : "Course Unpublished"}
                      </Alert>
                    </Snackbar>
                    <Snackbar
                      open={courseDeleted}
                      autoHideDuration={3000}
                      onClose={() => setCourseDeleted(false)}
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <Alert severity="success">
                        Course deleted successfully
                      </Alert>
                    </Snackbar>
                  </Grid>
                  <Grid item xs={12}>
                    <Dialog
                      open={deleteConfirmOpen}
                      onClose={handleDeleteConfirmClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Confirm Delete"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to delete this course?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleDeleteConfirmClose}
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleDeletetest(selectedTestId)}
                          color="primary"
                          autoFocus
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h4">{currentCourse.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    {ReactHtmlParser(currentCourse.description)}
                  </Typography>
                </Grid>
                {/* Lessons */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 4, height:"100%" }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Subjects
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/subjects`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <PlayLessonIcon />
                            </ListItemIcon>
                            <ListItemText>All Subjects</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/subject/create`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <ControlPointIcon />
                            </ListItemIcon>
                            <ListItemText>Create New Subject</ListItemText>
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Grid>
                {/* Tests */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 4 }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Tests
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/test/add`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <FormatListNumberedIcon />
                            </ListItemIcon>
                            <ListItemText>Add Existing Test</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/test/create`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <ControlPointIcon />
                            </ListItemIcon>
                            <ListItemText>Create New Test</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/test/list`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <QuizIcon />
                            </ListItemIcon>
                            <ListItemText>All Course Tests</ListItemText>
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Grid>
                {/* Meetings */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 4 }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Classes
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/class/add`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <ClassIcon />
                            </ListItemIcon>
                            <ListItemText>Add Existing Classes</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/class/create`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <ControlPointIcon />
                            </ListItemIcon>
                            <ListItemText>Create New Class</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/class/list`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <ListAltIcon />
                            </ListItemIcon>
                            <ListItemText>All Classes</ListItemText>
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Grid>
                {/* Settings */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 4 }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Setting
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0, pt: 0 }}>
                          <Switch
                            checked={currentCourse.status === "1"}
                            onChange={() => {
                              const newStatus =
                                currentCourse.status === "0" ? "1" : "0";
                              setCurrentCourse({
                                ...currentCourse,
                                status: newStatus,
                              });
                              postStatus(newStatus);
                            }}
                            name="status"
                            color="primary"
                          />
                          <ListItemText
                            onClick={() => {
                              const newStatus =
                                currentCourse.status === "0" ? "1" : "0";
                              setCurrentCourse({
                                ...currentCourse,
                                status: newStatus,
                              });
                              postStatus(newStatus);
                            }}
                            id="publish-unpublish"
                            primary="Publish"
                            sx={{ pl: 3, m: 0, cursor: "pointer" }}
                          />
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/update/${courseGuid}`}
                            color="inherit"
                            underline="none"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pointerEvents:
                                currentCourse && currentCourse.status === "1"
                                  ? "none"
                                  : "auto",
                              opacity:
                                currentCourse && currentCourse.status === "1"
                                  ? "0.5"
                                  : "1",
                            }}
                          >
                            <ListItemIcon>
                              <EditIcon />
                            </ListItemIcon>
                            <ListItemText>Edit Course</ListItemText>
                          </Link>
                          <HtmlTooltip
                            className="dashboard-tooltip"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Edit feature will enable when course
                                  unpublished.
                                </Typography>
                              </React.Fragment>
                            }
                            placement="right-start"
                          >
                            <InfoOutlinedIcon
                              sx={{ color: "#B8B8B8", ml: 2, mb: 1 }}
                            />
                          </HtmlTooltip>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Box
                            onClick={() => handleDeleteConfirmOpen(courseGuid)}
                            sx={{
                              pl: 0,
                              cursor: "pointer",
                              width: "auto",
                              display: "inline-flex",
                              justifyContent: "flex-start",
                              pl: 0,
                              cursor: "pointer",
                              pointerEvents:
                                currentCourse && currentCourse.status === "1"
                                  ? "none"
                                  : "auto",
                              opacity:
                                currentCourse && currentCourse.status === "1"
                                  ? "0.5"
                                  : "1",
                            }}
                          >
                            <ListItemIcon>
                              <ArchiveOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText>Archive Course</ListItemText>
                          </Box>

                          <HtmlTooltip
                            className="dashboard-tooltip"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Archive feature will enable when course
                                  unpublished.
                                </Typography>
                              </React.Fragment>
                            }
                            placement="right-start"
                          >
                            <InfoOutlinedIcon
                              sx={{ color: "#B8B8B8", ml: 2, mb: 1 }}
                            />
                          </HtmlTooltip>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Grid>
                {/* Enrollments */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 4, mt: 3 }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Enrollments
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/course/${courseGuid}/enrolled-users`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText>All Enrolled Users</ListItemText>
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )
        )}
      </Box>
    </>
  );
};
export default ManageCourse;
