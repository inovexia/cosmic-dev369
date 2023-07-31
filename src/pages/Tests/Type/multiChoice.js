import React, { useState } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  TextField,
  FormControl,
  FormHelperText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";


const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const MultiChoice = () => {

 // UseForm validation
 const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm();

const [validationErrors, setValidationErrors] = useState({});
  const [isTestCreated, setIsTestCreated] = useState(null);
  
  // End
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]); // Array of data for checkboxes
  const [checkedItems, setCheckedItems] = useState({}); // useState hook to manage checked state

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    }); // Update checked state
  };
  const handleAddOption = () => {
    const newOption = `Option ${options.length + 1}`;
    setOptions([...options, newOption]); // Add new option to the options array
    setCheckedItems({ ...checkedItems, [newOption]: false }); // Add new option to the checkedItems object with false value
  };

  // const handleRemoveOption = (index) => {
  //   const newOptions = [...options];
  //   newOptions.splice(index, 1); // Remove option from the options array
  //   setOptions(newOptions);
  //   const newCheckedItems = { ...checkedItems };
  //   delete newCheckedItems[newOptions[index]]; // Remove option from the checkedItems object
  //   setCheckedItems(newCheckedItems);
  // };
  
  return (
    <>
      <Typography component="h4">Multi Choice Question</Typography>
      <FormGroup>
        {options.map((option, index) => (
          <div key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedItems[option]}
                  onChange={handleCheckboxChange}
                  name={option}
                  className="option-label"
                />
              }
              label={option}
            />
            <StyledFormControl sx={{ width: "100%" }}>
              <TextField
                id="outlined-basic"
                name={`option-${option}`}
                placeholder={`${option} value`}
                //value={formData.marks}
                //onChange={handleInputChange}
                pattern="[A-Za-z]{1,}"
              />
              {validationErrors.marks && (
                <FormHelperText error>{validationErrors.marks}</FormHelperText>
              )}
            </StyledFormControl>
          </div>
        ))}
        <Button
          variant="outlined"
          sx={{ width: "150px" }}
          onClick={handleAddOption}
        >
          Add Option
        </Button>
      </FormGroup>
    </>
  );
};

export default MultiChoice;
