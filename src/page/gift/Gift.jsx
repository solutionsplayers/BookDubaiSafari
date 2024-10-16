import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { FiGift } from "react-icons/fi";
import GiftDetail from './GiftDetail';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Gift = () => {
    const location = useLocation(); // Get the location object

    // Access the state data passed from the previous page
    const { state } = location;
    const { ac_data } = state || {};
    // console.log(ac_data, 'gift')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []) // Ensure useEffect has dependencies array

    return (
        <>
            <Box sx={{ backgroundColor: "#ffc0b3", height: '25vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: "10px" }}>
                <FiGift style={{ color: '#DD404E', }} size={100} />
                <Typography sx={{ fontSize: "2rem", fontWeight: 700, color: "#DD404E" }}>Give a Book Dubai Safari gift card</Typography>
                <Typography sx={{ fontSize: "18px", fontWeight: 500, color: "#707070", textAlign: 'center', width: '70%' }}>Give the ones you love unforgettable travel experiences and make memories to last a lifetime bookdubaisafari on gift card</Typography>
            </Box>
            {/* Pass the data to the GiftDetail component */}
            <GiftDetail ac_data={ac_data} />
        </>
    )
}

export default Gift
