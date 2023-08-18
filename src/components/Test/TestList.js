import React from "react";
import {
  Typography,
  Grid,
  Link,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import parse from "html-react-parser";
import dayjs from 'dayjs';

const TestList = ({ item }) => {
  const startDate = item.start_date
  const endDate = item.end_date
  const createdDate = item.created_on

  const sDate = dayjs(startDate).format('DD-MM-YYYY HH:mm:ss');
  const eDate = dayjs(endDate).format('DD-MM-YYYY HH:mm:ss');
  const cDate = dayjs(createdDate).format('DD-MM-YYYY HH:mm:ss');
  return (
    <>
      <Card className="dem" key={item.guid} sx={{ my: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Link
                href={`/test/manage/${item.guid}`}
                color="inherit"
                underline="none"
                sx={{
                  fontSize: 24,
                  fontWeight: 600,
                  fontFamily: "Arial",
                }}
              >
                {item.title}
              </Link>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography component="h4">{item.type}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ py: 0, my: 2 }}>
            <Grid item xs={12} sx={{ py: 0 }}>
              <Typography component="h5">{item.guid}</Typography>
            </Grid>
          </Grid>
          {item && item.details !== null ? (
            <Grid container spacing={2} sx={{ py: 0, my: 2 }}>
              <Grid item xs={12} sx={{ py: 0 }}>
                <Typography component="div">{parse(item.details)}</Typography>
              </Grid>
            </Grid>
          ) : (
            ""
          )}

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography component="span">
                Start Date:{item.start_date ? sDate : cDate}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography component="span">
                End Date:{item.end_date ? eDate : cDate}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{mt:3}}>
              <Button
                variant="contained"
                color="primary"
                href={`/test/preview-test/${item.guid}`}
              >
                PREVIEW
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default TestList;
