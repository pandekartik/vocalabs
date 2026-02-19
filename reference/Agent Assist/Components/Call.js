import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Dialer from "./Dialer";

const Call = ({
  setCallDuration,
}) => {
  const [callStarted, setCallStarted] = useState(false);
  const [isDialerVisible, setIsDialerVisible] = useState(false);

  useEffect(() => {
    if (callStarted) {
      setIsDialerVisible(true); // Show Dialer when call starts
    } else {
      setIsDialerVisible(false); // Hide Dialer when call ends
    }
  }, [callStarted]);

  const handleCallButtonClick = () => {
    setCallStarted((prev) => !prev); // Toggle call status
  };

  const handleCloseDialer = () => {
    setCallStarted(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 3,
        mt:1,
        backgroundColor: "white",
        borderRadius: "5px",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",}}
    >
      {/* Start/End Call Button */}
      <Button
        variant={callStarted ? "contained" : ""}
        color={callStarted ? "error" : "primary"}
        onClick={handleCallButtonClick}
        sx={{
          mt: 0,
          width: "15vw",
          height: 40,
          marginLeft: 0,
          backgroundColor: "white",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial",
          fontWeight: 500,
          fontSize: { xs: "1vw", sm: ".8vw", md: ".6vw", lg: ".8vw" },
          textAlign: "left",
          color: "#000000",
          textTransform: "none",
        }}
      >
        {callStarted ? "End Call" : "Start Call"}
      </Button>

      {/* Conditionally Render Dialer */}
      {isDialerVisible && (
        <Dialer
          onClose={handleCloseDialer}
          setCallDuration={setCallDuration}
        />
      )}
    </Box>
  );
};

export default Call;
