import mongoose, { Document, Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  username: string;
  name: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
