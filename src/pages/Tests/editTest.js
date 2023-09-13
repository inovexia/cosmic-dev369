import React, { useState, useEffect } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  Link,
  FormHelperText,
  Snackbar,
  Alert
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import FormEditorField from "../../components/Common/formEditorField";
import FormTextField from "../../components/Common/formTextField";
import { serialize } from "object-to-formdata";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import CreatedBy from "../../Utils/createdBy"
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const EditTest = () => {
  // Query parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mtValue = params.get("mt");
  const { guid } = useParams();
  const {
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      details: "",
      status: "0",
      created_by: {CreatedBy},
    },
  });
  const [isTestCreated, setIsTestCreated] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null)
  

// Authorization Setup
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );
  myHeaders.append("Network", `${Network}`);
  const navigate = useNavigate();

  // update test in backend
  const [validationErrors, setValidationErrors] = useState({});
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
        `${BASE_URL}/tests/add/${guid}`,
        requestOptions
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsTestCreated(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(`/test/add-question/${guid}?mt=${mtValue}`);
        }, 1000);
      }
      else {
        setIsTestCreated(false);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      reset();
    } catch (error) {
      setValidationErrors(error.response.data);
      setIsTestCreated(false);
    }
 
  };
  // Get current test details
  const [test, setTest] = useState([]);
  const requestOption = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
    useEffect(() => {
      const fetchTest = async () => {
        const response = await fetch(`${BASE_URL}/tests/view/${guid}`, requestOption);
        const testData = await response.json();
        setTest(testData.payload);
        reset(testData.payload);
      };
      fetchTest();
    }, [reset]);
  return (
    <>
    <Helmet>
        <title>Edit Test</title>
    </Helmet>
    <Box sx={{ display: "flex" }}>
      <SidebarLeft />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid
          container
          spacing={2}
          sx={{width: "100%" }}
          alignItems="center"
        >
          <Grid item>
          <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => isTestCreated(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  severity={isTestCreated === true ? "success" : "warning"}
                >
                  {isTestCreated === true
                    ? "Test updated Successfully"
                    : "Test updation failled!"}
                </Alert>
              </Snackbar>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Edit Test
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              {mtValue ? <Button variant="contained" className="custom-button">
                <Link href={`/course/${mtValue}/test/list`} color="inherit" underline="none">
                  Cancel
                </Link>
              </Button> : <Button variant="contained" className="custom-button">
                <Link href="/test/list" color="inherit" underline="none">
                  Cancel
                </Link>
              </Button>}
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <input type="hidden" name="created_by" value={CreatedBy} />
              <StyledFormControl sx={{ width: "100%" }}>
                <FormTextField
                  label="Title"
                  control={control}
                  name="title"
                  variant="outlined"
                  required
                  pattern="[A-Za-z]{1,}"
                />
                {validationErrors.title && (
                  <FormHelperText error>
                    {validationErrors.title}
                  </FormHelperText>
                )}
              </StyledFormControl>
              <StyledFormControl sx={{ mt: 3, width: "100%" }}>
                <Box sx={{pb:2, fontWeight:"500"}}>Details</Box>
                <FormEditorField control={control} name="details" />
              </StyledFormControl>

              <Button variant="outlined" type="submit" className="custom-button">
                Update Test
              </Button>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  );
};
export default EditTest;
