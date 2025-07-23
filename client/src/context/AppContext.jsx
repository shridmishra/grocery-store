/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
      console.error(error);
    }
  };

const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user/is-auth");
    if (data.success) {
      setUser(data.user);

      // Convert array to object
      const cartObj = {};
      data.user.cartItems.forEach((item) => {
        cartObj[item.productId] = item.quantity;
      });

      setCartItems(cartObj); // 🧠 Important
    } else {
      setUser(null);
    }
  } catch (error) {
    setUser(null);
    console.error(error);
  }
};

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart =  (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);
    }

    toast.success("Removed from cart");
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      totalCount += cartItems[items];
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemsInfo = products.find((product) => product._id === items);
      if (itemsInfo && cartItems[items] > 0) {
        totalAmount += itemsInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  useEffect(() => {
    fetchProducts();
    fetchSellerStatus();
    fetchUser();
  }, []);

useEffect(() => {
  const updateCart = async () => {
    try {
      const cartArray = Object.entries(cartItems).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

     

      const { data } = await axios.post("/api/cart/update", {
        userId: user._id,
        cartItems: cartArray,
      });

      if (!data.success) {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (user) {
    updateCart(); // ✅ Only runs when user & cartItems change
  }
}, [cartItems, user]);



  const value = {
    user,
    isSeller,
    setIsSeller,
    setUser,
    navigate,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    setSearchQuery,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
