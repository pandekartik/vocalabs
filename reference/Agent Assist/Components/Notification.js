import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { APIUSER } from "../../E2E/axios.util";
import InputContext from "../../Context/inputContext";

const Notification = ({ handleClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [feedbackMessages, setFeedbackMessages] = useState([]); // State for multiple feedback messages
  const { streamSid } = useContext(InputContext);

  //Get Feedback messages from feedback GET API
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await APIUSER.get(`/feedback/${streamSid}`, config);

        if (response.data && response.data.feedback) {
          const newFeedback = Array.isArray(response.data.feedback)
            ? response.data.feedback
            : [response.data.feedback];

          // Update the feedback messages without modifying the notification count
          setFeedbackMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, ...newFeedback];

            // Deduplicate based on a unique identifier (e.g., `created_at`)
            return updatedMessages.filter(
              (msg, index, self) =>
                index === self.findIndex((m) => m.created_at === msg.created_at)
            );
          });
        } else {
          setFeedbackMessages([
            { text: "No feedback available for this session." },
          ]);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
        setFeedbackMessages([
          { text: "An error occurred while fetching feedback data." },
        ]);
      }
    };

    if (streamSid) {
      fetchFeedbackData();
    }
  }, [streamSid]);

  if (!isVisible) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        width: 437,
        height: 612,
        bgcolor: "white",
        position: "fixed",
        top: "10px",
        right: "10px",
        p: 2,
        zIndex: 1300,
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          pl: 1,
          top: 11,
          left: 3,
          fontFamily: "Poppins, Helvetica",
          fontWeight: 400,
          color: "black",
        }}
      >
        Feedback
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          position: "absolute",
          top: 61,
          left: 19,
          right:15,
          bgcolor: "#72be47",
          borderRadius: "6px 0 6px 6px",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {feedbackMessages.length > 0 ? (
          feedbackMessages.map((message, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                fontFamily: "Courier New",
                fontWeight: "400",
                fontSize: "0.975rem",
                textAlign: "left",
                lineHeight: "normal",
                color: "white",
              }}
            >
              {message.text}
            </Typography>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Courier New",
              fontWeight: "400",
              fontSize: "0.975rem",
              textAlign: "left",
              lineHeight: "normal",
              color: "white",
            }}
          >
            No feedback available.
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={() => {
          setIsVisible(false);
          handleClose();
        }}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon sx={{ width: 12, height: 12 }} />
      </IconButton>
    </Paper>
  );
};

export default Notification;
