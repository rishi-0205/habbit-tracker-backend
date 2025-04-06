import { Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/verifyUser";
import Tasks from "../models/tasks_model";
import User from "../models/user_model";

export const createTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new Error("Unauthorized"));
  }
  const { taskname, task_hue, repeatition_pattern } = req.body;
  const validUser = await User.findOne({ _id: user_id });
  if (!validUser) {
    return next(new Error("User Doesn't exist"));
  }
  const newTask = new Tasks({
    user_id,
    taskname,
    task_hue,
    repeatition_pattern,
  });
  try {
    const addedTask = await newTask.save();
    res.status(201).json(addedTask);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const editTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { _id, taskname, task_hue, repeatition_pattern } = req.body;

  if (!userId) {
    return next(new Error("Unauthorized"));
  }

  try {
    const updatedTask = await Tasks.findOneAndUpdate(
      { _id, user_id: userId },
      {
        $set: {
          taskname,
          task_hue,
          repeatition_pattern,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return next(new Error("Task not found or you are not authorized"));
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const getTasksByUserId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new Error("unauthorized"));
  }
  try {
    const tasksList = await Tasks.find({ user_id: userId });
    res.status(200).json(tasksList);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown error"));
  }
};

export const deleteTaskByTaskId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { task_id } = req.body;
  const { id } = req.params;

  if (!userId) {
    return next(new Error("Unauthorized"));
  }
  try {
    await Tasks.deleteOne({ _id: id, user_id: userId });
    res.status(200).json("Deletion Successful");
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};
