import express, { Express, Request, Response } from "express";
import * as http from "http";
import next, { NextApiHandler } from "next";
import * as socketIo from "socket.io";
import { board } from "./board";
import { router } from "./router";

const port: number = parseInt(process.env.PORT || "3000", 10);
const dev: boolean = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);
  const io: socketIo.Server = new socketIo.Server();

  io.attach(server);

  io.on("connection", (socket) => board(socket, io));

  app.use(router);

  router.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
