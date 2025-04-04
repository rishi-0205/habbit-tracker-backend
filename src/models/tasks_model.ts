import mongoose, { Document, Types } from "mongoose";

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

const Tasks = mongoose.model<ITasks>("Tasks", tasksSchema);

export default Tasks;
