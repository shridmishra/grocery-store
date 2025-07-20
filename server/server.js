import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;
await connectDB();


//Middleware Config
const allowedOrigin = ["http://localhost:5173"];
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use('/api/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
