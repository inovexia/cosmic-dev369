import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
const SummaryReport = ({ incorrectColor, correctColor, noansweredColor, incorrectValue, correctValue, unansweredValue, testResult, testDetails }) => {
  
  const data = {
    labels: ['Incorrect', 'Correct', 'Unanswerd'],
    datasets: [
      {
        label: 'Total',
        data: [incorrectValue, correctValue, unansweredValue],
        backgroundColor: [incorrectColor, correctColor, noansweredColor],
        hoverOffset: 4
      },
    ],
  };
console.log(correctValue)
  // const data = {
  //   labels: [
  //     'Red',
  //     'Blue',
  //     'Yellow'
  //   ],
  //   datasets: [{
  //     label: 'My First Dataset',
  //     data: [300, 50, 100],
  //     backgroundColor: [
  //       'rgb(255, 99, 132)',
  //       'rgb(54, 162, 235)',
  //       'rgb(255, 205, 86)'
  //     ],
  //     hoverOffset: 4
  //   }]
  // };
  return (
    <>
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12} md={3}>
        <Card sx={{ p: 4, backgroundColor: "#EAC43D" }}>
            <Typography
              variant="span"
              style={{
                fontSize: "40px",
                lineHeight: "45px",
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {testResult && testResult.marks_obtained}/{testDetails && testDetails.stats.marks}
            </Typography>
            <Box
              variant="p"
              sx={{
                minWidth: "100%",
                fontSize: "16px",
                color: "#ffffff",
              }}
            >
              Test Marks Score
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
        <Card sx={{ p: 4, backgroundColor: "#A6CD4E" }}>
            <Typography
              variant="span"
              style={{
                fontSize: "40px",
                lineHeight: "45px",
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {testResult && testResult.num_correct}
            </Typography>
            <Box
              variant="p"
              sx={{ minWidth: "100%", fontSize: "16px", color: "#ffffff" }}
            >
              Correct
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
        <Card sx={{ p: 4, backgroundColor: "#2A5C99" }}>
            <Typography
              variant="span"
              style={{
                fontSize: "40px",
                lineHeight: "45px",
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {testResult && testResult.num_wrong}
            </Typography>
            <Box
              variant="p"
              sx={{ minWidth: "100%", fontSize: "16px", color: "#ffffff" }}
            >
              Incorrect
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 4, backgroundColor: "#14C0CC" }}>
            <Typography
              variant="span"
              style={{
                fontSize: "40px",
                lineHeight: "45px",
                fontWeight: "700",
                color: "#ffffff",
              }}
            >
              {testResult && testResult.num_not_attempted}
            </Typography>
            <Box
              variant="p"
              sx={{ minWidth: "100%", fontSize: "16px", color: "#ffffff" }}
            >
              Unanswerd
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 4, backgroundColor: "#fff"}}>
            <Doughnut data={data}/>
        </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SummaryReport;
