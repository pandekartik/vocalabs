import React from "react";
import { Grid2 as Grid, Box, Button, Tooltip } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();

  //Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token"); 
      sessionStorage.clear(); 

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <>
      <Grid
        sx={{
          position: "fixed",
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
          height="90vh"
          alignItems="center"
          justifyContent="space-between"
          pt={1}
          pb={0.5}
          px={0.5}
          bgcolor="#3892cf"
          sx={{
            overflowY: "auto", 
            scrollbarWidth: "none", 
            msOverflowStyle: "none", 
            "&::-webkit-scrollbar": {
              display: "none", 
            },
          }}
        >
          <DashboardOutlinedIcon style={{ fontSize: 44, color: "white" }} />
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

export default SideBar;
