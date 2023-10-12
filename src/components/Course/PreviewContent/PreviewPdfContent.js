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
import DescriptionIcon from '@mui/icons-material/Description';
const PreviewPdfContent = () => {
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
          item.type === 'pdf' ? (
            <Card key={index}>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'background.paper',
                  padding: 2,
                }}
              >
                <p>
                  <a href={item.file_path}>{item.file_path}</a>
                </p>
                <div sx={{ alignitems: 'center', display: 'flex' }}>
                  <a href={item.file_path} download>
                    <span>Download</span>
                    <DescriptionIcon />
                  </a>
                </div>
              </Box>
            </Card>
          ) : (
            ''
          )
        )}
    </>
  );
};
export default PreviewPdfContent;
