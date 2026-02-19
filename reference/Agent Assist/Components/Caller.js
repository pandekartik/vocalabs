import React, { useState, useContext } from "react";
import { Box, Button } from "@mui/material";
import Call from "./Call";
import TestModeCall from "./TestModeCall";
import InputContext from "../../Context/inputContext";

const Caller = ({ setCallDuration }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const { setBaseUrl, setStreamSid, setResponses, } = useContext(InputContext);
  const handleCallEnd = () => {
    setActiveComponent(null);
    setShowOptions(false);
    setResponses([]);
  };

  // const chatMode = () => {
  //   setBaseUrl("ws://164.52.195.88:8750/frontend");
  //   setStreamSid("xyzo-ssdsd-dsds-dsdds-dsdsd-dsdsdfd");
  // };

  return (
    <Box sx={{ textAlign: "center" }}>
      {/* Show Options Button */}
      <Button
        variant="contained"
        onClick={() => setShowOptions((prev) => !prev)}
        sx={{
          width: "100%",
          fontFamily: "Arial",
          fontWeight: 500,
          fontSize: "0.9rem",
          color: "#ffffff",
          backgroundColor: "primary.main",
          textTransform: "none",
        }}
        disabled={activeComponent === "TestModeCall" || activeComponent === "Call"}
      >
        {showOptions ? "Hide Options" : "Show Options"}
      </Button>

      {/* Buttons above the suggestion box */}
      {showOptions && !activeComponent && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            width: "29.6vw",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Dialer */}
          <Button
            variant="outlined"
            onClick={() => setActiveComponent("Call")}
            sx={{
              width: "100%",
              fontFamily: "Arial",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#000000",
              backgroundColor: "white",
              margin: "1px",
            }}
          >
            Dialer Call
          </Button>

          {/* Test Mode Call */}
          <Button
            variant="outlined"
            onClick={() => setActiveComponent("TestModeCall")}
            sx={{
              width: "100%",
              fontFamily: "Arial",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#000000",
              backgroundColor: "white",
            }}
          >
            Test Mode Call
          </Button>

          {/* Chat mode */}
          {/* <Button
            variant="outlined"
            onClick={chatMode}
            sx={{
              width: "100%",
              fontFamily: "Arial",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "#000000",
              backgroundColor: "white",
              margin: "2px",
            }}
          >
            Chat Mode
          </Button> */}
        </Box>
      )}

      {/* Show buttons for Test Mode Call */}
      {activeComponent === "TestModeCall" && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            mt: 1,
            ml: 30,
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleCallEnd}
            sx={{
              width: "15vw",
              height: 40,
              fontFamily: "Arial",
              fontWeight: 500,
              fontSize: "0.9rem",
              textTransform: "none",
            }}
          >
            End Test Mode Call
          </Button>
        </Box>
      )}

      {/* End Test Mode Call */}
      {activeComponent === "Call" && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            mt: 1,
            ml: 30,
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={handleCallEnd}
            sx={{
              width: "15vw",
              height: 40,
              fontFamily: "Arial",
              fontWeight: 500,
              fontSize: "0.9rem",
              textTransform: "none",
            }}
          >
            End Dialer Mode Call
          </Button>
        </Box>
      )}

      {/* Show Call Component */}
      {activeComponent === "Call" && <Call setCallDuration={setCallDuration} />}

      {/* Show TestModeCall Component */}
      {activeComponent === "TestModeCall" && <TestModeCall />}
    </Box>
  );
};

export default Caller;
