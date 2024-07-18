import { PropsWithChildren, useState } from "react";
import { BsList, BsArrowDownUp, BsXCircle, BsHeart, BsHeartFill } from "react-icons/bs";

interface IClickable {
  onClick?: () => void;
}

const IconButton: React.FC<PropsWithChildren<IClickable>> = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

interface SidebarProps {
  closeSidebarProc: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebarProc }) => {
  // TODO: When sidebar is reopened, menu is closed. Should it stay open?

  // TODO: clean type defs. Should MenuItem be an enum?
  type MenuItem = 'New In' | 'Clothing' | 'Footwear' | 'Accesories' | 'SALE';
  type SubMenuItem = {
    item: string;
    action: null; // TODO: decide how to implement the action 
  }

  const menus: MenuItem[] = ['New In', 'Clothing', 'Footwear', 'Accesories', 'SALE'];
  const subMenues: Partial<Record<MenuItem, SubMenuItem[]>> = {
    'Clothing': [
      { item: 'New In', action: null },
      { item: 'See all', action: null },
      { item: 'Coats', action: null },
      { item: 'Beach clothes', action: null },
      { item: 'Sweaters & hoodies', action: null },
      { item: 'Shirts', action: null },
      { item: 'Jeans and pants', action: null },
      { item: 'T-shirts', action: null },
      { item: 'Underwear', action: null },
      { item: 'SALE', action: null },
    ]
  }

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
        {menus.map( (menuItem) =>
          <li key={menuItem} onClick={() => setOrUnsetMenuItem(menuItem)}>
            {menuItem}
          </li>
        )}
      </ul>
      
      {selectedMenuItem && subMenues[selectedMenuItem] && (
        <ul id='sidebar-submenu'>
          {subMenues[selectedMenuItem].map( (subMenuItem) =>
            // TODO: onClick
            <li key={subMenuItem.item}>
              {subMenuItem.item}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

const SearchBox: React.FC = () => {
  // TODO: set state for search query
  // TODO: validate input while user types
  // TODO: filter cards
  return (
    <input type="search" />
  )
}

const SortSelect: React.FC = () => {
  // TODO: Set state and default behaviour
  // TODO: Set options
  // TODO: Sort cards according to option selected
  return (
    <select></select>
  )
}

const CardGallery: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

const Card: React.FC = () => {
  return (
    // TODO: add props with img, title, description, price and fav
    <div>
      <p>I'm a product</p>
      <IconButton>
        <BsHeart />
      </IconButton>
    </div>
  )
}

const TextButton: React.FC<PropsWithChildren<IClickable>> = ({ children, onClick }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}


function App() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <>
      <header>
        <IconButton onClick={() => setShowSidebar(!showSidebar)}>
          <BsList />
        </IconButton>
        <h1>Find what you need</h1>
        <IconButton>
          <BsArrowDownUp />
        </IconButton>
        <SearchBox />
        {/* TODO: Desktop */}
        {/* <SortSelect /> */}
      </header>
      {showSidebar && <Sidebar closeSidebarProc={() => setShowSidebar(false)} />}
      <main>
        <CardGallery>
          {/* Fill with cards */}
          <Card />
        </CardGallery>
        <TextButton>LoadMore</TextButton>
      </main>
    </>
  )
}

export default App
