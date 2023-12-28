import { useState, useEffect, useRef } from "react";
import {
  firestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "../../firebase-config";
import { ChatState } from "../../Context/chatProvider";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import ReplyMessage from "./ReplyMessage";
import "../../index.css";

const formatTimestamp = (timestamp) =>
  timestamp ? new Date(timestamp.toDate()).toLocaleTimeString() : "";

const SingleChat = () => {
  const { user, selectedChat } = ChatState();
  const [file, setFile] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (!selectedChat || !selectedChat._id) return;

    const chatRef = collection(
      firestore,
      "Chats",
      selectedChat._id,
      "Messages"
    );

    const unsubscribe = onSnapshot(
      chatRef,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        newMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(newMessages);
        setLoading(false);
        scrollToBottom();
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedChat]);

  const uploadFileToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "dhrgpbkcy");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhrgpbkcy/image/upload",
        formData
      );

      return response.data.url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!selectedChat) return;

    const chatRef = collection(
      firestore,
      "Chats",
      selectedChat?._id ?? "",
      "Messages"
    );

    try {
      let messageData = {
        content: `${selectedEmoji || ""}`,
        sender: user._id,
        senderName: user.name,
        timestamp: serverTimestamp(),
        likes: {},
      };

      if (file) {
        const fileUrl = await uploadFileToCloudinary(file);
        messageData = {
          ...messageData,
          file: fileUrl,
        };
      }

      if (replyTo) {
        messageData.reply = {
          senderName: replyTo.senderName,
          content: replyTo.content,
        };
        setReplyTo(null);
      }

      await addDoc(chatRef, messageData);
      setFile("");
      setSelectedEmoji("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const likeMessage = async (messageId) => {
    if (!selectedChat) return;

    const chatRef = collection(
      firestore,
      "Chats",
      selectedChat?._id ?? "",
      "Messages"
    );

    try {
      const likedMessageIndex = messages.findIndex(
        (message) => message.id === messageId
      );

      if (likedMessageIndex !== -1) {
        const updatedMessages = [...messages];
        const likedMessage = updatedMessages[likedMessageIndex];

        if (!likedMessage.likes || !likedMessage.likes[user._id]) {
          likedMessage.likes = {
            ...likedMessage.likes,
            [user._id]: true,
          };

          setMessages(updatedMessages);

          await updateDoc(doc(chatRef, messageId), {
            likes: likedMessage.likes,
          });
        }
      }
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const replyMessage = (message) => {
    setReplyTo(message);
  };

  const deleteMessage = async (messageId) => {
    if (!selectedChat) return;

    const chatRef = collection(
      firestore,
      "Chats",
      selectedChat?._id ?? "",
      "Messages"
    );

    try {
      await deleteDoc(doc(chatRef, messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="w-[100%] h-[100%] relative flex flex-col">
      <div
        className="overflow-hidden h-[80%] px-4 scrollbar-style"
        style={{ overflowY: "scroll" }}
      >
        <div className="w-[100%] flex flex-col mt-4">
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col-reverse  ${
                  message.sender === user._id ? "items-end" : "items-start"
                } relative`}
              >
                {message.reply && (
                  <ReplyMessage
                    key={`reply-${message.id}`}
                    reply={message.reply}
                  />
                )}
                <span className="var(--text-color) text-sm">
                  <p>
                    {message.sender === user._id ? "You" : message.senderName}
                    <span className="text-gray-400 text-xs ml-2">
                      {formatTimestamp(message.timestamp)}
                    </span>

                    <button
                      onClick={() => likeMessage(message.id)}
                      className="var(--text-color) ml-2"
                    >
                      {message.likes && message.likes[user._id] ? (
                        <i className="fa-solid fa-thumbs-up"></i>
                      ) : (
                        <i className="fa-regular fa-thumbs-up"></i>
                      )}
                    </button>
                    <button
                      onClick={() => replyMessage(message)}
                      className="var(--text-color) ml-2"
                    >
                      <i className="fa-solid fa-reply"></i>
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="var(--text-color) ml-2"
                    >
                      <i className="fa-regular fa-trash-alt"></i>
                    </button>
                  </p>
                  <div
                    style={{
                      backgroundColor: message.file
                        ? "transparent"
                        : "var(--bg-color-secondary)",
                      color: "var(--text-color)",
                    }}
                    className={` flex ${
                      message.sender === user._id
                        ? "flex-row-reverse"
                        : "flex-row"
                    } my-2 var(--text-color) font-semibold w-fit rounded-full px-3 py-1 relative`}
                  >
                    {message.file ? (
                      <div className="">
                        <a href={message.file} target="_blank" rel="noreferrer">
                          <img
                            className="w-[150px] h-[150px] lg:w-[300px] lg:h-[300px] rounded-lg object-cover"
                            src={message.file}
                            alt=""
                          />
                        </a>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </span>
              </div>
            ))
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      {replyTo && (
        <div className="bg-gray-100 text-black p-2 rounded-md mb-2">
          <p>Replying to: {replyTo.senderName}</p>
          <InputEmoji
            value={selectedEmoji}
            onChange={setSelectedEmoji}
            cleanOnEnter
            onKeyDown={handleKeyDown}
            className="w-[100%] px-2 py-1 font-medium outline-none text-[#031526] rounded-s-lg "
            placeholder={`Reply to ${replyTo.senderName}...`}
          />
        </div>
      )}
      <div className="flex items-center justify-center">
        <label htmlFor="fileUpload">
          <i className="fa-solid fa-paperclip mr-1 cursor-pointer"></i>
        </label>
        <input
          type="file"
          accept="image/*"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <InputEmoji
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          cleanOnEnter
          onKeyDown={handleKeyDown}
          className="w-[80%] px-2 py-1 font-medium outline-none text-[#031526] rounded-s-lg "
          placeholder="Enter your text!"
        />
        <button
          onClick={sendMessage}
          className="px-2 py-1  rounded-lg"
          style={{
            backgroundColor: "var(--bg-color-secondary)",
            color: "var(--text-color)",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SingleChat;
