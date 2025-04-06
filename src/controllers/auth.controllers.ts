import { Request, Response, NextFunction } from "express";
import User from "../models/user_model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, username, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json("Signup Successful");
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown error"));
  }
};

export const signinUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return res.status(404).json({ message: "User does not exists" });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(new Error("Incorrect Credentials"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET!
    );

    const { password: _, ...rest } = validUser.toObject();

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown error"));
  }
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    return next(error instanceof Error ? error : new Error("Unknown error"));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  try {
    const validUser = await User.findOne({ username, email });
    if (!validUser) {
      return next(new Error("User Doesn't Exist"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(new Error("Incorrect credentials"));
    }
    await validUser.deleteOne();
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error instanceof Error ? error : new Error("Unknown error"));
  }
};
