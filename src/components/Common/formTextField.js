import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const FormTextField = ({ control, rules, name, children, ...props }) => {
  return (
    <Controller
      rules={rules}
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
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

export default FormTextField;
