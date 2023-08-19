import React from "react";
import {
  Grid
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactHtmlParser from "react-html-parser";

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
            <Grid container spacing={3} sx={{ mb: 5 }} key={index}>
              <Grid item xs={10} sx={{display:"flex", fontSize:"20px"}}>
                ({index + 1}). <span>{ReactHtmlParser(item.question)}</span>
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
