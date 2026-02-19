import React, { useState, useEffect, useContext, memo } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PanToolIcon from "@mui/icons-material/PanTool";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tooltip from "@mui/material/Tooltip";
import { Grid2 as Grid, Typography, Box } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { Badge, Dialog, IconButton,  } from "@mui/material";
import InputContext from "../../Context/inputContext";
import "./AgentDashboard.css";

import Notification from "./Notification";
import { APIUSER } from "../../E2E/axios.util";
import VoiceBot from "./VoiceBot";

const userDetails = JSON.parse(localStorage.getItem("user"));
const intervention_universal = `${process.env.REACT_APP_WEB_SOCKET}/supervisor/${userDetails?.user_id}`;

const AgentHeader = memo(({ headerText, passedNavigate }) => {
  const navigate = useNavigate();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const firstName = userDetails?.first_name;
  const lastName = userDetails?.last_name;
  const agentName = `${firstName} ${lastName}`;
  const agentId = userDetails?.user_id;
  const supervisor_id = userDetails?.manager_id;
  const { feedbackUrl, streamSid } = useContext(InputContext);

  const handleToggleNotification = () => {
    setIsNotificationVisible((prev) => !prev);

    // Reset the notification count if opening the notification panel
    if (!isNotificationVisible) {
      setNotificationCount(0);
    }
  };

  const handleClose = () => {
    setIsNotificationVisible(false);
  };

  // Navigate to /SADashboard
  const handleExitClick = () => {
    navigate("/calls");
  };

  // Intervention
  const handleIntervention = async () => {
    const postData = {
      agent_id: agentId,
      agent_name: agentName,
      stream_sid: streamSid,
      supervisor_id: supervisor_id,
    };

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Send the POST request
      const response = await APIUSER.post(
        "/call_intervention",
        postData,
        config
      );
      if (response.status === 200 || response.status === 201) {
        setMessage("Sent Successfully");
        setSeverity("success"); // Set success severity
        setOpen(true); // Open the Snackbar

      // Send a WebSocket message in the expected format if the socket is open
      if (socket && socket.readyState === WebSocket.OPEN) {
        const utcDate = new Date();
        const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add 5 hours and 30 minutes

        const timestamp = istDate.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        const wsMessage = {
          event: "notifications",
          data: [
            {
              event: "intervention",
              data: `Agent ${agentName}  with StreamSid ${streamSid} raised for Escalation.`,
              agent_id: agentId,
              stream_sid: streamSid,
              timestamp: timestamp, // Use the IST timestamp here
              status: "unread",
            },
          ],
          count: 1,
        };
        console.log("notification from agent is ", wsMessage)

        // Send the formatted WebSocket message
        socket.send(JSON.stringify(wsMessage));
      }
      setTimeout(() => {
        setOpen(false); // Hide popup
        setMessage(""); // Clear message (hides inline Typography)
      }, 1000);
    }
  }
    catch (error) {
      // Handle errors during the POST request
      console.error("Error during POST API call:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
      }
      setMessage("Failed to send intervention request"); // Set error message
      setSeverity("error"); 
      setOpen(true); 
      
      setTimeout(() => {
        setOpen(false); 
        setMessage(""); 
      }, 1000);
    }
  };




  //Establish websocket for Intervention
  useEffect(() => {
    if (!intervention_universal) {
      console.error("WebSocket URL is not defined.");
      return;
    }

    // Establish WebSocket Connection
    const ws = new WebSocket(intervention_universal);

    // Event Handlers
    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", {
        code: event.code,
        reason: event.reason,
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.group("WebSocket Message Received");
        console.log("Raw Data:", data);

        if (data.event === "notifications" && Array.isArray(data.data)) {
          data.data.forEach((notification, index) => {
            console.group(`Notification ${index + 1}`);
            console.groupEnd();
          });
        } else {
          console.log("Unrecognized message structure:", data);
        }
        console.groupEnd();
      } catch (error) {
        console.warn("Non-JSON message received:", event.data);
      }
    };

    // Store WebSocket instance in state
    setSocket(ws);

    // Cleanup WebSocket connection on component unmount or dependency change
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounted"); // 1000 is normal closure
      }
      setSocket(null); // Clear the socket state
    };
  }, [intervention_universal]);



  
  //notification count
  useEffect(() => {
    // WebSocket connection for notifications
    const ws = new WebSocket(feedbackUrl);

    ws.onopen = () => {
      console.log("WebSocket connected for notifications.");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "new_feedback") {
          setNotifications((prev) => {
            const isDuplicate = prev.some(
              (notification) => notification.id === data.id
            );
            return isDuplicate ? prev : [...prev, data];
          });

          // Increment the notification count
          setNotificationCount((prevCount) => prevCount + 1);
        } else {
          console.log("Ignored WebSocket message:", data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [feedbackUrl]);

  return (
    <>
      <Box
        container
        item
        sx={{
      position: "fixed",
        top: 0,
        left: 0,
        width: "98%",
        height: "64px",
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        }}
      >
     
          <Typography variant="h6" color="primary" fontWeight="medium" sx={{ml:1, fontSize: "1.25rem", 
          lineHeight: 1.2,}}
          component="h1">
            {headerText || 'Agent Assist'}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{ color: "black" }}
            >
              Hi, {agentName}
            </Typography>
          </Box>
          <Grid display="flex" alignItems="center">
            { !passedNavigate ? (
              <>
              {/* VoiceBot Summary */}
              <Grid        display="flex"
                  alignItems="center"
                  bgcolor="#d2f6dd"
                  borderRadius="14px"
                  height="60px"
                  px={1}
                  sx={{ overflow: "hidden", width: 90, height: 55}}>
                <VoiceBot/>
              </Grid>

                {/* Intervention Section */}
                <Grid
                  sx={{
                    width: { xs: "100%", sm: 223 },
                    height: 60,
                    backgroundColor: "white",
                    borderColor: "white",
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Intervention Button */}
                  <IconButton
                    sx={{
                      width: 55,
                      height: 55,
                      left: 23,
                      backgroundColor: "#ffe8ef",
                      borderRadius: "14px",
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                    onClick={handleIntervention}
                    color="primary"
                    aria-label="intervention"
                    disabled={!streamSid}
                  >
                    <PanToolIcon
                      sx={{
                        width: 30,
                        height: 30,
                        color: "#e53935",
                      }}
                    />
                  </IconButton>
       {/* Popup message using Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ml:37, mt:-1}} // Position at top center
      >
        <Alert
          onClose={handleClose}
          severity={severity} // "success" or "error"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 20,
                      left: { xs: 80, sm: 110 },
                      fontFamily: "Arial",
                      fontWeight: 500,
                      color: "black",
                      fontSize: "0.875rem",
                    }}
                  >
                    Intervention
                  </Typography>
                </Grid>

                {/* Notification Section */}
                <Grid
                  display="flex"
                  alignItems="center"
                  bgcolor="#d2f6dd"
                  borderRadius="14px"
                  height="60px"
                  px={1}
                  sx={{ overflow: "hidden", width: 55, height: 55 }}
                >
                  <IconButton color="error" onClick={handleToggleNotification}>
                    <Tooltip title="Notifications" arrow>
                      <Badge badgeContent={notificationCount} color="error">
                        <NotificationsIcon style={{ color: "#ed655a" }} />
                      </Badge>
                    </Tooltip>
                  </IconButton>

                  <Dialog open={isNotificationVisible} maxWidth="sm" fullWidth>
                    {isNotificationVisible && (
                      <Notification
                        setNotificationCount={setNotificationCount}
                        handleClose={handleClose}
                        notifications={notifications}
                      />
                    )}
                  </Dialog>
                </Grid>
                <Tooltip title="Go Back" arrow>
                <IconButton
                  sx={{
                    width: 55,
                    height: 55,
                    top: 0,
                    right: 0,
                    marginLeft: 5,
                    backgroundColor: "#ffe8ef",
                    borderRadius: "14px",
                    overflow: "hidden",
                    position: "relative",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                  color="primary"
                  aria-label="exit"
                  onClick={handleExitClick}
                >
                  <ExitToAppIcon />
                </IconButton>
                </Tooltip>
              </>
            ) : (
              // Exit Button when headerText === "Supervisor Assist"
              <Tooltip title="Go Back" arrow>
              <IconButton
                sx={{
                  width: 55,
                  height: 55,
                  top: 0,
                  right: 0,
                  backgroundColor: "#ffe8ef",
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
                color="primary"
                aria-label="exit"
                onClick={handleExitClick}
              >
                <ExitToAppIcon />
              </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Box>
    </>
  );
});

export default AgentHeader;
