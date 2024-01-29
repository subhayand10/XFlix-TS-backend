import express from 'express';
import "dotenv/config";
import videoRoutes from "./routes/video.routes";
import mongoose from 'mongoose';


const app = express();
app.use(express.json());
app.use("/v1/videos", videoRoutes);


app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);


  mongoose
    .connect("mongodb://127.0.0.1:27017/XFlix")
    .then(() => {
      console.log("Connected to DB at " + "mongodb://127.0.0.1:27017/XFlix");
    })
    .catch(() => {
      console.log("Error connecting to DB");
    });
});