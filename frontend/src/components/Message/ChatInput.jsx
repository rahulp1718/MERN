import InputEmoji from "react-input-emoji";

const ChatInput = ({
  setFile,
  selectedEmoji,
  setSelectedEmoji,
  sendMessage,
  handleKeyDown,
}) => (
  <div className="w-[100%] h-[15%] flex items-center">
    <label htmlFor="fileUpload">
      <i className="fa-solid fa-paperclip mr-2 cursor-pointer"></i>
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
      className="w-[100%] px-2 py-1 font-medium outline-none text-[#031526] rounded-s-lg "
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
);

export default ChatInput;
