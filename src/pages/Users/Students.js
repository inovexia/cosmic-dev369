import React from "react";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const Students = () => {
  return (
    <>
      <Helmet>
        <title>Students</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, px: 3, mt: 5 }} className="manage-course">
          <h1>Create Course</h1>
        </Box>
      </Box>
    </>
  );
};

export default Students;
