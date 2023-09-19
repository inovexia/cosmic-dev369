import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Helmet } from "react-helmet";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import Course from "../../../assets/images/Course.jpg";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { useTheme } from "@mui/material/styles";
import CheckTokenValid from "../../../components/Redirect/CheckTokenValid";

const Subjects = () => {
  const { courseGuid } = useParams();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;

  const options = [
    {
      label: "View",
      link: `/course/${courseGuid}/subject/edit`,
    },
    {
      label: "Update",
      link: `/course/${courseGuid}/subject/edit`,
    },
  ];

  const ITEM_HEIGHT = 48;
  // State Manage
  const [filterOption, setFilterOption] = useState("all");
  const [subjects, setSubjects] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  // Fetch Course list
  useEffect(() => {
    const fetchSubjects = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${BASE_URL}/course/${courseGuid}/subject/list`,
          requestOptions
        );
        const result = await response.json();
        setSubjects(result.payload.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredItems =
    subjects &&
    subjects.filter((item) => {
      const searchVal = `${item.title} ${item.description}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();

      if (filterOption === "all") {
        return searchVal.includes(searchValue);
      } else if (filterOption === "published") {
        return (
          searchVal.includes(searchValue) && item.status === "1" // Published courses
        );
      } else if (filterOption === "unpublished") {
        return (
          searchVal.includes(searchValue) && item.status === "0" // Unpublished courses
        );
      } else if (filterOption === "archive") {
        return (
          searchVal.includes(searchValue) && item.status === "2" // Archived courses
        );
      }

      return true; // By default, show all courses
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const lastIndex = currentPage * itemPerPage;
  const firstIndex = lastIndex - itemPerPage;
  const currentItem = filteredItems.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredItems && filteredItems.length / itemPerPage
  );
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

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

  // Action Button
  const [anchorEl, setAnchorEl] = useState(null);
  const [subjectGuid, setSubjectGuid] = useState(null);
  const open = Boolean(anchorEl);
  const [currStatus, setCurrStatus] = useState("");
  const [changeStatus, setChangeStatus] = useState("");

  const handleClick = (event, id, status) => {
    setAnchorEl(event.currentTarget);
    setSubjectGuid(id);
    setCurrStatus(status)
    if (status === "1") {
      setChangeStatus("0")
    }
    else {
      setChangeStatus("1");
    }
    
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Delete
  const [alertOpen, setAlertOpen] = useState(null);
  const [isActionSuccess, setIsActionSuccess] = useState(null);
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const [actionValue, setActionValue] = useState("")
  const [newStatus, setNewStatus] = useState("");
  const handleConfirmOpen = (action) => {
    setActionConfirmOpen(true);
    setActionValue(action)
  };
  const actionConfirmClose = () => {
    setActionConfirmOpen(false);
  };
  // Delete function on submit
  const handleBulkDeleteUser = async () => {
    setActionConfirmOpen(false);
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/${courseGuid}/subject/${subjectGuid}/delete`,
        requestOptions
      );
      const result = await res.json();
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


  // Delete function on submit
  const handleChangeStatus = async () => {
    var formdata = new FormData();
    formdata.append("status", changeStatus);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/${courseGuid}/subject/${subjectGuid}/change_status`,
        requestOptions
      );
      const result = await res.json();
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
        <title>All Subjects</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Dialog
          open={actionConfirmOpen}
          onClose={actionConfirmClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {actionValue && actionValue === "Publish"
              ? "Confirm Publish"
              : actionValue && actionValue === "Unpublish"
              ? "Confirm Unpublish"
              : "Confirm Delete"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to{" "}
              {actionValue && actionValue === "Publish"
                ? "Publish"
                : actionValue && actionValue === "Unpublish"
                ? "Unpublish"
                : "Delete"}{" "}
              this Subject?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={actionConfirmClose} color="primary">
              Cancel
            </Button>
            {actionValue && actionValue === "Publish" ? (
              <Button onClick={handleChangeStatus} color="primary" autoFocus>
                Confirm
              </Button>
            ) : actionValue && actionValue === "Unpublish" ? (
              <Button onClick={handleChangeStatus} color="primary" autoFocus>
                Confirm
              </Button>
            ) : (
              <Button onClick={handleBulkDeleteUser} color="primary" autoFocus>
                Confirm
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setIsActionSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          {actionValue && actionValue === "Publish" ? (
            <Alert severity={isActionSuccess === true ? "success" : "warning"}>
              {isActionSuccess === true
                ? "Subject Published Successfully"
                : "Subject not published."}
            </Alert>
          ) : actionValue && actionValue === "Unpublish" ? (
            <Alert severity={isActionSuccess === true ? "success" : "warning"}>
              {isActionSuccess === true
                ? "Subject Unpublished Successfully"
                : "Subject not Unpublished."}
            </Alert>
          ) : (
            <Alert severity={isActionSuccess === true ? "success" : "warning"}>
              {isActionSuccess === true
                ? "Subject Deleted Successfully"
                : "Subject not deleted."}
            </Alert>
          )}
        </Snackbar>

        <Box sx={{ flexGrow: 1, p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <h1>All Subjects</h1>
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                component={Link}
                href={`/course/${courseGuid}/subject/create`}
                variant="contained"
              >
                Create Subject
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : subjects && subjects.length !== 0 ? (
            <>
              <Grid
                container
                spacing={2}
                sx={{ mt: 3, justifyContent: "space-between" }}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Search by title and description"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="filter-label">Filter by Status</InputLabel>
                    <Select
                      labelId="filter-label"
                      label="Filter by Status"
                      id="filter-select"
                      value={filterOption}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="unpublished">Unpublished</MenuItem>
                      <MenuItem value="archive">Archive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
                className="manage-course"
              >
                <Grid item xs={12}>
                  {currentItem && currentItem.length !== 0 ? (
                    <Card>
                      {currentItem &&
                        currentItem.map((item, index) => (
                          <Box sx={{ px: 3 }} key={index}>
                            <Grid
                              container
                              sx={{
                                borderBottom: "1px solid #B8B8B8",
                                py: 2,
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={1}
                                sx={{
                                  display: { xs: "flex", md: "block" },
                                  justifyContent: { xs: "space-between" },
                                }}
                              >
                                <Box className="course-image">
                                  <img
                                    src={Course}
                                    alt={item.title}
                                    loading="lazy"
                                  />
                                </Box>
                                <Grid
                                  item
                                  sx={{ display: { xs: "block", md: "none" } }}
                                >
                                  <IconButton
                                    aria-label="more"
                                    id="long-button1"
                                    aria-controls={
                                      open ? "long-menu" : undefined
                                    }
                                    aria-expanded={open ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={(event) =>
                                      handleClick(event, item.guid, item.status)
                                    }
                                    className="no-pd"
                                  >
                                    <MoreVertOutlinedIcon />
                                  </IconButton>
                                  <Menu
                                    sx={{
                                      boxShadow:
                                        "0px 0px 7px -5px rgba(0,0,0,0.1)",
                                    }}
                                    id="long-menu1"
                                    MenuListProps={{
                                      "aria-labelledby": "long-button1",
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                      style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: "10ch",
                                      },
                                    }}
                                  >
                                    {options.map((option, index) => {
                                      const linkUrl = `${option.link}/${subjectGuid}`;
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={handleClose}
                                        >
                                          <Link
                                            href={linkUrl}
                                            underline="none"
                                            color="inherit"
                                          >
                                            {option.label}
                                          </Link>
                                        </MenuItem>
                                      );
                                    })}
                                    <MenuItem
                                      value={
                                        currStatus === "1"
                                          ? "Unpublish"
                                          : "Publish"
                                      }
                                      onClick={() =>
                                        handleConfirmOpen(
                                          currStatus === "1"
                                            ? "Unpublish"
                                            : "Publish"
                                        )
                                      }
                                    >
                                      {currStatus === "1"
                                        ? "Unpublish"
                                        : "Publish"}
                                    </MenuItem>
                                    <MenuItem
                                      value="delete"
                                      onClick={() =>
                                        handleConfirmOpen("delete")
                                      }
                                    >
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <h3>
                                  <Link
                                    href={`/course/manage/${item.guid}`}
                                    sx={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    {item.title}
                                  </Link>
                                </h3>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <h4>{item.created_by}</h4>
                              </Grid>
                              <Grid item xs={12} md={2}>
                                {item.status === "0" ? (
                                  <Typography
                                    variant="span"
                                    component="span"
                                    color="secondary"
                                  >
                                    Unpublished
                                  </Typography>
                                ) : item.status === "1" ? (
                                  <Typography
                                    variant="span"
                                    component="span"
                                    color={successColor}
                                  >
                                    Published
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="span"
                                    component="span"
                                    color="primary"
                                  >
                                    Archived
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={1}>
                                <Grid
                                  item
                                  sx={{ display: { xs: "none", md: "block" } }}
                                >
                                  <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={
                                      open ? "long-menu" : undefined
                                    }
                                    aria-expanded={open ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={(event) =>
                                      handleClick(event, item.guid, item.status)
                                    }
                                    className="no-pd"
                                  >
                                    <MoreVertOutlinedIcon />
                                  </IconButton>
                                  <Menu
                                    id="long-menu"
                                    MenuListProps={{
                                      "aria-labelledby": "long-button",
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                      style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: "10ch",
                                      },
                                    }}
                                  >
                                    {options.map((option, index) => {
                                      const linkUrl = `${option.link}/${subjectGuid}`;
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={handleClose}
                                        >
                                          <Link
                                            href={linkUrl}
                                            underline="none"
                                            color="inherit"
                                          >
                                            {option.label}
                                          </Link>
                                        </MenuItem>
                                      );
                                    })}
                                    <MenuItem
                                      value={
                                        currStatus === "1"
                                          ? "Unpublish"
                                          : "Publish"
                                      }
                                      onClick={() =>
                                        handleConfirmOpen(
                                          currStatus === "1"
                                            ? "Unpublish"
                                            : "Publish"
                                        )
                                      }
                                    >
                                      {currStatus === "1"
                                        ? "Unpublish"
                                        : "Publish"}
                                    </MenuItem>
                                    <MenuItem
                                      value="delete"
                                      onClick={() =>
                                        handleConfirmOpen("delete")
                                      }
                                    >
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                    </Card>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity="error">
                      Subject not found!
                    </Alert>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 5, justifyContent: "center" }}
              >
                <Grid item>
                  {filteredItems && filteredItems.length > itemPerPage ? (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <ButtonGroup
                          color="primary"
                          aria-label="outlined primary button group"
                          className="pagination-button"
                        >
                          <Button
                            onClick={prePage}
                            disabled={currentPage === 1}
                          >
                            PREV
                          </Button>
                          {numbers.map((n, i) => (
                            <Button
                              className={currentPage === n ? "active" : ""}
                              key={i}
                              onClick={() => changeCPage(n)}
                              style={{
                                backgroundColor:
                                  currentPage === n ? primaryColor : "",
                              }}
                            >
                              {n}
                            </Button>
                          ))}
                          <Button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                          >
                            NEXT
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert sx={{ mt: 5 }} severity="error">
              Subject not found!
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Subjects;
