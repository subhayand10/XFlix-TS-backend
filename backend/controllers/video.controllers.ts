import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import {catchAsync} from "../utils/catchAsync";
import * as videoService from "../services/video.service";
import { Request,Response } from "express";

interface query{
 title?: string;
 genres?: string;
 sortBy?: string;
 contentRating?: string;
}
const getVideos = catchAsync(async (req:Request,res:Response) => {
  try {
    const { title, genres, sortBy, contentRating }:query = req.query;

    const videos = await videoService.getSearchedVideos(
      title,
      genres,
      sortBy,
      contentRating
    );

    if (videos) {
      res.status(httpStatus.OK).send({ videos: videos });
    }
  } catch (err) {
    res
      .status(httpStatus.NOT_FOUND)
      .send({ statusCode: httpStatus.NOT_FOUND, message: "Videos not found" });
  }
});

const getVideoById = catchAsync(async (req:Request,res:Response) => {
  try {
    const { videoId } = req.params;
    const video = await videoService.searchVideoById(videoId);

    if (video) {
      res.status(httpStatus.OK).send(video);
    }
  } catch (err) {
    res.send({ statusCode: httpStatus.NOT_FOUND, message: "Video not found" });
  }
});

const postVideos = catchAsync(async (req:Request,res:Response) => {
  try {
    const newVideo = await videoService.postNewVideo(req.body);
    if (newVideo) {
      res.status(httpStatus.CREATED).send(newVideo);
    }
  } catch (err) {
    res.send({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Video not created",
    });
  }
});

const updateVotesCount = catchAsync(async (req:Request,res:Response) => {
  try {
    const videos = await videoService.modifyVoteCount(req);
    if (videos) {
      res.status(httpStatus.CREATED).send(videos);
    }
  } catch (err) {
    res.send({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Some parameter is missing or id is invalid",
    });
  }
});

const updateViewCount = catchAsync(async (req:Request,res:Response) => {
  try {
    const { videoId } = req.params;
    const videos = await videoService.modifyViewCount(videoId);
    if (videos) {
      res.status(httpStatus.CREATED).send(videos);
    }
  } catch (err) {
    res.send({
      statusCode: httpStatus.BAD_REQUEST,
      message: "video Id must be valid Id",
    });
  }
});

export {
  getVideos,
  getVideoById,
  postVideos,
  updateVotesCount,
  updateViewCount,
}
