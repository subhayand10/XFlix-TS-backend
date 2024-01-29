import express from "express";
import { getVideos,getVideoById,postVideos,updateVotesCount,updateViewCount } from "../controllers/video.controllers";

const router = express.Router();

router.get("/", getVideos);
router.get("/:videoId", getVideoById);
router.post("/", postVideos);
router.patch("/:videoId/votes", updateVotesCount);
router.patch("/:videoId/views", updateViewCount);

export default router;
