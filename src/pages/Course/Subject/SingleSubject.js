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
import BASE_URL from '../../../Utils/baseUrl';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import SidebarLeft from '../../../components/Sidebar/SidebarLeft';
import ReactHtmlParser from 'react-html-parser';
import DescriptionIcon from '@mui/icons-material/Description';
import { UTurnLeftTwoTone } from '@mui/icons-material';
import SortableList, { SortableItem } from 'react-easy-sort';
import { arrayMoveImmutable, arrayMoveMutable } from 'array-move';
const SingleSubject = () => {
  const { courseGuid } = useParams();
  const { subjectGuid } = useParams();
  const { lessonGuid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState('');
  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);
  // active section list
  const [isDivOpen, setIsDivOpen] = useState(false);

  const openDiv = (id) => {
    setIsDivOpen(true);
    setCurrentSectionId(id);

    // alert(id);
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
        `${BASE_URL}/course/subject/${subjectGuid}/preview`,
        requestOptions
      );
      const result = await response.json();
      if (result.success === true) {
        setLoading(false);
        setCurrentSubject(result.payload);
        if (result.payload.lessons.length > 0) {
          setCurrentLesson(result.payload.lessons[0]); // Assuming you want to select the first lesson initially
        }
      }
    };
    fetchCurrentSubject();
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
        if (result.success === true) {
          setLoading(false);
          setCurrentContent(result.payload);
        }
      }
    };
    fetchCurrentSection();
  }, [currentSectionId]); // Add currentSectionId as a dependency
  //youtube id find
  const extractYouTubeVideoId = (url) => {
    const pattern =
      /(?:https?:\/\/(?:www\.)?)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };
  // Drag n drop functionality for content
  const onSortEnd = (oldIndex, newIndex) => {
    setCurrentContent((currentContent) => {
      if (currentContent) {
        return {
          ...currentContent,
          content: arrayMoveImmutable(
            currentContent.content,
            oldIndex,
            newIndex
          ),
        };
      }
      return null;
    });
  };
  // Drag n drop functionality for lesson
  const onSortlesson = (oldIndex1, newIndex1) => {
    setCurrentSubject((currentSubject) => {
      if (currentSubject && Array.isArray(currentSubject.lessons)) {
        return {
          ...currentSubject,
          lessons: arrayMoveImmutable(
            currentSubject.lessons,
            oldIndex1,
            newIndex1
          ),
        };
      }
      return null; // Return null or a default value if currentSubject is not an array
    });
  };
  // Drag n drop functionality for section
  const onSortsection = (oldIndex2, newIndex2) => {
    setCurrentSubject((currentSubject) => {
      if (currentSubject && Array.isArray(currentSubject.lessons)) {
        return {
          ...currentSubject,
          lessons: arrayMoveImmutable(
            currentSubject.lessons,
            oldIndex2,
            newIndex2
          ),
        };
      }
      return null; // Return null or a default value if currentSubject is not an array
    });
  };

  return (
    <>
      <Helmet>
        <title>Single Subject</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item xs={6}>
              <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                {currentSubject && currentSubject.title}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                className='custom-button'
                onClick={() => navigate(`/course/${courseGuid}/subjects`)}
                component={Link}
              >
                Back
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant='outlined'
                className='custom-button'
                // href={`/course/${courseGuid}/subject/${subjectGuid}/lesson/create`}
                component={Link}
              >
                Add Section
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : currentSubject && currentSubject.length !== 0 ? (
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={9}>
                <Card sx={{ p: 3 }}>
                  {currentContent && currentContent.length !== 0 ? (
                    <SortableList
                      onSortEnd={onSortEnd}
                      className='list'
                      draggedItemClassName='dragged'
                    >
                      {currentContent.content.map((item, index) => (
                        <SortableItem key={index}>
                          <div
                            style={{ marginBottom: '16px' }}
                            className='single-subject-content'
                          >
                            {item.type === 'image' ? (
                              <Box>
                                <img src={item.file_path} alt={item.type} />
                              </Box>
                            ) : item.type === 'html' ? (
                              <Box
                                dangerouslySetInnerHTML={{
                                  __html: item.content,
                                }}
                              />
                            ) : item.type === 'pdf' ? (
                              <Box>
                                <p>
                                  <a href={item.file_path}>{item.file_path}</a>
                                </p>
                                <div
                                  sx={{ alignItems: 'center', display: 'flex' }}
                                >
                                  <a href={item.file_path} download>
                                    <span>Download</span>
                                    <DescriptionIcon />
                                  </a>
                                </div>
                              </Box>
                            ) : item.type === 'youtube' ? (
                              <Box>
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
                              'no section content'
                            )}
                          </div>
                        </SortableItem>
                      ))}
                    </SortableList>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity='error'>
                      Content not found!
                    </Alert>
                  )}
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card className='lesson-accordion'>
                  <SortableList
                    onSortEnd={onSortlesson}
                    className='list'
                    draggedItemClassName='dragged'
                  >
                    {currentSubject &&
                      currentSubject.lessons.map((item, index) => (
                        <SortableItem key={index}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls={`panel1a-content-${index}`}
                              id={`panel1a-header-${index}`}
                            >
                              <Box>
                                <Typography>{item.title}</Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <List
                                sx={{
                                  padding: 0,
                                }}
                              >
                                <SortableList
                                  onSortEnd={onSortsection}
                                  className='list'
                                  draggedItemClassName='dragged'
                                >
                                  {Array.isArray(item.sections) &&
                                    item.sections.map((item, index) => (
                                      <SortableItem key={index}>
                                        <ListItem
                                          onClick={() => openDiv(item.guid)}
                                          sx={{
                                            padding: 0,
                                          }}
                                        >
                                          <ListItemButton
                                            sx={{
                                              padding: 0,
                                            }}
                                          >
                                            {item.title}
                                          </ListItemButton>
                                        </ListItem>
                                      </SortableItem>
                                    ))}
                                </SortableList>
                                {/* {Array.isArray(item.sections) &&
                                  item.sections.map((item, index) => (
                                    <ListItem
                                      key={index}
                                      onClick={() => openDiv(item.guid)}
                                      sx={{
                                        padding: 0,
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          padding: 0,
                                        }}
                                      >
                                        {item.title}
                                      </ListItemButton>
                                    </ListItem>
                                  ))} */}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                        </SortableItem>
                      ))}
                  </SortableList>
                  {/* {currentSubject &&
                    currentSubject.lessons.map((item, index) => (
                      <Accordion key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel1a-content-${index}`}
                          id={`panel1a-header-${index}`}
                        >
                          <Box>
                            <Typography>{item.title}</Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List
                            sx={{
                              padding: 0,
                            }}
                          >
                            {Array.isArray(item.sections) &&
                              item.sections.map((item, index) => (
                                <ListItem
                                  key={index}
                                  onClick={() => openDiv(item.guid)}
                                  sx={{
                                    padding: 0,
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      padding: 0,
                                    }}
                                  >
                                    {item.title}
                                  </ListItemButton>
                                </ListItem>
                              ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))} */}
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert sx={{ mt: 5 }} severity='error'>
              Content not found!
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};
export default SingleSubject;
