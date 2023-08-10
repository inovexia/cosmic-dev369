import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import AvTimerOutlinedIcon from "@mui/icons-material/AvTimerOutlined";

const Timer = ({ durationInSeconds, onTimerExpired }) => {
  const [seconds, setSeconds] = useState(durationInSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timerInterval;

    if (isActive && seconds > 0) {
      timerInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(timerInterval);
      onTimerExpired(); // Call the provided function when timer expires
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isActive, seconds, onTimerExpired]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const timerColor = seconds <= 60 ? 'secondary' : 'primary';
  const timerClassName = seconds <= 60 ? 'blink' : '';

  return (
     <>
      <AvTimerOutlinedIcon color={timerColor} sx={{ fontSize: 32 }} />
      <Typography className={timerClassName} variant="h4" color={timerColor} sx={{ fontSize: '24px' }}>
      {seconds <= 60 ? (isActive ? `Time Remains: ${formatTime(seconds)}` : 'Time is up!') : (isActive ? `Time Left: ${formatTime(seconds)}` : 'Time is up!')} : MM:SS
      {/* {isActive ? `Time Left: ${formatTime(seconds)}` : 'Time is up!'} */}
    </Typography>
    </>
  );
};

export default Timer;
