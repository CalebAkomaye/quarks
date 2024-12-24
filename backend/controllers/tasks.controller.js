import { List, Task } from "../models/tasks.models.js";
import { User } from "../models/user.models.js";

export const getLists = async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res
      .status(401)
      .json({ message: "please login or create an account" });
  }

  const isAuthorized = await User.findById({ _id: user });

  if (!isAuthorized) {
    return res.status(401).json({ message: "please login" });
  }

  const taskLists = await List.find({ user: user });
  if (!taskLists) {
    return res.status(400).json({ message: "Create a New List" });
  }

  res.status(200).json({ success: true, message: "success", taskLists });
};

export const createList = async (req, res) => {
  const { title, user } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title field is required" });
  }

  const isAuthorized = await User.findById({ _id: user });
  if (!isAuthorized) {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized User" });
  }

  const alreadyExist = await List.findOne({ title });
  if (alreadyExist) {
    return res.status(400).json({
      success: false,
      message: `Category with the name "${title}" already exist`,
    });
  }

  const newList = new List({
    title,
    user,
  });
  await newList.save();

  res.status(200).json({ success: true, message: "success", newList });
};

export const updatedList = async (req, res) => {
  const { title } = req.body;
  const id = req.params.id;
  const isExisting = await List.findOne({ _id: id });
  if (!isExisting) {
    return res
      .status(400)
      .json({ success: false, message: "Operation not permitted" });
  }

  const resp = await List.findByIdAndUpdate(id, { title: title, new: true });
  const taskLists = await List.find();

  res
    .status(200)
    .json({ success: true, message: "update successful", taskLists });
};

export const deleteList = async (req, res) => {
  const id = req.params.id;
  const { user } = req.body;
  const isExisting = await List.findOne({ _id: id });
  if (!isExisting) {
    return res
      .status(400)
      .json({ success: false, message: "Operation not permitted" });
  }

  const del = await List.findOneAndDelete({ _id: id, user: user });
  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    deleted: del,
  });
};

export const getTask = async (req, res) => {
  const { id } = req.body;

  const isAuthorized = await User.findById({ _id: id });
  if (!isAuthorized) {
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized User" });
  }

  const tasks = await Task.find();
  res.status(200).json(tasks);

  res.status(400).json({ success: false, message: error.message });
};

export const createTask = async (req, res) => {
  try {
    const listId = req.params.id;
    const { title, userName } = req.body;

    // Validate input
    if (!title || !userName) {
      return res
        .status(400)
        .json({ message: "Title and userName are required." });
    }

    // Check if a task with the same title already exists
    const isExisting = await Task.findOne({ title });
    if (isExisting) {
      return res.status(400).json({ message: "Task already exists." });
    }

    // Find the user by userName
    const user = await User.find({ email: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log(user[0]._id.toString());

    // Find the list by id and ensure it belongs to the user
    const taskList = await List.findOne({
      _id: listId,
      user: user[0]._id.toString(),
    });

    if (!taskList) {
      return res
        .status(404)
        .json({ message: "List not found or does not belong to the user." });
    }
    console.log(taskList);
    // Create the new task
    const task = await Task.create({ title, user: user[0]._id.toString() });

    // console.log(task._id.toString());
    // Add the task to the list's tasks array
    taskList.tasks.push(task._id.toString());
    await taskList.save();

    const tasks = await User.findById({ _id: id });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      tasks: tasks,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text);
    const id = req.params.id;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { text: text },
      { new: true }
    );
    res.status(201).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Server error ${error.message}` });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const isExisting = await Task.findOne({ _id: id });

    if (!isExisting) {
      return res.status(400).json({
        message: "Task not found—may have been deleted.",
      });
    }

    const resp = await Task.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};
