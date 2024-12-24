// user.models.js
import mongoose from "mongoose";
import { List } from "./tasks.models.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
