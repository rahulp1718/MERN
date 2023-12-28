import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Menu,
  Stack,
  Avatar,
  Button,
  useToast,
  MenuList,
  MenuItem,
  IconButton,
  MenuButton,
  AlertDialog,
  ButtonGroup,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import Loading from "./Loading";
import { getSender } from "../../config/ChatsLogic";
import GroupChatModal from "./GroupChatModal";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase-config";

const ChatSidebar = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [currentUserChats, setCurrentUserChats] = useState([]);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [latestMessages, setLatestMessages] = useState({});
  const toast = useToast();

  const fetchAllChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/api/chat/${user._id}`,
        config
      );
      setCurrentUserChats(data);
      const latestMessagesData = await Promise.all(
        data.map(async (chat) => {
          const messagesRef = collection(
            firestore,
            "Chats",
            chat._id,
            "Messages"
          );
          const messagesSnapshot = await getDocs(messagesRef);
          const latestMessage = messagesSnapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => b.timestamp - a.timestamp)[0];

          return { chatId: chat._id, latestMessage };
        })
      );
      const latestMessagesMap = {};
      latestMessagesData.forEach((item) => {
        latestMessagesMap[item.chatId] = item.latestMessage;
      });
      setLatestMessages(latestMessagesMap);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchAllChats();
  }, []);

  const handleDeleteChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(
        `http://localhost:3001/api/chat/removeuser/${chatToDelete._id}`,
        config
      );

      setCurrentUserChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== chatToDelete._id)
      );

      if (selectedChat?._id === chatToDelete._id) {
        setSelectedChat(null);
      }

      toast({
        title: "Chat Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top center",
      });

      setIsDeleteAlertOpen(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to delete the chat. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display={{
          base: selectedChat ? "none" : "flex",
          md: "flex",
        }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg={"var(--bg-color)"}
        color="var(--text-color)"
        w={{ base: "100%", md: "30%" }}
        borderRadius="lg"
        borderWidth="1px"
        zIndex="99"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          fontWeight="bold"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
              bg={"var(--bg-color)"}
              color="var(--text-color)"
              border="1px solid var(--text-color)"
              _hover={{ bg: "var(--bg-color-secondary)" }}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>

        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="var(--bg-color)"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="scroll"
        >
          {currentUserChats.length > 0 ? (
            <Stack>
              {currentUserChats.map((chat) => (
                <Box
                  key={chat._id}
                  display="flex"
                  alignItems="center"
                  position="relative"
                >
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={
                      selectedChat === chat
                        ? "#38B2AC"
                        : "var(--bg-color-secondary)"
                    }
                    color="var(--text-color)"
                    px={3}
                    py={2}
                    borderRadius="lg"
                    flexGrow={1}
                    display="flex"
                    alignItems="center"
                  >
                    <Avatar
                      src={user.picture}
                      alt="User Image"
                      className="mr-2"
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Text color="var(--text-color)" fontWeight="bold">
                        {chat.isGroupChat
                          ? chat.chatName
                          : getSender(loggedInUser, chat.users)}
                      </Text>
                      <Text fontSize="sm" color="white">
                        {latestMessages[chat._id]?.content}
                      </Text>
                    </Box>
                    <Box
                      position="absolute"
                      right={0}
                      mr={6}
                      display={selectedChat === chat ? "block" : "none"}
                    >
                      <ButtonGroup variant="outline" size="sm">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<HamburgerIcon />}
                            variant="outline"
                            size="xs"
                            colorScheme="blue"
                          />
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                setChatToDelete(chat);
                                setIsDeleteAlertOpen(true);
                              }}
                              bg="red"
                              borderRadius="5px"
                              color="var(--text-color)"
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </ButtonGroup>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Loading />
          )}
        </Box>
      </Box>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Chat
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this chat?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteChat} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ChatSidebar;
