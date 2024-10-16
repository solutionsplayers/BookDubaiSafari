import {
  Box, Button, Divider, FormControl, FormControlLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ReCaptcha from '../../components/Recaptcha/ReCaptcha';
import Cookies from 'js-cookie';
import Page from '../../components/page'

const GiftDetail = ({ ac_data }) => {

  const [selectedValue, setSelectedValue] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [readMore, setReadMore] = useState(false);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleBuyNow = () => {
    const dataObject = {
      discount_price: discountPrice,
      description: description,
      recipient_email: recipientEmail,
    };

    if (selectedValue === 'yes') {
      dataObject.activity_id = ac_data.id;
    }

    const dataString = JSON.stringify(dataObject);
    Cookies.set('gift_data', dataString);
    navigate('/gift-pay');
  };

  const textFieldStyle = {
    marginTop: '1rem',
    '& .MuiInputBase-root': {
      border: 'none',
      '&:hover': {
        borderColor: 'transparent',
      },
      '&.Mui-focused': {
        boxShadow: 'none',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      display: 'none',
    },
    borderRadius: '5px',
    backgroundColor: '#f6f7f9',
  };

  const base = 'https://admin.bookdubaisafari.com/';
  const descriptionPreview = ac_data?.description?.split(' ').slice(0, 30).join(' ');
  const handleDiscountClick = (value) => {
    setDiscountPrice(value);
  }
  return (
    <Page title='Gift Card | Book Dubai Safari'>
      <Box>
        <Box sx={{
          padding: { xs: '3px', md: '70px', lg: '2rem 30%' },
        }}>


          <Box sx={{ mt: 0 }}>


            <Grid container spacing={3} mt={1} sx={{ alignItems: 'center' }}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: '700' }}>Choose a value for gift card</Typography>
                  <br />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant='outlined' onClick={() => handleDiscountClick('50')}>AED 50</Button>
                    <Button variant='outlined' onClick={() => handleDiscountClick('100')}>AED 100</Button>
                    <Button variant='outlined' onClick={() => handleDiscountClick('150')}>AED 150</Button>
                    <Button variant='outlined' onClick={() => handleDiscountClick('200')}>AED 200</Button>
                    <Button variant='outlined' onClick={() => handleDiscountClick('250')}>AED 250</Button>
                  </Box>
                  <br />
                  <Divider />
                  <br />
                  <label style={{ fontWeight: '700', fontSize: '1rem' }}>Enter Discount</label>
                  <TextField
                    placeholder="Discount"
                    sx={textFieldStyle}
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: '700', fontSize: '1rem' }}>Recipient Email:</label>
                  <TextField
                    placeholder="Recipient Email"
                    sx={textFieldStyle}
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: '700', fontSize: '1rem' }}>Personal Message</label>
                  <TextField
                    placeholder="Write Your Personal Message"
                    sx={textFieldStyle}
                    multiline
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Box>
              </Grid>
            </Grid>


            <Box sx={{ padding: '2rem 0%' }}>
              <Box sx={{
                borderRadius: '15px',
                border: ' 1px solid #E1E1E1',
                padding: '15px'
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'column' },
                    alignItems: 'start',
                    gap: { xs: '20px', md: '30px' },
                  }}
                >
                  <Box

                    sx={{
                      width: { xs: '100%', md: '100%' },
                    }}
                  >
                    <img
                      src={base + ac_data?.image_url}
                      alt=""
                      style={{
                        width: '100%',
                        height: { xs: '20vh', md: '20vh', lg: '20vh' },
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Box
                    flex={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: { xs: 2, md: 4 },
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '18px', md: '20px' }, fontWeight: 700 }}>
                      {ac_data?.name}
                    </Typography>
                    {/* <Typography
                sx={{
                  fontSize: { xs: '14px', md: '16px' },
                  fontWeight: 500,
                  color: '#A9A9A9',
                  wordBreak: 'break-all',
                }}
              >
                {ac_data?.description}
              </Typography> */}

                    <Typography

                      sx={{
                        fontSize: { xs: '14px', md: '16px' },
                        fontWeight: 500,

                        // wordBreak: 'break-all',
                        color: '#A9A9A9',
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        lineHeight: "1.5rem",
                      }}
                    >
                      {isExpanded ? ac_data?.description : (
                        <>
                          {ac_data?.description.slice(0, 320)}
                          {ac_data?.description.length > 320 && (
                            <Button
                              onClick={toggleDescription}
                              sx={{
                                marginLeft: '0.5rem',
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                color: '#A9A9A9',
                              }}
                            >
                              Read More
                            </Button>
                          )}
                        </>
                      )}
                      {isExpanded && (
                        <Button
                          onClick={toggleDescription}
                          sx={{
                            marginTop: '0.5rem', // Adjust spacing as needed
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            color: '#A9A9A9',
                          }}
                        >
                          Show Less
                        </Button>
                      )}
                    </Typography>

                  </Box>
                </Box>




              </Box>


            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <Typography variant="h1" sx={{ fontSize: '1.2rem', fontWeight: '600' }}>
                Suggest this activity on this gift certificate.
              </Typography>

              <FormControl>
                <RadioGroup
                  aria-labelledby="suggest-activity-label"
                  name="radio-buttons-group"
                  row
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

            </Box>

            {/*
          <Box mt={3}>
            <ReCaptcha />
          </Box> */}



            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }} gap={3}>
              <Button
                onClick={() => navigate('/preview-card', { state: { discountPrice, recipientEmail, description, acData: ac_data } })}
                variant="contained"
                sx={{
                  padding: '0.8rem 2rem',
                  backgroundColor: 'grey',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  width: '80%',
                  borderRadius: '25px',
                  ':hover': {
                    backgroundColor: 'grey',
                  },
                }}
                disabled={!discountPrice || !recipientEmail}
              >
                Preview Card
              </Button>

              <Button
                onClick={handleBuyNow}
                variant="contained"
                sx={{
                  marginLeft: '2rem',
                  padding: '0.8rem 3rem',
                  textTransform: 'none',
                  width: '80%',
                  borderRadius: '25px',
                  fontSize: '1rem',
                }}
                disabled={!discountPrice || !recipientEmail}

              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </Box>
      </Box >
    </Page>
  );
};

export default GiftDetail;
