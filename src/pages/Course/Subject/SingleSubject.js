import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  InputLabel,
  Link,
  Input,
  IconButton,
  Snackbar,
  Alert,
  Card
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import BASE_URL from '../../../Utils/baseUrl';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import CreatedBy from '../../../Utils/createdBy';
import { serialize } from 'object-to-formdata';
import FormTextField from '../../../components/Common/formTextField';
import FormEditorField from '../../../components/Common/formEditorField';
import SidebarLeft from '../../../components/Sidebar/SidebarLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const SingleSubject = () => {
  return (
    <>
      <Helmet>
        <title>Create Subject</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: '100%' }}
            alignItems='center'
          ></Grid>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                subject title
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                className='custom-button'
                href={`/course/subjects`}
                component={Link}
              >
                Back
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={9}>
             right
            </Grid>
            <Grid item xs={3}>
              left
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default SingleSubject;
