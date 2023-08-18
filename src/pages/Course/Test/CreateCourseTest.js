import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { serialize } from "object-to-formdata";
import FormTextField from "../../../components/Common/formTextField";
import FormEditorField from "../../../components/Common/formEditorField";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import CurrentUser from "../../../Utils/CurrentUserGuid";

// Date Time picker
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import CreatedBy from "../../../Utils/createdBy";

const CreateCourseTest = () => {
  const { courseGuid } = useParams();
  const [alertOpen, setAlertOpen] = useState(null);
  const [isTestCreated, setIsTestCreated] = useState(null);
  const [testGuid, setTestGuid] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      details: "",
      type: "evaluated",
      start_date: "",
      end_date: "",
      created_by: CurrentUser,
    },
  });

  // Authentication
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const formData = new FormData();

  // States
  const [errorValue, setErrorValue] = useState(null);
  const handleFormSubmit = async (data) => {
    //const formData = serialize(data);
    const formattedStartDate = dayjs(data.start_date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndDate = dayjs(data.end_date).format("YYYY-MM-DD HH:mm:ss");
    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("details", data.details);
    formData.append("created_by", CreatedBy);
    formData.append("start_date", formattedStartDate);
    formData.append("end_date", formattedEndDate);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/course/create_test/${courseGuid}`,
        requestOptions
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        setErrorValue("Test created successfully, please add questions in this test.")
        setIsTestCreated(true);
        setTimeout(() => {
          const newTestID = result.payload.test_guid;
          setTestGuid(newTestID);
          setAlertOpen(false);
          navigate(`/test/add-question/${newTestID}?mt=${courseGuid}`);
        }, 3000);
      } else {
        setErrorValue(result.message.end_date || result.message.start_date || result.message.title || result.message.type || result.message.details || result.message.created_by)
        setIsTestCreated(false);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error) {
      setIsTestCreated(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create test in course</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: "100%" }}
            alignItems="center"
          >
            <Grid item>
              <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setIsTestCreated(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={isTestCreated === true ? "success" : "warning"}
                >
                  {/* {isTestCreated === true
                    ? "Test created Successfully"
                    : "Test creation failled!"} */}
                  {errorValue && errorValue}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Create Test
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                className="custom-button"
                href={`/course/manage/${courseGuid}`}
                component={Link}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9} sx={{ mt: 3 }}>
                    <FormTextField
                      control={control}
                      label="Title"
                      variant="outlined"
                      name="title"
                      pattern="[A-Za-z]{1,}"
                      style={{ width: "100%" }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="type-select-label">Type</InputLabel>
                      <Controller
                        name="type"
                        control={control}
                        defaultValue="evaluated" // Default value set to 'student'
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="type-select-label"
                            id="type-select"
                            label="Type"
                          >
                            <MenuItem value="evaluated">Evaluated</MenuItem>
                            <MenuItem value="quiz">Quizz</MenuItem>
                            <MenuItem value="practice">Practice</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="start_date"
                        control={control}
                        defaultValue={dayjs()} // Set default value to current date and time
                        rules={{ required: "Start date is required" }}
                        render={({ field }) => (
                          <DateTimePicker
                            sx={{ width: "100%" }}
                            {...field}
                            label="Start Date"
                            showTodayButton
                            error={!!errors.start_date}
                            helperText={errors.start_date?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      className="demo  "
                    >
                      <Controller
                        name="end_date"
                        control={control}
                        defaultValue={dayjs()} // Set default value to current date and time
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <DateTimePicker
                            sx={{ width: "100%" }}
                            {...field}
                            label="End Date"
                            showTodayButton
                            error={!!errors.end_date}
                            helperText={errors.end_date?.message}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="test-details" sx={{ my: 1 }}>
                      Details
                    </InputLabel>
                    <FormEditorField
                      id="test-details"
                      control={control}
                      name="details"
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        components={[
                          "DateTimePicker",
                          "MobileDateTimePicker",
                          "DesktopDateTimePicker",
                          "StaticDateTimePicker",
                        ]}
                      >
                        <DemoItem label="Mobile variant">
                          <MobileDateTimePicker
                            defaultValue={dayjs("2022-04-17T15:30")}
                          />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid> */}
                </Grid>

                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  sx={{ mt: 5 }}
                  className="custom-button"
                >
                  Save Test
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default CreateCourseTest;
