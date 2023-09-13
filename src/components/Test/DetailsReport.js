import React from "react";
import {
  Grid,Box
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactHtmlParser from "react-html-parser";

const DetailsReport = ({ testResult, testDetails }) => {
  console.log(testDetails);
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
              {(item && item.file_hash !== null) ||
                                  (item &&
                                    item.file_url_path !== null) ? (
                                    <Box
                                      sx={{ width: "100%", maxWidth: "500px" }}
                                    >
                                      <img
                                          style={{
                                          maxWidth:"100%",
                                          height: "auto",
                                        }}
                                        src={
                                          item &&
                                          item.file_url_path &&
                                          item.file_hash &&
                                          item.file_url_path + "/" + item.file_hash
                                        } 
                                      />
                                    </Box>
                                  ) : (
                                    ""
                                  )}
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
