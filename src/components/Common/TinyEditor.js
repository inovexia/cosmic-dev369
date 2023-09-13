// TinyEditor.js
import React, { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller, useForm } from "react-hook-form";

const TinyEditor = ({ name, children, ...props }) => {
  const { control, setValue, setError, clearErrors, watch } = useForm();
  const content = watch(name); // Get the content value from the form

  useEffect(() => {
    // Check character length and set or clear the error message
    if (content && content.length >= 20) {
      setError(name, {
        type: "maxLength",
        message: "Character length should be less than 20",
      });
    } else {
      clearErrors(name); // Clear the error if character count is less than 20
    }
  }, [content, clearErrors, setError, name]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <Editor
            {...props}
            init={{ height: 250 }}
            value={field.value || ""}
            onEditorChange={(content) => {
              setValue(name, content); // Update the form field value
            }}
          >
            {children}
          </Editor>
          {field.error && <p style={{ color: "red" }}>{field.error.message}</p>}
        </div>
      )}
    />
  );
};

export default TinyEditor;
