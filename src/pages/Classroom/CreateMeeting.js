import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { serialize } from "object-to-formdata";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";
import FormTextField from "../../components/Common/formTextField";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const CreateMeeting = () => {
  // state initialization
  const [errorMessage, setErrorMessage] = useState(null);
  const [isMeetingCreated, setIsMeetingCreated] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
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
      alert("Class details field should not be empty!");
    } else {
      try {
        const response = await fetch(`${BASE_URL}/zoom/create`, requestOptions);
        const result = await response.json();
        setAlertOpen(true);
        if (result.success === true) {
          setErrorMessage("Class created successfully.");
          setIsMeetingCreated(true);
          setTimeout(() => {
            setAlertOpen(false);
            navigate(`/online-classes`);
          }, 3000);
        } else {
          setErrorMessage(result.message.title);
          setIsMeetingCreated(false);
          setTimeout(() => {
            setAlertOpen(false);
          }, 3000);
        }
      } catch (error) {
        setIsMeetingCreated(false);
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Class</title>
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
                  {errorMessage}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Create Class
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                className="custom-button"
                component={Link}
                href="/online-classes"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid item xs={12} sx={{ mb: 2 }}>
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
                    Class Details
                  </label>
                  <FormEditorField
                    control={control}
                    name="details"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                  />
                </StyledFormControl>

                <Button
                  variant="outlined"
                  type="submit"
                  className="custom-button"
                >
                  Save
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default CreateMeeting;
