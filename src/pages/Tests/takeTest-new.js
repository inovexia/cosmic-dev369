import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import { useParams, useNavigate } from "react-router-dom";

const TakeTest = () => {
  const { guid } = useParams(); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testData, setTestData] = useState([]); // Replace `[...]` with your test data
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );
  myHeaders.append("Network", `${Network}`);
  const requestOption = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  // Get all questions
  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await fetch(
        `${BASE_URL}/tests/preview/${guid}/1`,
        requestOption
      );
      const test_Data = await response.json();
      setTestData(test_Data.payload);
    };
    fetchQuestion();
  }, []);

  // Retrieve the current question based on the currentQuestionIndex
  const currentQuestion = testData[currentQuestionIndex];
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
     // Handle form submission for the current question

    if (currentQuestionIndex === testData.length - 1) {
      // Last question, end of the test
      console.log("End of the test");
      // Add logic for displaying the final message or redirecting to another page
    } else {
      // Move to the next question
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Display the current question and options */}
      {/* ... */}
      <h3>{currentQuestion && currentQuestion.question}</h3>
      {/* ... */}

      {/* Submit button */}
      <button type="submit">
        {currentQuestion && currentQuestionIndex === testData.length - 1 ? "Finish" : "Next"}
      </button>
    </form>
  );
};

export default TakeTest;
