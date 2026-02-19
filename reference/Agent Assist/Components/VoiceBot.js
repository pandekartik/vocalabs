import { Typography, Grid2 as Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed: `npm install axios`

const VoiceBot = () => {
  const [summaryOpen, setSummaryOpen] = useState(false); // State to control summary popup
  const [summaryData, setSummaryData] = useState(null); // State to store summary data
  const token = localStorage.getItem("token");

  // GET API function with fallback to dummy data
  const fetchSummaryData = async () => {
    try {
      // Attempt to fetch data from the real API
      const response = await axios.get('https://agent-assist.inteliconvo.ai/api/live/voicebot-get-details', {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      });

      // Check if response data exists and is valid
      if (response.data && response.status === 200) {
        setSummaryData(response.data); // Use real API data
      } else {
        throw new Error('No valid data returned from API');
      }
    } catch (error) {
      console.error("Error fetching summary data from API:", error);

      // Fallback to dummy data matching the API response structure
      const dummyResponse = {
        stream_sid: "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        summary: "This is a dummy voicebot summary",
        to: "+919876543210",
      };
      setSummaryData(dummyResponse); // Set dummy data as fallback
    }
  };

  // Handle clicking "Voice Bot" to open popup and fetch data
  const handleVoiceBotClick = () => {
    setSummaryOpen(true);
    fetchSummaryData();
  };

  // Close the summary popup
  const handleSummaryClose = () => {
    setSummaryOpen(false);
    setSummaryData(null); // Reset data when closing
  };

  return (
    <>
      <Grid sx={{ ml: 0 }}>
        {/* Clickable Voice Bot text */}
        <Typography
          onClick={handleVoiceBotClick}
          sx={{
            cursor: "pointer",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Voice Bot
        </Typography>
      </Grid>

      {/* Summary Popup */}
      <Dialog open={summaryOpen} maxWidth="sm" fullWidth>
        <DialogTitle>Voice Bot Summary</DialogTitle>
        <DialogContent>
          {summaryData ? (
            summaryData.error ? (
              <Typography color="error">{summaryData.error}</Typography>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>Stream SID: {summaryData.stream_sid}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Summary: {summaryData.summary}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>To: {summaryData.to}</Typography>
                </Grid>
              </Grid>
            )
          ) : (
            <Typography>Loading summary data...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSummaryClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceBot;