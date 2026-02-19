import React from "react";
import { Grid2 as Grid, Typography } from "@mui/material";

const TimeDuration = ({ callDuration, passedCallStatus }) => {
  
  return (
    <Grid
      sx={{
        height: callDuration
          ? { xs: "15vh", sm: "10vh", md: "80px" } // Smaller height when callDuration exists
          : "40px", // Default height when no callDuration
        mt: 0,
        backgroundColor: "white",
        borderRadius: 1,
        paddingX: 2,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontFamily: "Poppins, Helvetica",
          fontWeight: 500,
          color: "black",
        }}
      >
        Call Duration: {callDuration && passedCallStatus =="completed"  ? callDuration : "Not Started"}
      </Typography>
    </Grid>
  );
};

export default TimeDuration;