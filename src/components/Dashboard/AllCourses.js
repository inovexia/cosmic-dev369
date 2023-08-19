import React, { useState, useEffect } from "react";
import Course from "../../assets/images/Course.jpg";
import {
  Rating,
  Chip,
  Box,
  Card,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import { Link } from "react-router-dom";
import CheckTokenValid from "../Redirect/CheckTokenValid";
import ReactHtmlParser from "react-html-parser";


function truncateString(text, maxCharLength) {
  if (text.length <= maxCharLength) {
    return text;
  }
  return text.slice(0, maxCharLength) + '...';
}
const AllCourses = () => {
  const maxCharLength = 20;
  const ratingValueString = "3.5";
  const ratingValue = parseFloat(ratingValueString);
  // States
  const [courses, setCourses] = useState("");
  const [loading, setLoading] = useState(true);
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  // Fetch Course list
  useEffect(() => {
    const fetchCourses = async () => {
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch(`${BASE_URL}/course/list`, requestOptions);
        const result = await response.json();
        setCourses(result.payload);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    fetchCourses();
  },[]);
  return (
    <>
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Entry Title and button */}
          <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
              <Grid item xs={12} md={6}>
              <h1>All Courses</h1>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button className="custom-button" component={Link} to={"/course/list"} variant="outlined">
                View All Course
              </Button>
                <Button
                  className="custom-button"
                component={Link}
                to={"/course/create"}
                variant="contained"
                sx={{ ml: 2 }}
              >
                Add New Course
              </Button>
            </Grid>
          </Grid>
          {/* Course Slider */}
          <Card sx={{ p: 3, mt: 3 }}>
            <Box className="custom-swiper">
              <Swiper
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                  },
                  1024: {
                    slidesPerView: 1.5,
                  },
                  1200: {
                    slidesPerView: 2.2,
                  },
                  1400: {
                    slidesPerView: 2.6,
                  },
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {courses && courses.data.length !== 0 ? (
                  courses &&
                    courses.data.map((course, index) => {
                      const truncatedText = truncateString(course.description, maxCharLength)
                        return(
                    <SwiperSlide key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6} className="course-image">
                          <img src={Course} alt="Course" loading="lazy" />
                        </Grid>
                        <Grid item xs={12} md={6} display="grid">
                          <h3>{course.title}</h3>
                          <Box className="rating-box" sx={{ display: "none" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <h4
                                style={{ color: "#888888", fontWeight: "400" }}
                              >
                                5.0
                              </h4>
                              <Rating
                                className="rating-star"
                                name="read-only"
                                value={ratingValue}
                                readOnly
                              />
                            </Box>
                            <Chip
                              className="chip-badge"
                              label="$120"
                              color="secondary"
                            />
                          </Box>
                          <Box>
                            <Typography color="inherit" component="span">
                              {ReactHtmlParser(truncatedText)}
                            </Typography>
                          </Box>
                          <h4 style={{ color: "#888888", fontWeight: "400" }}>
                            <strong>Author: </strong>{course.created_by}
                          </h4>
                          <Button
                            variant="contained"
                            component={Link}
                            to={`/course/manage/${course.guid}`}
                            fullWidth
                          >
                            Manage Course
                          </Button>
                        </Grid>
                      </Grid>
                        </SwiperSlide>
                        )
})
                ) : (
                  <Alert sx={{ mt: 5 }} severity="error">
                    Course not found!
                  </Alert>
                )}
              </Swiper>
            </Box>
          </Card>
        </>
      )}
    </>
  );
};

export default AllCourses;
