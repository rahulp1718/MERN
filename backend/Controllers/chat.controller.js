const Chat = require("../Models/chat.model.js");
const User = require("../Models/user.model.js");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const handleErrorResponse = (error, res) => {
  console.error(error);

  if (error.name === "ValidationError") {
    res
      .status(400)
      .json({ message: "Validation Error", details: error.errors });
  } else {
    res.status(error.statusCode || 500).send("Internal Server Error");
  }
};

const accessChats = async (req, res) => {
  try {
    const { userId, loggedInUserId } = req.body;

    if (!userId) {
      throw new BadRequestError("Provide User's Id");
    }

    const chatFilter = {
      isGroupChat: false,
      users: { $all: [userId, loggedInUserId] },
    };

    const chatExists = await Chat.findOne(chatFilter)
      .populate("users", "-password")
      .populate("latestMessage")
      .populate({
        path: "latestMessage.sender",
        select: "name email profilePic",
      });

    if (chatExists) {
      return res.status(200).json(chatExists);
    }

    const newChatData = {
      chatName: "Private Chat",
      users: [userId, loggedInUserId],
      isGroupChat: false,
    };

    const newChat = await Chat.create(newChatData);
    const createdChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    return res.status(200).json(createdChat);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

const fetchAllChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await Chat.find({
      users: userId,
    })
      .populate("users")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 });

    const finalChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email profilePic",
    });

    res.status(200).json(finalChats);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

const createGroup = async (req, res) => {
  const { chatName, users, userId } = req.body;

  if (!chatName || !users) {
    res.status(400).json({ message: "Please  fill the fields" });
    return;
  }

  let parsedUsers;

  try {
    parsedUsers = Array.isArray(users) ? users : JSON.parse(users);

    if (!Array.isArray(parsedUsers) || parsedUsers.length < 2) {
      res.status(400).send("Group should contain more than 2 users");
      return;
    }
    parsedUsers.push(req.rootUser);

    const chat = await Chat.create({
      chatName: chatName,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.rootUserId,
      updatedBy: null,
      createdBy: userId,
      groupAdmin: userId,
    });

    const createdChat = await Chat.findOne({ _id: chat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.send(createdChat);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

const removeChat = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat removed successfully" });
  } catch (error) {
    console.error("Error removing chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateGroupPicture = async (req, res) => {
  const { chatId, newPicture, userId } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new NotFoundError("Chat not found");
    }
    chat.groupPic = newPicture;
    chat.updatedBy = userId;
    await chat.save();
    res.status(200).json({ message: "Group picture updated successfully" });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

const updateGroupData = async (req, res) => {
  const { chatName, users, userId, chatId } = req.body;

  if (!chatName || !users) {
    res.status(400).json({ message: "Please fill the fields" });
    return;
  }
  const chat = await Chat.findById(chatId);
  let parsedUsers;

  try {
    parsedUsers = Array.isArray(users) ? users : JSON.parse(users);

    if (!Array.isArray(parsedUsers) || parsedUsers.length < 2) {
      res.status(400).send("Group should contain more than 2 users");
      return;
    }
    parsedUsers.push(req.rootUser);

    chat.chatName = chatName;
    chat.users = parsedUsers;
    chat.updatedBy = userId;
    await chat.save();

    res.send(chat);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

module.exports = {
  accessChats,
  fetchAllChats,
  createGroup,
  removeChat,
  updateGroupPicture,
  updateGroupData,
};
