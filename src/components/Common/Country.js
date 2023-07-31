import React, { useEffect, useState } from "react";

const Country = () => {
  const [countryCode, setCountryCode] = useState(null);
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://geolocation-db.com/json/");
        const data = await response.json();
        const countryCode = data.country_code;
        setCountryCode(countryCode);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);
  return countryCode;
}

export default Country