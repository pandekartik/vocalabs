import React from "react";
import { Grid2 as Grid, Typography, Box } from "@mui/material";
import { useContext } from "react";
import InputContext from "../../Context/inputContext";

const Suggestions = () => {
  const {sopDetails} = useContext(InputContext);
  const suggestions = sopDetails?.suggestions || [];
  const suggestionsToDisplay =
    suggestions.length > 0 ? suggestions : ["No suggestions available."];

  return (
    <Grid
      sx={{
        borderRadius: 2,
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        mt: 1,
        height: '28.5vh',
        backgroundColor: "white",
        overflowY: "auto",
        overflowX: "hidden",
        whiteSpace: "pre-wrap",
        width: "100%",
        textAlign: "start",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          borderRadius: 3,
          width: { xs: "50%", sm: "25%", md: "25%" },
          position: "absolute",
          zIndex: 1,
          backgroundColor: "white",
          fontFamily: "Arial",
          fontWeight: 500,
          color: "black",
          mb: 2,
          pt: 1,
          pl: 2,
        }}
      >
        Suggestions
      </Typography>
      <Grid sx={{ mt: 6 }}>
        <Box sx={{ pl: 2, mt: 2 }}>
          <ul style={{ paddingLeft: 20 }}>
            {suggestionsToDisplay.map((suggestion, index) => (
              <li key={index}>
                <Typography variant="body2">{suggestion}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Suggestions;
