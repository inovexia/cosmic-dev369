import React, { useState, useEffect } from 'react';
import { Box, Card } from '@mui/material';
import { useParams } from 'react-router-dom';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import BASE_URL from '../../../Utils/baseUrl';

const PreviewVideoContent = () => {
  const [currentSection, setCurrentSection] = useState(null);
  const { sectionGuid } = useParams();
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);

  useEffect(() => {
    const fetchCurrentSection = async () => {
      try {
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          redirect: 'follow',
        };

        const response = await fetch(
          `${BASE_URL}/course/section/${sectionGuid}/preview`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('Content-Type');

        if (contentType.includes('application/json')) {
          const result = await response.json();

          if (result.success === true) {
            setCurrentSection(result.payload.content);
          }
        } else {
          // Handle other content types, e.g., YouTube video
          const videoUrl = await response.text();
          setCurrentSection([{ type: 'youtube', content: videoUrl }]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCurrentSection();
  }, [sectionGuid, myHeaders]);

  const extractYouTubeVideoId = (url) => {
    const pattern =
      /(?:https?:\/\/(?:www\.)?)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };

  return (
    <>
      {currentSection &&
        currentSection.map((item, index) =>
          item.type === 'youtube' ? (
            <Card key={index}>
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'background.paper',
                  padding: 2,
                }}
              >
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
            </Card>
          ) : (
            ''
          )
        )}
    </>
  );
};

export default PreviewVideoContent;
