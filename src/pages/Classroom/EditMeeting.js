import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  FormControl,
  Link,
  Snackbar,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import CreatedBy from "../../Utils/createdBy";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import FormEditorField from "../../components/Common/formEditorField";
import FormTextField from "../../components/Common/formTextField"
import { serialize } from "object-to-formdata";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const EditMeeting = () => {
    // Query Parameters
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const mtValue = params.get("ci");
  const { meetingGuid } = useParams();
  // state initialization
  const [isMeetingCreated, setIsMeetingCreated] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title:"",
      created_by: CreatedBy,
      details: "",
    },
  });
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const navigate = useNavigate();
  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    const content = editorRef.current.getContent();
    if (content.trim() === "") {
      alert("Meeting details field should not be empty!");
    } else {
      try {
        const response = await fetch(
          `${BASE_URL}/zoom/create/${meetingGuid}`,
          requestOptions
        );
        const result = await response.json();
        setAlertOpen(true);
        if (result.success === true) {
          setIsMeetingCreated(true);
          setTimeout(() => {
            navigate(`/online-classes`);
          }, 2000);
          reset();
        } else {
          setIsMeetingCreated(false);
        }
      } catch (error) {
        setIsMeetingCreated(false);
      }
    }
  };

  // Get current meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      const requestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/zoom/view/${meetingGuid}`,
        requestOption
      );
      const meetingData = await response.json();
      reset(meetingData.payload);
    };
    fetchMeeting();
  }, [reset]);

  return (
    <>
      <Helmet>
        <title>Edit Meeting</title>
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
                onClose={() => setIsMeetingCreated(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={isMeetingCreated === true ? "success" : "warning"}
                >
                  {isMeetingCreated === true
                    ? "Meeting updated Successfully"
                    : "Meeting updation failed"}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Edit Meeting
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained" className="custom-button" component={Link} href={mtValue && mtValue ? `/course/${mtValue}/meeting/list` : `/online-classes`} >
                Cancel 
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Grid item xs={12} sx={{mb:2}}>
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
                <StyledFormControl sx={{ width: "100%" }}>
                  <label
                    htmlFor="details"
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      fontFamily: "Arial",
                      marginBottom: "10px",
                    }}
                  >
                    Meeting Details
                  </label>
                  <FormEditorField
                    control={control}
                    name="details"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                  />
                </StyledFormControl>
                <Button variant="outlined" type="submit" className="custom-button">
                  Save Meeting
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default EditMeeting;
