import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Helmet } from "react-helmet";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import CreatedBy from "../../../Utils/createdBy";
import { serialize } from "object-to-formdata";
import FormTextField from "../../../components/Common/formTextField";
import FormEditorField from "../../../components/Common/formEditorField";
import SidebarLeft from "../../../components/Sidebar/SidebarLeft";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const SingleSubject = () => {
  const { courseGuid } = useParams();
  const { subjectGuid } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentSubject, setCurrentSubject] = useState(null);
  // Authentication
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  // Get current course details
  useEffect(() => {
    const fetchCurrentSubject = async () => {
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/course/${courseGuid}/subject/${subjectGuid}/preview`,
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
  console.log(currentSubject)
  return (
    <>
      <Helmet>
        <title>{currentSubject && currentSubject.title}</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        {loading ? (
          <Box sx={{ width: "100%", textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid
              container
              spacing={2}
              sx={{ width: "100%" }}
              alignItems="center"
            ></Grid>
            <Grid container spacing={2} sx={{ my: 3 }}>
              <Grid item xs={6}>
                <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                  {currentSubject.title}
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  className="custom-button"
                  href={`/course/subjects`}
                  component={Link}
                >
                  Back
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="outlined"
                  className="custom-button"
                  href={`/course/${courseGuid}/subject/${subjectGuid}/lesson/create`}
                  component={Link}
                >
                  Add Lesson
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={9}>
                <Card sx={{ p: 3 }}>Content</Card>
              </Grid>
              <Grid item xs={3}>
                <Card className="lesson-accordian">
                  {currentSubject &&
                    currentSubject.lessons.map((item, index) => (
                      <Accordion key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id={`panel1a-header${index}`}
                        >
                          <Typography>{item.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Suspendisse malesuada lacus ex, sit amet
                            blandit leo lobortis eget.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}

                  {/* <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                      </Typography>
                    </AccordionDetails>
                  </Accordion> */}
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
};
export default SingleSubject;
