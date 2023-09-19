import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const FormHiddenField = ({ control, rules, name, children, ...props }) => {
  return (
    <Controller
      rules={rules}
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          type="hidden"
          {...props}
          value={props.value ?? field.value ?? ""}
          onChange={props.onChange ? props.onChange : field.onChange}
        >
          {children}
        </TextField>
      )}
    />
  );
};

export default FormHiddenField;
