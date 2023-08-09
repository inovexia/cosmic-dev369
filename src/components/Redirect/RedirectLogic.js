import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import token from '../../Utils/token';

const RedirectLogic = () => {
  //const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  React.useEffect(() => {
    if (token === "") {
      if (currentPath === "/auth/register") {
        navigate("/auth/register");
      }
      else if (currentPath === "/auth/forgot-password") {
        navigate("/auth/forgot-password");
      }
      else {
        navigate("/auth/login");
      }
      
    }
  }, [navigate, token]);

  return null;
};

export default RedirectLogic;
