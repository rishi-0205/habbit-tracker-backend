import mongoose, { Document, Types } from "mongoose";

interface IProgress extends Document {
  _id: Types.ObjectId;
  task_id: Types.ObjectId;
  date: Date;
  rating: number;
}

const progressSchema = new mongoose.Schema<IProgress>({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tasks",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

const Tasks = mongoose.model<IProgress>("Progress", progressSchema);

export default Tasks;
