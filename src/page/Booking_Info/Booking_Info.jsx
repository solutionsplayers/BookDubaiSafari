import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Page from '../../components/page';
import BookingDetails from './BookingDetails';
import Cookies from 'js-cookie';

const Booking_Info = ({ activeStep }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const cookieData = Cookies.get('bookingDetails');
    if (cookieData) {
      setData(JSON.parse(cookieData));
    }
  }, [activeStep]);

  return (
    <Page title="Booking Information">
      <Grid container spacing={3} sx={{ padding: '2rem 5%' }}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ padding: '20px 0px',fontSize:'20px' }}>
            Thank you, Your Booking is Almost complete
          </Typography>
          <BookingDetails data={data} />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Booking_Info;
