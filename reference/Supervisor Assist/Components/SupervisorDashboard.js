import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Grid2 as Grid,
  Paper,
  Typography,
  Button,
  Badge,
} from "@mui/material";
import "./SupervisorDashboard.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import {
  SentimentSatisfiedAlt,
  SentimentDissatisfied,
  MoodBad,
  Mood,
  SentimentNeutral,
} from "@mui/icons-material";
import DashboardInfoBox from "./DashboardInfoBox";
import SupervisorHeader from "./SupervisorHeader";
import SupervisorSidebar from "./SupervisorSidebar";
import InputContext from "../../Context/inputContext";
import AgentList from "./AgentList";
import SearchFilter from "./SearchFilter";

const SupervisorDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const intervention_universal = `${process.env.REACT_APP_WEB_SOCKET}/supervisor/${userDetails?.user_id}`;
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [selectedStreamSid, setSelectedStreamSid] = useState(null);

  // useContext
  const { setStreamSid, setAudioUrl, data, paginationContent } =
    useContext(InputContext);

  const navigate = useNavigate();

  // Updated handleNotificationClick with data matching
  const handleNotificationClick = (notification) => {
    if (notification.stream_sid) {
      setSelectedStreamSid(notification.stream_sid);

      // Find matching data object based on stream_sid
      const matchedData = data.find(
        (item) => item.stream_sid === notification.stream_sid
      );

      // Use matchedData if found, otherwise fallback to notification fields
      const navigationState = matchedData
        ? {
            header: "Supervisor Assist",
            navigate: true,
            component: "Feedback",
            streamSid: matchedData.stream_sid,
            websocketUrl: matchedData.frontend_websocket_url || "",
            feedbackUrl: matchedData.frontend_feedback_url || "",
            call_status: matchedData.status || "",
            call_duration: matchedData.duration || "",
          }
        : {
            header: "Supervisor Assist",
            navigate: true,
            component: "Feedback",
            streamSid: notification.stream_sid,
            websocketUrl: notification.frontend_websocket_url || "",
            feedbackUrl: notification.frontend_feedback_url || "",
            call_status: notification.call_status || "",
            call_duration: notification.call_duration || "",
          };

      navigate("/supervisor/agent-dashboard", { state: navigationState });
    }
  };

  const handleToggleNotification = () => {
    setIsNotificationVisible((prev) => !prev);
    if (!isNotificationVisible) {
      setUnreadCount(0);
    }
  };

  const handleClose = () => {
    setIsNotificationVisible(false);
  };

  // Intervention WebSocket
  useEffect(() => {
    if (!intervention_universal) {
      console.error("WebSocket URL is not defined.");
      return;
    }

    const ws = new WebSocket(intervention_universal);
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "notifications" && Array.isArray(message.data)) {
          const newNotifications = message.data.map((notification) => ({
            ...notification,
            status: "unread",
          }));
          setNotifications((prev) => [...prev, ...newNotifications]);
          setUnreadCount((prev) => prev + newNotifications.length);
        } else {
          console.warn("Unexpected WebSocket message structure:", message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error, event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [intervention_universal]);

  // Sentiment function
  function getSentiment(input) {
    switch (input) {
      case "Angry":
        return <SentimentDissatisfied color="error" />;
      case "Neutral":
        return <SentimentNeutral color="disabled" />;
      case "Positive":
        return <Mood color="success" />;
      case "Interested":
        return <Mood color="success" />;
      case "Sad":
        return <MoodBad color="error" />;
      case "Abusive":
        return <SentimentDissatisfied color="error" />;
      case "Negative":
        return <SentimentDissatisfied color="error" />;
      case "Disappointed":
        return <SentimentDissatisfied color="error" />;
      case "Worried":
        return <SentimentNeutral color="disabled" />;
      case "Frustrated":
        return <SentimentDissatisfied color="error" />;
      case "Grateful":
        return <SentimentSatisfiedAlt color="success" />;
      case "Confused":
        return <SentimentNeutral color="disabled" />;
      case "Anxious":
        return <SentimentNeutral color="disabled" />;
      case "Stressed":
        return <SentimentDissatisfied color="error" />;
      default:
        return null;
    }
  }

  const inProgressCount = data.filter(
    (row) => row.status === "in-progress"
  ).length;

  const totalCalls = paginationContent ? paginationContent.total_count : 0;

  const averageCallTime = (() => {
    const totalSeconds = data.reduce((acc, row) => {
      if (row.duration && typeof row.duration === "string") {
        const timeParts = row.duration.split(" ");
        if (timeParts.length === 4) {
          const minutes = parseInt(timeParts[0]) || 0;
          const seconds = parseInt(timeParts[2]) || 0;
          return acc + minutes * 60 + seconds;
        } else {
          console.warn(`Invalid duration format for row: ${row.duration}`);
        }
      } else {
        console.warn(
          `Missing or invalid duration for row: ${JSON.stringify(row)}`
        );
      }
      return acc;
    }, 0);

    const averageSeconds = totalSeconds / data.length || 0;
    const avgMinutes = Math.floor(averageSeconds / 60);
    const avgSeconds = Math.round(averageSeconds % 60);
    return avgSeconds ? `${avgMinutes} min ${avgSeconds} sec` : "0";
  })();

  const handleNavigate = (row) => {
    const navigationPath =
      userDetails?.role === "Manager"
        ? "/supervisor/agent-dashboard"
        : userDetails?.role === "Agent"
        ? "/agent/agent-dashboard"
        : "";
    navigate(navigationPath, {
      state: {
        header:
          userDetails?.role === "Manager"
            ? "Supervisor Assist"
            : "Agent Assist",
        navigate: true,
        component: "Feedback",
        streamSid: row?.stream_sid,
        websocketUrl: row?.frontend_websocket_url,
        feedbackUrl: row?.frontend_feedback_url,
        call_status: row?.status,
        call_duration: row?.duration,
      },
    });
  };

  return (
    <Grid>
      {/* Main Header */}
      <Grid>
        <SupervisorHeader />
      </Grid>

      {/* Main Grid */}
      <Grid container sx={{ backgroundColor: "white" }}>
        {/* Sidebar */}
        <Grid>
          <SupervisorSidebar />
        </Grid>

        <Grid
          sx={{
            mt: 8,
            ml: 10,
            width: "94%",
            height: "90vh",
            overflow: "hidden",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ width: "100%", mt: 2 }}
            justifyContent={"space-between"}
          >
            {/* Three Box Container */}
            <Grid item md={8}>
              <DashboardInfoBox
                inProgressCount={inProgressCount}
                totalCalls={totalCalls}
                averageCallTime={averageCallTime}
              />
            </Grid>

            {/* Notification Section */}
            {userDetails?.role === "Manager" && (
              <Grid item md={1} sx={{ mr: 4 }}>
                <IconButton
                  onClick={handleToggleNotification}
                  aria-label="notifications"
                  sx={{ position: "relative" }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon color="primary" />
                  </Badge>
                </IconButton>

                {isNotificationVisible && (
                  <Paper
                    elevation={3}
                    sx={{
                      width: 437,
                      height: 612,
                      bgcolor: "white",
                      position: "fixed",
                      top: 10,
                      right: 10,
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
                      Notifications
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
                        right: 15,
                        bgcolor: "#72be47",
                        borderRadius: "6px 0 6px 6px",
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                    >
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              mb: 1,
                              borderBottom: "1px solid #e0e0e0",
                              pb: 1,
                              cursor: "pointer",
                            }}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <Typography
                              variant="body1"
                              color="textPrimary"
                              sx={{
                                fontFamily: "Courier New",
                                fontWeight:
                                  notification.status === "unread"
                                    ? "bold"
                                    : "normal",
                                fontSize: "0.975rem",
                                textAlign: "left",
                                color: "white",
                              }}
                            >
                              {notification.data}
                              {/* {notification.stream_sid && ` (StreamSid: ${notification.stream_sid})`} */}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ fontFamily: "Courier New" }}
                              >
                                Agent ID: {notification.agent_id}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ fontFamily: "Courier New" }}
                              >
                                {(() => {
                                  const utcDate = new Date(
                                    notification.timestamp
                                  );
                                  const istDate = new Date(
                                    utcDate.getTime() + 5.5 * 60 * 60 * 1000
                                  );
                                  return istDate.toLocaleString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                  });
                                })()}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "Courier New",
                            fontWeight: "400",
                            fontSize: "0.975rem",
                            textAlign: "left",
                            color: "white",
                          }}
                        >
                          No notifications available
                        </Typography>
                      )}
                    </Box>

                    <IconButton
                      onClick={handleClose}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <CloseIcon sx={{ width: 12, height: 12 }} />
                    </IconButton>
                  </Paper>
                )}
              </Grid>
            )}

            {/* Agent Create Call Button */}
            {userDetails?.role === "Agent" && (
              <Grid item md={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setStreamSid();
                    setAudioUrl();
                    navigate("/agent-dashboard");
                  }}
                  sx={{ position: "relative", mr: 3 }}
                >
                  Create Call
                </Button>
              </Grid>
            )}
          </Grid>

          <Grid>
            <SearchFilter />
          </Grid>

          <Grid>
            <AgentList
              getSentiment={getSentiment}
              handleNavigate={handleNavigate}
              selectedStreamSid={selectedStreamSid}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SupervisorDashboard;