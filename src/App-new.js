import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  Link,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import parse from "html-react-parser";
import BASE_URL from "./Utils/baseUrl";

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    loadTestData();
  }, [])
  const loadTestData = async () => {
    return await axios
      .get(`${BASE_URL}/tests/list`)
      .then((response) => setData(response.data))
      .catch((err) => console.log(err));
  }
  return (
    <div>App</div>
  )
}

export default App