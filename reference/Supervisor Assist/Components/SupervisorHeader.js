import React from "react";
import "./SupervisorDashboard.css";
import { ArrowDropDown } from "@mui/icons-material";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
const SupervisorHeader = () => {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: 66,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          px: 3,
          position: "fixed",
          overflow: "hidden",
          bgcolor: "white",
          justifyContent: "space-between",
          boxShadow: 1,
          zIndex: 10,
        }}
      >
        <Typography variant="h6" color="primary">
          {userDetails.role === "Manager"
            ? "Supervisor Assist"
            : userDetails.role === "Agent"
            ? "Agent Assist"
            : ""}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar src="/mask-group.png" alt={userDetails.first_name ? userDetails.first_name.charAt(0) : ""}  />
          <Box
            sx={{
              ml: 2,
            }}
          >
            <Typography variant="body1" fontWeight="medium">
              {userDetails.first_name} {userDetails.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {userDetails?.role === "Manager" ? "Supervisor" : "Agent"}
            </Typography>
          </Box>
          <IconButton>
            <ArrowDropDown />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default SupervisorHeader;
