import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { uiActions } from "./store/ui-slice";
// import { sendCartData } from "./store/cart-slice";
import { fetchCartData, sendCartData } from "./store/cart-actions";
import Notification from "./components/UI/Notification";

// to make sure we do not sent a cart replace (PUT) request when the component mounts
let isInitial = true;

function App() {
  // set up local stte in this component isLoading, error state
  // and we set those states as part of our http request cycle
  // and we use those states to cinditionaly rendoer the notification componet with the appropriate content
  // but we have ui-slice so we can have this state in there
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // fetch("https://game-guides-8ea88.firebaseio.com/cart.json", {
  //   //   method: "PUT", // diff to POST, the new data will not be added in a list of data but it will overwrite existing data
  //   //   body: JSON.stringify(cart),
  //   // });

  //   const sendCartData = async () => {
  //     dispatch(
  //       uiActions.showNotification({
  //         status: "pending",
  //         title: "Sending...",
  //         message: "Sending cart data!",
  //       })
  //     );
  //     // Code for handling the request
  //     const response = await fetch(
  //       "https://game-guides-8ea88.firebaseio.com/cart.json",
  //       {
  //         method: "PUT", // diff to POST, the new data will not be added in a list of data but it will overwrite existing data
  //         body: JSON.stringify(cart),
  //       }
  //     );

  //     // code for handling the response
  //     if (!response.ok) {
  //       throw new Error("Sending cart data failed.");
  //     }
  //     dispatch(
  //       uiActions.showNotification({
  //         status: "success",
  //         title: "Success !!!",
  //         message: "Sent cart data successsfullly!",
  //       })
  //     );
  //   };

  //   if (isInitial) {
  //     isInitial = false;
  //     return;
  //   }

  //   sendCartData().catch((error) => {
  //     dispatch(
  //       uiActions.showNotification({
  //         status: "error",
  //         title: "Error :(",
  //         message: "Sending cart data failed!",
  //       })
  //     );
  //   });
  // }, [cart, dispatch]);

  // Fetching cart data
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // sending cart data
  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    // we can use a function that returns another function as action as well
    // so we have sendCartData() a a action that is dispatched by desptch()

    // addItemTOcart and removeItemFromCart are only executed from our local aplication
    // So, for these two action creators  state.changed changes to true
    // So, when we fetchdata from firebase, when we execute replace cart, state.changed will stay false
    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {/* <Cart /> */}
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
