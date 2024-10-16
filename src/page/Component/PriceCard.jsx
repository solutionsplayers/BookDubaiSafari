import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { CalendarViewMonthOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Apply_Voucher } from "../../store/actions/bookingAction";
import { useLocation } from "react-router";
import { MdOutlineDateRange } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { useSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PriceCard = ({ data1, activeStep, total, setTotalAmount, cartData }) => {
  console.log(total, 'kkkkkkkkkkk')
  const { enqueueSnackbar } = useSnackbar();

  const [voucherCode, setVoucherCode] = useState("");
  const [discountError, setDiscountError] = useState(null);
  const [isFieldEnabled, setIsFieldEnabled] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const stateData = location.state;
  const [loading, setLoading] = useState(false);
  const pathnameCookie = Cookies.get("pathname");
  const totalBooking = JSON.parse(localStorage.getItem("bookingDetails") || "{}");
  console.log(state, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
  const auth = useSelector((state) => state?.auth?.isAuthenticated);
  const handleVoucherApply = async () => {
    setLoading(true);
    try {
      const res = await dispatch(Apply_Voucher(voucherCode));
      if (res.data.success) {
        setLoading(false);
        const price = parseFloat(res.data.payload.price);
        const discountAmount = Math.abs(price);
        setDiscountError(null);
        setIsFieldEnabled(true);

        //         const checkdate = bookingDetails.total_amount < discountAmount;
        // console.log('voucher can be apply due to less packgr price',checkdate)

        enqueueSnackbar("Voucher Applied Successfully", { variant: "success" });
        const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
        const information = JSON.parse(Cookies.get("information"));

        const updatedTotalAmount = bookingDetails.total_amount - discountAmount;
        bookingDetails.total_amount = updatedTotalAmount;
        information.total_amount = updatedTotalAmount;

        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
        Cookies.set("information", JSON.stringify(information));

        setTotalAmount(updatedTotalAmount);
      } else {
        setLoading(false);
        setDiscountError(res.data.message);
        enqueueSnackbar(res.data.message, { variant: "error" });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error applying voucher:", error);
      const errorMessage = error.response?.data?.message;
      // || "Error applying voucher. Please try again later.";
      setDiscountError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };



  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  console.log(cartData, 'allllllllllllll ayyyyyyyyyyyyy')

  return (
    <Box
      sx={{
        padding: "1.2rem 5%",
        border: "1px solid #f0f0f0",
        borderRadius: "10px",
        background: "#fff",
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem" }}
      >
        Summary
      </Typography>
      <Divider />

      <Box sx={{ marginTop: "1.2rem" }}>
        {state?.path === "cart" ? (
          <>
            {cartData?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0rem",
                  // border: "1px solid #f0f0f0",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "90%",
                }}
              >

                <Accordion
                  sx={{
                    minWidth: '100%',

                  }}
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}bh-content`}
                    id={`panel${index}bh-header`}
                    minWidth='100%'
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', minWidth: '100%' }}>
                      {/* {item?.package?.activity?.name} */}

                      {item?.package?.activity?.name || item?.ac_data?.name}

                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "13px",
                        width: "90%",
                      }}
                    >
                      {/* <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                    {item?.package?.activity?.name}
                  </Typography> */}
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: theme.palette.primary.textPrimary,
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "4.5rem",
                          lineHeight: "1.5rem",
                        }}
                      >
                        {/* {item?.package?.title || item?.ac_data?.name} */}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontWeight: 600,
                        }}
                      >
                        <MdOutlineDateRange size={22} /> &nbsp;
                        {item.tour_date ? item.tour_date : item.date}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Typography>Adult :</Typography>

                        <Typography>

                          {item.adult ? item.adult : item.adult}

                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Typography>Infant :</Typography>

                        <Typography>

                          {item.infant ? item.infant : item.infant}

                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        <Typography>Child :</Typography>

                        <Typography>

                          {item.child ? item.child : item.child}

                        </Typography>
                      </Box>

                      <div>
                        {auth && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography>
                                <IoPerson /> &nbsp;1 * Adult
                              </Typography>

                              <Typography>




                                AED
                                {item?.package?.category === "sharing"
                                  ? item?.package?.adult_price
                                  : item?.package?.price}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </div>

                      {/* <Typography><IoPerson /> &nbsp;1 * Adult</Typography>
                    <Typography>AED

                    {item?.package?.category === 'sharing' ? item?.package?.adult_price : item?.package?.price}


                    </Typography> */}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>Sub Total</Typography>
                        <Typography> AED {item.price}</Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>



            ))}
            <Box
              sx={{ display: "flex", alignItems: "center", margin: "20px 0px" }}
            >
              {activeStep !== 0 && (
                <TextField
                  label="Voucher Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderRadius: "10px",
                    backgroundColor: "whitesmoke",
                    "&:hover": { backgroundColor: "white" },
                  }}
                  InputProps={{
                    endAdornment: loading ? (
                      <Loader />
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleVoucherApply}
                        sx={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          padding: "10px 50px",
                          height: "100%",
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px",
                        }}
                      >
                        Apply
                      </Button>
                    ),
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Total Amount:</Typography>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main, fontWeight: "700" }}
              >
                AED {totalBooking.total_amount?.toFixed(2)}
              </Typography>
            </Box>
          </>
        ) : (
          // If pathnameCookie doesn't exist, show full card as it is
          <>
            <Box
              sx={{
                padding: "3rem 5%",
                border: "1px solid #f0f0f0",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              {/* <Typography
                variant="h1"
                sx={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "1rem" }}
              >
                Summary
              </Typography> */}
              {/* <Divider /> */}

              <Box sx={{ marginTop: "0rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon style={{ color: "#000" }} />
                    <Typography
                      sx={{ color: "#000", fontWeight: "bold", mt: 0.5, ml: 1 }}
                    >
                      Adult
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: "600" }}>
                    {data1?.adult}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon style={{ color: "#000" }} />
                    <Typography
                      sx={{ color: "#000", fontWeight: "bold", mt: 0.5, ml: 1 }}
                    >
                      Child
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: "600" }}>
                    {data1?.child}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon style={{ color: "#000" }} />
                    <Typography
                      sx={{ color: "#000", fontWeight: "bold", mt: 0.5, ml: 1 }}
                    >
                      Infant
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: "600" }}>
                    {data1?.infant}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarViewMonthOutlined style={{ color: "#000" }} />
                    <Typography
                      sx={{ color: "#000", fontWeight: "bold", mt: 0.5, ml: 1 }}
                    >
                      Date
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: "600" }}>
                    {data1?.date}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px 0px",
                  }}
                >
                  {activeStep !== 0 && (
                    <TextField
                      label="Voucher Code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        borderRadius: "10px",
                        backgroundColor: "whitesmoke",
                        "&:hover": { backgroundColor: "white" },
                      }}
                      InputProps={{
                        endAdornment: (
                          <Button
                            variant="contained"
                            onClick={handleVoucherApply}
                            sx={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              padding: "10px 50px",
                              height: "100%",
                            }}
                          >
                            Apply
                          </Button>
                        ),
                        sx: {
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px",
                        },
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "600",
                      fontSize: "1.5rem",
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "2rem",
                      color: theme.palette.primary.main,
                    }}
                  >
                    AED {activeStep === 0 ? data1?.total_amount : total}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PriceCard;
