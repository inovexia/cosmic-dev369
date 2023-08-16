import React from "react";
import token from "../../Utils/token";
import BASE_URL from "../../Utils/baseUrl";
import Network from "../../Utils/network";
import { useNavigate, useLocation } from 'react-router-dom';

const CheckTokenValid = () => {
  const navigate = useNavigate();
  //const [isTokenValid, setIsTokenValid] = React.useState(false);
  const fetchTokenDetails = React.useRef(async () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );
    myHeaders.append("Network", `${Network}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASE_URL}/users/token_details`,
        requestOptions
      );
      const result = await response.json();
      localStorage.setItem('user', result && result.payload.guid);
      if (result.success !== true) {
        navigate("/auth/login");
      }
      
    } catch (error) {
      console.log("error", error);
    }
  });
  React.useEffect(() => {
    fetchTokenDetails.current();
  }, []);
  return null;
};

export default CheckTokenValid;
