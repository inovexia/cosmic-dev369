import React, { useState } from "react";
import {
  Button,
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

const RegistrationSettings = () => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      created_by: CreatedBy,
      fields: {
        mobile: "",
        email: "",
      },
    },
  });

  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const [alertOpen, setAlertOpen] = useState(null);
  const [isSaved, setIsSaved] = useState(null);

  const handleRegSetting = async (data) => {
    const formData = serialize(data);
    try {
      var requestOption = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/settings/registration/valid_fields`,
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
        `${BASE_URL}/settings/registration/valid_fields`,
        requestOptions
      );
      const result = await response.json();
      setCurrentSetting(result.payload.fields);
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
          {isSaved === true ? "Setting saved" : "failled!"}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(handleRegSetting)}>
        <FormGroup
          style={{
            alignItems: "flex-start",
            marginTop: "20px",
          }}
        >
          <Controller
            name={`fields[mobile]`}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Use Mobile Number Field"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            {...register(`fields[mobile]`)}
            control={<Switch defaultChecked />}
            label="Use Mobile Number Field"
            labelPlacement="start" // This places the label before the switch
          /> */}

          <Controller
            name={`fields[email]`}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                style={{ marginLeft: "0" }}
                control={<Switch {...field} />}
                label="Use Email Field"
                labelPlacement="start"
              />
            )}
          />
          {/* <FormControlLabel
            style={{ marginLeft: "0" }}
            {...register(`fields[email]`)}
            control={<Switch />}
            label="Use Email Field"
            labelPlacement="start" // This places the label before the switch
          /> */}
        </FormGroup>
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

export default RegistrationSettings;
