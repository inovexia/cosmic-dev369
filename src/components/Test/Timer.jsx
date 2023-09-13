import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import AvTimerOutlinedIcon from "@mui/icons-material/AvTimerOutlined";

const Timer = ({ durationInMinutes, onTimerExpired }) => {
  const totalSeconds = durationInMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timerInterval;

    if (isActive && remainingSeconds > 0) {
      timerInterval = setInterval(() => {
        setRemainingSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (remainingSeconds === 0) {
      setIsActive(false);
      clearInterval(timerInterval);
      onTimerExpired(); // Call the provided function when the timer expires
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isActive, remainingSeconds, onTimerExpired]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const timerColor = remainingSeconds <= 60 ? 'secondary' : 'primary';
  const timerClassName = remainingSeconds <= 60 ? 'blink' : '';

  return (
    <>
      <AvTimerOutlinedIcon color={timerColor} sx={{ fontSize: 32 }} />
      <Typography className={timerClassName} variant="h4" color={timerColor} sx={{ fontSize: '24px' }}>
        {isActive ? `Time Left: ${formatTime(remainingSeconds)}` : 'Time is up!'} HH:MM:SS
      </Typography>
    </>
  );
};

export default Timer;
