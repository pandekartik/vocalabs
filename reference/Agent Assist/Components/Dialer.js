import React, { useState, useEffect, useRef, useContext } from "react";
import { Backspace, Phone } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { Device } from "@twilio/voice-sdk";
import CloseIcon from "@mui/icons-material/Close";
import { APIUSER, APIUSERDIAL } from "../../E2E/axios.util";
import InputContext from "../../Context/inputContext";
import Mic from "@mui/icons-material/Mic";
import MicOff from "@mui/icons-material/MicOff";

const REFRESH_TOKEN_INTERVAL = 50 * 60 * 1000; // 50 minutes in milliseconds

const Dialer = ({ onClose }) => {
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [status, setStatus] = useState("");
  console.log("status is", status);
  const [isDeviceRegistered, setIsDeviceRegistered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [device, setDevice] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [token, setToken] = useState(null);
  const [twilioCall, setTwilioCall] = useState(null);

  const { setStreamSid, setBaseUrl,  setInterventionUrl, callPickedUp, setCallPickedUp, setFeedbackUrl } =
    useContext(InputContext);

  const callHandledRef = useRef(false);

  const countryCodes = {
    IN: "91",
    US: "1",
    UK: "44",
  };

  const keypadButtons = [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
    { number: "*", letters: "" },
    { number: "0", letters: "" },
    { number: "#", letters: "" },
  ];

  // Fetch Twilio token and initialize Device
  const fetchToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (!userDetails?.user_id) throw new Error("User ID not found in localStorage");

      const response = await APIUSER.get("/token", {
        params: { identity: userDetails.user_id },
        ...config,
      });

      const fetchedToken = response.data.token;
      if (!fetchedToken) throw new Error("No Twilio token received");

      setToken(fetchedToken);

      if (device) {
        device.updateToken(fetchedToken);
      } else {
        const twilioDevice = new Device(fetchedToken, {
          codecPreferences: ["opus", "pcmu"],
          debug: true,
          region: "us1", 
          sounds: { disconnect: null },
          logLevel: "debug",
        });
        setDevice(twilioDevice);

        twilioDevice.register().then(() => {
          setStatus("Device registered");
          setIsDeviceRegistered(true);
        }).catch((error) => {
          setStatus(`Registration error: ${error.message}`);
        });
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  // Handle incoming calls
  useEffect(() => {
    const handleIncomingCall = (call) => {
      if (callHandledRef.current) return;

      callHandledRef.current = true;
      call.accept();
      setTwilioCall(call);
      setStatus("Incoming call accepted");
      setCallStarted(true);
      setCallPickedUp(true);

      call.on("disconnect", () => {
        setStatus("Call ended");
        setCallStarted(false);
        setCallPickedUp(false);
        setTwilioCall(null);
        setIsMuted(false);
        callHandledRef.current = false;
      });

      call.on("error", (error) => {
        setStatus(`Error: ${error.message}`);
      });
    };

    if (device) {
      device.on("incoming", handleIncomingCall);
      device.on("error", (error) => {
        setStatus(`Device error: ${error.message}`);
      });
      device.on("registered", () => setIsDeviceRegistered(true));
      device.on("unregistered", () => setIsDeviceRegistered(false));
    }

    return () => {
      if (device) {
        device.off("incoming", handleIncomingCall);
      }
    };
  }, [device, setCallPickedUp]);

  // Token refresh and initialization
  useEffect(() => {
    const fetchAndInitializeDevice = async () => {
      await fetchToken();
    };
    fetchAndInitializeDevice();

    const refreshInterval = setInterval(fetchAndInitializeDevice, REFRESH_TOKEN_INTERVAL);
    return () => clearInterval(refreshInterval);
  }, []);

  // Call duration timer
  useEffect(() => {
    let timer;
    if (callStarted) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else {
      setSeconds(0);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [callStarted]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setCountryCode(countryCodes[selectedCountry]);
    setNumber(`+${countryCodes[selectedCountry]}`); // Prepend + and country code
  };

  const handleNumberChange = (e) => {
    let inputValue = e.target.value;

    if (!country) {
      alert("Please add a country code first!");
      return;
    }

    // Allow only + and digits, remove other characters
    inputValue = inputValue.replace(/[^+\d]/g, "");

    // Ensure it starts with +${countryCode} (e.g., +91)
    const expectedPrefix = `+${countryCode}`;
    if (!inputValue.startsWith(expectedPrefix)) {
      inputValue = expectedPrefix; // Reset to +91 if invalid
    }

    // Restrict length based on country code (12 for +91, 11 for +1, etc.)
    const maxLength = countryCode === "91" ? 13 : 14; // +1 + 10 digits or +91 + 10 digits
    if (inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }

    setNumber(inputValue);

    // Provide feedback via status
    if (inputValue.length < maxLength && inputValue.length > expectedPrefix.length) {
      setStatus(`Number incomplete: Enter a ${maxLength - expectedPrefix.length}-digit number after ${expectedPrefix}`);
    } else if (inputValue.length === maxLength) {
      setStatus("Idle");
    }
  };

  const handleButtonClick = (digit) => {
    if (!country) {
      alert("Please add a country code first!");
      return;
    }
    if (/[0-9]/.test(digit)) { // Only allow digits
      const expectedPrefix = `+${countryCode}`;
      const maxLength = countryCode === "1" ? 12 : 13;
      let newNumber = number + digit;
      if (newNumber.length <= maxLength) {
        setNumber(newNumber);
        if (newNumber.length === maxLength) {
          setStatus("Idle");
        } else if (newNumber.length > expectedPrefix.length) {
          setStatus(`Number incomplete: Enter a ${maxLength - expectedPrefix.length}-digit number after ${expectedPrefix}`);
        }
      }
    }
  };

  const handleDelete = () => {
    const expectedPrefix = `+${countryCode}`;
    if (number.length > expectedPrefix.length) { // Prevent deleting +${countryCode}
      setNumber((prev) => prev.slice(0, -1));
      setStatus(`Number incomplete: Enter a ${countryCode === "1" ? 10 : 10}-digit number after ${expectedPrefix}`);
    }
  };

  const userDetails = JSON.parse(localStorage.getItem("user"));
  const payload = {
    to: number, // Will now always be in +9199858878 or +12025550123 format
    agent_name: `${userDetails?.first_name} ${userDetails?.last_name}`,
    agent_id: `${userDetails?.user_id}`,
    supervisor_id: userDetails?.manager_id,
    supervisor_name: "Test User",
    customer_id: userDetails?.customer_id,
    organisation_id: userDetails?.organisation_id,
    domain: userDetails?.domain_id,
    processes: userDetails?.processes,
  };

  //call api
  const handleCall = async () => {
    const expectedPrefix = `+${countryCode}`;
    const maxLength = countryCode === "91" ? 13 : 14;
    if (number.length !== maxLength || !number.startsWith(expectedPrefix)) {
      alert(`Please enter a valid number in the format ${expectedPrefix}${countryCode === "1" ? "" : ""} (${maxLength - expectedPrefix.length} digits after ${expectedPrefix})!`);
      return;
    }

    if (!isDeviceRegistered) {
      setStatus("Device not registered yet");
      return;
    }

    if (!navigator.onLine) {
      setStatus("No internet connection");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      setStatus("Calling...");
      setCallStarted(true);

      const response = await APIUSERDIAL.post("/call", payload, config);

      const frontend_url = response.data.frontend_url;
      if (!frontend_url) throw new Error("No WebSocket URL received from API");

      setBaseUrl(frontend_url);
      setInterventionUrl(response.data.frontend_intervention_url);
      setFeedbackUrl(response.data.frontend_feedback_url);

      const streamSid = frontend_url.split("/").pop();
      setStreamSid(streamSid);

      if (!webSocket) {
        const newWebSocket = new WebSocket(frontend_url);
        setWebSocket(newWebSocket);

        newWebSocket.onopen = () => console.log("WebSocket connected");
        newWebSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.status === "call_ended") handleEndCall();
        };
        newWebSocket.onclose = () => {
          console.log("WebSocket closed");
          setWebSocket(null);
        };
        newWebSocket.onerror = (error) => console.error("WebSocket error:", error);
      }

      if (device) {
        const call = await device.connect({ params: payload });
        setTwilioCall(call);

        call.on("accept", () => {
          setStatus("Call connected");
          setCallPickedUp(true);
          console.log("Call accepted");
        });

        call.on("disconnect", () => {
          setStatus("Call disconnected");
          setCallStarted(false);
          setCallPickedUp(false);
          setTwilioCall(null);
          setIsMuted(false);
          console.log("Call disconnected");
        });

        call.on("error", (error) => {
          console.error("Call error:", error);
          if (error.code === 31005) {
            setStatus("Connection failed: Gateway terminated the call (31005)");
            console.log("Possible causes: Invalid number, network issue, or gateway rejection");
          } else {
            setStatus(`Call error: ${error.message}`);
          }
          setCallStarted(false);
          setCallPickedUp(false);
          setTwilioCall(null);
        });
      } else {
        setStatus("Device not initialized");
        setCallStarted(false);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      setCallStarted(false);
    }
  };

  const handleEndCall = () => {
    if (twilioCall) {
      twilioCall.disconnect();
    }
    if (webSocket) {
      webSocket.close();
    }
    setStatus("Idle");
    setCallStarted(false);
    setCallPickedUp(false);
    setIsMuted(false);
    setTwilioCall(null);
    setWebSocket(null);
    onClose();
    console.log("Call ended manually");
  };

  const handleMuteToggle = () => {
    if (twilioCall) {
      const newMutedState = !isMuted;
      twilioCall.mute(newMutedState);
      setIsMuted(newMutedState);
      console.log(`Call ${newMutedState ? "muted" : "unmuted"}`, twilioCall.isMuted());
    } else {
      console.log("No active call to mute");
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: 251 },
        height: { xs: "auto", sm: 450 },
        boxShadow: 2,
        zIndex: 2,
        bgcolor: "white",
        borderRadius: 1,
        p: { xs: 1, sm: 2 },
        position: "absolute",
        top: { xs: 50, sm: 70 },
        right: { xs: -20, sm: -15 },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 4, right: 4 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="body1"
        sx={{
          fontFamily: "Poppins-Medium, Helvetica",
          fontWeight: "medium",
          color: "black",
          mb: 0.5,
          fontSize: { xs: "14px", sm: "16px" },
        }}
      >
        Enter a number
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: 1,
          borderColor: "#e9eaef",
          borderRadius: 1,
          mb: 1,
          p: 0.5,
        }}
      >
        <Select
          value={country}
          onChange={handleCountryChange}
          sx={{ width: { xs: "50px", sm: "70px" }, mr: 0.5,}}
          displayEmpty
          renderValue={(selected) => (selected ? selected : "🌐")}
        >
          <MenuItem value="IN">🇮🇳</MenuItem>
          <MenuItem value="US">🇺🇸</MenuItem>
          <MenuItem value="UK">🇬🇧</MenuItem>
        </Select>
        
        <TextField
          variant="standard"
          placeholder={`+${countryCode}${countryCode === "1" ? "" : ""}`}
          value={number}
          onChange={handleNumberChange}
          InputProps={{
            disableUnderline: true,
            sx: { ml: 0.5, color: "#bdbdbdee", fontSize: { xs: "14px", sm: "16px" } },
          }}
          fullWidth
        />
        <IconButton onClick={handleDelete} sx={{ p: 1 }}>
          <Backspace fontSize="small" />
        </IconButton>
      </Box>

      <Grid container spacing={1} justifyContent="center">
        {keypadButtons.map((item) => (
          <Grid item xs={4} key={item.number}>
            <Button
              variant="text"
              sx={{
                width: "100%",
                height: { xs: "50px", sm: "60px" },
                bgcolor: "#f4f7fb",
                borderRadius: 1,
                fontWeight: "medium",
                fontSize: { xs: "14px", sm: "16px" },
                color: "#3e3e3e",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { bgcolor: "#ffffff" },
                p: 0,
              }}
              onClick={() => handleButtonClick(item.number)}
            >
              <Typography
                variant="h6"
                sx={{ lineHeight: 1, fontSize: { xs: "16px", sm: "20px" } }}
              >
                {item.number}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1, mt: 0.2, fontSize: { xs: "8px", sm: "10px" } }}
              >
                {item.letters}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <IconButton
          onClick={callStarted && callPickedUp ? handleEndCall : handleCall}
          disabled={!isDeviceRegistered || (callStarted && !callPickedUp)}
          sx={{
            bgcolor: callStarted && callPickedUp ? "red" : "#4CAF50",
            p: 2,
            mx: 1,
            "&:hover": { bgcolor: callStarted && callPickedUp ? "darkred" : "#388e3c" },
            "&.Mui-disabled": { bgcolor: "grey.500" },
          }}
        >
          <Phone sx={{ color: "white", fontSize: { xs: "20px", sm: "24px" } }} />
        </IconButton>

        {callPickedUp && (
          <IconButton
            onClick={handleMuteToggle}
            sx={{
              bgcolor: isMuted ? "grey.700" : "#2196F3",
              p: 2,
              mx: 1,
              "&:hover": { bgcolor: isMuted ? "grey.800" : "#1976D2" },
            }}
          >
            {isMuted ? (
              <MicOff sx={{ color: "white", fontSize: { xs: "20px", sm: "24px" } }} />
            ) : (
              <Mic sx={{ color: "white", fontSize: { xs: "20px", sm: "24px" } }} />
            )}
          </IconButton>
        )}
      </Box>

      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: { xs: "12px", sm: "14px" } }}
        >
          {/* {status} */}
          {/* {callStarted && ` - Duration: ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`} */}
        </Typography>
      </Box>
    </Box>
    
  );
};

export default Dialer;


