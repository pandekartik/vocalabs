import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { INTELICONVOAPI } from "../E2E/axios.util";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Validation Schema
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address.")
      .trim()
      .matches(
        /^[\w-.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        "Email must be a valid email address."
      )
      .max(120, "Email must be at most 120 characters long.")
      .required("Email is required."),

    password: Yup.string()
      .max(50, "Password must be at most 50 characters long.")
      .required("Password is required."),
  });

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleRequest(values);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Login Request
  const handleRequest = async (data) => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const res = await INTELICONVOAPI.post("/auth/user/login", data, { headers });

      if (res?.data?.token) {
        localStorage.setItem("user", JSON.stringify(res.data)); 
        localStorage.setItem("token", res.data.token);
        navigate("/calls", { replace: true });
      } else {
        console.error("Error: Token not received");
      }
    } catch (err) {
      console.error("Login failed:", err.message || err);
    }
  };

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Username"
            placeholder="name@gmail.com"
            type="email"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            {...getFieldProps("password")}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="medium"
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
