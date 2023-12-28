import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import UserSearchResult from "./UserSearchResult";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children, isUpdateMode, existingGroupData }) => {
  const [groupChatName, setGroupChatName] = useState(
    isUpdateMode ? existingGroupData.chatName : ""
  );
  const [selectedUsers, setSelectedUsers] = useState(
    isUpdateMode ? existingGroupData.users : []
  );
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `http://localhost:3001/api/user?search=${query}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      console.log("error.message", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((sel) => sel._id !== delUser._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        position: "top",
      });
      return;
    }

    try {
      if (!user) {
        toast({
          title: "User token or loggedInUserId not available",
          status: "error",
          position: "top",
        });
        return;
      }

      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const endpoint = isUpdateMode
        ? `http://localhost:3001/api/chat/updateGroup/${existingGroupData._id}`
        : "http://localhost:3001/api/chat/group";

      const axiosMethod = isUpdateMode ? axios.patch : axios.post;

      const { data } = await axiosMethod(
        endpoint,
        {
          chatName: groupChatName,
          users: Array.from(
            new Set([...selectedUsers.map((u) => u._id), user._id])
          ),
          userId: user._id,
          chatId: isUpdateMode && existingGroupData._id,
        },
        config
      );

      if (setChats) {
        setChats((prevChats) => [data, ...prevChats]);
      }
      onClose();
      toast({
        title: isUpdateMode ? "Group Chat Updated!" : "New Group Chat Created!",
        status: "success",
        position: "top",
      });
    } catch (error) {
      console.log("Backend Error:", error);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {isUpdateMode ? "Update Group Chat" : "Create Group Chat"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users e.g., rahul, john, sam..."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : Array.isArray(searchResult) ? (
              searchResult
                .slice(0, 3)
                .map((user) => (
                  <UserSearchResult
                    key={user._id}
                    user={user}
                    onClickFunction={() => handleSelectedUser(user)}
                  />
                ))
            ) : (
              <div>No valid search results</div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              {isUpdateMode ? "Update Chat" : "Create Chat"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
