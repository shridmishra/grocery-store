import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({ success: false, msg: "No token. Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.userId = decoded.id;
    } else {
      res.json({ success: false, msg: "Not Authorized " });
    }

    next();
  } catch (error) {
    return res.json({ success: false, error: "Invalid or expired token" });
  }
};

export default authUser;
