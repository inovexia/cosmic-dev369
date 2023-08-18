import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Box,
  Alert,
  TextField,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Link,
  CircularProgress,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar,
  Card,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { serialize } from "object-to-formdata";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Helmet } from "react-helmet";
import theme from "../../../configs/theme";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { styled } from "@mui/material/styles";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

const EditIcon = styled(EditRoundedIcon)(({ theme }) => ({
  color: theme.palette.warning.main, // Replace 'primary' with the desired theme color
}));
const DeleteIcon = styled(DeleteRoundedIcon)(({ theme }) => ({
  color: theme.palette.danger.main, // Replace 'primary' with the desired theme color
}));

const Test = () => {
  const currentDate = new Date(); // Get the current date and time
  const { courseGuid } = useParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: "",
      end_date: "",
    },
  });
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const [tests, setTests] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

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

  // Fetch Test list of this course
  useEffect(() => {
    const fetchTests = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${BASE_URL}/course/get_tests/${courseGuid}`,
          requestOptions
        );
        const result = await response.json();
        setTests(result.payload.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Search Tests
  const filteredTests =
    tests &&
    tests.filter((test) => {
      const fullName = `${test.title} ${test.details}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();
      return fullName.includes(searchValue);
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10);
  const lastIndex = currentPage * testsPerPage;
  const firstIndex = lastIndex - testsPerPage;
  const currentTests = filteredTests.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredTests && filteredTests.length / testsPerPage
  );
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  }

  // Bulk selection feature
  const [selectedTests, setselectedTests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleTestSelect = (testId) => {
    if (selectedTests.includes(testId)) {
      setselectedTests(selectedTests.filter((guid) => guid !== testId));
    } else {
      setselectedTests([...selectedTests, testId]);
    }
  };

  const handleSelectAllTests = () => {
    if (!selectAll) {
      const allTestIds = filteredTests.map((test) => test.guid);
      setselectedTests(allTestIds);
    } else {
      setselectedTests([]);
    }
    setSelectAll(!selectAll);
  };

  // Bulk Actions
  const [selectedAction, setSelectedAction] = useState(null);
  function handleActionChange(event) {
    setSelectedAction(event.target.value);
  }
  const handleConfirmOpen = () => {
    setIsConfirmOpen(true);
  };
  const actionConfirmClose = () => {
    setIsConfirmOpen(false);
  };

  // Remove Test bulk
  const handleRemoveTest = async () => {
    const formData = serialize();
    selectedTests.forEach((value, index) => {
      formData.append(`tests[${index}]`, value);
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/remove_tests/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "Test removed Successfully");
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        showSnackbar(
          "warning",
          "Test removed failed, Atleast 1 item should be selected!"
        );
        setTimeout(() => {}, 3000);
      }
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Remove delete bulk
  const handleDeleteTest = async () => {
    const formData = serialize();
    selectedTests.forEach((value, index) => {
      formData.append(`tests[${index}]`, value);
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/delete_tests/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "Test deleted Successfully");
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        showSnackbar(
          "warning",
          "Test deleted failed, Atleast 1 item should be selected!"
        );
        setTimeout(() => {}, 3000);
      }
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // Change Date Test bulk
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleChangeDate = async (data) => {
    const formattedStartDate = dayjs(data.start_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndDate = dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss");
    // Create formData and append the formatted date values
    const formData = new FormData();
    selectedTests.forEach((value, index) => {
      formData.append(`tests[${index}][guid]`, value);
      formData.append(`tests[${index}][start_date]`, formattedStartDate);
      formData.append(`tests[${index}][end_date]`, formattedEndDate);
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/test_dates/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setSnackbarSuccess(result.success);
      if (result.success === true) {
        showSnackbar("success", "Date changed Successfully");
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        showSnackbar(
          "warning",
          "Date changed failed, Atleast 1 item should be selected!"
        );
        setTimeout(() => {}, 3000);
      }
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };
  return (
    <>
      <Helmet>
        <title>All Tests</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {/* Bulk Delete Confirmation popup */}

        <Dialog
          open={isConfirmOpen}
          onClose={actionConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
          <DialogContent>
            {selectedAction && selectedAction === "remove" ? (
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to remove selected tests?
              </DialogContentText>
            ) : selectedAction && selectedAction === "delete" ? (
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete selected tests?
              </DialogContentText>
            ) : (
              <form onSubmit={handleSubmit(handleChangeDate)}>
                <Grid container spacing={2} sx={{ py: 3 }}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="start_date"
                        control={control}
                        defaultValue={dayjs()} // Set default value to current date and time
                        rules={{ required: "Start date is required" }}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="Start Date"
                            fullWidth
                            showTodayButton
                            error={!!errors.start_date}
                            helperText={errors.start_date?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="end_date"
                        control={control}
                        defaultValue={dayjs()} // Set default value to current date and time
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="End Date"
                            fullWidth
                            showTodayButton
                            error={!!errors.end_date}
                            helperText={errors.end_date?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      onClick={actionConfirmClose}
                      variant="outlined"
                      className="custom-button"
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "right" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      className="custom-button"
                      color="primary"
                      autoFocus
                    >
                      Change
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </DialogContent>
          <DialogActions>
            {selectedAction && selectedAction === "changeDate" ? (
              ""
            ) : (
              <Button onClick={actionConfirmClose} color="primary">
                Cancel
              </Button>
            )}

            {selectedAction && selectedAction === "delete" ? (
              <Button onClick={handleDeleteTest} color="primary" autoFocus>
                Confirm
              </Button>
            ) : selectedAction && selectedAction === "remove" ? (
              <Button onClick={handleRemoveTest} color="primary" autoFocus>
                Confirm
              </Button>
            ) : (
              ""
            )}
          </DialogActions>
        </Dialog>
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

        <Box sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Tests
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: { xs: "flex", md: "block" },
                justifyContent: { xs: "space-between" },
                textAlign: { md: "right" },
              }}
            >
              <Button
                variant="contained"
                component={Link}
                className="custom-button"
                href={`/course/manage/${courseGuid}`}
                sx={{mr:1}}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                component={Link}
                className="custom-button"
                href={`/course/${courseGuid}/test/add`}
              >
                Add Existing
              </Button>
              <Button
                component={Link}
                href={`/course/${courseGuid}/test/create`}
                variant="outlined"
                sx={{ ml: 1 }}
                className="custom-button"
              >
                Create New
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by First Name or Last Name"
                placeholder="Search by First Name or Last Name"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {currentTests && currentTests.length !== 0 ? (
                <>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      my: 3,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Grid item xs={12} md={2}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="type-select-label">Action</InputLabel>
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              labelId="type-select-label"
                              id="type-select"
                              label="Action"
                              onChange={handleActionChange}
                              defaultValue=""
                            >
                              <MenuItem
                                value="changeDate"
                                onClick={handleConfirmOpen}
                              >
                                Change Date
                              </MenuItem>
                              <MenuItem
                                value="remove"
                                onClick={handleConfirmOpen}
                              >
                                Remove
                              </MenuItem>
                              <MenuItem
                                value="delete"
                                onClick={handleConfirmOpen}
                              >
                                Delete
                              </MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className="manage-course">
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: "0px" }}>
                        <Box sx={{ px: 3 }}>
                          <Grid
                            container
                            sx={{
                              borderBottom: "1px solid #B8B8B8",
                              py: 2,
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              md={0.5}
                              sx={{
                                display: { xs: "flex", md: "flex" },
                                justifyContent: { xs: "start" },
                                alignItems: { xs: "center" },
                              }}
                            >
                              <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAllTests}
                                indeterminate={
                                  selectedTests.length > 0 &&
                                  selectedTests.length < filteredTests.length
                                }
                              />
                              <Box
                                sx={{ display: { xs: "block", md: "none" } }}
                              >
                                Select All
                              </Box>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={3.5}
                              sx={{ display: { xs: "none", md: "block" } }}
                            >
                              <b>Name</b>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={3}
                              sx={{ display: { xs: "none", md: "block" } }}
                            >
                              <Box>
                                <b>Start Date</b>
                              </Box>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={3}
                              sx={{ display: { xs: "none", md: "block" } }}
                            >
                              <Box>
                                <b>End Date</b>
                              </Box>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={2}
                              sx={{ display: { xs: "none", md: "block" } }}
                            >
                              <b>Action</b>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                  {currentTests &&
                    currentTests.map((test, index) => {
                      const parsedStartDate = dayjs(test.start_date);
                      const sDate = parsedStartDate.format(
                        "DD-MM-YYYY HH:mm:ss"
                      );
                      const parsedEndDate = dayjs(test.end_date);
                      const eDate = parsedEndDate.format("DD-MM-YYYY HH:mm:ss");
                      return (
                        <Grid
                          container
                          spacing={2}
                          key={index}
                          className="manage-course"
                        >
                          <Grid item xs={12}>
                            <Card sx={{ borderRadius: "0px" }}>
                              <Box sx={{ px: 3 }}>
                                <Grid
                                  container
                                  sx={{
                                    borderBottom: "1px solid #B8B8B8",
                                    py: 2,
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    md={0.5}
                                    sx={{
                                      display: { xs: "flex", md: "flex" },
                                      justifyContent: { xs: "start" },
                                      alignItems: { xs: "center" },
                                    }}
                                  >
                                    <Checkbox
                                      checked={selectedTests.includes(
                                        test.guid
                                      )}
                                      onChange={() =>
                                        handleTestSelect(test.guid)
                                      }
                                    />
                                    <Box
                                      sx={{
                                        display: { xs: "block", md: "none" },
                                      }}
                                    >
                                      <h3>
                                        <Link
                                          href={`/test/manage/${test.guid}?ci=${courseGuid}`}
                                          sx={{
                                            textDecoration: "none",
                                            color: "inherit",
                                          }}
                                        >
                                          {test.title}
                                        </Link>
                                      </h3>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={3.5}>
                                    <Box
                                      sx={{
                                        display: { xs: "none", md: "block" },
                                      }}
                                    >
                                      <h3>
                                        <Link
                                          href={`/test/manage/${test.guid}?ci=${courseGuid}`}
                                          sx={{
                                            textDecoration: "none",
                                            color: "inherit",
                                          }}
                                        >
                                          {test.title}
                                        </Link>
                                      </h3>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <Box>{sDate}</Box>
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <Box>{eDate}</Box>
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <Grid item>
                                      <Box className="action-btn">
                                        <Button
                                          component={Link}
                                          href={`/test/take-test/${test.guid}`}
                                          color="primary"
                                          sx={{
                                            fontSize: 16,
                                            fontWeight: 500,
                                            fontFamily: "Arial",
                                          }}
                                        >
                                          <PlayCircleFilledIcon />
                                        </Button>
                                        <Button
                                          component={Link}
                                          href={`/test/edit/${test.guid}?mt=${courseGuid}`}
                                          color="warning"
                                          sx={{
                                            fontSize: 16,
                                            fontWeight: 500,
                                            fontFamily: "Arial",
                                          }}
                                        >
                                          <EditIcon />
                                          Edit
                                        </Button>
                                        {/* <Button
                                          onClick={() =>
                                            handleConfirmOpen (test.guid)
                                          }
                                          color="danger"
                                          sx={{
                                            fontSize: 16,
                                            fontWeight: 500,
                                            fontFamily: "Arial",
                                          }}
                                        >
                                          <DeleteIcon />
                                          Delete
                                        </Button> */}
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      );
                    })}

                  {filteredTests && filteredTests.length > testsPerPage ? (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          marginTop: "30px",
                        }}
                      >
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                          className="pagination-button"
                        >
                          <Button
                            onClick={prePage}
                            disabled={currentPage === 1}
                          >
                            PREV
                          </Button>
                          {numbers.map((n, i) => (
                            <Button
                              className={currentPage === n ? "active" : ""}
                              key={i}
                              onClick={() => changeCPage(n)}
                              style={{
                                backgroundColor:
                                  currentPage === n ? primaryColor : "",
                              }}
                            >
                              {n}
                            </Button>
                          ))}
                          <Button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                          >
                            NEXT
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <Alert sx={{ mt: 5 }} severity="error">
                  Test not found!
                </Alert>
              )}
            </>
          )}
          <Grid container spacing={2}></Grid>
        </Box>
      </Box>
    </>
  );
};

export default Test;
