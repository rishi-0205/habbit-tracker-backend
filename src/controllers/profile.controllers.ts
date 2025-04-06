import { Request, Response, NextFunction } from "express";
import Profile from "../models/profile_model";
import User from "../models/user_model";
import { CustomRequest } from "../middlewares/verifyUser";

export const profileCreation = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new Error("Unauthorized"));
  }
  const existingProfile = await Profile.findOne({ user_id });
  if (existingProfile) {
    return res.status(400).json({ message: "Profile already exists" });
  }
  const { name, avatar } = req.body;

  if (!name) return next(new Error("Name is required"));

  const validUser = await User.findOne({ _id: user_id });
  if (!validUser) {
    return next(new Error("Invalid User"));
  }
  const userprofile = new Profile({
    user_id,
    name,
    avatar,
  });
  try {
    await userprofile.save();
    res.status(201).json("Profile Created Successfully");
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const editUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new Error("Unauthorized"));
  }
  const { name, avatar } = req.body;

  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user_id },
      {
        $set: {
          name,
          avatar,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};

export const getUserProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return next(new Error("Unauthorized"));
  }
  const validUser = await User.findOne({ _id: user_id });
  if (!validUser) {
    return next(new Error("User doesn't exist"));
  }
  try {
    const userProfile = await Profile.findOne({ user_id }).populate(
      "user_id",
      "-password"
    );
    res.status(200).json(userProfile);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown Error"));
  }
};
