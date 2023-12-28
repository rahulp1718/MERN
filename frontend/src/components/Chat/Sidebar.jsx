import { useState } from "react";
import {
  Box,
  Text,
  Menu,
  Drawer,
  Button,
  Tooltip,
  Avatar,
  MenuList,
  MenuItem,
  DrawerBody,
  IconButton,
  MenuButton,
  MenuDivider,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerCloseButton,
  Input,
  useToast,
} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import React from "react";
import axios from "axios";
import Loading from "./Loading.jsx";
import UserSearchResult from "./UserSearchResult.jsx";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const { user, setSelectedChat, setChats } = ChatState();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error("Error occurred:", error);
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const chatAccess = async (selectedUserId) => {
    try {
      const requestData = {
        userId: selectedUserId,
        loggedInUserId: user._id,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/chat",
        requestData,
        config
      );

      const newChat = response.data;

      setChats((prevChats) => [newChat, ...prevChats]);
      setSelectedChat(newChat);
      onClose();
    } catch (error) {
      console.error("Error during chat access:", error);

      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          toast({
            title: "Not Authorized",
            description: "Please log in to perform this action.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
        return console.log(`HTTP error ${status}:`, data);
      } else {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the Chat",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
        w="100vw"
        bgColor="var(--bg-color)"
        color="var(--text-color)"
        p="10px"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom">
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open menu"
            onClick={onOpen}
            bg={"var( --bg-color-secondary)"}
          />
        </Tooltip>
        <Text fontSize="3xl" fontFamily="Work sans">
          <span className="font-bold">ChatApp</span>
        </Text>
        <div className="flex items-center gap-3">
          <Menu>
            <MenuButton fontSize={"2xl"} m={1}>
              <i className="fa-solid fa-bell text-[var(--text-color)]"></i>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton
              bg="var( --bg-color-secondary)"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList bg="var( --bg-color-secondary)">
              <ProfileModal user={user}>
                <MenuItem bg="var( --bg-color-secondary)" fontWeight={"bold"}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                bg="var( --bg-color-secondary)"
                fontWeight={"bold"}
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="var(--bg-color)" color="var(--text-color)">
          <DrawerCloseButton />
          <DrawerHeader>Create your chats</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Type here..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <Loading />
            ) : (
              <div>
                {searchResult?.map((user) => (
                  <UserSearchResult
                    key={user._id}
                    user={user}
                    onClickFunction={() => chatAccess(user._id)}
                  />
                ))}
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
