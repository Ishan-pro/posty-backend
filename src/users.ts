import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const app: Router = new (Router as any)();

app.get("", async (req: Request, res: Response) => {
  const Allusers = await prisma.user.findMany();
  console.log(req.user?.username);
  res.send(Allusers);
});

interface userdto {
  name: string;
  username: string;
  email: string;
  password: string;
}

app.post("", async (req: Request, res: Response) => {
  const expiration = 60 * 60 * 24 * 7 * 1000 + Date.now();
  const userdata: userdto = req.body;
  try {
    const accesstoken: string = jwt.sign(
      {
        username: userdata.username,
        email: userdata.email,
      },
      process.env.SECRET,
      {
        expiresIn: expiration,
      }
    );
    const refreshtoken: string = jwt.sign(
      {
        username: userdata.username,
        email: userdata.email,
      },
      process.env.SECRET
    );
    const user = await prisma.user.create({
      data: { refreshtoken, accesstoken, ...userdata },
      select:{
        username:true,
        email:true,
        refreshtoken:true,
        accesstoken:true
      }
    });
    res.send(user);
  } catch (err) {
    console.log(err)
    res.status(400).send("Invalid Credentials")
  }
  
});

app.post("/login/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user && user.password === password) {
      const { username } = user;

      const expiration = 60 * 60 * 24 * 7 * 1000 + Date.now();

      const accesstoken = jwt.sign({ username, email }, process.env.SECRET, {
        expiresIn: expiration,
      });
      const refreshtoken = jwt.sign({ username, email }, process.env.SECRET);
      await prisma.user.update({
        where: { username },
        data: { accesstoken, refreshtoken },
      });
      res.send({
        accesstoken,
        refreshtoken
      });
    } else {
      res.status(404).send("Credentials don't match");
    }
  } else {
    res.send("Bad Request")
  }
}
);

export function authcheck(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  
  if (authToken) {
    try {
      const { username, id } = jwt.verify(authToken, process.env.SECRET);
      req.user = {username};
    } catch (err) {
      console.log(err);
    }
  }
  next();
}

export default app;
