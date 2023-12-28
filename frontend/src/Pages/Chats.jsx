import { ChatState } from "../Context/chatProvider";
import ChatBox from "../components/Chat/ChatBox";
import Sidebar from "../components/Chat/Sidebar";
import ChatSidebar from "../components/Chat/ChatSidebar";
import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Chats = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Box w="100%">
        {user && <Sidebar />}
        <Box
          display="flex"
          justifyContent="space-between"
          bg="#BFD7ED"
          w="100%"
          h="90vh"
          p="5px"
          position="relative"
        >
          {user && (
            <>
              <ChatSidebar fetchAgain={fetchAgain} isOpen={isOpen} />
              <ChatBox
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                isOpen={isOpen}
              />
              <IconButton
                icon={<ChevronRightIcon />}
                aria-label="Toggle Chat"
                onClick={onToggle}
                display={{ base: "block", md: "none" }}
                position="absolute"
                top="50%"
                left="5px"
                transform="translateY(-50%)"
                zIndex="1"
              />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chats;
