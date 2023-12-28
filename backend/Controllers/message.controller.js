const asyncHandler = require("express-async-handler");
const {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
} = require("firebase/firestore");
const Message = require("../Models/message.model");

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chat }).populate(
      "sender",
      "name pic email"
    );
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chat } = req.body;

  if (!content || !chat) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chat,
  };

  try {
    const message = await Message.create(newMessage);

    const firestoreChat = firebase.collection("Chats").doc(chat);
    const firestoreMessage = firestoreChat
      .collection("Messages")
      .doc(message._id);

    await firestoreMessage.set({
      sender: message.sender,
      content: message.content,
      timestamps: message.timestamps,
    });

    await firestoreChat.update({
      latestMessage: {
        sender: message.sender,
        content: message.content,
        timestamps: message.timestamps,
      },
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
