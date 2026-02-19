import React, { useEffect, useContext } from "react";
import TapIcon from "@mui/icons-material/TouchApp";
import {
  Box,
  IconButton,
  Grid2 as Grid,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import { APIUSER } from "../../E2E/axios.util";
import BlankBox from "../BlankBox";
import InputContext from "../../Context/inputContext";

const AgentList = ({ getSentiment, handleNavigate, selectedStreamSid }) => {
  const ITEMS_PER_PAGE = 20;
  const userDetails = JSON.parse(localStorage.getItem("user"));


  // useContext
  const {
    setSentiment,
    sentiment,
    setData,
    page, 
    setPage,
    paginationContent,
    setPaginationContent,
    debounceQuery,
    currentPage,
    searchQuery,
    setFilteredData,
    rowsPerPage, 
    setRowsPerPage,
    callType,
    filteredData
  } = useContext(InputContext);
console.log("Paginaition is", paginationContent)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found. User may need to log in.");
          return;
        }
  
        if (!userDetails?.user_id) {
          console.error("User ID is missing.");
          return;
        }
  
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
  
        const agent_ip = `/fetch-all-details?agent_id=${userDetails?.user_id}`;
        const supervisor_ip = `/fetch-all-details?supervisor_id=${userDetails?.user_id}`;
        let final_ip = "";
  
        if (userDetails?.role === "Manager") {
          final_ip = supervisor_ip;
        } else if (userDetails?.role === "Agent") {
          final_ip = agent_ip;
        }
  
        if (!final_ip) {
          console.error("Invalid user role:", userDetails?.role);
          return;
        }
  
        // Append pagination parameters
        final_ip += `&page=${page + 1}&limit=${rowsPerPage}`;
  
        // Only append searchQuery if it’s a stream_sid (UUID-like pattern)
        if (searchQuery?.trim() && /^[0-9a-fA-F-]{36}$/.test(searchQuery)) {
          final_ip += `&search=${encodeURIComponent(searchQuery)}`;
        }
  
        // Append callType if provided
        if (callType) {
          final_ip += `&status=${encodeURIComponent(callType)}`;
        }
  
        const response = await APIUSER.get(final_ip, config);
  
        if (response?.data) {
          // Sort data by start_time (newest first)
          let sortedData = [...response.data?.data].sort(
            (a, b) => new Date(b.start_time) - new Date(a.start_time)
          );
  
          // Client-side filtering for non-stream_sid searchQuery
          if (searchQuery?.trim() && !/^[0-9a-fA-F-]{36}$/.test(searchQuery)) {
            const query = searchQuery.toLowerCase();
            sortedData = sortedData.filter((call) =>
              [
                call.agent_name,
                call.from,
                call.to,
                call.overall_sentiment,
                call.call_sid,
                call.direction,
                call.status,
              ].some((field) => field?.toLowerCase().includes(query))
            );
          }
  
          // Update state
          setData(sortedData);
          setFilteredData(sortedData);
          setPaginationContent(response.data.pagination);
  
          // Manage WebSocket connections for in-progress calls
          const inProgressCalls = sortedData.filter((el) => el.status === "in-progress");
          const sockets = [];
  
          inProgressCalls.forEach((call) => {
            const latestWebSocketUrl = call?.frontend_websocket_url;
            if (!latestWebSocketUrl) {
              console.warn(`No WebSocket URL for stream_sid: ${call.stream_sid}`);
              return;
            }
  
            const socket = new WebSocket(latestWebSocketUrl);
            sockets.push(socket);
  
            socket.onmessage = (event) => {
              try {
                const message = JSON.parse(event.data);
                const sid = message?.streamSid;
  
                if (message.event === "full_content" && Array.isArray(message.data.transcripts)) {
                  message.data.transcripts.forEach((transcriptItem) => {
                    if (transcriptItem.event === "api_response") {
                      const responseData = transcriptItem?.data;
                      const sentiment = responseData?.overall_sentiment;
                      setSentiment(sentiment);
                      setFilteredData((prevData) =>
                        prevData.map((row) =>
                          sid === row.stream_sid ? { ...row, overall_sentiment: sentiment } : row
                        )
                      );
                    }
                  });
                }
              } catch (err) {
                console.error("Error parsing WebSocket message:", err);
              }
            };
  
            socket.onerror = (error) => console.error("WebSocket Error:", error);
            socket.onclose = () => console.log(`WebSocket closed for ${call.stream_sid}`);
          });
  
          // Cleanup WebSocket connections
          return () => {
            sockets.forEach((socket) => {
              if (socket.readyState !== WebSocket.CLOSED) {
                socket.close();
              }
            });
          };
        } else {
          setData([]);
          setFilteredData([]);
          setPaginationContent(null);
        }
      } catch (error) {
        console.error("Failed to fetch data from API:", error);
        setData([]);
        setFilteredData([]);
        setPaginationContent(null);
      }
    };
  
    fetchData();
  }, [page, rowsPerPage, callType, debounceQuery]);

  // Final filtering based on callType
  const finalFilteredData = filteredData.filter((row) => {
    if (callType === "in-progress") {
      return row.status === "in-progress";
    } else if (callType === "completed") {
      // Show calls with status "completed", "no-answer", or "busy"
      return ["completed", "no-answer", "busy"].includes(row.status);
    }
    return true;
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  // Sort filteredData by end_time in descending order
  const sortedData = [...finalFilteredData].sort(
    (a, b) => new Date(b.start_time) - new Date(a.start_time)
  );

  // Slice the sorted data for pagination
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Grid sx={{ m: 2 }}>
        <Box sx={{ bgcolor: "white", mt: 2 }}>
          {currentItems && currentItems.length > 0 ? (
            <>
              {/* Header Row */}
              <Grid
                container
                justifyContent={"space-between"}
                sx={{ mb: 2, ml: 2, width: "90vw" }}
              >
                <Grid item xs={2} sx={{ ml: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Agent Name
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ ml: 6 }}>
                  <Typography variant="body2" color="textSecondary">
                    Call StreamSid
                  </Typography>
                </Grid>
                     <Grid item xs={2} sx={{ ml: 8 }}>
                  <Typography variant="body2" color="textSecondary">
                    Start Time
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ ml: 8 }}>
                  <Typography variant="body2" color="textSecondary">
                    Duration
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="textSecondary">
                    Sentiment
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="textSecondary">
                    View call
                  </Typography>
                </Grid>
                {/* <Grid item xs={1.6}>
                        <Typography variant="body2" color="textSecondary">
                          Call Analysis
                        </Typography>
                      </Grid> */}
              </Grid>

              {/* Data Rows */}
              {currentItems
                .sort((a, b) => new Date(b.start_time) - new Date(a.start_time)) // Sort by start_time descending
                .map((row) => {
                //   const isLatest =
                //     currentItems[0].stream_sid === row.stream_sid; // The first item after sorting will be the latest

                  // Border ribbon color
                  let borderColor = "orange"; // Default
                  if (sentiment) {
                    if (
                      [
                        "Angry",
                        "Abusive",
                        "Disappointed",
                        "Frustrated",
                        "Stressed",
                        "Negative",
                      ].includes(row.overall_sentiment)
                    ) {
                      borderColor = "red";
                    } else if (
                      ["Sad", "Worried", "Anxious", "Unhappy"].includes(
                        row.overall_sentiment
                      )
                    ) {
                      borderColor = "blue";
                    } else if (
                      [
                        "Neutral",
                        "Happy",
                        "Grateful",
                        "Interested",
                        "Positive",
                      ].includes(row.overall_sentiment)
                    ) {
                      borderColor = "green";
                    }
                  }

                  const isSelected = row.stream_sid === selectedStreamSid;

                  return (
                    <Paper
                      key={row.stream_sid} // ✅ Use a unique identifier instead of index
                      sx={{
                        mb: 1,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        borderLeft: `4px solid ${borderColor}`, // Apply border color
                        backgroundColor: isSelected ? "#e0f7fa" : "inherit",
                        transition: "background-color 0.3s", // Smooth transition
                      }}
                    >
                      <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ flexGrow: 1, ml: 0 }}
                      >
                        <Grid item xs={2}>
                          <Typography variant="body2">
                            {row.agent_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">
                            {row.stream_sid}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">
                            {row.start_time}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ml:6}}>
                          <Typography variant="body2">
                            {row.duration}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ml:4}}>
                          {row.overall_sentiment ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "center",
                              }}
                            >
                              <span>{getSentiment(row.overall_sentiment)}</span>
                              &nbsp;
                              <Typography variant="body2" >
                                {row.overall_sentiment}
                              </Typography>
                            </div>
                          ) : (
                            <Typography variant="body2">
                              No Sentiment Available
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            {row.status}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => handleNavigate(row)}
                            sx={{
                              bgcolor: "#d1ecff",
                              borderRadius: "50%",
                              ml: 4,
                            }}
                          >
                            <TapIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
            </>
          ) : (
            
            // Show BlankBox if no data is available
            <BlankBox />
          )}
        </Box>
        <TablePagination
          component="div"
          count={paginationContent ? paginationContent.total_count : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </>
  );
};

export default AgentList;














