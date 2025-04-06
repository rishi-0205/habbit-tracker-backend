import mongoose, { Document, Types, HydratedDocument } from "mongoose";
import Progress from "./progress_model";

interface ITasks extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  taskname: string;
  task_hue: string;
  repeatition_pattern: string;
}

const tasksSchema = new mongoose.Schema<ITasks>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  taskname: {
    type: String,
    required: true,
  },
  task_hue: {
    type: String,
    required: true,
  },
  repeatition_pattern: {
    type: String,
    required: true,
  },
});

tasksSchema.pre(
  "deleteOne",
  { document: true, query: false } as any,
  async function (this: HydratedDocument<ITasks>, next: (err?: Error) => void) {
    const taskid = this._id;
    try {
      await Progress.deleteMany({ task_id: taskid });
      next();
    } catch (err) {
      if (err instanceof Error) {
        next(err);
      } else {
        next(new Error("Unknown error"));
      }
    }
  }
);

const Tasks = mongoose.model<ITasks>("Tasks", tasksSchema);

export default Tasks;
