import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { AIUSER } from "../../E2E/axios.util";
import InputContext from "../../Context/inputContext";

const KnowledgeAI = () => {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [extractedResponse, setExtractedResponse] = useState({
    Entity: "",
    Intent: "",
  });
  console.log("Extracted response is", extractedResponse)
  const {streamSid} = useContext(InputContext);

  useEffect(()=>{
    if(streamSid){
      setAnswer([]);
      setExtractedResponse([]);
    }
  }, [streamSid])

  const handlediscussion = () => {
    setLoading(true);

    const payload = { question: question, streamSid: streamSid, domain: userDetails?.domain_id,    customer_id: userDetails?.customer_id, };
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    AIUSER.post("/knowledge_ai", payload, config)
      .then((response) => {
        if (response.data) {
          setAnswer(
            response.data.contextual_answer || "No contextual answer available."
          );
          setExtractedResponse({
            Entity: response.data.extracted_response?.Entities || "No entity",
            Intent: response.data.extracted_response?.Intents || "No intent",
          });
        } else {
          setAnswer("No valid response from the AI server.");
          setExtractedResponse({ Entity: "", Intent: "" });
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handlediscussion();
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "white",

        height: "72vh",
        borderRadius: 2,
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        mt: 1,

        textAlign: "left",
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For Internet Explorer and Edge
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for Chrome and Safari
        },
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          pl: 2,
          mt: 1,
        }}
      >
        Knowledge AI
      </Typography>
      <Typography
        variant="body2"
        color="black"
        sx={{
          pl: 2,
        }}
      >
        AI refers to artificial intelligence systems specifically designed to
        acquire, process, and apply knowledge
      </Typography>
      <CardContent>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <TextField
            fullWidth
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your question"
            sx={{
              height: "3em",
              fontFamily: "Poppins",
              fontSize: "16px",
              backgroundColor: "#e9eaef",
            }}
            InputProps={{
              sx: {
                height: "3em",
                "& input::placeholder": {
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "rgba(0, 0, 0, 0.5)",
                  borderRadius: 0,
                },
              },
            }}
          />
          <Button
            onClick={handlediscussion}
            variant="contained"
            color="primary"
            disabled={loading}
            style={{
              backgroundColor: "#3892CF",
              height: "3.4em",
              marginLeft: 2,
              width: "3.5em",
              minWidth: "unset",
            }}
          >
            <IoMdSend />
          </Button>
        </div>

        <div style={{ margin: "2px" }}>
          <div style={{ marginBottom: 5 }}>
            <Typography
              component="div"
              sx={{
                borderColor: "#edf7f7",
                borderRadius: "6px",
                fontFamily: "Arial",
                fontSize: "14px",
                color: "#3892CF",
                fontWeight: 400,
                boxShadow: 2,
                height: "250px",
                overflowY: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                mb: 2,
                p: 1,
                paddingLeft: 2,
                backgroundColor: "background.paper",
              }}
            >
              {answer || " "}
            </Typography>
          </div>
          <div>
            <Typography
              component="div"
              sx={{
                borderColor: "#3892CF",
                borderRadius: "6px",
                fontFamily: "Arial",
                fontSize: "14px",
                fontWeight: 500,
                height: "60px",
                boxShadow: 2,
                overflowY: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                mb: 2,
                padding: 1,

                color: "text.primary",
              }}
            >
              <Typography
                variant="body2"
                color="black"
                align="left"
                sx={{
                  fontSize: "14px",
                }}
              >
                <span>Entity:</span>
                <span style={{ color: "#4fbb6e" }}>
                  {" "}
                  {extractedResponse.Entity}
                </span>
              </Typography>
              <Typography variant="body2" color="black" align="left">
                Intent:{" "}
                <span style={{ color: "#4fbb6e" }}>
                  {extractedResponse.Intent}
                </span>
              </Typography>
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeAI;
