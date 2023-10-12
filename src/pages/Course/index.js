import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Link,
  Button,
  TextField,
  MenuItem,
  Menu,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Alert,
  ButtonGroup,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SidebarLeft from '../../components/Sidebar/SidebarLeft';
import Course from '../../assets/images/Course.jpg';
import BASE_URL from '../../Utils/baseUrl';
import token from '../../Utils/token';
import Network from '../../Utils/network';
import { useTheme } from '@mui/material/styles';
import CheckTokenValid from '../../components/Redirect/CheckTokenValid';

const Courses = () => {
  const options = [
    {
      label: 'Preview',
      link: 'course/subject/MYN18/lesson/PHP22/preview',
    },
    {
      label: 'Update',
      link: '/lesson/update',
    },
  ];
  const ITEM_HEIGHT = 48;
  // const { courseGuid } = useParams();
  // const { subjectGuid } = useParams();
  // const { lessonGuid } = useParams();
  const [courseGuid, setCourseGuid] = useState('');
  const [courseId, setCourseId] = useState('');
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;

  // State Management
  const [filterOption, setFilterOption] = useState('all');
  const [searchTitle, setSearchTitle] = useState('');
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState();

  // publish and unpublish
  const [isPublished, setIsPublished] = useState(false);
  const handlePublishToggle = () => {
    setIsPublished(!isPublished);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);

  // search and filter functionality
  const filteredItems =
    courses &&
    courses.filter((item) => {
      const searchVal = `${item.title} ${item.description}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();

      if (filterOption === 'all') {
        return searchVal.includes(searchValue);
      } else if (filterOption === 'published') {
        return (
          searchVal.includes(searchValue) && item.status === '1' // Published courses
        );
      } else if (filterOption === 'unpublished') {
        return (
          searchVal.includes(searchValue) && item.status === '0' // Unpublished courses
        );
      } else if (filterOption === 'archive') {
        return (
          searchVal.includes(searchValue) && item.status === '2' // Archived courses
        );
      }

      return true; // By default, show all courses
    });
  // console.log(filteredItems);
  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const lastIndex = currentPage * itemPerPage;
  const firstIndex = lastIndex - itemPerPage;
  const currentItem =
    filteredItems && filteredItems.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredItems && filteredItems.length / itemPerPage
  );
  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  }

  // Get Course list
  useEffect(() => {
    const fetchCurrentCourse = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(`${BASE_URL}/course/list`, requestOptions);
      const result = await response.json();
      console.log(result.payload.data.guid);
      if (result.success === true) {
        setLoading(false);
        setCurrentCourse(result.payload.data.guid);
        setCourses(result.payload.data);
      }
    };
    fetchCurrentCourse();
  }, []);

  // Add subjectGuid to the dependency array
  // console.log(lessons);
  // dropdown menu
  // Action Button
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const [currStatus, setCurrStatus] = useState('');
  const [changeStatus, setChangeStatus] = useState('');

  const handleClick = (event, id, status) => {
    setAnchorEl(event.currentTarget);
    setCourseGuid(id);
    setCourseId(id);
    setCurrStatus(status);
    // if (status === '1') {
    //   setChangeStatus('0');
    // } else {
    //   setChangeStatus('1');
    // }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // Delete
  const [alertOpen, setAlertOpen] = useState(null);
  const [isActionSuccess, setIsActionSuccess] = useState(null);
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const handleConfirmOpen = (action, id) => {
    setActionConfirmOpen(true);
    setActionValue(action);
    setCourseGuid(id);
    if (action === '1') {
      setChangeStatus('0');
    } else {
      setChangeStatus('1');
    }
  };
  const actionConfirmClose = () => {
    setActionConfirmOpen(false);
  };
  // Delete function on submit
  const handleBulkDeleteUser = async () => {
    setActionConfirmOpen(false);
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/delete/${courseId}`,
        requestOptions
      );
      const result = await res.json();
      // console.log(result);
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  // publish and unpublish function
  const handleChangeStatus = async () => {
    var formdata = new FormData();
    formdata.append('status', changeStatus);

    // return;
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/status/${courseGuid}`,
        requestOptions
      );
      const result = await res.json();
      // console.log(result);
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };
  return (
    <>
      <CheckTokenValid />
      <Helmet>
        <title>All Courses</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Dialog
          open={actionConfirmOpen}
          onClose={actionConfirmClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            {actionValue && actionValue === '0'
              ? 'Confirm Publish'
              : actionValue && actionValue === '1'
              ? 'Confirm Unpublish'
              : 'Confirm Delete'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Are you sure you want to{' '}
              {actionValue && actionValue === '0'
                ? 'Publish'
                : actionValue && actionValue === '1'
                ? 'Unpublish'
                : 'Delete'}{' '}
              this Course?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={actionConfirmClose} color='primary'>
              Cancel
            </Button>
            {actionValue && actionValue === '0' ? (
              <Button onClick={handleChangeStatus} color='primary' autoFocus>
                Confirm
              </Button>
            ) : actionValue && actionValue === '1' ? (
              <Button onClick={handleChangeStatus} color='primary' autoFocus>
                Confirm
              </Button>
            ) : (
              <Button onClick={handleBulkDeleteUser} color='primary' autoFocus>
                Confirm
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setIsActionSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {actionValue && actionValue === '0' ? (
            <Alert severity={isActionSuccess === true ? 'success' : 'warning'}>
              {isActionSuccess === true
                ? 'Course Published Successfully'
                : 'Course not published.'}
            </Alert>
          ) : actionValue && actionValue === '1' ? (
            <Alert severity={isActionSuccess === true ? 'success' : 'warning'}>
              {isActionSuccess === true
                ? 'Course Unpublished Successfully'
                : 'Course not Unpublished.'}
            </Alert>
          ) : (
            <Alert severity={isActionSuccess === true ? 'success' : 'warning'}>
              {isActionSuccess === true
                ? 'Course Deleted Successfully'
                : 'Course not deleted.'}
            </Alert>
          )}
        </Snackbar>
        <Box sx={{ flexGrow: 1, p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <h1>All Courses</h1>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'right' }}>
              <Button
                component={Link}
                href={`/course/create`}
                variant='contained'
              >
                Create Course
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : courses && courses.length !== 0 ? (
            <>
              <Grid
                container
                spacing={2}
                sx={{ mt: 3, justifyContent: 'space-between' }}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    label='Search by title and description'
                    placeholder='Search by title'
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id='filter-label'>Filter by Status</InputLabel>
                    <Select
                      labelId='filter-label'
                      label='Filter by Status'
                      id='filter-select'
                      value={filterOption}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value='all'>All</MenuItem>
                      <MenuItem value='published'>Published</MenuItem>
                      <MenuItem value='unpublished'>Unpublished</MenuItem>
                      <MenuItem value='archive'>Archive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
                className='manage-course'
              >
                <Grid item xs={12}>
                  {currentItem && currentItem.length !== 0 ? (
                    <Card sx={{ px: 3 }}>
                      {currentItem &&
                        currentItem.map((item, index) => (
                          <div key={index}>
                            <Grid
                              container
                              sx={{
                                borderBottom: '1px solid #B8B8B8',
                                py: 2,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={1}
                                sx={{
                                  display: { xs: 'flex', md: 'block' },
                                  justifyContent: { xs: 'space-between' },
                                }}
                              >
                                <Box className='course-image'>
                                  <img
                                    src={Course}
                                    alt={item.title}
                                    loading='lazy'
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <h3>
                                  <Link
                                    href={`/course/${item.guid}/subjects`}
                                    sx={{
                                      textDecoration: 'none',
                                      color: 'inherit',
                                    }}
                                  >
                                    {item.title}
                                  </Link>
                                </h3>
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <p>{item.created_by}</p>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <label>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={
                                          item.status === '1' ? true : false
                                        }
                                        // onChange={handlePublishToggle}
                                        onClick={() =>
                                          handleConfirmOpen(
                                            item.status === '0' ? '0' : '1',
                                            item.guid
                                          )
                                        }
                                        name='publishSwitch'
                                      />
                                    }
                                    label=''
                                  />
                                  {item.status === '1'
                                    ? 'Published'
                                    : 'Unpublished'}
                                </label>
                              </Grid>
                              <Grid item xs={12} md={1}>
                                <Grid
                                  item
                                  sx={{ display: { xs: 'none', md: 'block' } }}
                                >
                                  <IconButton
                                    aria-label='more'
                                    id='long-button'
                                    aria-controls={
                                      open ? 'long-menu' : undefined
                                    }
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup='true'
                                    onClick={(event) =>
                                      handleClick(event, item.guid, item.status)
                                    }
                                    className='no-pd'
                                  >
                                    <MoreVertOutlinedIcon />
                                  </IconButton>
                                  <Menu
                                    id='long-menu'
                                    MenuListProps={{
                                      'aria-labelledby': 'long-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                      style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '10ch',
                                      },
                                    }}
                                  >
                                    <MenuItem onClick={handleClose}>
                                      <Link
                                        href={`/course/manage/${courseGuid}`}
                                        underline='none'
                                        color='inherit'
                                      >
                                        Manage
                                      </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      <Link
                                        href={`/course/update/${courseGuid}`}
                                        underline='none'
                                        color='inherit'
                                      >
                                        Update
                                      </Link>
                                    </MenuItem>
                                    <MenuItem
                                      value='delete'
                                      onClick={() =>
                                        handleConfirmOpen('delete')
                                      }
                                    >
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                    </Card>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity='error'>
                      Subject not found!
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert sx={{ mt: 5 }} severity='error'>
              Lesson not found!
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Courses;
