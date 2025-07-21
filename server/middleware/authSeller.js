import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  if(!sellerToken) {
    return res.status(200).json({success:false,msg:"Not authorized"})       
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

   
    if (decoded.email === process.env.SELLER_EMAIL) {
      req.userId = decoded.id;
      next();
    } else {
      res.json({ success: false, msg: "Not authorized" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }
};

export default authSeller;  