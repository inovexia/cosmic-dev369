import { Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";

const CheckboxField = ({ control, rules, name, children, ...props }) => {
  return (
    <Controller
      rules={rules}
      control={control}
      name={name}
      render={({ field }) => (
        <Checkbox
          {...props}
          value={props.value ?? field.value ?? ""}
          onChange={props.onChange ? props.onChange : field.onChange}
        >
          {children}
        </Checkbox>
      )}
    />
  );
};

export default CheckboxField;
