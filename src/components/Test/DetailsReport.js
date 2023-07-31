import React from "react";
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Tabs,
  Tab,
  Link,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const DetailsReport = ({ testResult }) => {
  //console.log(testResult);
  const formatedResult = [...testResult.answers].sort((a, b) => a.guid.localeCompare(b.guid));
  return (
    <>
       <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={10}>
                <strong>Sr No.</strong> <strong>Question</strong>
              </Grid>
              <Grid item xs={1}>
               <strong>Remark</strong>
              </Grid>
              <Grid item xs={1}>
              <strong>Mark</strong>
              </Grid>
            </Grid>
      {formatedResult &&
        formatedResult.map((item, index) => {
          return (
            <Grid container spacing={3} sx={{ mb: 3 }} key={index}>
              <Grid item xs={10}>
                {index + 1}. {item.question}
              </Grid>
              <Grid item xs={1}>
                {item.response === "CORRECT" ? (
                  <CheckCircleIcon style={{ color: "#A6CD4E" }} />
                ) : (
                  <CancelIcon style={{ color: "#FF4646" }} />
                )}
              </Grid>
              <Grid item xs={1}>
              {item.marks_obtained}
              </Grid>
            </Grid>
          );
        })}
    </>
  );
};

export default DetailsReport;
