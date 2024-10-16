import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';
import { Booking } from '../../../store/actions/categoriesActions';
import PriceCard from "../../Component/PriceCard";

const Component1 = ({ data, onNext, data1, activeStep, cartData }) => {
  console.log(data, 'hh')
  const theme = useTheme();
  const [payNow, setPayNow] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { state } = useLocation();

  const userData = useSelector((state) => state?.auth?.user);


  const [formValues, setFormValues] = useState({
    title: "Mr",
    first_name: "",
    last_name: "",
    email: "",
    nationality: "",
    phone: "",
    pickup_location: "",
    note: "",
    ...userData
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue || "");
      });
  }, []);

  const handleChangeCountry = (event) => {
    setSelectedCountry(event.target.value);
    setFormValues({ ...formValues, nationality: event.target.value });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formValues.first_name) newErrors.first_name = "First Name is required";
    if (!formValues.last_name) newErrors.last_name = "Last Name is required";
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formValues.phone) newErrors.phone = "Phone Number is required";
    if (!formValues.nationality) newErrors.nationality = "Nationality is required";
    if (!formValues.pickup_location) newErrors.pickup_location = "Pick up Location is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dete, setDete] = useState(null)
  console.log(dete, 'date')
  useEffect(() => {
    // window.scrollTo(0, 0);
    const data = localStorage.getItem('bookingDetails');
    if (data) {
      setDete(JSON.parse(data));
    }
  }, []);


  const handleProceedToPayment = () => {
    if (!validate()) return;

    let bookingDetails;

    if (state?.path === 'cart') {
      const { date, adult, child, infant, total_amount, id, package_details, activity_name } = cartData;
      bookingDetails = {
        ...formValues,
        activity_name: dete?.activity_name,
        date: dete?.date,
        total_amount: dete?.total_amount,
        status: "pending",
        payment: 'fail',
        package_details: cartData,
      };
    } else {
      bookingDetails = {
        ...formValues,
        activity_name: data?.name,
        date: data?.date,
        total_amount: data?.total_amount,
        status: "pending",
        payment: 'fail',
        package_details: [data?.package],
      };
    }

    console.log('bookingDetails:', bookingDetails);

    // Use localStorage to store bookingDetails if the data is too large for cookies
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    onNext();
  };



  const textFieldStyle = {
    marginTop: "1rem",
    "& .MuiInputBase-root": {
      border: "none",
      "&:hover": {
        borderColor: "transparent",
      },
      "&.Mui-focused": {
        boxShadow: "none",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      display: "none",
    },
    borderRadius: "5px",
    backgroundColor: "#f6f7f9",
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={8}>
          <Box
            sx={{
              border: "1px solid #f0f0f0",
              padding: "1.5rem 5%",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{ fontSize: "1rem", fontWeight: "600", display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                Lead Passenger Details
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "grey" }}>
                Please Enter Your Passenger Details
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: "0rem" }}>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label>Title</label>
                  <FormControl fullWidth>
                    <Select
                      value={formValues.title}
                      name="title"
                      sx={textFieldStyle}
                      onChange={handleChange}
                    >
                      <MenuItem value="Mr">Mr.</MenuItem>
                      <MenuItem value="Miss">Miss</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>First Name</label>
                  <TextField
                    placeholder="First Name"
                    sx={textFieldStyle}
                    name="first_name"
                    value={formValues.first_name}
                    onChange={handleChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                  />
                </Box>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Last Name</label>
                  <TextField
                    placeholder="Last Name"
                    sx={textFieldStyle}
                    name="last_name"
                    value={formValues.last_name}
                    onChange={handleChange}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                  />
                </Box>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Email Address</label>
                  <TextField
                    placeholder="Email"
                    sx={textFieldStyle}
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Box>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Nationality</label>

                  <FormControl fullWidth>
                    <Select
                      placeholder="Select Country"
                      labelId="country-select-label"
                      id="country-select"
                      value={selectedCountry}
                      onChange={handleChangeCountry}
                      label="Country"
                      sx={textFieldStyle}
                      error={!!errors.nationality}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.value} value={country.value}>
                          <img
                            src={country.flag}
                            alt=""
                            style={{ width: "20px", marginRight: "10px" }}
                          />
                          {country.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.nationality && (
                      <Typography variant="caption" color="error">
                        {errors.nationality}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Phone Number</label>
                  <TextField
                    placeholder="Phone Number"
                    sx={textFieldStyle}
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Special Request</label>
                  <TextField
                    placeholder="Special Request"
                    sx={textFieldStyle}
                    name="note"
                    value={formValues.note}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              border: "1px solid #f0f0f0",
              padding: "1.3rem 5%",
              borderRadius: "10px",
              marginTop: "2rem",
              background: "#fff",
            }}
          >
            <Box>
              <Typography
                variant="h1"
                sx={{ fontSize: "1.2rem", fontWeight: "600", display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <BiSolidMessageSquareDetail size={28} style={{ color: theme.palette.primary.main }} />
                Extra Details
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "grey" }}>
                Please Enter your Extra Details
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ marginTop: "0rem" }}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Pick up Location</label>
                  <TextField
                    placeholder="Enter your Address"
                    sx={textFieldStyle}
                    name="pickup_location"
                    value={formValues.pickup_location}
                    onChange={handleChange}
                    error={!!errors.pickup_location}
                    helperText={errors.pickup_location}
                  />
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "1rem" }}>Note</label>
                  <TextField
                    placeholder="Write your special request here"
                    sx={textFieldStyle}
                    name="note"
                    value={formValues.note}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "end" },
              alignItems: "end",
              mt: 2,
            }}
          >
            <Button
              onClick={handleProceedToPayment}


              variant="contained"
              sx={{
                textTransform: "none",
                padding: { xs: "10px 20px", md: "10px 40px" },
                width: { xs: "100%", md: "auto" },
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
            >
              Proceed to payment
            </Button>




          </Box>
        </Grid>
        <Grid item lg={4}>
          <PriceCard data1={data1} activeStep={activeStep} cartData={cartData} />
        </Grid>
      </Grid>
    </>
  );
};

export default Component1;
