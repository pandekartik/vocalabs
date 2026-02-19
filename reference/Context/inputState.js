import React from "react";
import { useState, useEffect } from "react";
import InputContext from "./inputContext";

const InputState = (props) => {
  const [streamSid, setStreamSid] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [interventionUrl, setInterventionUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [sopDetails, setSopDetails] = useState([]);
  const [feedbackUrl, setFeedbackUrl] = useState();
  const [audioUrl, setAudioUrl] = useState("");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [status, setStatus] = useState("");
  const [sentiment, setSentiment] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [paginationContent, setPaginationContent] = useState();
  const [callType, setCallType] = useState();
  const [currentPage, setCurrentPage] =  useState(1);
  const [debounceQuery, setDebouncedQuery ] = useState();
  const [responses, setResponses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [callPickedUp, setCallPickedUp] = useState(false);
  const [callEnd, setCallEnd] = useState();
  const [seconds, setSeconds] = useState(0);
  


  

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer); // Cleanup timer on component unmount or when value changes
    };
  }, [searchQuery]);
  return (
    <InputContext.Provider value={{ 
      streamSid,
      setStreamSid,
      baseUrl,
      seconds, 
      setSeconds,
      responses, 
      setResponses,
      callPickedUp, 
      setCallPickedUp,
      setSentiment,
      messages, 
      setMessages,
      callEnd, 
      setCallEnd,
      sentiment,
      setBaseUrl,
      interventionUrl, 
      setInterventionUrl,
      transcript, 
      setTranscript,
      sopDetails, 
      setSopDetails,
      feedbackUrl,
      setFeedbackUrl,
      audioUrl,
      setAudioUrl,
      debouncedValue,
      setDebouncedValue, 
      searchQuery, 
      setSearchQuery,
      status,
      setStatus,
      filteredData, 
      setFilteredData,
      data, 
      setData,
      paginationContent, 
      setPaginationContent,
      callType, 
      setCallType,
      debounceQuery,
      setDebouncedQuery,
      currentPage,
      setCurrentPage,
      page,
      setPage,
      rowsPerPage, 
      setRowsPerPage
       }}>
      {props.children}
    </InputContext.Provider>
  );
};
export default InputState;
