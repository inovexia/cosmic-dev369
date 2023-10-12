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
import BASE_URL from '../../../../Utils/baseUrl';
import token from '../../../../Utils/token';
import Network from '../../../../Utils/network';
import SidebarLeft from '../../../../components/Sidebar/SidebarLeft';
import ReactHtmlParser from 'react-html-parser';
import DescriptionIcon from '@mui/icons-material/Description';
const SingleLesson = () => {
  const { courseGuid } = useParams();
  const { subjectGuid } = useParams();
  const { lessonGuid } = useParams();
  // const { sectionGuid } = useParams();
  const [sectionGuid, setSectionGuid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSection, setCurrentSection] = useState([]);
  const [currentContent, setCurrentContent] = useState(null);
  const [value, setValue] = React.useState(0);
  const [currentSectionId, setCurrentSectionId] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);
  // Get current course details
  useEffect(() => {
    const fetchCurrentSubject = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(
        `${BASE_URL}/course/subject/${subjectGuid}/preview`,
        requestOptions
      );
      const result = await response.json();
      if (result.success === true) {
        setLoading(false);
        setCurrentSubject(result.payload);
      }
    };
    fetchCurrentSubject();
  }, []);
  // console.log(currentSubject);
  // active section list
  const [isDivOpen, setIsDivOpen] = useState(false);

  const openDiv = (id) => {
    setIsDivOpen(true);
    setCurrentSectionId(id);

    // alert(id);
  };
  console.log(currentSectionId);
  // Get content details
  useEffect(() => {
    const fetchCurrentLesson = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(
        `${BASE_URL}/course/lesson/${lessonGuid}/preview`,
        requestOptions
      );
      const result = await response.json();
      // console.log('C', result.payload);
      if (result.success === true) {
        setLoading(false);
        setCurrentLesson(result.payload);
        if (result.payload.sections && result.payload.sections.length > 0) {
          setCurrentSectionId(result.payload.sections[0].guid);
        }
      }
    };
    fetchCurrentLesson();
  }, []);
  // Get current Section details
  useEffect(() => {
    const fetchCurrentSection = async () => {
      if (currentSectionId) {
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
        };
        const response = await fetch(
          `${BASE_URL}/course/section/${currentSectionId}/preview`,
          requestOptions
        );
        const result = await response.json();
        console.log(result.payload);
        if (result.success === true) {
          setLoading(false);
          setCurrentContent(result.payload);
        }
      }
    };
    fetchCurrentSection();
  }, [currentSectionId]); // Add currentSectionId as a dependency
  const extractYouTubeVideoId = (url) => {
    const pattern =
      /(?:https?:\/\/(?:www\.)?)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };
  return (
    <>
      <Helmet>
        <title>{currentSubject && currentSubject.title}</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        {loading ? (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : currentContent && currentContent.length !== 0 ? (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid
              container
              spacing={2}
              sx={{ width: '100%' }}
              alignItems='center'
            ></Grid>
            <Grid container spacing={2} sx={{ my: 3 }}>
              <Grid item xs={6}>
                <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                  {currentLesson && currentLesson.title}
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
                <Button
                  sx={{ ml: 2 }}
                  variant='outlined'
                  className='custom-button'
                  href={`/course/${courseGuid}/subject/${subjectGuid}/lesson/create`}
                  component={Link}
                >
                  Add Section
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={9}>
                <Card sx={{ p: 3 }}>
                  {currentContent && currentContent.length !== 0 ? (
                    <div>
                      {currentContent &&
                        currentContent.content.map((item, index) => (
                          <div key={index} sx={{ margin: '16px' }}>
                            {item.type === 'image' ? (
                              <Box sx={{ padding: '16px' }}>
                                <img src={item.file_path} alt={item.type} />
                              </Box>
                            ) : item.type === 'html' ? (
                              <Box
                                sx={{ padding: '16px' }}
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                            ) : item.type === 'pdf' ? (
                              <Box sx={{ padding: '16px' }}>
                                <p>
                                  <a href={item.file_path}>{item.file_path}</a>
                                </p>
                                <div
                                  sx={{ alignitems: 'center', display: 'flex' }}
                                >
                                  <a href={item.file_path} download>
                                    <span>Download</span>
                                    <DescriptionIcon />
                                  </a>
                                </div>
                              </Box>
                            ) : item.type === 'youtube' ? (
                              <Box sx={{ padding: '16px' }}>
                                <iframe
                                  title='Embedded Content'
                                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                                    item.content
                                  )}`} // Extract and use the YouTube video ID in the URL
                                  width='100%'
                                  height='350px'
                                  frameBorder='0'
                                  allowFullScreen
                                />
                              </Box>
                            ) : (
                              ''
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity='error'>
                      Content not found!
                    </Alert>
                  )}
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card
                  sx={{
                    py: 2,
                  }}
                >
                  {currentLesson &&
                    currentLesson.sections.map((item, index) => (
                      <Box
                        sx={{
                          flexGrow: 1,
                          boxShadow: 'none',
                        }}
                        key={index}
                      >
                        <List
                          sx={{
                            padding: 0,
                            boxShadow: 0,
                          }}
                        >
                          <ListItem
                            key={index}
                            onClick={() => openDiv(item.guid)}
                            sx={{
                              padding: 0,
                              boxShadow: 0,
                            }}
                          >
                            <ListItemButton
                              sx={{
                                boxShadow: 0,
                              }}
                            >
                              {item.title}
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </Box>
                    ))}
                </Card>
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
export default SingleLesson;
