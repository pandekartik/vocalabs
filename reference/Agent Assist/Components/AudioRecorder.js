import React, { useContext, useRef, useState, useEffect } from "react";
import InputContext from "../../Context/inputContext";
import {
  Grid2 as Grid,
  Box,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FastForwardIcon from "@mui/icons-material/FastForward";

const AudioRecorder = () => {
  const { audioUrl } = useContext(InputContext);
  const audioRef = useRef(new Audio(audioUrl));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    audio.src = audioUrl || "";
    if (audioUrl) audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [audioUrl]);

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration || Infinity
      );
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Slider change handler
  const handleSliderChange = (event, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Grid
      sx={{
        width: { xs: "100%", sm: "80%", md: "50%", lg: "30.5vw" }, // Responsive width
        height: { xs: "15vh", sm: "10vh", md: "80px" }, // Smaller height
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.5, sm: 1 }, // Reduced gap
        }}
      >
        <IconButton
          onClick={skipBackward}
          aria-label="Skip Backward 10 seconds"
          sx={{ color: "#1976d2", p: { xs: 0.5, sm: 1 } }}
        >
          <FastRewindIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
        </IconButton>

        <IconButton
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            "&:hover": { bgcolor: "#1565c0" },
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
          }}
        >
          {isPlaying ? (
            <PauseIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
          )}
        </IconButton>

        <IconButton
          onClick={skipForward}
          aria-label="Skip Forward 10 seconds"
          sx={{ color: "#1976d2", p: { xs: 0.5, sm: 1 } }}
        >
          <FastForwardIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
        </IconButton>
      </Box>

      {/* Progress Slider and Time */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: { xs: 0.25, sm: 0.5 }, // Reduced gap
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: "0.625rem", sm: "0.75rem" },
            minWidth: { xs: "25px", sm: "30px" },
          }}
        >
          {formatTime(currentTime)}
        </Typography>

        <Slider
          value={currentTime}
          min={0}
          max={duration || 100}
          onChange={handleSliderChange}
          sx={{
            flexGrow: 1,
            color: "#1976d2",
            "& .MuiSlider-thumb": {
              width: { xs: 8, sm: 10 },
              height: { xs: 8, sm: 10 },
            },
            "& .MuiSlider-rail": { height: { xs: 2, sm: 4 } },
            "& .MuiSlider-track": { height: { xs: 2, sm: 4 } },
          }}
          disabled={!audioUrl}
        />

        <Typography
          variant="caption"
          sx={{
            fontSize: { xs: "0.625rem", sm: "0.75rem" },
            minWidth: { xs: "25px", sm: "30px" },
          }}
        >
          {formatTime(duration)}
        </Typography>
      </Box>
    </Grid>
  );
};

export default AudioRecorder;