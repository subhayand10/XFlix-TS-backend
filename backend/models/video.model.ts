import mongoose from 'mongoose';
import { Document } from "mongoose";

interface VideoModel extends Document {
  videoLink: string;
  title: string;
  genre: string;
  contentRating: string;
  releaseDate: Date;
  previewImage: string;
  votes: {
    upVotes: number;
    downVotes: number;
  };
  viewCount: number;
}

const VideoSchema = new mongoose.Schema(
  {
    videoLink: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    contentRating: {
      type: String,
      required: true,
      trim: true,
    },
    releaseDate: {
      type: Date,
      default: Date.now(),
    },
    previewImage: {
      type: String,
      required: true,
      trim: true,
    },
    votes: {
      upVotes: {
        type: Number,
        default: 0,
      },
      downVotes: {
        type: Number,
        default: 0,
      },
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);

const Video = mongoose.model("Video", VideoSchema);
export {Video,VideoModel}
