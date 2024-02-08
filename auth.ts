import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).redirect("/login.html");
  jwt.verify(token, "CY216K2ZShla7cAUBH07", (err) => {
    if (err) return res.status(401).send("Unauthorized");
    next();
  });
};
