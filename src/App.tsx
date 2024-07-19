import { PropsWithChildren, useCallback, useEffect, useState } from "react";
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
  setTagProc: (tag: Tag | null) => void;
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

interface SearchBoxProps {
  value: string;
  onInput: React.FormEventHandler<HTMLInputElement>;
}
const SearchBox: React.FC<SearchBoxProps> = ({ value, onInput }) => {
  return (
    <input type="search" value={value} onInput={onInput} />
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

const Card: React.FC<IProduct> = ({ thumbnail, title, description, price }) => {
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
  /* UI state */
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  
  /* Product state */
  const PRODUCTS_PER_FETCH = 6;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cache, setCache] = useState<IProduct[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);

  const MINIMUM_QUERY_LENGTH = 3;
  const [query, setQuery] = useState<string>('');
  
  // TODO: wait until the user stops typing for a little bit before updating products
  useEffect(() => {
    if (query.length >= MINIMUM_QUERY_LENGTH) {
      fetchProducts(true);
    }

    if (query.length == 0 && cache) {
      console.log('Restoring cache');
      setProducts(cache);
    }
  }, [query]);

  const fetchProducts: (overwrite: boolean) => void = useCallback((overwrite = false) => {
    // TODO: add functionality to search by tag once own backend is running
    const shouldSearch = query.length >= MINIMUM_QUERY_LENGTH;
    const limit = PRODUCTS_PER_FETCH;
    const skip = overwrite ? 0 : products.length;
    const shouldCache = !shouldSearch && cache.length < limit + skip;
  
    const url = 'https://dummyjson.com/products'
      .concat(shouldSearch ? `/search?q=${query}&` : '?')
      .concat(`limit=${limit}&`)
      .concat(skip ? `skip=${skip}&` : '')
      .concat('select=thumbnail,title,description,price');
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (overwrite) {
          if (shouldCache) setCache(data.products);
          setProducts(data.products);
        } else {
          setProducts(prev => {
            const val = [...prev, ...data.products];
            setCache(val);
            return val;
          });
        }
      })
      .catch((error) => {
        // TODO: do something meaningful with the error
        console.log(error);
      });
  }, [products, query]);

  /* TODO: It appears to trigger twice in dev because of React Strict Mode mounting
  and remounting the component. Check that in production this only happens one time */
  useEffect(() => fetchProducts(true), []);

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
        <SearchBox value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)}/>
        {/* TODO: Desktop */}
        {/* <SortSelect /> */}
      </header>
      {showSidebar && <Sidebar
        closeSidebarProc={() => setShowSidebar(false)}
        setTagProc={setTag}
      />}
      <main>
        <CardGallery>
          {products.map( (product, i) =>
            <Card key={i} {...product} />
          )}
        </CardGallery>
        <TextButton onClick={() => fetchProducts(false)}>Load More</TextButton>
      </main>
    </>
  )
}

export default App
