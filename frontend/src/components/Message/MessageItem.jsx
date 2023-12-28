import { formatTimestamp } from "./utils";

const MessageItem = ({
  message,
  user,
  index,
  visibleOptionsIndex,
  setVisibleOptionsIndex,
  likeMessage,
  deleteMessage,
  renderMessageOptions,
}) => (
  <div
    key={index}
    className={`flex flex-col-reverse  ${
      message.sender === user._id ? "items-end" : "items-start"
    } relative`}
  >
    <span className="var(--text-color) text-sm">
      <p>
        {message.sender === user._id ? "You" : message.senderName}
        <span className="text-gray-400 text-xs ml-2">
          {formatTimestamp(message.timestamp)}
        </span>
        <button
          onClick={() =>
            visibleOptionsIndex === index
              ? setVisibleOptionsIndex(null)
              : setVisibleOptionsIndex(index)
          }
          className="var(--text-color) ml-2"
        >
          {renderMessageOptions(index)}
        </button>
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
          message.sender === user._id ? "flex-row-reverse" : "flex-row"
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
);

export default MessageItem;
