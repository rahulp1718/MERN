import MessageItem from "./MessageItem";
import MessageOptionsMenu from "./MessageOptionsMenu";
import { deleteDoc, doc, firestore, collection } from "firebase/firestore"; // Remove the unnecessary import
import { ChatState } from "../../Context/chatProvider";

const MessageList = ({
  messages,
  user,
  visibleOptionsIndex,
  setVisibleOptionsIndex,
  likeMessage,
}) => {
  const { selectedChat } = ChatState();

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
    <div className="w-[100%] flex flex-col mt-4">
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message}
          user={user}
          index={index}
          visibleOptionsIndex={visibleOptionsIndex}
          setVisibleOptionsIndex={setVisibleOptionsIndex}
          likeMessage={likeMessage}
          deleteMessage={deleteMessage}
          renderMessageOptions={(index) => (
            <MessageOptionsMenu renderMessageOptions={index} />
          )}
        />
      ))}
    </div>
  );
};

export default MessageList;
