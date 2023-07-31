import React, { useState, useEffect } from "react";
import ListRoundedIcon from "@mui/icons-material/ListRounded";

import {
  Box,
  Drawer,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Checkbox,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";

const Anchor = "top" | "left" | "bottom" | "right";

export default function TestSidebar({ data, updateQuestion, selectedOptions }) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const handleButtonNumber = (buttonId ) => {
    updateQuestion(buttonId)
  };

  const[rev, setrev] = useState("")

  const maxIndex = Math.max(...Object.keys(selectedOptions));
  const missingIndices = [];
  const revOptions = [];
  
  for (let i = 0; i <= maxIndex; i++) {
    if (!(i in selectedOptions)) {
      missingIndices.push(i);
    }
  }
  for (let i = 0; i <= maxIndex; i++) {
    if (selectedOptions[i] && selectedOptions[i].review === true) {
      revOptions.push(i);
    }
  }
  // console.log(revOptions)
//console.log("data",data)
//console.log("obj",missingIndices)
  //console.log(missingIndices)
  //console.log(selectedOptions)
  const list = (anchor) => (
    <Box
      className="test-sidebar"
      sx={{ width: 300, marginTop: "64px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Grid container sx={{ p: 3 }}>
        {data.map((item, index) => (
          <Grid item sx={{ m: 1 }} key={index}>
            <Button
              variant={missingIndices.includes(index) ? "contained" : (revOptions.includes(index) ? "contained" : "outlined")}
              color={missingIndices.includes(index) ? "primary" : (revOptions.includes(index) ? "review" : "secondary")}
              onClick={(e) => handleButtonNumber(index)}
            >
              {index + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
 
  // console.log(missingIndices)
  // console.log(selectedOptions)
  return (
    <div>
      <Button onClick={toggleDrawer("right", true)}>
        <ListRoundedIcon sx={{ fontSize: "30px" }} />
      </Button>
      <Drawer
        anchor="right"
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            style={{ fontSize: "18px", marginBottom: "10px" }}
          >
            View Instruction
          </Typography>
          <ul style={{ listStyle: "none" }}>
            <li>
              <span
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: "#FF0000",
                  display: "inline-block",
                  marginRight: "5px",
                }}
              ></span>
              Unattempt
            </li>
            <li>
              <span
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: "#A6CD4E",
                  display: "inline-block",
                  marginRight: "5px",
                }}
              ></span>
              Review for later
            </li>
          </ul>
        </Box>
      </Drawer>
    </div>
  );
}
