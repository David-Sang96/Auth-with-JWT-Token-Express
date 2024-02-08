import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import { checkAuth } from "./auth";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const users: { email: string; password: string }[] = [];

app.get("/", checkAuth, (req: Request, res: Response) => {
  res.sendFile(__dirname + "/home.html");
});
app.get("/data", checkAuth, (req: Request, res: Response) => {
  res.sendFile(__dirname + "/data/data.json");
});

app.post("/register", (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password)
    return res.status(400).send("Email and Password are required");
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = { email, password: hash };
  users.push(newUser);
  fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
  res.redirect("/login.html");
});

app.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email and Password are required");
  const exitedUser = users.find((user) => user.email === email);
  if (!exitedUser) return res.status(401).send("Not valid Email");
  console.log(exitedUser.password);
  const validPassword = bcrypt.compareSync(password, exitedUser.password);
  if (!validPassword) return res.status(401).send("Not valid Password");
  const token = jwt.sign({ email }, "CY216K2ZShla7cAUBH07", {
    expiresIn: "1h",
  });
  res.cookie("token", token);
  res.redirect("/");
});

app.post("/logOut", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("login.html");
});

app.listen(port, () => {
  console.log("server is listening");
});
