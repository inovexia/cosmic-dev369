import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';

const TakeTest = () => {
  const questions = [
    {
      id: 1,
      question: 'Question 1',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      id: 2,
      question: 'Question 2',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      id: 3,
      question: 'Question 3',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      id: 4,
      question: 'Question 4',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      id: 5,
      question: 'Question 5',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      id: 6,
      question: 'Question 6',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    // Add more questions as needed
  ];

  const { register, handleSubmit, getValues } = useForm();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const onSubmit = (data) => {
    const formData = questions.map((question, index) => ({
      question: question.question,
      options: selectedOptions[index],
    }));

    // Perform your submission logic here
    // Pass formData to your API or perform any necessary operations
    // For example:
    // axios.post('/api/submit', formData);
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestion]: {
        ...prevSelectedOptions[currentQuestion],
        [option]: !prevSelectedOptions[currentQuestion]?.[option],
      },
    }));
  };

  const renderOptions = (options) => {
    return options.map((option, index) => (
      <FormControlLabel
        key={index}
        control={
          <Checkbox
            checked={selectedOptions[currentQuestion]?.[option] || false}
            onChange={() => handleCheckboxChange(option)}
          />
        }
        label={option}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Question Form</h1>

      {/* Display current question */}
      <h2>{questions[currentQuestion].question}</h2>

      {/* Display options */}
      <FormGroup>{renderOptions(questions[currentQuestion].options)}</FormGroup>

      {/* Prev and Next buttons */}
      <div>
        {currentQuestion > 0 && (
          <Button type="button" onClick={handlePrev}>
            Prev
          </Button>
        )}
        {currentQuestion < questions.length - 1 ? (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </div>
    </form>
  );
};

export default TakeTest;
