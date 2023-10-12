import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  Link,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  List,
  ListItemButton,
  ListItem,
  ListItems,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Helmet } from 'react-helmet';
import BASE_URL from '../../../../../Utils/baseUrl';
import token from '../../../../../Utils/token';
import Network from '../../../../../Utils/network';
import CreatedBy from '../../../../../Utils/createdBy';
import { serialize } from 'object-to-formdata';
import FormTextField from '../../../../../components/Common/formTextField';
import FormEditorField from '../../../../../components/Common/formEditorField';
import SidebarLeft from '../../../../../components/Sidebar/SidebarLeft';
import ReactHtmlParser from 'react-html-parser';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PropTypes from 'prop-types';
import Course from '../../../../../../src/assets/images/Course.jpg';
import PreviewHtmlContent from 'components/Course/PreviewContent/PreviewHtmlContent';
import PreviewImageContent from 'components/Course/PreviewContent/PreviewImageContent';
import PreviewVideoContent from 'components/Course/PreviewContent/PreviewVideoContent';
import PreviewPdfContent from 'components/Course/PreviewContent/PreviewPdfContent';
const SingleSection = () => {
  const { courseGuid } = useParams();
  const { lessonGuid } = useParams();
  const { sectionGuid } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);
  // Get current Section details
  useEffect(() => {
    const fetchCurrentSection = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(
        `${BASE_URL}/course/section/${sectionGuid}/preview`,
        requestOptions
      );
      const result = await response.json();
      // console.log(sectionGuid);
      if (result.success === true) {
        setLoading(false);
        setCurrentSection(result.payload);
      }
    };
    fetchCurrentSection();
  }, []);

  return (
    <>
      <Helmet>
        <title>{currentSection && currentSection.title}</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        {loading ? (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : currentSection && currentSection.length !== 0 ? (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* <Grid
              container
              spacing={2}
              sx={{ width: '100%' }}
              alignItems='center'
            ></Grid> */}
            <Grid container spacing={2} sx={{ my: 3 }}>
              <Grid item xs={6}>
                <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                  {currentSection && currentSection.title}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Button
                  variant='contained'
                  className='custom-button'
                  href={`/course/subject/lesson/${lessonGuid}/sections`}
                  component={Link}
                >
                  Back
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant='outlined'
                  className='custom-button'
                  href={`/course/subject/lesson/${lessonGuid}/section/create`}
                  component={Link}
                >
                  Add Section
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={12}>
                <Box>
                  <PreviewHtmlContent />
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Alert sx={{ mt: 5 }} severity='error'>
            Lesson not found!
          </Alert>
        )}
      </Box>
    </>
  );
};
export default SingleSection;
