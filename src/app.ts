import express from "express";


import adminRouter from "./routers/admin.router";
import authRouter from "./routers/auth.router";


import environment from "dotenv";
import cors from "cors";
import userRouter from "./routers/user.router";

environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "https://event-idham-gilang.vercel.app",
  })
);

// jalur utama dari api
app.use("/api/admin", adminRouter);

app.use("/api/user", userRouter);

app.use("/api/auth/", authRouter)


app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
