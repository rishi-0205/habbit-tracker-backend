import mongoose, { Document, Types } from "mongoose";

interface IProfile extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  avatar: number;
}

const profileSchema = new mongoose.Schema<IProfile>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: Number,
    required: false,
  },
});

const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
