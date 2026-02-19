import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState, useEffect, useRef, useContext } from "react";
import { APIUSER } from "../../E2E/axios.util";
import InputContext from "../../Context/inputContext";

export const FeedbackModal = ({ handleClose, }) => {
  const [message, setMessage] = useState("");
  const [successNotification, setSuccessNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);
  const [httpResponse, setHttpResponse] = useState(null);
  const websocketRef = useRef(null); 
  const {feedbackUrl, streamSid} = useContext(InputContext)

  // useEffect(() => {
  //   if (feedbackUrl) {
  //     // Create a WebSocket connection
  //     websocketRef.current = new WebSocket(feedbackUrl);

  //     websocketRef.current.onopen = () => {
  //       // Check and send data if available
  //       if (httpResponse) {
  //         const dataToSend = JSON.stringify(httpResponse);

  //         websocketRef.current.send(dataToSend);
  //       }
  //     };

  //     websocketRef.current.onmessage = (event) => {
  //       try {
  //         const receivedData = JSON.parse(event.data);
  //         console.log("rece")
  //       } catch (error) {
  //         console.error("Error parsing WebSocket message:", error);
  //       }
  //     };

  //     websocketRef.current.onclose = (event) => {
  //       console.log(
  //         `WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`
  //       );
  //     };

  //     websocketRef.current.onerror = (error) => {
  //       console.error("WebSocket encountered an error:", error);
  //     };

  //     // Cleanup on component unmount
  //     return () => {
  //       if (websocketRef.current) {
  //         websocketRef.current.close();
  //       }
  //     };
  //   }
  // }, [feedbackUrl, httpResponse]);


  
  // Feedback POST API
  const handleSendFeedback = async () => {
    try {
      const payload = {
        feedback: message,
        stream_sid: streamSid,
      };
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // Step 1: Call Feedback API
      const response = await APIUSER.post("/feedback", payload, config);

      if (response.status === 200) {
        setHttpResponse(response.data); // Store response to send via WebSocket
        setSuccessNotification("Feedback stored successfully!");
        setMessage("");

        // Step 2: Send the response via WebSocket
        if (
          websocketRef.current &&
          websocketRef.current.readyState === WebSocket.OPEN
        ) {
          websocketRef.current.send(JSON.stringify(response.data));
        }

        // Auto-close modal after success
        setTimeout(() => {
          setSuccessNotification(null);
          handleClose();
        }, 3000);
      }
    } catch (error) {
      setErrorNotification("Failed to send feedback. Please try again.");
      console.error(error);
      setTimeout(() => setErrorNotification(null), 3000);
    }
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          width: 618,
          height: 488,
          bgcolor: "white",
          borderColor: "neutral.200",
          top: "10px",
          right: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: 569,
            height: 40,
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            // borderBottom: 1,
            borderColor: "light.neutralsw.400",
            px: 3,
            py: 1.5,
            // border:1
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
            }}
          >
            <PersonIcon sx={{ width: 24, height: 24, color: "#3892cf" }} />
            <ChatBubbleIcon
              sx={{
                width: 14,
                height: 14,
                color: "#3892cf",
                mb: 2,
                ml: -1,
                borderRadius: 4,
              }}
            />
            <Box sx={{ width: 16, height: 20 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: 14,
                  fontFamily: "Arial",
                  fontWeight: "400",
                  ml: 1,
                }}
              >
                Feedback
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 0 }}
          >
            <CloseIcon sx={{ width: 12, height: 12 }} />
          </IconButton>
        </Box>

        <Paper
          sx={{
            display: "flex",
            width: 280,
            height: 383,
            p: 2.5,
            position: "absolute",
            top: 56,
            left: 299,
            bgcolor: "white",
            borderRadius: 1,
            // border:1,
            boxShadow: 3,
            mt: 1,
          }}
        >
          <Box sx={{ width: 266, height: 348, ml: -1 }}>
            <Typography
              variant="medium"
              sx={{
                fontWeight: "medium",
                color: "dark.neutralsd.600",
                fontSize: 12,
                mt: 1,
              }}
            >
              Suggestion
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Enter your feedback"
              multiline
              rows={16}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              sx={{
                mt: 1,
              }}
              InputProps={{
                sx: {
                  fontSize: 12,
                  width: 295,
                },
              }}
            />
          </Box>
        </Paper>

        <Box
          sx={{
            position: "absolute",
            width: 286,
            height: 40,
            top: 434,
            left: 318,
            bgcolor: "#3892cf",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => {
              handleSendFeedback();
              // handleClose();
            }}
            sx={{
              color: "white",
              fontSize: 12,
            }}
          >
            Send
          </Button>
        </Box>
      </Box>

      {/* Success Notification */}
      {successNotification && (
        <Snackbar open autoHideDuration={3000}>
          <Alert severity="success" sx={{ width: "100%" }}>
            {successNotification}
          </Alert>
        </Snackbar>
      )}

      {/* Error Notification */}
      {errorNotification && (
        <Snackbar open autoHideDuration={3000}>
          <Alert severity="error" sx={{ width: "100%" }}>
            {errorNotification}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};
