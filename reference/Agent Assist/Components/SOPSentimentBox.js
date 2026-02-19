// Dynamic Sentimment| Entity | Intent
import React, { useState, useEffect, useContext } from "react";
import {
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentNeutral as SentimentNeutralIcon,
  MoodBad as MoodBadIcon,
} from "@mui/icons-material";
import { Avatar, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputContext from "../../Context/inputContext";

const SOPSentimentBox = () => {
  const [sentimentIcon, setSentimentIcon] = useState(null);
  const [sentimentColor, setSentimentColor] = useState("gray");
  const {sopDetails} = useContext(InputContext);

  const theme = useTheme();
  const isMdOrLarger = useMediaQuery(theme.breakpoints.up("lg"));

  // Helper function to map sentiment type to icon and color
  const setIconAndColor = (type) => {
    switch (type) {
      case "Angry":
      case "Abusive":
      case "Sad":
      case "Frustrated":
      case "Negative":
        return {
          icon: <MoodBadIcon />,
          color: "red",
        };
      case "Neutral":
        return {
          icon: <SentimentNeutralIcon />,
          color: "green",
        };
      case "Happy":
      case "Grateful":
      case "Positive": 
        return {
          icon: <SentimentSatisfiedAltIcon />,
          color: "green",
        };
      case "Confused":
      case "Worried":
        return {
          icon: <SentimentDissatisfiedIcon />,
          color: "blue",
        };
      default:
        return {
          icon: <SentimentNeutralIcon />,
          color: "green",
        };
    }
  };
  //Extract sentiments
  useEffect(() => {
    // Extract sentiment from sopDetails
    const sentiment = sopDetails?.sentiments?.[0] || null;

    // Update sentiment icon and color
    const sentimentData = setIconAndColor(sentiment);
    setSentimentIcon(sentimentData.icon);
    setSentimentColor(sentimentData.color);
  }, [sopDetails]);

  return (
    <Grid
      sx={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 1,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        padding: 2,
        mt: 1,
      }}
    >
      {/* Sentiment Section */}
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: 1,
          borderRadius: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#eceaf8",
            border: 4,
            ml: 1,
          }}
        >
          {sentimentIcon &&
            React.cloneElement(sentimentIcon, {
              sx: {
                color: sentimentColor,
                fontSize: 24,
              },
            })}
        </Avatar>
        {isMdOrLarger && (
          <Typography
            sx={{
              fontFamily: "Helvetica",
              fontWeight: "bold",
              color: "#767676",
              fontSize: "0.85rem",
              width: "100%",
            }}
          >
            {sopDetails?.sentiments?.[0] || "No Sentiment"}
          </Typography>
        )}
      </Grid>

      {/* Entity Section */}
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: 1,
          borderRadius: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#eceaf8",
            border: 4,
            ml: 1,
          }}
        >
          <SentimentSatisfiedAltIcon
            sx={{
              backgroundColor: "#eceaf8",
              color: "red",
              fontSize: 24,
              borderRadius: "50%",
            }}
          />
        </Avatar>
        {isMdOrLarger && (
          <Typography
            sx={{
              fontFamily: "Helvetica",
              fontWeight: "bold",
              color: "#767676",
              fontSize: "0.85rem",
              width: "100%",
            }}
          >
            Entity
          </Typography>
        )}
      </Grid>

      {/* Intent Section */}
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: 1,
          borderRadius: 1,
        }}
      >
        {" "}
        <Avatar
          sx={{
            bgcolor: "#eceaf8",
            border: 4,
            ml: 1,
          }}
        >
          <SentimentSatisfiedAltIcon
            sx={{
              backgroundColor: "#eceaf8",
              color: "lightgreen",
              fontSize: 24,
              borderRadius: "50%",
            }}
          />
        </Avatar>
        {isMdOrLarger && (
          <Typography
            sx={{
              fontFamily: "Helvetica",
              fontWeight: "bold",
              color: "#767676",
              fontSize: "0.85rem",
              width: "100%",
            }}
          >
            {sopDetails?.intent || "No Intent"}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default SOPSentimentBox;
