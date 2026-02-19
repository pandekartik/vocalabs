import React, { useState, useEffect, useContext } from "react";
import { Grid2 as Grid, Box, Typography, Card, CardContent } from "@mui/material";
import { APIUSER } from "../../E2E/axios.util";
import InputContext from "../../Context/inputContext";

const Transcription = ({ passedCallStatus }) => {
  const [messages, setMessages] = useState([]);
  console.log("Message is ", messages);

  const { streamSid, baseUrl, setTranscript, setSopDetails, setAudioUrl, audioUrl } =
    useContext(InputContext);
    console.log("Audio is", audioUrl);

  useEffect(() => {
    // Clear responses when streamSid changes
    setMessages([]);
  }, [streamSid]);

  useEffect(() => {
    let websocket;

    const handleWebSocketData = (data) => {
      try {
        if (data.event === "full_content" && Array.isArray(data.data.transcripts)) {
          data.data.transcripts.forEach((transcriptItem, index) => {
            if (transcriptItem.event === "transcription" && transcriptItem.data) {
              const transcriptionMessage = {
                text: transcriptItem.data,
                speaker: transcriptItem.speaker === "Agent" ? "Agent" : "Customer",
                color: "#e49c46",
                index, // Add index for sorting
              };

              setMessages((prev) => {
                const exists = prev.some((msg) => msg.text === transcriptionMessage.text);
                const updatedMessages = exists ? prev : [...prev, transcriptionMessage];
                // Sort descending for "in-progress"
                if (passedCallStatus === "in-progress") {
                  return [...updatedMessages].sort((a, b) => b.index - a.index); // Newest first
                }
                return updatedMessages; // Default order (sorted later for "completed")
              });

              setTranscript((prev) => {
                const updatedTranscript = prev.includes(transcriptionMessage.text)
                  ? prev
                  : `${prev}Speaker: ${transcriptionMessage.text}\n`;
                return updatedTranscript;
              });
            } else if (transcriptItem.event === "api_response" && transcriptItem.data?.responses) {
              setSopDetails(transcriptItem.data.responses[0]);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    if (streamSid && passedCallStatus === "in-progress") {
      setAudioUrl("");
      websocket = new WebSocket(baseUrl);

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketData(data);
        } catch (error) {
          console.error("Error parsing WebSocket data:", error);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (websocket) {
          websocket.close();
        }
      };
    }

    if (streamSid && passedCallStatus === "completed") {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      APIUSER.get(
        `/get-transcript-details?stream_sid=${streamSid}&status=completed`,
        config
      )
        .then((res) => {
          setAudioUrl(res.data.recording_url);
          const apiResponses = [];
          const finalResult = [];

          res?.data?.details?.[0]?.Transcript_Details?.transcripts?.forEach((el, index) => {
            if (el.event === "transcription" && el.data?.trim()) {
              finalResult.push({
                text: el.data,
                speaker: el.speaker === "Agent" ? "Agent" : "Customer",
                color: "#e49c46",
                index, // Add index for sorting
              });
            } else if (el.event === "api_response" && Array.isArray(el?.data?.responses)) {
              el.data.responses.forEach((response) => {
                apiResponses.push(response);
              });
            }
          });

          // Sort ascending for "completed" status
          if (passedCallStatus === "completed") {
            finalResult.sort((a, b) => a.index - b.index); // Oldest first
          }

          setSopDetails(apiResponses);
          setMessages(finalResult);
        })
        .catch((error) => {
          console.error("API request failed:", error);
          if (error.response) {
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            console.error("No response received:", error.request);
          } else {
            console.error("Request setup error:", error.message);
          }
        });
    }
  }, [streamSid]);

  return (
    <Grid
      container
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}
      >
        <Card
          sx={{
            ...styles.transcriptBox,
            "@media (max-width: 600px), (min-width: 601px) and (max-width: 1024px), (min-width: 1025px)": {
              fontFamily: "Arial",
              fontWeight: 400,
              fontSize: { xs: "3vw", sm: "2vw", md: "1.5vw", lg: "1.2vw" },
              width: "100%",
              height: "100vh",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "white",
              zIndex: 2,
              borderRadius: "4px 4px 0 0",
              fontSize: { xs: "1vw", sm: "1vw", md: "1vw", lg: "1vw" },
              width: "98%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                pt: 1,
                pl: 2,
              }}
            >
              Transcription <span style={{ fontSize: 12 }}>{}</span>
            </Typography>
          </Box>
          <CardContent
            sx={{
              height: "90vh",
              pt: 8,
              overflowY: "auto",
              scrollbarWidth: "thin",
              msOverflowStyle: "scrollbar",
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "white",
                    padding: { xs: "6px", sm: "8px", md: "8px" },
                    margin: "4px 0",
                    borderRadius: "4px",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Arial",
                      fontSize: {
                        xs: "3vw",
                        sm: "1.5vw",
                        md: "1vw",
                        lg: "1vw",
                      },
                      color: message.color,
                      fontWeight: 400,
                      mr: 1,
                    }}
                  >
                    {message.speaker}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Arial",
                      fontSize: {
                        xs: "3vw",
                        sm: "1.5vw",
                        md: "1vw",
                        lg: "1vw",
                      },
                      color: "#51c94d",
                      fontWeight: 400,
                    }}
                  >
                    {message.text}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Arial",
                  textAlign: "center",
                  color: "gray",
                  ml: { xs: "0px", sm: "80px", md: "120px" },
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                }}
              >
                No transcriptions available.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const styles = {
  transcriptBox: {
    mt: 0,
    backgroundColor: "white",
    fontSize: "1vw",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    padding: 0,
    overflowX: "hidden",
    scrollbarWidth: "none",
    borderRadius: 2,
    overflowY: "scroll",
    whiteSpace: "normal",
    fontFamily: "Arial",
    msOverflowStyle: "none",
    textAlign: "left",
  },
};

export default Transcription;






















