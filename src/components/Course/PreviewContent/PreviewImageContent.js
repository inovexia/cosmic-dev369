import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Toolbar,
  TextField,
  Snackbar,
  Alert,
  Grid,
  Avatar,
  Card,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { serialize } from 'object-to-formdata';
import { useLocation } from 'react-router-dom';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import BASE_URL from '../../../Utils/baseUrl';
// import ProfileMenu from '././ProfileMenu';
import CosmicBrand from '../../../assets/images/CosmicBrand.jpg';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

const PreviewImageContent = () => {
  const [currentSection, setCurrentSection] = useState(null);
  const { sectionGuid } = useParams();
  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);
  // Get current course details
  useEffect(() => {
    const fetchCurrentSection = async () => {
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      const response = await fetch(
        `${BASE_URL}/course/section/${sectionGuid}/preview`,
        requestOptions
      );
      const result = await response.json();
      if (result.success === true) {
        // setLoading(false);
        setCurrentSection(result.payload.content);
        // setSectionGuid(result.payload);
      }
    };
    fetchCurrentSection();
  }, []);
  return (
    <>
      {currentSection &&
        currentSection.map((item, index) =>
          item.type === 'image' ? (
            <Card key={index}>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'background.paper',
                  padding: 2,
                }}
              >
                <img src={item.file_path} alt={item.type} />
              </Box>
            </Card>
          ) : (
            ''
          )
        )}
    </>
  );
};
export default PreviewImageContent;
