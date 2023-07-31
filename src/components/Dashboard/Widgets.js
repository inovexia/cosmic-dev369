import React, { useState } from "react";
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
} from "@mui/material";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';

const Widgets = ({courses, classes, tests, students}) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={6} md={3}>
        <Card className="widget-card">
          <Grid container>
            <Grid item xs={8}>
              <Box className="widget-score">
                <h3>Online Class</h3>
                <Typography
                  color="primary"
                  sx={{
                    fontSize: "36px",
                    fontWeight: "44px",
                    fontWeight: "500",
                  }}
                  component="h2"
                >
                 {classes.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="widget-icon">
                <PersonalVideoIcon color="primary" style={{ fontSize: 60 }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card className="widget-card">
          <Grid container>
            <Grid item xs={8}>
              <Box className="widget-score">
                <h3>Tests</h3>
                <Typography
                  color="primary"
                  sx={{
                    fontSize: "36px",
                    fontWeight: "44px",
                    fontWeight: "500",
                  }}
                  component="h2"
                >
                  {tests.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="widget-icon">
                <SpeakerNotesIcon color="primary" style={{ fontSize: 60 }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card className="widget-card">
          <Grid container>
            <Grid item xs={8}>
              <Box className="widget-score">
                <h3>Courses</h3>
                <Typography
                  color="primary"
                  sx={{
                    fontSize: "36px",
                    fontWeight: "44px",
                    fontWeight: "500",
                  }}
                  component="h2"
                >
                  {courses.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="widget-icon">
                <LibraryBooksIcon color="primary" style={{ fontSize: 60 }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card className="widget-card">
          <Grid container>
            <Grid item xs={8}>
              <Box className="widget-score">
                <h3>Students</h3>
                <Typography
                  color="primary"
                  sx={{
                    fontSize: "36px",
                    fontWeight: "44px",
                    fontWeight: "500",
                  }}
                  component="h2"
                >
                  {students.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="widget-icon">
                <PersonIcon color="primary" style={{ fontSize: 60 }} />
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Widgets;
