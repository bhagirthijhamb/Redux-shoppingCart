import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

// custom action creator
export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://game-guides-8ea88.firebaseio.com/cart.json"
      );

      if (!response.ok) {
        throw new Error("Could not fetch cart data");
      }

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error :(",
          message: "Fetching cart data failed!",
        })
      );
    }
  };
};

// custom action creator
export const sendCartData = (cart) => {
  // that returns a function
  // that dispatches an action
  // this can be an async function
  return async (dispatch) => {
    // perform any asynchronous code/ side-effect before we dispatch an action
    // as we have not reached a reducer yet.

    // dispatch an action
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    // function for handling the request and handling the response
    const sendRequest = async () => {
      // Code for handling the request
      const response = await fetch(
        "https://game-guides-8ea88.firebaseio.com/cart.json",
        {
          method: "PUT", // diff to POST, the new data will not be added in a list of data but it will overwrite existing data
          // body: JSON.stringify(cart),
          body: JSON.stringify({
            totalQuantity: cart.totalQuantity,
            items: cart.items,
          }),
        }
      );

      // code for handling the response
      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };

    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success !!!",
          message: "Sent cart data successsfullly!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error :(",
          message: "Sending cart data failed!",
        })
      );
    }
  };
};
