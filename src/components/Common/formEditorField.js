import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

const FormEditorField = ({ control, rules, name, children, ...props }) => {
  return (
    <Controller
      rules={rules}
      control={control}
      name={name}
      render={({ field }) => (
        <Editor
          {...props}
          init={{ height: 250 }}
          value={props.value ?? field.value ?? ""}
          onEditorChange={props.onChange ? props.onChange : field.onChange}
        >
          {children}
        </Editor>
      )}
    />
  );
};

export default FormEditorField;
