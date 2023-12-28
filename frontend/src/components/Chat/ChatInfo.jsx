/* eslint-disable no-unused-vars */
import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";

const ChatInfo = () => {
  const { selectedChat, user } = ChatState();

  const getOtherUser = () => {
    if (
      !selectedChat ||
      !selectedChat.users ||
      selectedChat.users.length === 0
    ) {
      return null;
    }

    const loggedInUserIndex = selectedChat.users.findIndex(
      (u) => u._id === user._id
    );
    const otherUserIndex = loggedInUserIndex === 0 ? 1 : 0;

    return selectedChat.users[otherUserIndex];
  };

  const otherUser = getOtherUser();

  const updateGroupPicture = async (e) => {
    if (!selectedChat.isGroupChat) {
      console.log("You are not authorized to change the picture");
      return;
    }

    const picture = e.target.files[0];

    try {
      if (!picture) {
        console.log("No picture selected");
        return;
      }

      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dhrgpbkcy");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dhrgpbkcy/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      const newGroupPicture = cloudinaryData.url.toString();

      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const { newData } = await axios.patch(
        `http://localhost:3001/api/chat/updateGroupImage/${selectedChat._id}`,
        {
          chatId: selectedChat._id,
          userId: user._id,
          newPicture: newGroupPicture,
        },
        config
      );
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          h: "100%",
          width: "calc(100% - 1100px)",
          bg: "var(--bg-color)",
          color: "var(--text-color)",
          borderRadius: "lg",
          borderWidth: "1px",
        }}
      >
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent="center"
          my={5}
          fontSize={30}
        >
          {selectedChat.isGroupChat ? selectedChat?.chatName : otherUser?.name}
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
        >
          {otherUser?.picture && (
            <Box position="relative">
              <Image
                src={
                  selectedChat.isGroupChat
                    ? selectedChat.groupPic
                    : otherUser?.picture
                }
                alt={otherUser?.name}
                w="80px"
                h="80px"
                borderRadius="50%"
                objectFit="cover"
                mb="20px"
              />

              <label htmlFor="image-change">
                <i className="fa-solid fa-camera absolute bg-white p-1 text-black text-md bottom-3 left-[20%] translate-x-[50%] rounded-full" />
              </label>
              <input
                type="file"
                accept="image/*"
                id="image-change"
                onChange={updateGroupPicture}
                style={{ display: "none" }}
              />
            </Box>
          )}
          {!selectedChat.isGroupChat && (
            <Heading as="h2" size="md">
              <p>{otherUser?.name}</p>
              <p>{otherUser?.email}</p>
            </Heading>
          )}
          {selectedChat.isGroupChat && (
            <Text sx={{ fontSize: "20px", marginBottom: "10px" }}>
              Group Members
            </Text>
          )}
          {selectedChat.isGroupChat &&
            selectedChat.users.map((user) => (
              <Box
                sx={{
                  backgroundColor: "var(--bg-color-secondary)",
                  width: "80%",
                  padding: "0.5em",
                  marginY: "0.2em",
                  borderRadius: "5px",
                }}
                key={user._id}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="text-start">{user.name}</span>
                </Box>
              </Box>
            ))}
          {selectedChat.isGroupChat && (
            <GroupChatModal
              isUpdateMode={true}
              existingGroupData={selectedChat}
            >
              <button className="bg-blue-400 px-2 py-1 rounded mt-5">
                Add user
              </button>
            </GroupChatModal>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ChatInfo;
