const ReplyMessage = ({ reply }) => {
  return (
    <div className="bg-[#5184D0] p-1 px-2 rounded-md my-2">
      <p className="text-white mb-1">{reply.senderName}</p>
      <p>{reply.content}</p>
    </div>
  );
};

export default ReplyMessage;
