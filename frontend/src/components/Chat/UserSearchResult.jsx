import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserSearchResult = ({ user, onClickFunction }) => {
  return (
    <Box
      onClick={onClickFunction}
      cursor="pointer"
      bg="var(--bg-color-secondary)"
      _hover={{
        background: "#ffffff",
        color: "var(--bg-color)",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      py={2}
      px={3}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.picture}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserSearchResult;
