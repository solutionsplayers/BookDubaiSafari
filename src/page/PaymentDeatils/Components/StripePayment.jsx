// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm";
// import Cookies from "js-cookie";

// const stripePromise = loadStripe("pk_live_51PFdCkFkBaY5Cia8oy73pwJhmyg3kC7f3jxwSRuvmJfcn5oLLJCvhJRwqQvZsqBVkMDLeCQltaKLFI3WUORI8CDS00KQV80uHQ");


// // const stripePromise = loadStripe("pk_test_51Nl5l2Fd4D0x5hm6bNeeGB3OgSp6LVDsHPSthOuzgiygFol7rB4uUG02e2x1DlTyz48BBGenNM6gd0DJWrozE0cj00b7xF7yx3");

// const StripePayment = ({ data, onNext, paymentData, activeStep, cartData }) => {
//     const [cookieData, setCookieData] = useState(null);
//     const [totalAmount, setTotalAmount] = useState(0);
//     const [sideData, setSideData] = useState(null);
//     const [totalValue, setTotalValue] = useState(0);

//     useEffect(() => {
//         const data = localStorage.getItem('bookingDetails');
//         if (data) {
//             setCookieData(JSON.parse(data));
//             setTotalAmount(JSON.parse(data)?.total_amount || 0);
//         }
//     }, []);

//     useEffect(() => {
//         const data = Cookies.get('information');
//         if (data) {
//             setSideData(JSON.parse(data));
//             setTotalValue(JSON.parse(data)?.total_amount || 0);
//         }
//     }, []);

//     return (
//         <Elements stripe={stripePromise} options={'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'}>



//             <CheckoutForm totalAmount={totalAmount} setTotalAmount={setTotalAmount} onNext={onNext} setTotalValue={setTotalValue} totalValue={totalValue} paymentData={paymentData} activeStep={activeStep} cartData={cartData} />
//         </Elements>
//     );
// };

// export default StripePayment;
