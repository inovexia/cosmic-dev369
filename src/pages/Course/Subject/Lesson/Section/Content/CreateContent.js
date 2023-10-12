import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Card,
  CssBaseline,
  Container,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import BASE_URL from '../../../../../../Utils/baseUrl';
import token from '../../../../../../Utils/token';
import Network from '../../../../../../Utils/network';
import CreatedBy from '../../../../../../Utils/createdBy';
import { serialize } from 'object-to-formdata';
import FormTextField from '../../../../../../components/Common/formTextField';
import FormEditorField from '../../../../../../components/Common/formEditorField';
import SidebarLeft from '../../../../../../components/Sidebar/SidebarLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RightSidebar from 'components/Sidebar/RightSidebar';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import TheatersOutlinedIcon from '@mui/icons-material/TheatersOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { SpaceBarRounded } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { MuiFileInput } from 'mui-file-input';

const CreateContent = () => {
  const { courseGuid } = useParams();
  const [alertOpen, setAlertOpen] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [valueLength, setValueLength] = useState('');
  const [isInputValid, setInputValid] = useState(true);
  const [titleValid, setTitleValid] = useState('');
  const [isTextareaValid, setTextareaValid] = useState(false);
  const [isTitleLengthValid, setIsTitleLengthValid] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [filename, setFilename] = useState(null);
  const [editorFields, setEditorFields] = useState([]);
  const [mediaFields, setMediaFields] = useState([]);
  const [urlFields, setUrlFields] = useState([]);
  const [selectedFieldType, setSelectedFieldType] = useState([]);
  const [selectedBlockType, setSelectedBlockType] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const [selectedImages, setSelectedImages] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [youtubeLinkInput, setYoutubeLinkInput] = useState('');

  const navigate = useNavigate();
  const {
    control,
    setValue,
    watch,
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

  // Handle Image file input change for a content block
  const handleImageFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') && file.size <= 300 * 1024 * 1024) {
        // Update the selected image for the specific content block
        const updatedBlocks = [...contentBlocks];
        updatedBlocks[index].selectedImage = file;
        setContentBlocks(updatedBlocks);
      } else {
        alert(
          'Please select an image file that is smaller than or equal to 300MB.'
        );
      }
    }
  };

  // Handle Video file input change for a content block
  const handleVideoFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/') && file.size <= 300 * 1024 * 1024) {
        // Update the selected video for the specific content block
        const updatedBlocks = [...contentBlocks];
        updatedBlocks[index].selectedVideo = file;
        setContentBlocks(updatedBlocks);
      } else {
        alert(
          'Please select a video file that is smaller than or equal to 300MB.'
        );
      }
    }
  };

  // Handle PDF file input change for a content block
  const handlePdfFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 300 * 1024 * 1024) {
        // Update the selected PDF for the specific content block
        const updatedBlocks = [...contentBlocks];
        updatedBlocks[index].selectedPDF = file;
        setContentBlocks(updatedBlocks);
      } else {
        alert(
          'Please select a PDF file that is smaller than or equal to 300MB.'
        );
      }
    }
  };
  const addContentBlock = (blockType) => {
    const newIndex = contentBlocks.length;
    const newBlock = { type: blockType };

    if (blockType === 'Text') {
      newBlock.field = (
        <>
          <FormEditorField
            className='dev'
            sx={{ width: '100%' }}
            control={control}
            name={`block[${newIndex}][content]`} // Set the name attribute
          />
        </>
      );
    }

    // Add separate state properties for each content block type
    if (blockType === 'Image') {
      newBlock.selectedImage = null;
    } else if (blockType === 'Video') {
      newBlock.selectedVideo = null;
    } else if (blockType === 'File') {
      newBlock.selectedPDF = (
        <input
          name={`block[${newIndex}][content]`}
          id={`pdf-file-input-${newIndex}`} // Use unique ID
          type='file'
          accept='.pdf,application/pdf'
          onChange={(event) => handlePdfFileChange(event, newIndex)}
          style={{ display: 'none' }}
        />
      );
    } else if (blockType === 'Link') {
      newBlock.field = (
        <FormTextField
          control={control}
          label='URL'
          variant='outlined'
          name={`block[${newIndex}][content]`}
        />
      );
    } else if (blockType === 'YoutubeLink') {
      newBlock.field = (
        <FormTextField
          control={control}
          label='Youtube Link'
          variant='outlined'
          name={`block[${newIndex}][content]`}
        />
      );
    }

    setContentBlocks([...contentBlocks, newBlock]);
  };

  // Function to remove a content block from the state
  const removeContentBlock = (index) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks.splice(index, 1);
    setContentBlocks(updatedBlocks);
  };

  // Render content blocks dynamically based on the state
  const renderedBlocks = contentBlocks.map((block, index) => {
    switch (block.type) {
      case 'Text':
        return (
          <Grid sx={{ display: 'flex' }} item xs={12} key={index}>
            <input type='hidden' name={`block.${index}.text`} value='text' />
            <FormEditorField
              sx={{ width: '100%' }}
              control={control}
              name={`block.${index}.content`} // Set the name attribute
            />
            <Button onClick={() => removeContentBlock(index)}>
              <DeleteOutlinedIcon />
            </Button>
          </Grid>
        );
      case 'Image':
        return (
          <Grid sx={{ display: 'flex' }} item xs={12} key={index}>
            <Box className='add-file'>
              <input
                name={`block[${index}][content]`}
                id={`image-file-input-${index}`}
                type='file'
                accept='image/*'
                onChange={(event) => handleImageFileChange(event, index)}
                style={{ display: 'none' }}
              />
              {/* Rest of your Image input code */}
            </Box>
          </Grid>
        );
      case 'Video':
        return (
          <Grid sx={{ display: 'flex' }} item xs={12} key={index}>
            <Box className='add-file'>
              <input
                name={`block[${index}][content]`}
                id={`video-file-input-${index}`}
                type='file'
                accept='video/*'
                onChange={(event) => handleVideoFileChange(event, index)}
                style={{ display: 'none' }}
              />
              <strong>Select Video</strong>
              <label htmlFor={`video-file-input-${index}`}>
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
              {block.selectedVideo && (
                <Box>
                  <span>Selected Video</span>
                  <video
                    controls
                    src={URL.createObjectURL(block.selectedVideo)}
                    style={{ width: '100%', height: 'auto' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}
              <Button onClick={() => removeContentBlock(index)}>
                <DeleteOutlinedIcon />
              </Button>
            </Box>
          </Grid>
        );
      case 'File':
        return (
          <Grid sx={{ display: 'flex' }} item xs={12} key={index}>
            <Box className='add-file'>
              <input
                name={`block[${index}][content]`}
                id={`pdf-file-input-${index}`} // Use unique ID
                type='file'
                accept='.pdf,application/pdf'
                onChange={(event) => handlePdfFileChange(event, index)}
                style={{ display: 'none' }}
              />
              <strong>Upload PDF File</strong>
              <label htmlFor={`pdf-file-input-${index}`}>
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
              {block.selectedPDF && (
                <Box>
                  <p>Filename: {block.selectedPDF.name}</p>
                </Box>
              )}
              <Button onClick={() => removeContentBlock(index)}>
                <DeleteOutlinedIcon />
              </Button>
            </Box>
          </Grid>
        );
      case 'Link':
        return (
          <Grid sx={{ display: 'flex' }} item xs={12} key={index}>
            <FormTextField
              label='URL'
              variant='outlined'
              control={control}
              name={`block[${index}][content]`}
              fullWidth
            />
            <Button onClick={() => removeContentBlock(index)}>
              <DeleteOutlinedIcon />
            </Button>
          </Grid>
        );
      case 'YoutubeLink':
        return (
          <Grid sx={{ display: 'flex' }} item xs={12} key={index}>
            <FormTextField
              label='Youtube Link'
              variant='outlined'
              control={control}
              name={`block[${index}][content]`}
              fullWidth
            />
            <Button onClick={() => removeContentBlock(index)}>
              <DeleteOutlinedIcon />
            </Button>
          </Grid>
        );
      // Add cases for other block types
      default:
        return null;
    }
  });

  // Validation on character Length
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setTitleValid(newValue.length);
    const truncatedValue = newValue.slice(0, 50);
    setInputValue(truncatedValue);
    setValue('title', truncatedValue);
    setValueLength(truncatedValue.length);
    const isValid = truncatedValue.length >= 3 && truncatedValue.length <= 50;
    setInputValid(isValid);
    if (truncatedValue.length === 50) {
      setInputValid(false);
    }
  };

  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);

  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
    console.log(formData);
    return;
    if (data.description.length >= 107) {
      setTextareaValid(true);
    } else if (titleValid < 3 || titleValid > 50) {
      setIsTitleLengthValid(true);
    } else {
      console.log(data);
      setAlertOpen(true);
      setIsSuccess(true);
      setTextareaValid(false);
      setIsTitleLengthValid(false);
      setTimeout(() => {
        setAlertOpen(false);
      }, 1000);
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Section</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
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
                Create Section
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                className='custom-button'
                href={`/course/subjects`}
                component={Link}
              >
                Back
              </Button>
            </Grid>
          </Grid>
          {/* <Grid item>
            <button onClick={() => addContentBlock("Text")}>
              Add Text Block
            </button>
            <button onClick={() => addContentBlock("Image")}>
              Add Image Block
            </button>
          </Grid> */}
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={9}>
              <Card sx={{ p: 3, height: '100%' }}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Grid container spacing={2} className='content-outer'>
                    <Grid item xs={12} className='content'>
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
                    {renderedBlocks}
                  </Grid>

                  <Button
                    variant='outlined'
                    size='medium'
                    type='submit'
                    sx={{ mt: 5 }}
                    className='custom-button'
                  >
                    Save
                  </Button>
                </form>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
                  <Grid item xs={12}>
                    <Typography>Select Tools</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ px: 1 }}>
                    <Button
                      variant='text'
                      className='no-radius'
                      //onClick={handleAddEditorField}
                      onClick={() => addContentBlock('Text')}
                    >
                      <IntegrationInstructionsOutlinedIcon />
                      <Typography
                        variant='span'
                        sx={{
                          width: '100%',
                          display: 'block',
                          textAlign: 'cenrer',
                        }}
                      >
                        HTML Code
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ px: 1 }}>
                    <Button
                      variant='text'
                      className='no-radius'
                      //onClick={handleAddMediaField}
                      onClick={() => addContentBlock('Image')}
                    >
                      <ImageOutlinedIcon />
                      <Typography
                        variant='span'
                        sx={{
                          width: '100%',
                          display: 'block',
                          textAlign: 'cenrer',
                        }}
                      >
                        Image
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ px: 1 }}>
                    <Button
                      variant='text'
                      className='no-radius'
                      //onClick={handleAddMediaField}
                      onClick={() => addContentBlock('Video')}
                    >
                      <VideoFileOutlinedIcon />
                      <Typography
                        variant='span'
                        sx={{
                          width: '100%',
                          display: 'block',
                          textAlign: 'cenrer',
                        }}
                      >
                        Video
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ px: 1 }}>
                    <Button
                      variant='text'
                      className='no-radius'
                      //onClick={handleAddMediaField}
                      onClick={() => addContentBlock('File')}
                    >
                      <PictureAsPdfOutlinedIcon />
                      <Typography
                        variant='span'
                        sx={{
                          width: '100%',
                          display: 'block',
                          textAlign: 'cenrer',
                        }}
                      >
                        PDF
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ px: 1 }}>
                    <Button
                      variant='text'
                      className='no-radius'
                      //onClick={handleAddUrlField}
                      onClick={() => addContentBlock('Link')}
                    >
                      <LinkOutlinedIcon />
                      <Typography
                        variant='span'
                        sx={{
                          width: '100%',
                          display: 'block',
                          textAlign: 'cenrer',
                        }}
                      >
                        URL
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{ px: 1 }}>
                    <Button
                      variant='text'
                      className='no-radius'
                      //onClick={handleAddUrlField}
                      onClick={() => addContentBlock('YoutubeLink')}
                    >
                      <SubscriptionsOutlinedIcon />
                      <Typography
                        variant='span'
                        sx={{
                          width: '100%',
                          display: 'block',
                          textAlign: 'cenrer',
                        }}
                      >
                        Youtube Link
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default CreateContent;
