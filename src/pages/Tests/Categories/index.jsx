import React, { useState, useEffect } from "react";
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
import FormTextField from "../../../components/Common/formTextField";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { serialize } from "object-to-formdata";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import CreatedBy from "../../../Utils/createdBy";
import theme from "../../../configs/theme";
import CheckTokenValid from "../../../components/Redirect/CheckTokenValid";

const options = [
  {
    label: "All Test",
    link: "/test/category/tests",
  },
  {
    label: "Link Test",
    link: "/test/category/link-test",
  }
];

const Categories = () => {
  // reactHook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({
    title: "",
  });
  const {
    primary: { main: primaryColor },
  } = theme.palette;
  const {
    success: { main: successColor },
  } = theme.palette;
  // State Manage
  const [allCatecories, setAllCatecories] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");

  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch Category list
  useEffect(() => {
    const fetchItems = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `${BASE_URL}/tests/categories`,
          requestOptions
        );
        const result = await response.json();
        setAllCatecories(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Search Users
  const filteredItems =
    allCatecories &&
    allCatecories.filter((item) => {
      const searchVal = `${item.title} ${item.category_id}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();
      return searchVal.includes(searchValue);
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const lastIndex = currentPage * itemPerPage;
  const firstIndex = lastIndex - itemPerPage;
  const currentItems = filteredItems.slice(firstIndex, lastIndex);
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
  const [currentItemGuid, setCurrentItemGuid] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentItemGuid(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Actions
  const [alertOpen, setAlertOpen] = useState(null);
  const [isActionSuccess, setIsActionSuccess] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const handleConfirmOpen = () => {
    setActionConfirmOpen(true);
  };
  const actionConfirmClose = () => {
    setActionConfirmOpen(false);
  };
  // Delete function on submit
  const handleBulkDelete = async () => {
    setActionConfirmOpen(false);
    var formData = new FormData();
    formData.append("categories[0]", currentItemGuid )
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/tests/delete_categories`,
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

  // Create popup open
  const [itemCreate, setItemCreate] = useState("");
  const handleCreate = () => {
    setActionConfirmOpen(true);
    setItemCreate("create");
  };

  //  Create Category submit action
  const handleCreateCategory = async (data) => {
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/tests/create_category`,
        requestOptions
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        const newCategory = {
          category_id: result.payload.category_id,
          title: data.title,
          created_by: CreatedBy,
          // Add any other properties you want
        };

        setAllCatecories([...allCatecories, newCategory]);
        setActionMessage("Category created successfully.");
        setActionConfirmOpen(false);
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      } else {
        setIsActionSuccess(false);
        setActionMessage(result.message.title);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
    } catch (error) {
      setIsActionSuccess(false);
    }
  };
  return (
    <>
      <CheckTokenValid />
      <Helmet>
        <title>All Categories</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {itemCreate === "create" ? (
          <Dialog
            open={actionConfirmOpen}
            onClose={actionConfirmClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            sx={{ maxWidth: "600px", margin: "0px auto" }}
          >
            <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>
              Create Category
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(handleCreateCategory)}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <FormTextField
                      control={control}
                      label="Title"
                      variant="outlined"
                      name="title"
                      pattern="[A-Za-z]{1,}"
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <DialogActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    onClick={actionConfirmClose}
                    color="primary"
                    variant="outlined"
                    className="custom-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    className="custom-button"
                  >
                    Create
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog
            open={actionConfirmOpen}
            onClose={actionConfirmClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this category?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={actionConfirmClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleBulkDelete} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        )}

        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setIsActionSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          {itemCreate && itemCreate === "create" ? (
            <Alert severity={isActionSuccess === true ? "success" : "warning"}>
              {actionMessage}
            </Alert>
          ) : (
            <Alert severity={isActionSuccess === true ? "success" : "warning"}>
              {isActionSuccess === true
                ? "Category Deleted Successfully"
                : "Category not deleted."}
            </Alert>
          )}
        </Snackbar>

        <Box sx={{ flexGrow: 1, p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <h1>All Categories</h1>
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                className="custom-button"
                variant="contained"
                onClick={handleCreate}
              >
                Create New
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : allCatecories && allCatecories.length !== 0 ? (
            <>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Search by title and ID"
                    placeholder="Search by title and ID"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
                className="manage-course"
              >
                <Grid item xs={12}>
                  {currentItems && currentItems.length !== 0 ? (
                    <Card>
                      {currentItems &&
                        currentItems.map((item, index) => (
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
                                md={0.5}
                                sx={{
                                  display: { xs: "flex", md: "block" },
                                  justifyContent: { xs: "space-between" },
                                }}
                              >
                                <Box
                                  className="course-title"
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {index + 1 + (currentPage - 1) * itemPerPage}-
                                  <Typography
                                    component="h3"
                                    variant="h6"
                                    sx={{
                                      ml: 1,
                                      fontWeight: "500",
                                      display: { xs: "block", md: "none" },
                                    }}
                                  >
                                    <Link
                                      href={`/test/category/tests/${item.guid}`}
                                      sx={{
                                        textDecoration: "none",
                                        color: "inherit",
                                      }}
                                    >
                                      {item.title}
                                    </Link>
                                  </Typography>
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
                                      handleClick(event, item.guid)
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
                                  >
                                    {options.map((option, index) => {
                                      const linkUrl = `${option.link}/${currentItemGuid}`;
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
                                      value="delete"
                                      onClick={handleConfirmOpen}
                                    >
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} md={4.5}>
                                <Typography
                                  component="h3"
                                  variant="h6"
                                  sx={{
                                    fontWeight: "500",
                                    display: { xs: "none", md: "block" },
                                  }}
                                >
                                  <Link
                                    href={`/test/category/tests/${item.guid}`}
                                    sx={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    {item.title}
                                  </Link>
                                </Typography>
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
                                    onClick={(event) => handleClick(event, item.guid)}
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
                                  >
                                    {options.map((option, index) => {
                                      const linkUrl = `${option.link}/${currentItemGuid}`;
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
                                      value="delete"
                                      onClick={handleConfirmOpen}
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
                      Category not found!
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
              Category not found!
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Categories;
