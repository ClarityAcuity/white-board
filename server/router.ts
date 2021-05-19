import express, { Request, Response } from "express";

export const router = express.Router();

router.get("/hello", async (req: Request, res: Response) => {
  res.send("Hello World");
});
