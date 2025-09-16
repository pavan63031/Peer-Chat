import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT;

const app = express();


// app.use(cors({
//     origin : "http://localhost:5173",
//     credentials : true,
// }))

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://peer-chat-front.onrender.com"
  ],
  credentials: true
}));



app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/chat",chatRouter);


app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
})

