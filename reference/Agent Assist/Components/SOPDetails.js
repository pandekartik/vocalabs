// Working for in-progress call not for completed call

import React, { useState, useEffect, useContext } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import InputContext from "../../Context/inputContext";

const SOPDetails = () => {
  const [responses, setResponses] = useState([]);
  const { sopDetails, streamSid , status} = useContext(InputContext);

  useEffect(() => {
    // Clear responses when streamSid changes
    setResponses([]);
  }, [streamSid]);
  
  useEffect(() => {
    if (!sopDetails || !streamSid) return;
  
    setResponses((prevResponses) => {
      if (status === "in-progress") {
        // Check if the new sopDetails already exists in the responses array
        const isDuplicate = prevResponses.some(
          (response) => JSON.stringify(response) === JSON.stringify(sopDetails)
        );
  
        return isDuplicate ? prevResponses : [sopDetails, ...prevResponses];
      } else if (status === "completed") {
        // Reset responses for completed calls
        return Array.isArray(sopDetails) ? sopDetails : [sopDetails];
      }
  
      return prevResponses;
    });
  }, [sopDetails, streamSid, status]);
  
  
  
  const isDataUnavailable = !streamSid || responses.length === 0;

  return (
    <Grid
      sx={{
        borderRadius: 2,
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        mt: 1,
        height: "78vh",
        backgroundColor: "white",
        overflowY: "auto",
        overflowX: "hidden",
        whiteSpace: "pre-wrap",
        width: "100%",
        textAlign: "start",
        // overflowY: "auto",
        // scrollbarWidth: "none",
        // msOverflowStyle: "none",
        // "&::-webkit-scrollbar": { display: "none" },
        overflowY: "auto", // Enables vertical scrolling
        scrollbarWidth: "thin", // Shows scrollbar in Firefox with a thin style
        msOverflowStyle: "scrollbar", // Shows scrollbar in IE/Edge
        "&::-webkit-scrollbar": {
          width: "5px", // Sets scrollbar width in Webkit browsers
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888", // Custom thumb color
          borderRadius: "5px", // Rounded edges
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1", // Custom track color
        },
      }}
      
    >
      <Typography
        variant="h6"
        sx={{
          zIndex: 1,
          mb: 2,
          position: "absolute",
          pt: 1,
          borderRadius: 3,
          borderBottomRightRadius: 0,
          fontSize: "20px",
          pl: 2,
          width: { xs: "80%", sm: "27%", md: "27%", lg: "29.2%" },
          backgroundColor: "white",
          fontFamily: "Poppins, Helvetica",
          fontWeight: 500,
          color: "black",
        }}
      >
        SOP Details
      </Typography>
      {isDataUnavailable ? (
        <Grid
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "15vh",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: "#7d7d7d",
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
            }}
          >
            No SOP Details available
          </Typography>
        </Grid>
      ) : (
        <Grid sx={{ mt: 3 }}>
          {responses
            .filter((response) => {
              // Filter out responses with no relevant data
              const {
                question,
                contextual_answer,
                extracted_response,
                complaints,
                sentiments,
              } = response;
              return (
                question ||
                contextual_answer ||
                (extracted_response &&
                  (extracted_response.Entities || extracted_response.Intents)) ||
                (complaints && complaints.length > 0) ||
                (sentiments && sentiments.length > 0)
              );
            })
            .map((response, index) => {
              const {
                question,
                contextual_answer,
                extracted_response,
                complaints = [],
                sentiments = [],
              } = response;

              const entity = extracted_response?.Entities || "No Entities";
              console.log("Entities are", entity)
              const intent = extracted_response?.Intents || "No Intents";

              return (
                <Grid
                  key={index}
                  sx={{
                    borderRadius: 2,
                    mb: 2,
                    p: 2,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {question && (
                    <Typography>
                      <strong style={{ fontWeight: 400, color: "black" }}>
                        Question:
                      </strong>{" "}
                      <span style={{ color: "#e49c46" }}>{question}</span>
                    </Typography>
                  )}
                  {contextual_answer && (
                    <Typography>
                      <strong style={{ fontWeight: 400, color: "black" }}>
                        Contextual Answer:
                      </strong>{" "}
                      <span style={{ color: "#3892CF" }}>
                        {contextual_answer}
                      </span>
                    </Typography>
                  )}
                  {(entity !== "No Entity" || intent !== "No Intents") && (
                    <Typography>
                      <strong style={{ fontWeight: 400, color: "black" }}>
                        Entity:
                      </strong>{" "}
                      <span style={{ color: "#3892CF" }}>{entity || "No Entity"}</span>{" "}
                      <strong style={{ fontWeight: 400, color: "black" }}>
                        Intent:
                      </strong>{" "}
                      <span style={{ color: "#3892CF" }}>{intent || "No Intents"}</span>
                    </Typography>
                  )}
                  {complaints.length > 0 && (
                    <Typography>
                      <strong style={{ fontWeight: 400, color: "black" }}>
                        Complaints:
                      </strong>{" "}
                      <span style={{ color: "#3892CF" }}>
                        {complaints.join(", ")}
                      </span>
                    </Typography>
                  )}
                  {sentiments.length > 0 && (
                    <Typography>
                      <strong style={{ fontWeight: 400, color: "black" }}>
                        Sentiment:
                      </strong>{" "}
                      <span style={{ color: "#3892CF" }}>
                        {sentiments.join(", ")}
                      </span>
                    </Typography>
                  )}
                </Grid>
              );
            })}
        </Grid>
      )}
    </Grid>
  );
};

export default SOPDetails;
