import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Link,
  Tabs,
  Tab,
  Typography,
  Grid,
  Button,
  Tooltip,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));
const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box py={3}>{children}</Box>}
    </div>
  );
};

const options = [
  {
    label: "Attempts",
    link: "/test/manage",
  },
  {
    label: "Submissions",
    link: "/test/report",
  },
  {
    label: "Preview",
    link: "/test/preview-test",
  },
];

const UpcommingOptions = [
  {
    label: "Take Test",
    link: "/test/take-test",
  },
  {
    label: "Preview",
    link: "/test/preview-test",
  },
  {
    label: "Manage",
    link: "/test/manage",
  },
];

const ITEM_HEIGHT = 48;

const TestsTab = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Action Button
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTestGuid, setCurrentTestGuid] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentTestGuid(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // States
  const [tests, setTests] = useState("");
  const [loading, setLoading] = useState(true);
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch Test list
  useEffect(() => {
    const fetchTests = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/tests/list`, requestOptions);
        const result = await response.json();
        setTests(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchTests();
  }, []);
  return (
    <>
      <Grid container sx={{ alignItems: "center" }}>
        <Grid item xs={3} md={6}>
          <h2>Tests</h2>
        </Grid>
        <Grid
          item
          xs={9}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Link href={"/test/create"} sx={{ mr: 2 }}>
            <AddCircleRoundedIcon
              color="primary"
              sx={{ width: "53px", height: "53px" }}
            />
          </Link>
          <Button
            className="custom-button"
            component={Link}
            href={"/test/list"}
            variant="outlined"
          >
            View All Test
          </Button>
        </Grid>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <Box sx={{ px: 3, py: 2 }} className="test-tab-content">
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab style={{ padding: "0px" }} label="Ongoing test" />
            <Tab
              style={{ padding: "0px", marginLeft: "20px" }}
              label="Upcomming Test"
            />
          </Tabs>

          <TabPanel value={selectedTab} index={0}>
            {loading ? (
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : tests && tests.data.length !== 0 ? (
              tests &&
              tests.data.slice(0, 3).map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "0px",
                    borderLeft: "4px solid #B8B8B8",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <h3>{item.title}</h3>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Details</Typography>
                          <b>{"Title:"}</b> <em>{item.title}</em>
                          <br />
                          <b>{"ID:"}</b> <em>{item.guid}</em>
                          <br />
                          <b>{"Type:"}</b> <em>{item.type}</em>
                          <br />
                          <b>{"Created On:"}</b> <em>{item.created_on}</em>
                        </React.Fragment>
                      }
                      placement="right-start"
                    >
                      <InfoOutlinedIcon
                        sx={{ color: "#B8B8B8", ml: 2, mb: 1 }}
                      />
                    </HtmlTooltip>
                  </Box>
                  <Box>
                    <IconButton
                      aria-label="more"
                      id="long-button-1"
                      aria-controls={open ? "long-menu-1" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, item.guid)}
                      className="no-pd"
                    >
                      <MoreVertOutlinedIcon />
                    </IconButton>
                    <Menu
                      id="long-menu-1"
                      MenuListProps={{
                        "aria-labelledby": "long-button-1",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      {options.map((option, index) => {
                        const linkUrl = `${option.link}/${currentTestGuid}`;
                        return (
                          <MenuItem key={index} onClick={handleClose}>
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
                    </Menu>
                  </Box>
                </Card>
              ))
            ) : (
              <Alert sx={{ mt: 5 }} severity="error">
                Test not found!
              </Alert>
            )}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button
                className="custom-button"
                component={Link}
                href={"/test/list"}
                variant="outlined"
              >
                View All Test
              </Button>
            </Grid>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            {loading ? (
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : tests && tests.data.length !== 0 ? (
              tests &&
              tests.data.slice(0, 3).map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "0px",
                    borderLeft: "4px solid #B8B8B8",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <h3>{item.title}</h3>
                    <HtmlTooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">Details</Typography>
                          <b>{"Title:"}</b> <em>{item.title}</em>
                          <br />
                          <b>{"ID:"}</b> <em>{item.guid}</em>
                          <br />
                          <b>{"Type:"}</b> <em>{item.type}</em>
                          <br />
                          <b>{"Created On:"}</b> <em>{item.created_on}</em>
                        </React.Fragment>
                      }
                      placement="right-start"
                    >
                      <InfoOutlinedIcon
                        sx={{ color: "#B8B8B8", ml: 2, mb: 1 }}
                      />
                    </HtmlTooltip>
                  </Box>
                  <Box>
                    <IconButton
                      aria-label="more"
                      id="long-button-2"
                      aria-controls={open ? "long-menu-2" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, item.guid)}
                      className="no-pd"
                    >
                      <MoreVertOutlinedIcon />
                    </IconButton>
                    <Menu
                      id="long-menu-2"
                      MenuListProps={{
                        "aria-labelledby": "long-button-2",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      {UpcommingOptions.map((upoption, index) => {
                        const linkUrl = `${upoption.link}/${currentTestGuid}`;
                        return (
                          <MenuItem key={index} onClick={handleClose}>
                            <Link
                              href={linkUrl}
                              underline="none"
                              color="inherit"
                            >
                              {upoption.label}
                            </Link>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Box>
                </Card>
              ))
            ) : (
              <Alert sx={{ mt: 5 }} severity="error">
                Test not found!
              </Alert>
            )}
          </TabPanel>
        </Box>
      </Card>
    </>
  );
};

export default TestsTab;
