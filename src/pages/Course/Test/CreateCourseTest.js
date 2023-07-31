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
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

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
      // start_date: "",
      // end_date:"",
      created_by: CurrentUser,
    },
  });

  // Authentication
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const formdata = new FormData();

  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
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
        setIsTestCreated(true);
        setTimeout(() => {
          const newTestID = result.payload.test_guid;
          setTestGuid(newTestID);
          setAlertOpen(false);
          navigate(`/test/add-question/${newTestID}?mt=${courseGuid}`);
        }, 3000);
      } else {
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
                  {isTestCreated === true
                    ? "Test created Successfully"
                    : "Test creation failled!"}
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
