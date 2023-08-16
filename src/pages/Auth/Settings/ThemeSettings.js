import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { ChromePicker } from "react-color";
import { useForm } from "react-hook-form";
import { serialize } from "object-to-formdata";
import CreatedBy from "../../../Utils/createdBy";
import BASE_URL from "../../../Utils/baseUrl";
import token from "../../../Utils/token";
import Network from "../../../Utils/network";
import { Box, Button,Snackbar, Alert } from "@mui/material";

function ThemeSettings() {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      created_by: CreatedBy,
    },
  });

  // Authorization
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const [alertOpen, setAlertOpen] = useState(null);
  const [isSaved, setIsSaved] = useState(null);

  const handleSetting = async (data) => {
    const formData = serialize(data);
    try {
      var requestOption = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/settings/general/save_theme`,
        requestOption
      );
      const result = await response.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsSaved(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload();
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
        `${BASE_URL}/settings/general/get_theme`,
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
          {isSaved === true ? "Setting saved" : "failled!"}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(handleSetting)}>
        <Controller
          name="theme_color"
          control={control}
          defaultValue="#FFFFFF"
          render={({ field }) => (
            <div>
              <ChromePicker
                color={field.value}
                onChange={(color) => field.onChange(color.hex)}
              />
              <Box mt={2} width="50px" height="50px" bgcolor={field.value} />
            </div>
          )}
        />
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
}

export default ThemeSettings;
