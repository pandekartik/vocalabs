import React from "react";
import { Typography, Link, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import LoginForm from "./LoginForm";
import LoginImage from "../assests/LoginImage.jpg";

const SignUp = () => {
  // const navigate = useNavigate();

  const SectionStyle = styled("div")(() => ({
    width: "65%",
    maxWidth: "65%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }));

  const ContentStyle = styled("div")(() => ({
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    justifyContent: "center",
  }));

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SectionStyle>
        <div
          style={{
            backgroundImage: `url(${LoginImage})`,
            backgroundSize: "cover",
            height: "100vh",
            position: "relative",
          }}
        >
          <Stack sx={{ position: "relative", top: 40, left: 30 }}>
            <Typography
              sx={{
                position: "absolute",
                marginTop: "60px",
                marginLeft: "10px",
                background:
                  "linear-gradient(90deg, #F92B9A 0%, #2B64F9 112.29%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "18px",
                fontWeight: 900,
              }}
            >
              Powered by Generative AI.
            </Typography>
            <Typography
              sx={{
                position: "absolute",
                marginTop: "100px",
                marginLeft: "10px",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "17px",
              }}
            >
              Decode voice of customer to enhance CSAT, improve service quality,
              and boost customer loyalty.
            </Typography>
          </Stack>
        </div>
      </SectionStyle>

      <Container sx={{ width: "35%", backgroundColor: "#ffffff" }}>
        <ContentStyle>
          <Stack sx={{ mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Enter your credentials to access{" "}
              <span style={{ color: "#3892CF" }}>Agent Assist.</span>
            </Typography>
          </Stack>

          <LoginForm />

          {/* <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don’t have an account?&nbsp;
            <Link
              variant="subtitle2"
              onClick={() => navigate("/register")}
              sx={{ cursor: "pointer", color: "#3892CF" }}
            >
              Signup as Guest
            </Link>
          </Typography> */}
        </ContentStyle>
      </Container>
    </div>
  );
};

export default SignUp;
