import { Box } from '@mui/material'
import React from 'react'
import NoDataFound from '../assests/NoDataFound.png'
const BlankBox = () => {
  return (
    <>
    <Box display="flex" justifyContent="center" alignItems="center" height="64vh" sx={{ boxShadow:1, borderRadius:'1%'}}>
    <img 
          src={NoDataFound} 
          alt="No Data Found" 
          style={{ marginBottom: "20px", borderRadius: "8px", maxWidth: "10%", height: "auto" }} 
        /> 
    </Box>
    </>
  )
}
export default BlankBox
