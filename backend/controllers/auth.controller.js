import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userAlreadyExist = await User.findOne({ email });

  if (userAlreadyExist) {
    return res.status(400).json({ message: "Email Already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  await user.save();

  res.status(200).json({
    success: true,
    message: "user created successfully",
    user: { ...user._doc, password: null },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: { ...user._doc, password: null },
  });
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getUser = async (req, res) => {
  // const { email } = req.body;
  const user = await User.find();

  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found-Create an account to get started" });
  }

  res.status(200).json([{ ...user[0]._doc, password: null }]);
};
