import mongoose from "../providers/Database";

export interface IMediaTiktok {
  profilePic: any;
  url: String;
  thumbnail: any;
  username: String;
  audioUrl: any;
  description: String;
  video_nw: any;
  video_w: any;
  dimensions: any;
  play_count: any;
  location: String;
}

export interface IMediaModel extends IMediaTiktok, mongoose.Document {}

export const tiktokSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    profilePic: mongoose.SchemaTypes.Mixed,
    username: String,
    description: String,
    thumbnail: mongoose.SchemaTypes.Mixed,
    audioUrl: mongoose.SchemaTypes.Mixed,
    video_nw: mongoose.SchemaTypes.Mixed,
    video_w: mongoose.SchemaTypes.Mixed,
    dimensions: mongoose.SchemaTypes.Mixed,
    plaa_count: mongoose.SchemaTypes.Mixed,
    url: String,
    expireAt: {
      type: Date,
      default: Date.now() + 60 * 1000 * 24 * 7, // expires in 7 days
    },
  },
  {
    timestamps: true,
  }
);

tiktokSchema.index({ createdAt: 1 });

export default mongoose.model<IMediaModel>("Media", tiktokSchema);
