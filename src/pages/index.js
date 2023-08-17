import React from "react";
import { Box, CircularProgress} from "@mui/material";
import CheckTokenValid from "../../src/components/Redirect/CheckTokenValid"

const Loader = () => {
  return (
    <>
      <CheckTokenValid/>
      <Box sx={{ display: 'flex', height:"70vh", alignItems:"center", justifyContent:"center" }}>
      <CircularProgress />
    </Box>
    </>
  );
};

export default Loader;
