import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  InputLabel,
  Link,
  Input,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import BASE_URL from '../../../../Utils/baseUrl';
import token from '../../../../Utils/token';
import Network from '../../../../Utils/network';
import CreatedBy from '../../../../Utils/createdBy';
import { serialize } from 'object-to-formdata';
import FormTextField from '../../../../components/Common/formTextField';
import FormEditorField from '../../../../components/Common/formEditorField';
import SidebarLeft from '../../../../components/Sidebar/SidebarLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const UpdateLesson = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const cid = params.get('ci');
  const sid = params.get('si');
  console.log('cid', cid, 'sid', sid);
  const { guid } = useParams();
  const { qid } = useParams();
  const { courseGuid } = useParams();
  const { subjectGuid } = useParams();
  const [alertOpen, setAlertOpen] = useState(null);
  const [isSubjectCreated, setIsSubjectCreated] = useState(null);
  const [isSubjectUpdated, setIsSubjectUpdated] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [valueLength, setValueLength] = useState('');
  const [isInputValid, setInputValid] = useState(true);
  const [titleValid, setTitleValid] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTextareaValid, setTextareaValid] = useState(false);
  const [isTitleLengthValid, setIsTitleLengthValid] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [filename, setFilename] = useState(null);
  const navigate = useNavigate();
  const {
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      userfile: undefined,
      created_by: CreatedBy,
    },
  });
  const { title } = watch();
  // Validation on character Length
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTitleValid(newValue.length);
    if (newValue.length >= 3 && newValue.length <= 35) {
      setIsTitleLengthValid(false);
    }
    const truncatedValue = newValue.slice(0, 35);
    setInputValue(truncatedValue);
    setValue('title', truncatedValue);
    setValueLength(truncatedValue.length);
    const isValid = truncatedValue.length >= 3 && truncatedValue.length <= 35;
    setInputValid(isValid);
    if (truncatedValue.length === 35) {
      setInputValid(false);
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

  // Get current course details
  useEffect(() => {
    const fetchCurrentSubject = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(
        `${BASE_URL}/course/${courseGuid}/subject/${subjectGuid}/view`,
        requestOptions
      );
      const result = await response.json();
      reset(result.payload);
    };
    fetchCurrentSubject();
  }, [reset]);

  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);

  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
    };
    if (data.description.length >= 107) {
      setTextareaValid(true);
    } else if (
      (titleValid && titleValid < 3) ||
      (titleValid && titleValid > 35)
    ) {
      setIsTitleLengthValid(true);
    } else {
      setTextareaValid(false);
      setIsTitleLengthValid(false);
      try {
        const response = await fetch(
          `${BASE_URL}/course/${courseGuid}/subject/${subjectGuid}/edit`,
          requestOptions
        );
        const result = await response.json();
        setAlertOpen(true);
        if (result.success === true) {
          setIsSubjectUpdated(true);
          setTimeout(() => {
            setAlertOpen(false);
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
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Lesson</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setIsSubjectCreated(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={isSubjectUpdated === true ? 'success' : 'warning'}>
            {isSubjectUpdated === true
              ? 'Subject updatedd Successfully'
              : 'Subject updation failled!'}
          </Alert>
        </Snackbar>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: '100%' }}
            alignItems='center'
          ></Grid>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                Edit Lesson
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                className='custom-button'
                href={`/course/${cid}/subject/${sid}/preview`}
                component={Link}
              >
                Back
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
                      onChange={handleInputChange}
                      required
                      value={title}
                      error={!isInputValid}
                      helperText={
                        !isInputValid
                          ? 'Title must be between 3 and 35 characters'
                          : ''
                      }
                    />
                    {isTitleLengthValid && (
                      <Typography sx={{ mt: 2 }} color='error'>
                        Title must have allowed min 3 and max 35 characters
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel htmlFor='course-desc' sx={{ my: 1 }}>
                      Description
                    </InputLabel>
                    <FormEditorField
                      id='course-desc'
                      control={control}
                      name='description'
                    />
                    {isTextareaValid && (
                      <Typography sx={{ mt: 2 }} color='error'>
                        Description must be at least 100 characters
                      </Typography>
                    )}
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
                  Update
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default UpdateLesson;
