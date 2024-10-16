import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import BookingHeader from "./components/BookingHeader";
import Details from "./components/Details";
import { Navigate, useLocation, useNavigate } from "react-router";

const BookingDetails = ({ data }) => {
  const { state } = useLocation()
  // console.log(data, 'fdfdfd')
  const navigate = useNavigate()
  const detail = state === 'cart'
    ;

  const handleCancel = () => {
    localStorage.removeItem('bookingDetails');
    navigate('/')

  }
  return (
    <Box sx={{ height: "70%", background: "#f6f7f9", py: 5, px: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6} sx={{ px: 2 }}>
          <BookingHeader
            title="Booking Information"
            sub=""
          />
          <Divider sx={{ mt: 2 }} />
          <Details title="First Name" value={data?.first_name} />
          <Details title="Last Name" value={data?.last_name} />
          <BookingHeader
            sx={{ mt: 3 }}
            title="Payments"
            sub={data?.note}
          />
          <Divider sx={{ mt: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h5">
              Total
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold" sx={{ fontSize: '1.5rem' }}>
              AED {data?.total_amount}
            </Typography>
          </Box>
          {/* <Divider sx={{ mt: 2 }} /> */}

        </Grid>
        <Grid item xs={12} lg={6} sx={{ borderLeft: "1px solid #e2e2e2" }}>
          <BookingHeader
            title="Booking Summary"
          // sub="Lorem Ipsum Dolor Sit amet"
          />
          <Divider sx={{ mt: 2 }} />
          <Typography
            variant="h1"
            sx={{ fontSize: "1.1rem", fontWeight: "600", mt: 3 }}
          >
            Summary
          </Typography>
          <Details title="Email" value={data?.email} />
          <Details title="Nationality" value={data?.nationality} />
          <Details title="Date" value={data?.date} />

          <Details title="Phone" value={data?.phone} />
          {!state.path === 'cart' && (
            <>
              <Details title="Adult" value={data?.adult} />
              <Details title="Child" value={data?.child} />
            </>
          )}
          <Details title="Fee Included" value="24 Feb, 2024" />
        </Grid>
        <Box
          sx={{ margin: "3rem 1rem", display: "flex", marginTop: '10px', justifiyContent: 'Right' }}
        >
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{
              padding: "0.7rem 3rem",
              backgroundColor: "grey",
              color: "white",
              textTransform: "none",
              fontSize: "0.8rem",
              ":hover": {
                backgroundColor: "grey",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => navigate('/invoice-detail', { state })}
            variant="contained"
            sx={{
              marginLeft: "1rem",
              padding: "0.7rem 1.5rem",
              textTransform: "none",
              fontSize: "0.8rem",
            }}
          >
            Print Voucher
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default BookingDetails;
