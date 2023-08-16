import React, { useState } from "react";
import {
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { serialize } from "object-to-formdata";
import CreatedBy from "../../../Utils/createdBy";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";

const CommonSettings = () => {
  const {
    register,
    reset,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      default_user_role: "student",
      created_by: CreatedBy,
    },
  });
  const {
    auto_generate_username,
    default_user_role,
    allow_user_registration,
    email_verification_required,
    auto_approve_user,
  } = watch();
  const [alertOpen, setAlertOpen] = useState(null);
  const [isSaved, setIsSaved] = useState(null);

  const [userRole, setUserRole] = React.useState("student");
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const handleChangeRole = (event) => {
    setUserRole(event.target.value);
  };

  const handleCommonSetting = async (data) => {
    const formData = serialize(data);
    formData.append("created_by", CreatedBy);
    try {
      var requestOption = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/settings/registration/common`,
        requestOption
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsSaved(true);
        setTimeout(() => {
          setAlertOpen(false);
        }, 1000);
      } else {
        setIsSaved(false);
        setTimeout(() => {
          setAlertOpen(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error save setting:", error);
    }
  };
  const [currentSetting, setCurrentSetting] = React.useState("");
  React.useEffect(() => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const fetchData = async () => {
      const response = await fetch(
        `${BASE_URL}/settings/registration/common`,
        requestOptions
      );
      const result = await response.json();
      setCurrentSetting(result.payload);
      reset(result.payload);
    };
    fetchData();
  }, [reset]);

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={1000}
        onClose={() => setIsSaved(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={isSaved === true ? "success" : "warning"}>
          {isSaved === true ? "Setting saved Successfully" : "failled!"}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(handleCommonSetting)}>
        <FormGroup
          style={{
            alignItems: "flex-start",
            marginTop: "20px",
          }}
        >
          <Controller
            name="single_device_login"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Use Single Device Login"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            {...register("single_device_login")}
            control={<Switch defaultChecked />}
            label="Use Single Device Login"
            labelPlacement="start" // This places the label before the switch
          /> */}
          <Controller
            name="email_verification_required"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Email Verification Required"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            {...register("email_verification_required")}
            control={<Switch />}
            label="Email Verification Required"
            Controller // This places the label before the switch
          /> */}
          <Controller
            name="allow_user_registration"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Allow User Registration"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            {...register("allow_user_registration")}
            control={<Switch />}
            label="Allow User Registration"
            labelPlacement="start" // This places the label before the switch
          /> */}
          <Controller
            name="auto_generate_username"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Auto Generate Username"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            value={auto_generate_username}
            {...register("auto_generate_username")}
            control={<Switch />}
            label="Auto Generate Username"
            labelPlacement="start" // This places the label before the switch
          /> */}
          <Controller
            name="auto_approve_user"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Auto Approve"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            {...register("auto_approve_user")}
            name="auto_approve_user"
            control={<Switch />}
            label="Auto Approve"
            labelPlacement="start" // This places the label before the switch
          /> */}
        </FormGroup>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="user-role">User Role</InputLabel>
          <Select
            labelId="user-role"
            id="user-role-select"
            {...register("default_user_role")}
            value={userRole}
            label="User Role"
            onChange={handleChangeRole}
            autoFocus
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="instructor">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          className="custom-button"
          variant="outlined"
          sx={{ mt: 3 }}
        >
          Save
        </Button>
      </form>
    </>
  );
};

export default CommonSettings;
