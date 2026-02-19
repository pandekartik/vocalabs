import React, { useState, useContext } from "react";
import { Button, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { APIUSER } from "../../E2E/axios.util";
import InputContext from "../../Context/inputContext";

const TestModeCall = () => {
  const [callStarted, setCallStarted] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const { setStreamSid, setBaseUrl, setFeedbackUrl } = useContext(InputContext);

  // Formik setup for validation
  const formik = useFormik({
    initialValues: {
      dialNumber: "",
      toNumber: "",
    },
    validationSchema: Yup.object({
      dialNumber: Yup.string()
        .required("Agent Number is required")
        .matches(/^\+\d+$/, "Agent Number with country code")
        .test(
          "not-same-as-toNumber",
          "Agent Number and Customer Number cannot be the same",
          function (value) {
            return value !== this.parent.toNumber;
          }
        ),
      toNumber: Yup.string()
        .required("Customer Number is required")
        .matches(/^\+\d+$/, "Customer Number with country code")
        .test(
          "not-same-as-dialNumber",
          "Agent Number and Customer Number cannot be the same",
          function (value) {
            return value !== this.parent.dialNumber;
          }
        ),
    }),
    onSubmit: async (values) => {
      const userDetails = JSON.parse(localStorage.getItem("user"));
      const payload = {
        to: values.toNumber,
        agent_name: `${userDetails?.first_name} ${userDetails?.last_name}`,
        agent_id: userDetails.user_id,
        supervisor_name: `Test User`,
        supervisor_id: userDetails?.manager_id,
        dial_number: values.dialNumber,
        customer_id: userDetails?.customer_id,
        organisation_id: userDetails?.organisation_id,
        domain: userDetails?.domain_id,
        processes: userDetails?.processes,
      };

      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await APIUSER.post(`/call`, payload, config);

        const frontend_url = response?.data?.frontend_url;
        const stream_url = response?.data?.stream_url;
        const notification_url = response?.data?.frontend_feedback_url;
        setFeedbackUrl(notification_url);
        if (!frontend_url || !stream_url) {
          console.error("Missing WebSocket URL or Stream URL in response");
          return;
        }

        setBaseUrl(frontend_url);
        const streamSid = frontend_url.split("/").pop();
        setStreamSid(streamSid);
        setCallStarted(true);
        setShowInputFields(false);
      } catch (error) {
        console.error("Error initiating call:", error);
      }
    },
  });

  // Handle start/end call
  const handleCallButtonClick = () => {
    if (!callStarted && !showInputFields) {
      setShowInputFields(true);
    } else if (!callStarted && showInputFields) {
      formik.handleSubmit();
    } else {
      setCallStarted(false);
      setStreamSid("");
      setBaseUrl("");
      formik.resetForm();
      setShowInputFields(false);
    }
  };

  // Check if both numbers include country codes and form is valid
  const isButtonDisabled = () => {
    if (callStarted) return false; // "End Call" is always enabled
    if (!showInputFields) return false; // "Start Test Mode Call" is always enabled
    const hasCountryCode = (number) => /^\+\d+$/.test(number);
    return (
      !hasCountryCode(formik.values.dialNumber) ||
      !hasCountryCode(formik.values.toNumber) ||
      !formik.isValid ||
      formik.isSubmitting
    );
  };

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 3,
        ml: 0,
        mt: 1,
        backgroundColor: "white",
        borderRadius: "5px",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Input fields for dial_number and to_number */}
      {showInputFields && !callStarted && (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            width: { xs: "90%", sm: "80%", md: "15vw" },
            mb: 0,
          }}
        >
          <TextField
            sx={{
              mt: 1,
              ml: 1,
              width: "14vw",
              height: "10vh",
              "& .MuiInputBase-input::placeholder": {
                fontSize: "12px",
                color: "text.secondary",
              },
            }}
            name="dialNumber"
            value={formik.values.dialNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dialNumber && Boolean(formik.errors.dialNumber)}
            helperText={formik.touched.dialNumber && formik.errors.dialNumber}
            placeholder="Agent no.. with Country code"
            fullWidth
          />

          <TextField
            sx={{
              mt: 0,
              ml: 1,
              width: "14vw",
              height: "10vh",
              "& .MuiInputBase-input::placeholder": {
                fontSize: "12px",
                color: "text.secondary",
              },
            }}
            name="toNumber"
            value={formik.values.toNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.toNumber && Boolean(formik.errors.toNumber)}
            helperText={formik.touched.toNumber && formik.errors.toNumber}
            placeholder="Customer no.. with Country code"
            fullWidth
          />
        </Box>
      )}

      {/* Button to start/end call */}
      <Button
        variant="contained"
        color={callStarted ? "error" : "primary"}
        onClick={handleCallButtonClick}
        disabled={isButtonDisabled()}
        sx={{
          width: { xs: "90%", sm: "100%", md: "15vw" },
          height: 40,
          backgroundColor: callStarted ? "#ffcccc" : "white",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial",
          fontWeight: 500,
          ml: 0,
          position: "right",
          fontSize: "0.9rem",
          color: "#000000",
          textTransform: "none",
          "&:hover": {
            backgroundColor: callStarted ? "#ffb3b3" : "#f0f0f0",
          },
        }}
      >
        {callStarted
          ? "End Call"
          : showInputFields
          ? "Call"
          : "Start Test Mode Call"}
      </Button>
    </Box>
  );
};

export default TestModeCall;
