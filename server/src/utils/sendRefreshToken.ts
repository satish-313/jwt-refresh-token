import { Response } from "express";
import { createRefreshToken } from "../auth";
import { User } from "../entity/User";

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie("gen", createRefreshToken(user), {
    // httpOnly: true,
    // secure: true,
    sameSite: "lax",
  });
};
