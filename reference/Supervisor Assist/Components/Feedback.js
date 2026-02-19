import React, { useState, useContext } from "react";
import { Dialog, Box, Button, Typography } from "@mui/material";
import { FeedbackModal } from "./FeedbackModal";
import InputContext from "../../Context/inputContext";

const Feedback = () => {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const { feedbackUrl, streamSid } = useContext(InputContext);

  // Toggle Feedback Modal Visibility
  const handleToggleFeedback = () => {
    setIsFeedbackVisible((prev) => !prev);
  };

  const handleClose = () => {
    setIsFeedbackVisible(false);
  };


  return (
    <>
      <Box>
        {userDetails.role === "Manager" && (
          <Button
            color="error"
            onClick={handleToggleFeedback}
            sx={{
              width: "100%",
              height: 40,
              backgroundColor: "#3892CF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 0,
              "&:hover": {
                backgroundColor: "#3892CF", // Keep the same background color on hover
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', Helvetica, sans-serif",
                fontWeight: 500,
                color: "white",
              }}
            >
              Give Feedback
            </Typography>
          </Button>
        )}

        <Dialog open={isFeedbackVisible} maxWidth="sm" fullWidth>
          {isFeedbackVisible && (
            <FeedbackModal
              handleClose={handleClose}
              streamSid={streamSid}
              feedbackUrl={feedbackUrl}
            />
          )}
        </Dialog>
      </Box>
    </>
  );
};

export default Feedback;
