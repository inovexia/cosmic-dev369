import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
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
  IconButton,
  Link,
  Snackbar,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { MuiTelInput } from 'mui-tel-input';
import { useForm, Controller } from 'react-hook-form';
import BASE_URL from '../../../Utils/baseUrl';
import CreatedBy from '../../../Utils/createdBy';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import { serialize } from 'object-to-formdata';
import FormTextField from '../../../components/Common/formTextField';
import FormEditorField from '../../../components/Common/formEditorField';
import SidebarLeft from '../../../components/Sidebar/SidebarLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
const StyledFormControl = styled(FormControl)({
  marginBottom: '16px',
});

const UpdateSubject = () => {
  const { courseGuid } = useParams();
  const { subjectGuid } = useParams();
  const [alertOpen, setAlertOpen] = useState(null);
  const [isSubjectUpdated, setIsSubjectUpdated] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [fileError, setFileError] = useState(null);
  const [filename, setFilename] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: '',
      updated_by: CreatedBy,
    },
  });

  // Get current course details
  useEffect(() => {
    const fetchCurrentSubject = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(
        `${BASE_URL}/course/subject/${subjectGuid}/view`,
        requestOptions
      );
      const courseData = await response.json();

      reset(courseData.payload);
    };
    fetchCurrentSubject();
  }, [reset]);

  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);
  const formdata = new FormData();

  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `${BASE_URL}/course/subject/${subjectGuid}/edit`,
        requestOptions
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsSubjectUpdated(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate(`/course/${courseGuid}/subjects`);
        }, 3000);
      } else {
        setIsSubjectUpdated(false);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error) {
      setIsSubjectUpdated(false);
    }
  };
  // /Validation on file size
  const handleFileChange = (e) => {
    const [selectedFile] = e.target.files;
    if (selectedFile) {
      if (selectedFile.size > 300 * 1024 * 1024) {
        setFileError('File size should be less than 300MB.');
        setFilename(null);
      } else {
        setFileError('');
        setFilename(selectedFile.name);
        setValue('userfile', selectedFile);
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Update Subject</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: '100%' }}
            alignItems='center'
          >
            <Grid item>
              <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setIsSubjectUpdated(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert
                  severity={isSubjectUpdated === true ? 'success' : 'warning'}
                >
                  {isSubjectUpdated === true
                    ? 'Subject updated Successfully'
                    : 'Subject updation failled!'}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                Update Subject
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                className='custom-button'
                href={`/course/${courseGuid}/subjects`}
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
                  <Grid item xs={12} md={12} sx={{ mt: 3 }}>
                    <FormTextField
                      control={control}
                      label='Title'
                      variant='outlined'
                      name='title'
                      pattern='[A-Za-z]{1,}'
                      style={{ width: '100%' }}
                      required
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={2} sx={{ mt: 3 }}>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id='type-select-label'>Status</InputLabel>
                      <Controller
                        name='status'
                        control={control}
                        defaultValue='Unpublished' // Default value set to 'student'
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId='type-select-label'
                            id='type-select'
                            label='Course Status'
                          >
                            <MenuItem value='0'>Unpublished</MenuItem>
                            <MenuItem value='1'>Published</MenuItem>
                            <MenuItem value='2'>Archive</MenuItem>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={12}>
                    <InputLabel htmlFor='course-desc' sx={{ my: 1 }}>
                      Description
                    </InputLabel>
                    <FormEditorField
                      id='course-desc'
                      control={control}
                      name='description'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box className='add-file'>
                      <input
                        name='userfile'
                        id='file-input'
                        type='file'
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <strong>Upload File</strong>
                      <label htmlFor='file-input'>
                        <IconButton component='span'>
                          <FileUploadIcon
                            sx={{
                              color: '#EAC43D',
                              width: '50px',
                              height: '50px',
                              cursor: 'pointer',
                            }}
                          />
                        </IconButton>
                      </label>
                      <span>{filename ? filename : 'No file selected'}</span>
                      {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant='contained'
                  size='medium'
                  type='submit'
                  sx={{ mt: 5 }}
                  className='custom-button'
                >
                  Update Subject
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default UpdateSubject;
