import React from "react";
import { Grid2 as Grid, Box, Button, Tooltip } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useNavigate } from "react-router-dom";

const SupervisorSideBar = () => {
  const navigate = useNavigate();

  //Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token"); // Remove the token
      sessionStorage.clear(); // Clear any session-specific data

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error (optional)
    }
  };
  return (
    <>
      <Grid
        justifyContent={"start"}
        position={"fixed"}
        sx={{
          overflow: "hidden",
          overflowY: "auto", // Enable vertical scrolling
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for IE
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar for WebKit browsers
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100vh"
          alignItems="center"
          justifyContent="space-between"
          pt={1}
          pb={0.5}
          px={0.5}
          bgcolor="#3892cf"
          sx={{
            overflowY: "auto", // Enable vertical scrolling
            scrollbarWidth: "none", // Hide scrollbar for Firefox
            msOverflowStyle: "none", // Hide scrollbar for IE
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar for WebKit browsers
            },
          }}
        >
          <DashboardOutlinedIcon
            style={{ fontSize: 44, color: "white", marginTop: "70px" }}
          />
                 <Tooltip title="Log Out" arrow>
          <Button
            style={{ fontSize: 44, color: "white", borderRadius: "4px" }}
            onClick={handleLogout}
          >
            <ExitToAppOutlinedIcon style={{ fontSize: 44 }} />
          </Button>
          </Tooltip>
        </Box>
      </Grid>
    </>
  );
};

export default SupervisorSideBar;
