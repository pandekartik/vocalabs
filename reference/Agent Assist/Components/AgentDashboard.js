import React, { useEffect, useContext } from "react";
import { Grid2 as Grid, Typography, Box, Card } from "@mui/material";
import "./AgentDashboard.css";
import Transcription from "./Transcription";
import KnowledgeAI from "./KnowledgeAI";
import Suggestions from "./Suggestions";
import AgentHeader from "./AgentHeader";
import SideBar from "./SideBar";
import SOPSentimentBox from "./SOPSentimentBox";
import TimeDuration from "./TimeDuration";
import { useLocation } from "react-router-dom";
import Feedback from "../../Supervisor Assist/Components/Feedback";
import Caller from "./Caller";
import InputContext from "../../Context/inputContext";
import AudioRecorder from "./AudioRecorder";
import SOPDetails from "./SOPDetails";

const AgentDashboard = () => {
  const {
    setBaseUrl,
    setStreamSid,
    setFeedbackUrl,
    audioUrl,
    sopDetails,
    setSopDetails,
    setStatus,
  } = useContext(InputContext);

  const location = useLocation();

  const passedStreamSid = location.state?.streamSid || ""; // Passed streamSid
  const passedWebsocketUrl = location.state?.websocketUrl || ""; // Passed WebSocket URL
  const passedFeedbackUrl = location.state?.feedbackUrl || ""; //Passed Feedback URL
  const passedNavigate = location.state?.navigate || "";
  let passedCallStatus = location.state?.call_status || "in-progress"; //Passed Call Status
  let status = passedCallStatus;
  const callDuration = location.state?.call_duration;

  setStatus(status);

  const headerText = location.state?.header;
  const componentToRender = location.state?.component || "Call";

  // Determine if navigation is from SupervisorDashboard
  useEffect(() => {
    if (passedStreamSid && passedWebsocketUrl) {
      setBaseUrl(passedWebsocketUrl);
      setStreamSid(passedStreamSid);
      setFeedbackUrl(passedFeedbackUrl);
      setSopDetails(sopDetails);
    }
  }, [passedWebsocketUrl, passedStreamSid, passedFeedbackUrl]);

  return (
    <Grid>
      {/* Main Header */}
      <Grid>
        <AgentHeader headerText={headerText} passedNavigate={passedNavigate} />
      </Grid>

      {/* Main Grid */}
      <Grid
        sx={{
          mt: 8,
        }}
      >
        {/* Sidebar */}
        <Grid item size={0.5}>
          <SideBar />
        </Grid>

        {/* Main Content */}
        <Grid
          container
          item
          sx={{
            height: "calc(100vh - 80px)", 
            margin: "10px",
            ml: 9,
            position: "relative",
            overflowY: "auto", // Enables scrolling
            scrollbarWidth: "thin", // Firefox
            msOverflowStyle: "scrollbar", // IE/Edge
            "&::-webkit-scrollbar": {
              width: "4px", // Thin scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          }}
          size={11.3}
          spacing={1}
        >
          {/* Audio file */}
          <Grid item size={4} sx={{ mt: 1 }}>
            <Card sx={{ height: "100%", boxShadow: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {audioUrl && passedCallStatus ==='completed' ? (
                  <AudioRecorder/>
                ) : (
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{ fontFamily: "Arial", textAlign: "center" }}
                  >
                    No audio file available
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Call Duration */}
          <Grid item size={4} sx={{ mt: 1 }}>
            <Card sx={{ height: "100%", boxShadow: "none" }}>
              {callDuration && passedCallStatus === 'completed' ? (
                    <TimeDuration callDuration={callDuration} passedCallStatus={passedCallStatus} />
              ):(
                <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ fontFamily: "Arial", textAlign: "center", mt:1 }}
              >
                Call Duration: Not Started
              </Typography>
              )}
          
            </Card>
          </Grid>

          {/* Call || Feedback */}
          <Grid item size={4} sx={{ mt: 1 }}>
            {componentToRender === "Feedback" &&
            passedCallStatus === "in-progress" ? (
              <Feedback />
            ) : componentToRender === "Call" ? (
              <Caller />
            ) : (
              
              <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                fontFamily: "Arial",
                textAlign: "center",
                mt: 0,
                bgcolor: "white",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>No Feedback</span>
            </Typography>
            
            )}
          </Grid>

          {/* Transcription */}
          <Grid item size={4}>
            <Card sx={{ height: 670, boxShadow: "none" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Transcription passedCallStatus={passedCallStatus} />
              </Box>
            </Card>
          </Grid>

          {/* Sentiment Box | SOP Details */}
          <Grid
            item
            size={4}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Card sx={{ height: 100, boxShadow: "none" }}>
              <SOPSentimentBox />
            </Card>
            <Card sx={{ height: 565, boxShadow: "none" }}>
              <SOPDetails />
            </Card>
          </Grid>

          {/* Suggestion | Knowledge AI */}
          <Grid
            item
            size={4}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Card sx={{ height: 140, boxShadow: "none" }}>
              <Suggestions />
            </Card>
            <Card sx={{ height: 520, boxShadow: "none" }}>
              <KnowledgeAI />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AgentDashboard;
