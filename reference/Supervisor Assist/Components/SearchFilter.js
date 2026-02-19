import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import InputContext from "../../Context/inputContext";

const ITEMS_PER_PAGE = 10;

const SearchFilter = () => {
  const {
    callType,
    setCallType,
    searchQuery,
    setSearchQuery,
    setPaginationContent,
    data,
    setFilteredData,
    setCurrentPage,
    setDebouncedQuery,
  } = useContext(InputContext);

  // Debounce function
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
  }

  const debounceQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setDebouncedQuery(debounceQuery);
  }, [debounceQuery, setDebouncedQuery]);

  // Fetch data from API with authentication
  const fetchDataFromApi = async (query) => {
    try {
      const agentId = 133; // Hardcoded; adjust dynamically if needed
      const page = 1;
      const limit = ITEMS_PER_PAGE;
      const token = localStorage.getItem("token"); // Assuming token is stored here
      const url = `https://agent-assist.inteliconvo.ai/api/live/fetch-all-details?agent_id=${agentId}&page=${page}&limit=${limit}&search=${query}`;

      if (!token) {
        console.warn("No token found in localStorage");
        throw new Error("Authentication token missing");
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Explicitly include token
        },
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);

      if (response.status === 200 && response.data) {
        return response.data; // Adjust based on actual response structure
      } else {
        throw new Error("No valid data returned");
      }
    } catch (error) {
      console.error("API Fetch Error:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
      return null; // Return null on error (e.g., 401, 404)
    }
  };

  // Search function with API and fallback
  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    let filtered = [];

    // Fetch from API if query looks like a stream_sid
    if (query && query.match(/^[a-z0-9-]{36}$/)) {
      const apiData = await fetchDataFromApi(query);
      if (apiData) {
        filtered = Array.isArray(apiData) ? apiData : apiData.data || [];
        console.log("API Filtered Data:", filtered);
      } else {
        console.log("Falling back to client-side filtering due to API failure");
      }
    }

    // Fallback to client-side filtering if API fails or query isn’t a stream_sid
    if (!filtered.length) {
      filtered = data.filter((row) => {
        return (
          (row.agent_name && row.agent_name.toLowerCase().includes(query)) ||
          (row.id && row.id.toLowerCase().includes(query)) ||
          (row.time && row.time.toLowerCase().includes(query)) ||
          (row.status && row.status.toLowerCase().includes(query)) ||
          (row.start_time && row.start_time.toLowerCase().includes(query)) ||
          (row.stream_sid && row.stream_sid.toLowerCase().includes(query)) ||
          (
            (row.overall_sentiment && row.overall_sentiment) ||
            "No Sentiment Available"
          )
            .toLowerCase()
            .includes(query) ||
          (row.duration && String(row.duration).toLowerCase().includes(query))
        );
      });
      console.log("Client-side Filtered Data:", filtered);
    }

    // Apply callType filter
    filtered = filtered.filter(
      (row) =>
        !callType || (row.status && row.status.toLowerCase() === callType.toLowerCase())
    );

    // Update state
    setFilteredData(filtered);
    setCurrentPage(1);

    const startIndex = 0;
    const endIndex = Math.min(ITEMS_PER_PAGE, filtered.length);
    const paginatedItems = filtered.slice(startIndex, endIndex);
    setPaginationContent({
      items: paginatedItems,
      total_count: filtered.length,
    });
  };

  return (
    <>
      <Box
        sx={{
          m: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
        }}
      >
        {/* Toggle Buttons Section */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant={callType === "in-progress" ? "contained" : "outlined"}
            color="primary"
            onClick={() => {
              setCallType("in-progress");
              handleSearch({ target: { value: searchQuery } });
            }}
          >
            In Progress Calls
          </Button>
          <Button
            variant={callType === "completed" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => {
              setCallType("completed");
              handleSearch({ target: { value: searchQuery } });
            }}
          >
            Completed Calls
          </Button>
          {callType && (
            <IconButton
              onClick={() => {
                setCallType(null);
                handleSearch({ target: { value: searchQuery } });
              }}
            >
              <CloseIcon sx={{ width: 12, height: 12 }} />
            </IconButton>
          )}
        </Box>

        {/* Search and Dropdown Section */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
        </Box>
      </Box>
    </>
  );
};

export default SearchFilter;