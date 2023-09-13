import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { MuiTelInput } from "mui-tel-input";
import { useForm, Controller } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import CreatedBy from "../../Utils/createdBy";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import { serialize } from "object-to-formdata";
import FormTextField from "../../components/Common/formTextField";
import FormEditorField from "../../components/Common/formEditorField"
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const UpdateCourse = () => {
  const { courseGuid } = useParams();
  const [alertOpen, setAlertOpen] = useState(null)
  const [isCourseUpdated, setIsCourseUpdated] = useState(null)
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "",
      updated_by: CreatedBy
    },
  });

  // Get current course details
  useEffect(() => {
    const fetchCurrentCourse = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/course/view/${courseGuid}`,
        requestOptions
      );
      const courseData = await response.json();
      reset(courseData.payload);
    };
    fetchCurrentCourse();
  }, [reset]);

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
        `${BASE_URL}/course/update/${courseGuid}`,
        requestOptions
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsCourseUpdated(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(`/course/manage/${courseGuid}`);
        }, 3000);
      } else {
        setIsCourseUpdated(false);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error) {
      setIsCourseUpdated(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Course</title>
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
                onClose={() => setIsCourseUpdated(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={isCourseUpdated === true ? "success" : "warning"}
                >
                  {isCourseUpdated === true
                    ? "Course updated Successfully"
                    : "Course updation failled!"}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my  :1 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Update Course
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained" className="custom-button" href="/course/list" component={Link}>
                  Cancel
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={10} sx={{ mt: 3 }}>
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
                  <Grid item xs={12} md={2} sx={{ mt: 3 }}>
                  <FormControl sx={{ width: "100%" }}>
                      <InputLabel id="type-select-label">Status</InputLabel>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue="Unpublished" // Default value set to 'student'
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="type-select-label"
                            id="type-select"
                            label="Course Status"
                          >
                            <MenuItem value="0">Unpublished</MenuItem>
                            <MenuItem value="1">Published</MenuItem>
                            <MenuItem value="2">Archive</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                  <InputLabel htmlFor="course-desc" sx={{my:1}}>Description</InputLabel>
                  <FormEditorField id="course-desc" control={control} name="description" />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  sx={{ mt: 5 }}
                  className="custom-button"
                >
                  Update Course
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default UpdateCourse;
