import { PropsWithChildren, useEffect, useState } from "react";
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

interface IProduct {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
}

const Card: React.FC<IProduct> = ({ id, thumbnail, title, description, price }) => {
  return (
    <div>
      <img src={thumbnail} alt={title} />
      <h1>{title}</h1>
      <p>{description}</p>
      <div>
        <p>€ {price}</p>
        <IconButton>
          <BsHeart />
        </IconButton>
      </div>
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


  const [products, setProducts] = useState<IProduct[]>([]);

  /* TODO: It appears to trigger twice in dev because of React Strict Mode mounting
     and remounting the component. Check that in production this only happens one time */
  useEffect( () => {
    const limit = 6;
    const skip = 0;
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=thumbnail,title,description,price`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.products);
        setProducts(data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          {products.map( (product) =>
            <Card {...product} />
          )}
        </CardGallery>
        <TextButton>LoadMore</TextButton>
      </main>
    </>
  )
}

export default App
