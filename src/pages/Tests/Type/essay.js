import React, { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { styled } from "@mui/material/styles";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const Essay = () => {
  const [formData, setFormData] = useState("");
  return (
    <>
      <Typography component="h4">Long Answer</Typography>
      <StyledFormControl sx={{ mt: 2, width: "100%" }}>
        <Editor
          init={{
            height: 250, // set the height to 500 pixels
          }}
          placeholder="Ex. This is sample text."
          onEditorChange={(content) =>
            setFormData((formData) => ({
              ...formData,
              longAnswer: content,
            }))
          }
        />
      </StyledFormControl>
    </>
  );
};

export default Essay;
