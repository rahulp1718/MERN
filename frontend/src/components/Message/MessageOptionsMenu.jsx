import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { message_list } from "../../constants";

const MessageOptionsMenu = () => (
  <Menu>
    <MenuButton>
      <i className="fa-solid fa-ellipsis-vertical"></i>
    </MenuButton>
    <MenuList bg={"var(--bg-color-secondary)"}>
      {message_list.map((items) => (
        <MenuItem
          bg={"var(--bg-color-secondary)"}
          borderY={"1px"}
          borderycolor={"var(--bg-color)"}
          key={items.title}
        >
          {items.title}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

export default MessageOptionsMenu;
