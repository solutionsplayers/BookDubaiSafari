import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import Page from "../../components/page";
import LeftSideComponents from "./Components/LeftSideComponents";
import RightSideComponents from "./Components/RightSideComponents";
import { getCart } from "../../store/actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import CartSkeleton from "./Components/CartSkeleton";

const CartMain = ({ nameProp }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const allCartRedux = useSelector((state) => state.cart.cart.payload);
  const allCartLocal = JSON.parse(localStorage.getItem("addCartData")) || [];
  const allCart = allCartRedux?.length > 0 ? allCartRedux : allCartLocal;
  const [totalPrice, setTotalPrice] = useState(0);
  const routes = useSelector((state) => state?.AllMenu?.menus?.payload)
  console.log(allCart, 'LKK')
  useEffect(() => {
    dispatch(getCart())
      .then(() => setLoading(false))
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    const total = allCart.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(total);
  }, [allCart]);

  const localCart = localStorage.getItem('addCartData')

  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return (
    <Page title={nameProp}>
      <Box sx={{ padding: "1rem 5%" }}>
        <Typography variant="h1" sx={{ fontSize: "1.5rem", fontWeight: "700", mt: 3 }}>
          Shopping Cart
        </Typography>

        {loading ? (

          <>
            <CartSkeleton />

          </>


        ) : allCart?.length === 0 || localCart === '[]' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <Box>
              <img src='/emptycart.png' alt="cart iage" width='100%' height={'300vh'} />
            </Box>



            <Typography sx={{ fontSize: '1.5rem', mb: 4, fontWeight: '700' }}>Your Cart is Empty</Typography>
            <Button variant="contained" sx={{ textTransform: 'none' }} onClick={() => navigate(routes[4]?.route)}>
              Explore More
            </Button>
          </Box>
        ) : localCart?.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <Box>
              <img src='/emptycart.png' alt="cart iage" width='100%' height={'300vh'} />
            </Box>



            <Typography sx={{ fontSize: '1.5rem', mb: 4, fontWeight: '700' }}>Your Cart is Empty</Typography>
            <Button variant="contained" sx={{ textTransform: 'none' }} onClick={() => navigate(routes[4]?.route)}>
              Explore More
            </Button>
          </Box>
        ) :


          (
            <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8} lg={8} sm={12}>
                <Box>
                  <LeftSideComponents allCart={allCart} setTotalPrice={setTotalPrice} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} lg={4} sm={12}>
                <Box

                >
                  <RightSideComponents allCart={allCart} totalPrice={totalPrice} />
                </Box>
              </Grid>
            </Grid>
          )}
      </Box>
    </Page>
  );
};

export default CartMain;
