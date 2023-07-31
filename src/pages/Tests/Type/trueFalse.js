import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";

const TrueFalse = () => {
  return (
    <>
      <Typography component="h4">True Or False</Typography>
    <RadioGroup
      aria-label="options"
      name="options"
      //value={value}
      //onChange={handleChange}
      className={`ans-true-false`}
    >
      <FormControlLabel value="true" control={<Radio />} label="True" />
      <FormControlLabel value="false" control={<Radio />} label="False" />
    </RadioGroup>
    </>
  );
};

export default TrueFalse;
