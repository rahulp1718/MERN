import { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import SingleChat from "./SingleChat";
import ChatInfo from "./ChatInfo";

const ChatBox = () => {
  const { selectedChat, user } = ChatState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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

  return (
    <>
      <Box
        display={{ base: selectedChat ? "flex" : "none", medium: "flex" }}
        alignItems="center"
        flexDir="column"
        p={1}
        px={5}
        bg="var(--bg-color)"
        color="var(--text-color)"
        h={"100%"}
        borderRadius="lg"
        borderWidth="1px"
        w={{ base: "100%", md: "70%" }}
      >
        {selectedChat && otherUser && (
          <>
            <Box
              display={"flex"}
              gap={"10px"}
              alignItems={"center"}
              justifyContent={"space-between"}
              px={"15px"}
              py={"5px"}
              width={"100%"}
              bg={"#5284D0"}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={2}
                onClick={handleModal}
              >
                {otherUser.picture && (
                  <img
                    src={
                      selectedChat.isGroupChat
                        ? selectedChat.groupPic
                        : otherUser.picture
                    }
                    alt={otherUser.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                )}
                <Heading
                  as="h2"
                  size="md"
                  cursor={"pointer"}
                  onClick={handleModal}
                >
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : otherUser.name}
                </Heading>
              </Box>
              <i
                className="fa-solid fa-ellipsis-vertical text-[1.5rem] cursor-pointer"
                onClick={handleModal}
              ></i>
            </Box>
            <SingleChat
              selectedChat={selectedChat}
              user={user}
              otherUser={otherUser}
            />
          </>
        )}
      </Box>

      {isModalOpen && <ChatInfo />}
    </>
  );
};

export default ChatBox;
