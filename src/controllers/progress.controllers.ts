import { CustomRequest } from "../middlewares/verifyUser";
import { Response, NextFunction } from "express";
import Progress from "../models/progress_model";
import User from "../models/user_model";
import Tasks from "../models/tasks_model";

export const noteProgress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const { user_id, task_id, date, rating } = req.body;

  if (rating < 0 || rating > 10) {
    return next(new Error("Invalid Rating"));
  }

  if (userId !== user_id) {
    return next(new Error("Unauthorized"));
  }

  try {
    const validUser = await User.findById(userId);

    if (!validUser) {
      return next(new Error("User doesn't exist"));
    }

    const validTask = await Tasks.findById(task_id);

    if (!validTask) {
      return next(new Error("This task doesn't exist"));
    }

    const newProgress = new Progress({
      user_id: userId,
      task_id,
      date,
      rating,
    });

    const savedProgress = await newProgress.save();
    res.status(201).json(savedProgress);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const updateTaskRating = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body?.id;
  const { task_id, date, rating } = req.body;

  if (rating < 0 || rating > 10) {
    return next(new Error("Invalid Rating"));
  }

  if (!userId) {
    return next(new Error("Unauthorized"));
  }

  try {
    const validTask = await Tasks.findById(task_id);

    if (!validTask) {
      return next(new Error("This task doesn't exist"));
    }

    const updatedRating = await Progress.findOneAndUpdate(
      { task_id, date },
      {
        $set: {
          rating,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedRating);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const getProgressByTaskId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new Error("Unauthorized"));
  }
  const { task_id } = req.body;
  try {
    const progressListByTaskId = await Progress.find({
      task_id,
      user_id: userId,
    }).sort({ date: -1 });
    res.status(200).json(progressListByTaskId);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const getProgressByUserId = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new Error("Unauthorized"));
  }
  try {
    const progressListByUserId = await Progress.find({ user_id: userId });
    res.status(200).json(progressListByUserId);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};
