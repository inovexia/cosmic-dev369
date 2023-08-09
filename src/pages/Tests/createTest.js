import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Hidden,
  Link,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import { Helmet } from 'react-helmet';
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import CreatedBy from "../../Utils/createdBy"
//import token from "../../Utils/token";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const CreateTest = () => {
  const token = '726ea82af534eb4b12e63fc1594bd2abd35f0ee2036b6bc38d57b5f769d6601f';
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    details: "",
    created_by:{CreatedBy},
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isTestCreated, setIsTestCreated] = useState(null);
  const [guid, setGuid] = useState("");

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );
  myHeaders.append("Network", `${Network}`);

  var formdata = new FormData();
  formdata.append("title", formData.title);
  formdata.append("type", formData.type);
  formdata.append("details", formData.details);
  formdata.append("created_by",CreatedBy );
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  // function handleInputChange(event) {
  //   setFormData({
  //     ...formData,
  //     [event.target.name]: event.target.value,
  //   });
  // }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    //event.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/tests/add`,
        requestOptions
      );
      const result = await response.json();
      setIsTestCreated(true);
      setTimeout(() => {
        const newTestID = result.payload.guid;
        setGuid(newTestID);
        navigate(`/test/add-question/${newTestID}`);
      }, 3000);
    } catch (error) {
      setValidationErrors(error.response.data);
      setIsTestCreated(false);
    }
  };

  // Fetch Category List
  React.useEffect(() => {
    const fetchCategoryList = async () => {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${token}`
      );
      const requestOptions = {
        method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
      };
      try {
        const response = await fetch(
          `${BASE_URL}/tests/categories`,
          requestOptions
        );
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchCategoryList();
    
  }, []);
  
  
  return (
    <>
      <Helmet><title>Create Test</title></Helmet>
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
              severity="success"
              open={isTestCreated}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={50000}
              onClose={() => setIsTestCreated(false)}
              sx={{
                backgroundColor: `${
                  isTestCreated === true ? "#008000" : "#ff0000"
                }`,
              }}
              message={
                isTestCreated === true
                  ? "Test created successfully!"
                  : "Failed to create test"
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mt:3}}>
          <Grid item xs={6}>
            <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
              Create Test
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Button variant="contained">
              <Link href="/test/list" color="inherit" underline="none">
                Cancel
              </Link>
            </Button>
          </Grid>
        </Grid>
      
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <StyledFormControl sx={{ width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  pattern="[A-Za-z]{1,}"
                />
                {validationErrors.title && (
                  <FormHelperText error>
                    {validationErrors.title}
                  </FormHelperText>
                )}
              </StyledFormControl>
              <FormControl sx={{ mt: 5, width: "100%" }}>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value={`practice`}>Practice</MenuItem>
                  <MenuItem value={`evaluated`}>Evaluated</MenuItem>
                  <MenuItem value={`quiz`}>Quizz</MenuItem>
                </Select>
                {validationErrors.type && (
                  <FormHelperText error>{validationErrors.type}</FormHelperText>
                )}
              </FormControl>
              <StyledFormControl sx={{ mt: 5, width: "100%" }}>
                <label
                  htmlFor="details"
                  sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    fontFamily: "Arial",
                    mt: 5,
                  }}
                >
                  Details
                </label>
                <Editor
                  onEditorChange={(content) =>
                    setFormData((formData) => ({
                      ...formData,
                      details: content,
                    }))
                  }
                />
              </StyledFormControl>

              <Button variant="contained" type="submit">
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
export default CreateTest;
