import { ChangeEvent, PropsWithChildren, useCallback, useEffect, useState } from "react";
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
  onInput: React.FormEventHandler<HTMLInputElement>;
}
const SearchBox: React.FC<SearchBoxProps> = ({ onInput }) => {
  return (
    <input type="search" onInput={onInput} />
  )
}

interface SortSelectProps {
  value: Sort;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { [key in Sort]: string }
}

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange, options }) => {
  return (
    <select id="sort" value={value} onChange={onChange}>
      {Object.entries(options).map(([key, value]) =>
        <option key={key} value={key}>
          {value}
        </option> 
      )}
    </select>
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

type Sort = "none" | "name" | "price";
type SortFunctionArray = { [key in Sort]: ((a: IProduct, b: IProduct) => number ) | null }


function App() {
  /* UI state */
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  
  /* Product state */
  const PRODUCTS_PER_FETCH = 6;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cache, setCache] = useState<IProduct[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);

  // TODO: decouple sorting from fetching products
  const [sort, setSort] = useState<Sort>("none");
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const SORT_FUNCTIONS: SortFunctionArray = {
    none: null,
    price: (a, b) => a.price - b.price,
    name: (a, b) => {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    }
  }
  
  useEffect(() => {
    const productsCopy = products.slice();
    const sortFunction = SORT_FUNCTIONS[sort];

    if (sortFunction) {
      productsCopy.sort(sortFunction);
    }

    setSortedProducts(productsCopy);
  }, [sort, products]);

  const MINIMUM_QUERY_LENGTH = 3;
  const QUERY_UPDATE_DELAY_MS = 500;
  const [query, setQuery] = useState<string>('');
  
  let queryTimeout: number;
  const debounceQuery: (val: string) => void = (val) => {
    clearTimeout(queryTimeout);

    const shouldWait = val.length > 0;

    if (shouldWait) {
      queryTimeout = setTimeout(() => {
        setQuery(val);
      }, QUERY_UPDATE_DELAY_MS);
    } else {
      setQuery(val);
    }
  };

  useEffect(() => {
    if (query.length >= MINIMUM_QUERY_LENGTH) {
      fetchProducts(true);
    }

    if (query.length == 0 && cache) {
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
        setProducts((prev) => {
          const fetchedValues = data.products;
          const updatedValues = overwrite ? fetchedValues : [...prev, ...fetchedValues];
          if (shouldCache) setCache(updatedValues);
          return updatedValues;
        });
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
        <SearchBox onInput={(e) => debounceQuery((e.target as HTMLInputElement).value)}/>
        {/* TODO: Visible in desktop only */}
        <SortSelect
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          options={{
            none: "Sort by",
            name: "Name",
            price: "Price",
          }}
        />
      </header>
      {showSidebar && <Sidebar
        closeSidebarProc={() => setShowSidebar(false)}
        setTagProc={setTag}
      />}
      <main>
        <CardGallery>
          {sortedProducts.map( (product, i) =>
            <Card key={i} {...product} />
          )}
        </CardGallery>
        <TextButton onClick={() => fetchProducts(false)}>Load More</TextButton>
      </main>
    </>
  )
}

export default App
