import { useState } from "react";
import { BsXCircle } from "react-icons/bs";
import { IconButton } from "./buttons";
import { MenuItem, Tag } from "../common/types";
import { menus, subMenues } from "../common/constants";

interface SidebarProps {
  closeSidebarProc: () => void;
  setTagProc: (tag: Tag | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ closeSidebarProc, setTagProc }) => {
  // TODO: When sidebar is reopened, menu is closed. Should it stay open?
  
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  function setOrUnsetMenuItem(menuItem: MenuItem) {
    const newValue = menuItem === selectedMenuItem ? null : menuItem;
    setSelectedMenuItem(newValue);
  }

  return (
    <div>
      <IconButton onClick={() => closeSidebarProc()}>
        <BsXCircle />
      </IconButton>

      <ul id='sidebar-menu'>
        {menus.map((menuItem) => <li key={menuItem} onClick={() => setOrUnsetMenuItem(menuItem)}>
          {menuItem}
        </li>
        )}
      </ul>

      {selectedMenuItem && subMenues[selectedMenuItem] && (
        <ul id='sidebar-submenu'>
          {subMenues[selectedMenuItem].map((subMenuItem) =>
            // TODO: onClick
            <li key={subMenuItem.item} onClick={() => setTagProc(subMenuItem.tag)}>
              {subMenuItem.item}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
