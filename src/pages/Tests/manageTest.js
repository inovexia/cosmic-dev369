import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  FormControl,
  Divider,
  Link,
  Tooltip,
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
} from "@mui/material";
import { Helmet } from "react-helmet";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { tooltipClasses } from "@mui/material/Tooltip";
import CreatedBy from "../../Utils/createdBy";

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

const ManageTest = () => {
  // Query Parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryValue = params.get("ci");
  const { guid } = useParams();
  const [questions, setQuestions] = useState([]);
  // Authorization Setup
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Get current test details
  const [alertOpen, setAlertOpen] = useState(null);
  const [alertValue, setAlertValue] = useState(null);
  const [test, setTest] = useState([]);
  const [testStatus, setTestStatus] = useState("0");
  useEffect(() => {
    const fetchTest = async () => {
      const requestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const res = await fetch(`${BASE_URL}/tests/view/${guid}`, requestOption);
      const testresult = await res.json();
      setTest(testresult && testresult.payload);
      //console.log(testresult.payload.status);
      setTestStatus(testresult && testresult.payload.status);
    };
    fetchTest();
  }, []);

  // Publish And Unpublish

  // Get my attepmts
  const [myAttempts, setMyAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      var formdata = new FormData();
      formdata.append("user_guid", CreatedBy);
      const requestOption = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      const res = await fetch(
        `${BASE_URL}/tests/attempts/${guid}`,
        requestOption
      );
      const result = await res.json();
      setMyAttempts(result && result.payload);
    };
    fetchAttempts();
  }, []);

  // Total Marks
  const totalMarks = questions.reduce((acc, curr) => {
    return acc + parseInt(curr.marks);
  }, 0);

  const postStatus = async (newStatus) => {
    const formdata = new FormData();
    formdata.append("status", newStatus);
    formdata.append("updated_by", "CA000017");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/tests/status/${guid}`,
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
  const handleDeleteConfirmOpen = (testId) => {
    setselectedTestId(testId);
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setselectedTestId("");
  };

  const navigate = useNavigate();
  const [testDeleted, setTestDeleted] = useState(null);
  const handleDeletetest = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/tests/delete/${guid}`,
        requestOptions
      );
      const statusResult = await res.json();
      //console.log(statusResult);
      setAlertOpen(true);
      if (statusResult.success === true) {
        setTestDeleted(statusResult.success);
        setAlertValue("Test deleted successfully");
      }
      setDeleteConfirmOpen(false);
      setTimeout(() => {
        navigate(`/test/list`);
      }, 1000);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Snackbar
  const [isTestPublished, setIsTestPublished] = useState(null);
  const AllMinutes = test.settings && test.settings.test_duration;
  // function formatTime(seconds) {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;
  //   const formattedHours = hours.toString().padStart(2, "0");
  //   const formattedMinutes = minutes.toString().padStart(2, "0");
  //   const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  //   return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  // }

  function formatDurationToHHMMSS(minutes) {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const minutesFormatted = (minutes % 60).toString().padStart(2, "0");
    const seconds = "00";
    return `${hours}:${minutesFormatted}:${seconds}`;
  }
  const formattedTime = formatDurationToHHMMSS(AllMinutes);
  return (
    <>
      <Helmet>
        <title>Manage Test</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {test && (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container sx={{ mt: 3 }}>
              <Grid item xs={6}>
                <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                  Manage ({test.title})
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                {queryValue && queryValue ? (
                  <Button
                    variant="contained"
                    className="custom-button"
                    component={Link}
                    href={`/course/${queryValue}/test/list`}
                  >
                    Back
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className="custom-button"
                    component={Link}
                    href={`/test/list`}
                  >
                    Back
                  </Button>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  component="h5"
                  variant="h5"
                  sx={{ fontSize: "18px" }}
                >
                  <strong>Test Duration:</strong> {formattedTime} HH:MM:SS
                </Typography>
              </Grid>
              <Grid item sx={{ mt: 0, width: "100%" }} alignItems="center">
                <Grid item xs={12}>
                  <Snackbar
                    open={alertOpen}
                    autoHideDuration={3000}
                    onClose={() => setAlertOpen(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert
                      severity={testDeleted === true ? "success" : "warning"}
                    >
                      {testDeleted === true
                        ? alertValue
                        : "Someting went wrong"}
                    </Alert>
                  </Snackbar>
                  <Snackbar
                    open={isTestPublished}
                    autoHideDuration={3000}
                    onClose={() => setIsTestPublished(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert
                      severity={test.status === "1" ? "success" : "warning"}
                    >
                      {test.status === "1"
                        ? "Test Published"
                        : "Test Unpublished"}
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
                        Are you sure you want to delete this test?
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
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 4, backgroundColor: "#14C0CC" }}>
                  <Typography
                    variant="span"
                    style={{
                      fontSize: "40px",
                      lineHeight: "45px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {test.stats && test.stats.questions}
                  </Typography>
                  <Box
                    variant="p"
                    sx={{
                      minWidth: "100%",
                      fontSize: "16px",
                      color: "#ffffff",
                    }}
                  >
                    Total Questions
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 4, backgroundColor: "#EAC43D" }}>
                  <Typography
                    variant="span"
                    style={{
                      fontSize: "40px",
                      lineHeight: "45px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {test.stats && test.stats.marks}
                  </Typography>
                  <Box
                    variant="p"
                    sx={{
                      minWidth: "100%",
                      fontSize: "16px",
                      color: "#ffffff",
                    }}
                  >
                    Total Marks
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 4, backgroundColor: "#A6CD4E" }}>
                  <Typography
                    variant="span"
                    style={{
                      fontSize: "40px",
                      lineHeight: "45px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {test.stats && test.stats.submissions}
                  </Typography>
                  <Box
                    variant="p"
                    sx={{
                      minWidth: "100%",
                      fontSize: "16px",
                      color: "#ffffff",
                    }}
                  >
                    Submissions
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 4, backgroundColor: "#2A5C99" }}>
                  <Typography
                    variant="span"
                    style={{
                      fontSize: "40px",
                      lineHeight: "45px",
                      fontWeight: "700",
                      color: "#ffffff",
                    }}
                  >
                    {test.settings && test.settings.num_attempts === 0
                      ? "No limit"
                      : test.settings && test.settings.num_attempts}
                  </Typography>
                  <Box
                    variant="p"
                    sx={{
                      minWidth: "100%",
                      fontSize: "16px",
                      color: "#ffffff",
                    }}
                  >
                    Attempts
                  </Box>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 5 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: "100%" }}>
                  <Card sx={{ p: 4, height: "100%" }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Questions
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/all-questions/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <FormatListNumberedIcon />
                            </ListItemIcon>
                            <ListItemText>All Questions</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/add-question/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <ControlPointIcon />
                            </ListItemIcon>
                            <ListItemText>Add Question</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/preview-test/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <VisibilityIcon />
                            </ListItemIcon>
                            <ListItemText>Preview Test</ListItemText>
                          </Link>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/import-question/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <SimCardDownloadIcon />
                            </ListItemIcon>
                            <ListItemText>Import Question</ListItemText>
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: "100%" }}>
                  <Card sx={{ p: 4, height: "100%" }}>
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
                        <ListItem sx={{ pl: 0 }}>
                          <Switch
                            checked={test.status === "1"}
                            disabled={
                              test.stats && test.stats.questions !== 0
                                ? false
                                : true
                            }
                            onChange={() => {
                              const newStatus = test.status === "0" ? "1" : "0";
                              setTest({ ...test, status: newStatus });
                              postStatus(newStatus);
                            }}
                            name="status"
                            color="primary"
                          />
                          <Box
                            sx={{ display: "flex", justifyContent: "start" }}
                          >
                            <ListItemText
                              id="publish-unpublish"
                              primary="Publish"
                              sx={{ pl: 3 }}
                            />
                            <HtmlTooltip
                              className="dashboard-tooltip"
                              title={
                                <React.Fragment>
                                  <Typography color="inherit">
                                    There should be minimum 1 question for
                                    publish this test.
                                  </Typography>
                                </React.Fragment>
                              }
                              placement="right-start"
                            >
                              <InfoOutlinedIcon
                                sx={{ color: "#B8B8B8", ml: 2, mb: 1 }}
                              />
                            </HtmlTooltip>
                          </Box>
                        </ListItem>
                        <Divider variant="" component="li" />
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/take-test/${guid}`}
                            target="_blank"
                            color="inherit"
                            underline="none"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pointerEvents:
                                (test.settings &&
                                  test.settings.num_attempts < 0) ||
                                (myAttempts && myAttempts.remaining <= 0)
                                  ? "none"
                                  : "auto",
                              opacity:
                                (test.settings &&
                                  test.settings.num_attempts < 0) ||
                                (myAttempts && myAttempts.remaining <= 0)
                                  ? "0.5"
                                  : "1",
                            }}
                          >
                            <ListItemIcon>
                              <VisibilityIcon />
                            </ListItemIcon>
                            <ListItemText>Take Test</ListItemText>
                          </Link>
                          <HtmlTooltip
                            className="dashboard-tooltip"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  You can take test if test published, and your
                                  attempts remaining
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
                          <Link
                            href={`/test/edit/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pointerEvents:
                                test && test.status === "1" ? "none" : "auto",
                              opacity:
                                test && test.status === "1" ? "0.5" : "1",
                            }}
                          >
                            <ListItemIcon>
                              <EditIcon />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                          </Link>
                          <HtmlTooltip
                            className="dashboard-tooltip"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Edit feature will enable when test
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
                          <Link
                            href={`/test/setting/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pointerEvents:
                                test && test.status === "1" ? "none" : "auto",
                              opacity:
                                test && test.status === "1" ? "0.5" : "1",
                            }}
                          >
                            <ListItemIcon>
                              <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                          </Link>
                          <HtmlTooltip
                            className="dashboard-tooltip"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Settings feature will enable when test
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
                        <ListItem
                          sx={{
                            width: "auto",
                            display: "inline-flex",
                            justifyContent: "flex-start",
                            pl: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: "auto",
                              display: "inline-flex",
                              justifyContent: "flex-start",
                              pl: 0,
                              cursor: "pointer",
                              pointerEvents:
                                test && test.status === "1" ? "none" : "auto",
                              opacity:
                                test && test.status === "1" ? "0.5" : "1",
                            }}
                            onClick={() => handleDeleteConfirmOpen(test.guid)}
                          >
                            <ListItemIcon>
                              <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                          </Box>
                          <HtmlTooltip
                            className="dashboard-tooltip"
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Delete feature will enable when test
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
                </Box>
              </Grid>
              {test &&
              test.type !== "practice" &&
              test &&
              test.type !== "quiz" ? (
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: "100%" }}>
                    <Card sx={{ p: 4, height: "100%" }}>
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
                              href={`/test/enrollments/${guid}`}
                              color="inherit"
                              underline="none"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <ListItemIcon>
                                <CheckCircleIcon />
                              </ListItemIcon>
                              <ListItemText>All Enrollments</ListItemText>
                            </Link>
                          </ListItem>
                        </List>
                      </Box>
                    </Card>
                  </Box>
                </Grid>
              ) : (
                ""
              )}

              <Grid item xs={12} md={6}>
                <Box sx={{ height: "100%" }}>
                  <Card sx={{ p: 4, height: "100%" }}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "24px",
                        lineHeight: "34px",
                        fontWeight: "500",
                      }}
                    >
                      Submissions
                    </Typography>
                    <Box>
                      <List>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/report/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText>My Submission Report</ListItemText>
                          </Link>
                        </ListItem>
                        <ListItem sx={{ pl: 0 }}>
                          <Link
                            href={`/test/all-submissions/${guid}`}
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemIcon>
                              <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText>All Submission</ListItemText>
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};
export default ManageTest;
