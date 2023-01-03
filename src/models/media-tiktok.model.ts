import mongoose from "../providers/Database";

export interface IMediaTiktok {
  location: String;
  profilePic: any;
  username: String;
  desc: String;
  thumbnail: any;
  mediaUrl: String;
  url: String;
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
    desc: String,
    thumbnail: mongoose.SchemaTypes.Mixed,
    mediaUrl: String,
    url: String,
    expireAt: {
      type: Date,
      default: Date.now() + 60 * 1000, // expires in 7 days
    },
  },
  {
    timestamps: true,
  }
);

tiktokSchema.index({ createdAt: 1 });

export default mongoose.model<IMediaModel>("Media", tiktokSchema);
