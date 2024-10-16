import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, } from "@stripe/react-stripe-js";
import { Button, Box, Typography, useTheme, TextField, Grid } from "@mui/material";
import { StripePay } from "../../../store/actions/categoriesActions";
import { Link, useLocation } from "react-router-dom";
import { Booking } from '../../../store/actions/categoriesActions';
import Cookies from 'js-cookie';
import { Apply_Voucher } from "../../../store/actions/bookingAction";
import PriceCard from "../../Component/PriceCard";
import { useSnackbar } from "notistack";
import Loader from "../../../components/Loader/Loader";
import TermsModal from './TermsModal'
import { deleteCart } from "../../../store/actions/cartActions";

const CheckoutForm = ({ onNext, data, totalAmount, setTotalAmount, paymentData, cartData }) => {

    const token = useSelector((state) => state?.auth?.token);
    const { state } = useLocation()
    console.log(state, 'this')
    const theme = useTheme();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [discountError, setDiscountError] = useState(null);
    const [bookingNum, setBookingNum] = useState(null);

    const [isFieldEnabled, setIsFieldEnabled] = useState(false);
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    // const handleProceedToPayment = async (paymentStatus) => {
    //     // debugger
    //     const bookingDetails = JSON.parse(Cookies.get('bookingDetails'));
    //     const bookingArray = Object.values(bookingDetails);
    //     const bookingKeys = Object.keys(bookingDetails);

    //     console.log(bookingDetails, 'bbc');

    //     if (state === '/cart') {
    //         bookingDetails.package_details = cartData;
    //     }

    //     bookingDetails.payment = paymentStatus;

    //     try {
    //         const res = await dispatch(Booking(bookingDetails, token));
    //         console.log('Booking API response:', res);
    //         enqueueSnackbar('Booking successful!', { variant: 'success' });
    //         onNext();
    //     } catch (error) {
    //         console.error('Error in booking:', error);
    //         enqueueSnackbar('Booking Failed!', { variant: 'error' });

    //         setPaymentError("Error in booking. Please try again later.");
    //     }
    // };


    // --------------------delete----------

    const ids = Cookies.get('id') ? JSON.parse(Cookies.get('id')) : [];

    const handleDelete = async (ids) => {

        if (token) {
            try {
                for (const id of ids) {
                    const res = await dispatch(deleteCart(id));

                }
            } catch (err) {
                console.error(err);

            }
        } else {
            Cookies.remove('id');
            const currentData = localStorage.getItem('addCartData');

            if (currentData) {
                // Step 2: Modify the data to be empty (assuming 'addCartData' contains an array)
                const emptyData = [];
                localStorage.setItem('addCartData', JSON.stringify(emptyData));
                console.log('Array emptied in localStorage');
            }
        }
        // enqueueSnackbar("Cart data cleared from cookies", { variant: "info" });
    };


    // const handledelete = ()=>{
    //     localStorage.removeItem('addCartData');

    // }

    const handledelete = () => {
        // Step 1: Retrieve current data from localStorage
        const currentData = localStorage.getItem('addCartData');

        if (currentData) {
            // Step 2: Modify the data to be empty (assuming 'addCartData' contains an array)
            const emptyData = [];

            // Step 3: Save the modified empty data back to localStorage
            localStorage.setItem('addCartData', JSON.stringify(emptyData));

            console.log('Array emptied in localStorage');
        } else {
            console.log('No data found in localStorage to empty');
        }
    };

    // ------------------------------------

    const booking = async () => {
        const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
        console.log(bookingDetails, 'ddd');

        if (state.path === 'cart') {
            bookingDetails.package_details = cartData;
        }

        bookingDetails.payment = 'success';

        try {
            const res = await dispatch(Booking(bookingDetails, token));
            const bookingNumber = res?.data?.payload?.reference_id;
            setBookingNum(bookingNumber);
            localStorage.setItem('bookingNumber', bookingNumber); // Store bookingNumber in local storage
            enqueueSnackbar('Booking successful!', { variant: 'success' });
            localStorage.removeItem('addCartData');
            handleDelete(ids);
            onNext();
        } catch (error) {
            console.error('Error in booking:', error);
            enqueueSnackbar('Booking Failed!', { variant: 'error' });
            setPaymentError("Error in booking. Please try again later.");
        }
    };




    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        if (totalAmount - discount < 2) {
            enqueueSnackbar('Price cannot be less than 2 AED', { variant: 'error' });
            return;
        }

        setLoading(true);
        try {
            const { clientSecret } = await dispatch(StripePay({ price: totalAmount - discount }));

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {},
                },
            });

            if (result.error) {
                setPaymentError(result.error.message);

                enqueueSnackbar(result.error.message, { variant: 'error' });
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    setPaymentSuccess(true);
                    enqueueSnackbar('Payment successful!', { variant: 'success' });

                    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));

                    console.log(bookingDetails, 'boking detailsssssss')

                    const bookingArray = Object.values(bookingDetails);
                    const bookingKeys = Object.keys(bookingDetails);


                    if (state.path === 'cart') {
                        bookingDetails.package_details = cartData;
                    }

                    bookingDetails.payment = 'success';
                    try {
                        const res = await dispatch(Booking(bookingDetails, token));
                        const bookingNumber = res?.data?.payload?.reference_id;
                        setBookingNum(bookingNumber);
                        localStorage.setItem('bookingNumber', bookingNumber); // Store bookingNumber in local storage
                        enqueueSnackbar('Booking successful!', { variant: 'success' });
                        localStorage.removeItem('addCartData');
                        handleDelete(ids);
                        onNext();
                    } catch (error) {
                        console.error('Error in booking:', error);
                        enqueueSnackbar('Booking Failed!', { variant: 'error' });
                        setPaymentError("Error in booking. Please try again later.");
                    }
                } else {
                    const errorMessage = "Payment failed. Please try again.";
                    setPaymentError(errorMessage);

                    enqueueSnackbar(errorMessage, { variant: 'error' });
                }
            }
        } catch (error) {
            console.error("Error in Stripe payment:", error);
            const errorMessage = "Error processing payment. Please try again later.";
            setPaymentError(errorMessage);

            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                backgroundColor: '#F6F7F9',
                padding: '12px',
                fontSize: '16px',
                width: "100%",
                color: '#424770',
                border: '1px solid black',
                borderRadius: '4px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    const fieldContainerStyle = {
        marginBottom: "20px",
        padding: "4px",
    };


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item lg={8}>
                    <div style={{ border: "1px solid #f0f0f0", padding: '30px', borderRadius: '5px' }}>
                        {!paymentSuccess ? (
                            <form onSubmit={handleSubmit}>
                                <Box>
                                    <Typography variant="h1" sx={{ fontSize: "1rem", fontWeight: "600", marginBottom: "5px" }}>
                                        Payment Details
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.9rem", color: "grey", marginBottom: "20px" }}>
                                        Please enter your payment details
                                    </Typography>
                                </Box>
                                <div style={fieldContainerStyle}>
                                    <label style={{ display: "block", marginBottom: "10px", fontSize: '0.9rem' }}>Card Number</label>
                                    <div style={{ padding: "12px", backgroundColor: '#F6F7F9', borderRadius: '6px' }}>
                                        <CardNumberElement options={cardStyle} />
                                    </div>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ ...fieldContainerStyle, width: "calc(65% - 10px)" }}>
                                        <label style={{ display: "block", marginBottom: "10px", fontSize: '0.9rem' }}>Expiration Date</label>
                                        <div style={{ padding: "12px", backgroundColor: '#F6F7F9', borderRadius: '6px' }}>
                                            <CardExpiryElement options={cardStyle} />
                                        </div>
                                    </div>
                                    <div style={{ ...fieldContainerStyle, width: "calc(50% - 10px)" }}>
                                        <label style={{ display: "block", marginBottom: "10px", fontSize: '0.9rem' }}>CVC</label>
                                        <div style={{ padding: "12px", backgroundColor: '#F6F7F9', borderRadius: '6px' }}>
                                            <CardCvcElement options={cardStyle} />
                                        </div>
                                    </div>


                                </Box>

                                {paymentError && <Typography color="error" sx={{ marginBottom: "20px" }}>{paymentError}</Typography>}
                                {discountError && <Typography color="error" sx={{ marginBottom: "20px" }}>{discountError}</Typography>}

                                {/* <Box gap={1} display={"flex"} sx={{ marginTop: "0.6rem", alignItems: "center" }}>
                                    <input
                                        type="checkbox"
                                        required
                                        style={{ fontSize: "0.9rem", transform: "scale(1.8)" }}
                                    />
                                    <Typography sx={{ fontSize: "0.9rem", marginLeft: "1rem" }}>
                                        By proceeding further you accept{" "}
                                        <Link to="/privacy-policy" style={{ fontSize: '0.9rem', color: theme.palette.primary.main, textDecoration: "none" }}>
                                            Privacy Policy
                                        </Link>{" "}
                                        policy{" "}
                                    </Typography>
                                </Box> */}

                                <Box gap={1} display={"flex"} sx={{ marginTop: "0.5rem", alignItems: "center" }}>
                                    <input
                                        type="checkbox"
                                        required
                                        style={{ fontSize: "1rem", transform: "scale(1.8)", color: "red" }}
                                    />
                                    <Typography sx={{ fontSize: "0.9rem", marginLeft: "1rem" }}>
                                        By proceeding further you accept all our{" "}
                                        <Link onClick={handleModalOpen} style={{ fontSize: '0.9rem', color: theme.palette.primary.main, textDecoration: "none" }}>
                                            Terms and Conditions
                                        </Link>{" "}
                                    </Typography>
                                </Box>

                                <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="h6">
                                        Total Amount: AED {(totalAmount).toFixed(2)}
                                    </Typography>
                                    {loading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            <Button sx={{ padding: '8px 30px' }} type="submit" variant="contained" disabled={!stripe}>
                                                Pay Now
                                            </Button>

                                        </>
                                    )}
                                </Box>
                                {/* <Button sx={{ padding: '8px 30px' }} variant="contained" onClick={booking}>
                                    Booking
                                </Button> */}
                            </form>
                        ) : (
                            loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>

                                    <Loader />
                                </Box>
                            ) : (
                                <Typography color="success" variant="h5" sx={{ textAlign: "center", marginTop: "20px" }}>SomeThing Went Wrong</Typography>
                            )
                        )}
                    </div>
                </Grid>
                <Grid item lg={4}>
                    <PriceCard data1={paymentData} total={totalAmount} setTotalAmount={setTotalAmount} paymentData={paymentData} cartData={cartData} />
                </Grid>
            </Grid>

            <TermsModal isOpen={isModalOpen} onClose={handleModalClose} />

        </>
    );
};

export default CheckoutForm;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import { Button, Box, Typography, useTheme, TextField, Grid } from "@mui/material";
// import { Booking } from '../../../store/actions/categoriesActions';
// import Cookies from 'js-cookie';
// import PriceCard from "../../Component/PriceCard";
// import { useSnackbar } from "notistack";
// import Loader from "../../../components/Loader/Loader";
// import TermsModal from './TermsModal'
// import { deleteCart } from "../../../store/actions/cartActions";
// import { useLocation } from "react-router";
// import { Link } from "react-router-dom";


// const CheckoutForm = ({ onNext, data, totalAmount, setTotalAmount, paymentData, cartData }) => {
//     const token = useSelector((state) => state?.auth?.token);
//     const { state } = useLocation();
//     const theme = useTheme();
//     const stripe = useStripe();
//     const elements = useElements();
//     const dispatch = useDispatch();
//     const [paymentError, setPaymentError] = useState(null);
//     const [paymentSuccess, setPaymentSuccess] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const { enqueueSnackbar } = useSnackbar();

//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleModalOpen = () => {
//         setIsModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setIsModalOpen(false);
//     };

//     useEffect(() => {
//         window.scroll(0, 0);
//     }, []);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (!stripe || !elements) {
//             return;
//         }
//         setLoading(true);
//         try {
//             const result = await stripe.confirmPayment({
//                 elements,
//                 confirmParams: {
//                     return_url: window.location.origin,
//                 },
//             });

//             if (result.error) {
//                 setPaymentError(result.error.message);
//                 enqueueSnackbar(result.error.message, { variant: 'error' });
//             } else {
//                 if (result.paymentIntent.status === 'succeeded') {
//                     setPaymentSuccess(true);
//                     enqueueSnackbar('Payment successful!', { variant: 'success' });

//                     const bookingDetails = JSON.parse(Cookies.get('bookingDetails'));
//                     const bookingArray = Object.values(bookingDetails);
//                     const bookingKeys = Object.keys(bookingDetails);

//                     if (state === '/cart') {
//                         bookingDetails.package_details = cartData;
//                     }

//                     bookingDetails.payment = 'success';
//                     try {
//                         const res = await dispatch(Booking(bookingDetails, token));

//                         enqueueSnackbar('Booking successful!', { variant: 'success' });
//                         handleDelete(ids);

//                         onNext();
//                     } catch (error) {
//                         console.error('Error in booking:', error);
//                         enqueueSnackbar('Booking Failed!', { variant: 'error' });
//                         setPaymentError("Error in booking. Please try again later.");
//                     }
//                 } else {
//                     const errorMessage = "Payment failed. Please try again.";
//                     setPaymentError(errorMessage);
//                     enqueueSnackbar(errorMessage, { variant: 'error' });
//                 }
//             }
//         } catch (error) {
//             console.error("Error in Stripe payment:", error);
//             const errorMessage = "Error processing payment. Please try again later.";
//             setPaymentError(errorMessage);
//             enqueueSnackbar(errorMessage, { variant: 'error' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Grid container spacing={3}>
//                 <Grid item lg={8}>
//                     <div style={{ border: "1px solid #f0f0f0", padding: '30px', borderRadius: '5px' }}>
//                         {!paymentSuccess ? (
//                             <form onSubmit={handleSubmit}>
//                                 <Box>
//                                     <Typography variant="h1" sx={{ fontSize: "1rem", fontWeight: "600", marginBottom: "5px" }}>
//                                         Payment Details
//                                     </Typography>
//                                     <Typography sx={{ fontSize: "0.9rem", color: "grey", marginBottom: "20px" }}>
//                                         Please enter your payment details
//                                     </Typography>
//                                 </Box>
//                                 <PaymentElement />
//                                 {paymentError && <Typography color="error" sx={{ marginBottom: "20px" }}>{paymentError}</Typography>}
//                                 <Box gap={1} display={"flex"} sx={{ marginTop: "0.5rem", alignItems: "center" }}>
//                                     <input
//                                         type="checkbox"
//                                         required
//                                         style={{ fontSize: "1rem", transform: "scale(1.8)", color: "red" }}
//                                     />
//                                     <Typography sx={{ fontSize: "0.9rem", marginLeft: "1rem" }}>
//                                         By proceeding further you accept all our{" "}
//                                         <Link onClick={handleModalOpen} style={{ fontSize: '0.9rem', color: theme.palette.primary.main, textDecoration: "none" }}>
//                                             Terms and Conditions
//                                         </Link>{" "}
//                                     </Typography>
//                                 </Box>
//                                 <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                     <Typography variant="h6">
//                                         Total Amount: AED {(totalAmount).toFixed(2)}
//                                     </Typography>
//                                     {loading ? (
//                                         <Loader />
//                                     ) : (
//                                         <Button sx={{ padding: '8px 30px' }} type="submit" variant="contained" disabled={!stripe}>
//                                             Pay Now
//                                         </Button>
//                                     )}
//                                 </Box>
//                             </form>
//                         ) : (
//                             loading ? (
//                                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>
//                                     <Loader />
//                                 </Box>
//                             ) : (
//                                 <Typography color="success" variant="h5" sx={{ textAlign: "center", marginTop: "20px" }}>Something Went Wrong</Typography>
//                             )
//                         )}
//                     </div>
//                 </Grid>
//                 <Grid item lg={4}>
//                     <PriceCard data1={paymentData} total={totalAmount} setTotalAmount={setTotalAmount} paymentData={paymentData} cartData={cartData} />
//                 </Grid>
//             </Grid>
//             <TermsModal isOpen={isModalOpen} onClose={handleModalClose} />
//         </>
//     );
// };

// export default CheckoutForm;
