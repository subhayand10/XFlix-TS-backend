import { Video } from "../models/video.model";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { Request } from "express-serve-static-core";
import { VideoModel } from "../models/video.model";

export const getSearchedVideos = async (
  title: string | undefined,
  genres: string | undefined,
  sortBy: string | undefined,
  contentRating: string | undefined
) => {
  try {
    let genreList = ["All"];
    const contentRatingLists = ["Anyone", "7+", "12+", "16+", "18+"];
    const AllGenreLists = [
      "Education",
      "Sports",
      "Movies",
      "Comedy",
      "Lifestyle",
      "All",
    ];

    // if no parameters are passed, then return all videos
    if (!title && !genres && !sortBy && !contentRating) {
      const videos = await Video.find({});
      console.log(videos.length)
      return videos;
    }

    //if only title is passed
    if (title && !genres && !sortBy && !contentRating) {
      const videos = await Video.find({
        title: {
          $regex: new RegExp(title, "i"),
        },
      });
      return videos;
    }

    //if genre is also passed
    if (genres) {
      genreList = genres.toString().split(",");

      const ifGenreNotInList = genreList.some((item) =>
        AllGenreLists.includes(item)
      );

      // if none of the genre item matches
      if (!ifGenreNotInList) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `genre must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]`
        );
      }

      // if all parameters are passed except sortBy
      if (title && contentRating && genres) {
        const allVideos = await Video.find({
          $and: [
            {
              title: {
                $regex: new RegExp(title, "i"),
              },
            },
            {
              genre: {
                $in: genreList,
              },
            },
            {
              contentRating: contentRating,
            },
          ],
        });

        return allVideos;
      }

      // if title and genres are passed or only if genre is passsed(filters in both cases)
      const allVideos = await Video.find({
        $and: [
          {
            title: title ? { $regex: new RegExp(title, "i") } : undefined,
          },
          {
            genre: {
              $in: genreList,
            },
          },
        ],
      });

      return allVideos;
    }

    // if sortedBy is passed
    if (sortBy) {
      const videos = await Video.find({});
      if (sortBy === "viewCount") {
        const sortedVideos = [...videos].sort(
          (a, b) => b.viewCount - a.viewCount
        );
        return sortedVideos;
      } else if (sortBy === "releaseDate") {
        const sortedVideos = [...videos].sort(
          (a, b) => b.releaseDate.getTime() - a.releaseDate.getTime()
        );
        return sortedVideos;
      } else {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "sort By must be one of [viewCount, releaseDate]"
        );
      }
    }

    // if only contentRating is passed
    if (contentRating && !title && !sortBy && !genres) {
      let indexOfContentRating = contentRatingLists.indexOf(contentRating);

      if (indexOfContentRating < 0) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "contentRating must be one of [Anyone, 7+, 12+, 16+, 18+, All]"
        );
      }

      const videos = await Video.find({ contentRating: contentRating });

      return videos;
    }
  } catch (err) {
    throw err;
  }
};

export const searchVideoById = async (id:string) => {
  try {
    const video = await Video.findById(id);
    if (video) {
      return video;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }
  } catch (err) {
    throw err;
  }
};

export const postNewVideo = async (body:any) => {
  try {
    if (body.length > 1) {
      const video = await Video.insertMany(body);
      return video;
    } else {
      const {
        videoLink,
        title,
        genre,
        contentRating,
        releaseDate,
        previewImage,
      } = body;

      if (
        videoLink &&
        title &&
        genre &&
        contentRating &&
        releaseDate &&
        previewImage
      ) {
        const newVideo = await Video.create(body);
        await newVideo.save();
        return newVideo;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "a body parameter is missing"
        );
      }
    }
  } catch (err) {
    throw err;
  }
};

export const modifyVoteCount = async (req:Request) => {
  try {
    const { vote, change } = req.body;
    const { videoId } = req.params;

    const video:VideoModel | null = await Video.findById(videoId);
     if (!video) {
       // Handle the case where video is not found (null)
       throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
     }

    if (vote === "upVote" && change === "increase") {
      video.votes.upVotes += 1;
    } else if (vote === "upVote" && change === "decrease") {
      if (video.votes.upVotes > 0) {
        video.votes.upVotes -= 1;
      } else {
        video.votes.upVotes = 0;
      }
    } else if (vote === "downVote" && change === "increase") {
      video.votes.downVotes += 1;
    } else if (vote === "downVote" && change === "decrease") {
      if (video.votes.downVotes > 0) {
        video.votes.downVotes -= 1;
      } else {
        video.votes.downVotes = 0;
      }
    }

    await video.save();
    return video;
  } catch (err) {
    throw err;
  }
};

export const modifyViewCount = async (id:string) => {
  try {
    const video:VideoModel | null = await Video.findById(id);
    if (!video) {
      // Handle the case where video is not found (null)
      throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }

    video.viewCount += 1;
    await video.save();

    return video;
  } catch (err) {
    throw err;
  }
};