import jwt from "jsonwebtoken";

//Seller Login : api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true, // prevent js to access cookie
        secure: process.env.NODE_ENV === "production", // use secure cookie in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, msg: "Logged In" });
    } else {
      return res.json({ success: false, msg: "INVALID CREDENTIALS" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};

// Seller isAuth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// SellerLogout : /api/seller/logout

export const SellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, msg: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
