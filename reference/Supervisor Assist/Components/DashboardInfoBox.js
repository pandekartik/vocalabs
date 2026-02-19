import React from "react";
import { Paper, Box, Typography, Divider } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";

const DashboardInfoBox = ({ inProgressCount, totalCalls, averageCallTime }) => {
  return (
    <Box sx={{ display: "flex", mt: 0, px: 3,  width: "42vw", }}>
      {/* In-progress Calls Box */}
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          justifyContent: "space-between",
        
          boxShadow: 1,
          opacity: 0.88,
        }}
      >
        <SupportAgentIcon
          sx={{
            fontSize: 35,
            color: "#a195e6",
            bgcolor: "#d1ecff",
            borderRadius: "50%",
          }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography variant="body1" color="textPrimary">
            Inprogress Calls
          </Typography>
          <Typography variant="h6" color="textPrimary">
            {inProgressCount}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        {/* Active Calls Box */}
        <GroupIcon
          sx={{
            fontSize: 35,
            color: "#21ad42",
            bgcolor: "#d1ecff",
            borderRadius: "50%",
          }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography variant="body1" color="textPrimary">
            Total Calls
          </Typography>
          <Typography variant="h6" color="textPrimary">
            {totalCalls}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        {/* Average Call Time Box */}
        <HistoryIcon
          sx={{
            fontSize: 35,
            color: "#ed8040",
            bgcolor: "#faefe8",
            borderRadius: "50%",
          }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography variant="body1" color="textPrimary">
            Average Call Time
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {averageCallTime}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardInfoBox;
