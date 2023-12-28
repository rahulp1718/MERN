import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  firestore,
} from "../../firebase-config";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";

const ChatContainer = () => {
  const { user, selectedChat } = ChatState();
  const [file, setFile] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef("");
  const [visibleOptionsIndex, setVisibleOptionsIndex] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat || !selectedChat._id) return;

      const chatRef = collection(
        firestore,
        "Chats",
        selectedChat._id,
        "Messages"
      );

      try {
        const snapshot = await onSnapshot(chatRef);
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        newMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(newMessages);
        setLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    loadMessages();
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

          await updateDoc(chatRef, messageId, {
            likes: likedMessage.likes,
          });
        }
      }
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  return (
    <div className="w-[100%] h-[100%] relative flex flex-col">
      <div
        className="overflow-hidden h-[80%] px-4"
        style={{ overflowY: "scroll", scrollbarWidth: "thin" }}
      >
        <MessageList
          messages={messages}
          user={user}
          visibleOptionsIndex={visibleOptionsIndex}
          setVisibleOptionsIndex={setVisibleOptionsIndex}
          likeMessage={likeMessage}
        />
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        file={file}
        setFile={setFile}
        selectedEmoji={selectedEmoji}
        setSelectedEmoji={setSelectedEmoji}
        sendMessage={sendMessage}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChatContainer;
