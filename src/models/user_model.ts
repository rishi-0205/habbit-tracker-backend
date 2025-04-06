import mongoose, { Document, Types, HydratedDocument } from "mongoose";
import Profile from "./profile_model";
import Tasks from "./tasks_model";

export interface IUser extends Document {
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

userSchema.pre(
  "deleteOne",
  { document: true, query: false } as any,
  async function (this: HydratedDocument<IUser>, next: (err?: Error) => void) {
    const userId = this._id;
    try {
      await Profile.deleteOne({ user_id: userId });

      const tasks = await Tasks.find({ user_id: userId });

      await Promise.all(tasks.map((task) => task.deleteOne()));
      next();
    } catch (err) {
      if (err instanceof Error) {
        next(err);
      } else {
        next(new Error("Unknown Error"));
      }
    }
  }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
