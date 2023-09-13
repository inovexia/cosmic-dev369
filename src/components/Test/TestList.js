import React from "react";
import {
  Typography,
  Box,
  Grid,
  Link,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import parse from "html-react-parser";
import dayjs from "dayjs";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";

const TestList = ({ item }) => {
  const startDate = item.start_date;
  const endDate = item.end_date;
  const createdDate = item.created_on;

  const sDate = dayjs(startDate).format("DD-MM-YYYY HH:mm:ss");
  const eDate = dayjs(endDate).format("DD-MM-YYYY HH:mm:ss");
  const cDate = dayjs(createdDate).format("DD-MM-YYYY HH:mm:ss");
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
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {item && item.status === "1" ? (
                  <PublishedWithChangesOutlinedIcon color="success" />
                ) : (
                  <UnpublishedOutlinedIcon color="secondary" />
                )}
                <Typography component="h4" sx={{ ml: 2 }}>
                  {item.type}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ py: 0 }}>
            <Grid item xs={12} sx={{ pt:0, display:"block", mt:0 }}>
              <Typography component="h5">
                <strong>ID:</strong>
                {item.guid}
              </Typography>
            </Grid>
          </Grid>
          {item && item.details !== null ? (
            <Grid container spacing={2} sx={{ py: 0 }}>
              <Grid item xs={12} sx={{ py: 0 }}>
                <Typography component="div">{parse(item.details)}</Typography>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{ mt: 3 }}>
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
