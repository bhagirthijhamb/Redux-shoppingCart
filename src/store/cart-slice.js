import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    // totalAmount: 0,
    changed: false,
  },
  reducers: {
    // to replace or front-end cart with the cart we are laoding from firebase.
    // replaceCart expects a paylaod that has totalQuantity and items field which is exactly the structure we are receiving from firebase.
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const exisitingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      state.changed = true;
      if (!exisitingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        exisitingItem.quantity++;
        exisitingItem.totalPrice = exisitingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

// // custom action creator
// export const sendCartData = (cart) => {
//   // that returns a function
//   // that dispatches an action
//   // this can be an async function
//   return async (dispatch) => {
//     // perform any asynchronous code/ side-effect before we dispatch an action
//     // as we have not reached a reducer yet.

//     // dispatch an action
//     dispatch(
//       uiActions.showNotification({
//         status: "pending",
//         title: "Sending...",
//         message: "Sending cart data!",
//       })
//     );

//     // function for handling the request and handling the response
//     const sendRequest = async () => {
//       // Code for handling the request
//       const response = await fetch(
//         "https://game-guides-8ea88.firebaseio.com/cart.json",
//         {
//           method: "PUT", // diff to POST, the new data will not be added in a list of data but it will overwrite existing data
//           body: JSON.stringify(cart),
//         }
//       );

//       // code for handling the response
//       if (!response.ok) {
//         throw new Error("Sending cart data failed.");
//       }
//     };

//     try {
//       await sendRequest();
//       dispatch(
//         uiActions.showNotification({
//           status: "success",
//           title: "Success !!!",
//           message: "Sent cart data successsfullly!",
//         })
//       );
//     } catch (error) {
//       dispatch(
//         uiActions.showNotification({
//           status: "error",
//           title: "Error :(",
//           message: "Sending cart data failed!",
//         })
//       );
//     }

//     dispatch(
//       uiActions.showNotification({
//         status: "success",
//         title: "Success !!!",
//         message: "Sent cart data successsfullly!",
//       })
//     );
//   };
// };

export const cartActions = cartSlice.actions;

export default cartSlice;
