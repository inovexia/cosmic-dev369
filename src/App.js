import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppRouter from './routes';
import Layout from './Layout';
import Login from "./pages/Auth/Login";
import "./App.css";
import "./assets/css/addQuestion.css";
import "./assets/css/meeting.css";
import "./assets/css/styleGuide.css";
import "./assets/css/dashboard.css";
import "./assets/css/course.css";

function App() {
  return (
    <Layout>
    <AppRouter />
    </Layout>
  );
}

export default App;
