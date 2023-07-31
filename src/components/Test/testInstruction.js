import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useForm } from "react-hook-form";

const TestInstruction = ({ test, onValueChange }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      read_instruction: "0",
    },
  });
  const { read_instruction } = watch();
  const [checkboxValue, setCheckboxValue] = useState(false);

  const onCheckboxConfirm = (event) => {
    setCheckboxValue(event.target.checked);
    onValueChange(event.target.checked);
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid item>
          <Typography variant="h2" sx={{ fontSize: "1.5em", fontWeight: 500 }}>
            Please read the instructions carefully <br />
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <List className={`test-instruction`}>
            <ListItem sx={{ px: 0 }}>
              <span className={`list-order`}>1</span>
              <ListItemText
                primary={`Total Question : ${
                  test.stats && test.stats.questions
                }`}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <span className={`list-order`}>2</span>
              <ListItemText
                primary={`Marks For Correct : ${
                  test.settings && test.settings.marks_per_question
                }`}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <span className={`list-order`}>3</span>
              <ListItemText
                primary={`Marks For Wrong : ${
                  test.settings && test.settings.neg_marks_per_question
                }`}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <span className={`list-order`}>4</span>
              <ListItemText
                primary={`Time : ${
                  test.settings && test.settings.test_duration
                }`}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="p" sx={{ fontSize: "1em", fontWeight: 500 }}>
            Bookmark Questions: The Marked for Review status for a question
            simply indicates that you would like to look at that question again.
            Selected answer will be considered for evaluation.
          </Typography>
        </Grid>
        {/* <input
        type="checkbox"
        checked={checkboxValue}
        onChange={onCheckboxConfirm}
      /> */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="read_instruction"
                checked={checkboxValue}
                onChange={onCheckboxConfirm}
                className="option-label"
              />
            }
            label={
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="h3"
                  color="text.primary"
                  sx={{ fontSize: "1em", fontWeight: 400 }}
                >
                  I have read this instruction
                </Typography>
              </Box>
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TestInstruction;
