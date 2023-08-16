import React, { useState } from 'react';
import './CustomSwitch.css'; // Import your custom CSS for styling

const CustomSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={`custom-switch ${isChecked ? 'active' : ''}`} onClick={toggleSwitch}>
      <div className={`slider ${isChecked ? 'on' : ''}`} />
    </div>
  );
};

export default CustomSwitch;
