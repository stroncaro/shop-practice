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
  setTagProc: React.Dispatch<React.SetStateAction<Tag | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebarProc, setTagProc }) => {
  // TODO: When sidebar is reopened, menu is closed. Should it stay open?

  // TODO: clean type defs. Should MenuItem be an enum?
  type MenuItem = 'New In' | 'Clothing' | 'Footwear' | 'Accesories' | 'SALE';
  type SubMenuItem = {
    item: string;
    tag: Tag | null;
  }

  const menus: MenuItem[] = ['New In', 'Clothing', 'Footwear', 'Accesories', 'SALE'];
  const subMenues: Partial<Record<MenuItem, SubMenuItem[]>> = {
    'Clothing': [
      { item: 'New In', tag: null },
      { item: 'See all', tag: 'clothing' },
      { item: 'Corsets', tag: 'corsets' },
      { item: 'Dresses', tag: 'dresses' },
      { item: "Girls' dresses", tag: "girls' dresses" },
      { item: 'Shirts', tag: "men's shirts" },
      { item: 'Skirts', tag: 'skirts' },
      { item: 'T-shirts', tag: "men's t-shirts" },
      { item: 'Suits', tag: 'suits' },
      { item: 'SALE', tag: null },
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
            <li key={subMenuItem.item} onClick={() => setTagProc(subMenuItem.tag)}>
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

type Tag = "clothing" | "corsets" | "dresses" | "girls' dresses" | "gowns" | "men's shirts" | "men's t-shirts" | "skirts" | "suits";

function App() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  
  function getProducts(): void {
    // TODO: add functionality to search by tag once own backend is running
    const limit = 6;
    const skip = products.length;
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=thumbnail,title,description,price`;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.products);
      setProducts([...products, ...data.products]);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  /* TODO: It appears to trigger twice in dev because of React Strict Mode mounting
  and remounting the component. Check that in production this only happens one time */
  useEffect(getProducts, [tag]);

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
      {showSidebar && <Sidebar
        closeSidebarProc={() => setShowSidebar(false)}
        setTagProc={setTag}
      />}
      <main>
        <CardGallery>
          {products.map( (product) =>
            <Card {...product} />
          )}
        </CardGallery>
        <TextButton onClick={() => getProducts()}>Load More</TextButton>
      </main>
    </>
  )
}

export default App
