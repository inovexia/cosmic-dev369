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
  Paper,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { serialize } from 'object-to-formdata';
import { useLocation } from 'react-router-dom';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import BASE_URL from '../../../Utils/baseUrl';
// import ProfileMenu from '././ProfileMenu';
import ReactHtmlParser from 'react-html-parser';
import DescriptionIcon from '@mui/icons-material/Description';
const PreviewHtmlContent = () => {
  const [currentSection, setCurrentSection] = useState(null);
  const [contentGuid, setContentGuid] = useState(null);
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
      console.log(result.payload.content);
      if (result.success === true) {
        // setLoading(false);
        setCurrentSection(result.payload);
        // setContentGuid(id);
      }
    };
    fetchCurrentSection();
  }, []);
  const extractYouTubeVideoId = (url) => {
    const pattern =
      /(?:https?:\/\/(?:www\.)?)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };
  return (
    <>
      {currentSection &&
        currentSection.content.map((item, index) => (
          <Card key={index} sx={{ margin: '16px' }}>
            {item.type === 'image' ? (
              <Box sx={{ padding: '16px' }}>
                <img src={item.file_path} alt={item.type} />
              </Box>
            ) : item.type === 'html' ? (
              <Box
                sx={{ padding: '16px' }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : item.type === 'pdf' ? (
              <Box sx={{ padding: '16px' }}>
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
            ) : item.type === 'youtube' ? (
              <Box sx={{ padding: '16px' }}>
                <iframe
                  title='Embedded Content'
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                    item.content
                  )}`} // Extract and use the YouTube video ID in the URL
                  width='100%'
                  height='350px'
                  frameBorder='0'
                  allowFullScreen
                />
              </Box>
            ) : (
              ''
            )}
          </Card>
        ))}
    </>
  );
};
export default PreviewHtmlContent;
