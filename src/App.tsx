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

interface ProductState {
  products: IProduct[];
  tag: Tag | null;
  search: string;
}

function App() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [effectTriggerId, setEffectTriggerId] = useState<number>(0);
  const [productState, setProductState] = useState<ProductState>({
    products: [],
    tag: null,
    search: '',
  });
  
  function triggerProductUpdateAfterStateUpdate() {
    setEffectTriggerId(effectTriggerId + 1);
  }

  // TODO: make it possible to delete or clear search
  /* As it stands now, products are not refreshed when search is small
     to avoid searching for one or two letters, but avoids triggering
     refresh when deleting input. Also, clearing with the clear button
     doesn't refresh the producs */
  function setSearch(search: string) {
    if (/^\w*$/.test(search)) {
      const shouldTriggerProductUpdate = search.length > 2;
      setProductState({
        search: search,
        tag: productState.tag,
        products: shouldTriggerProductUpdate ? [] : productState.products,
      });
      if (shouldTriggerProductUpdate) triggerProductUpdateAfterStateUpdate();
    }
  }

  function setTag(tag: Tag | null) {
    if (tag !== productState.tag) {
      setProductState({
        search: productState.search,
        tag: tag,
        products: [],
      });
      triggerProductUpdateAfterStateUpdate();
    }
  }

  function getProducts(): void {
    // TODO: add functionality to search by tag once own backend is running
    const shouldSearch = productState.search.length > 2;
    const limit = 6;
    const skip = productState.products.length;

    let query: string = 'https://dummyjson.com/products';
    query += shouldSearch ? `/search?q=${productState.search}&` : '?';
    query += `limit=${limit}&`;
    if (skip) query += `skip=${skip}&`;
    query += 'select=thumbnail,title,description,price';

    fetch(query)
    .then((response) => response.json())
    .then((data) => {
      setProductState({
        search: productState.search,
        tag: productState.tag,
        products: [...productState.products, ...data.products]
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  /* TODO: It appears to trigger twice in dev because of React Strict Mode mounting
  and remounting the component. Check that in production this only happens one time */
  useEffect(getProducts, [effectTriggerId]);

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
        <SearchBox value={productState.search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)}/>
        {/* TODO: Desktop */}
        {/* <SortSelect /> */}
      </header>
      {showSidebar && <Sidebar
        closeSidebarProc={() => setShowSidebar(false)}
        setTagProc={setTag}
      />}
      <main>
        <CardGallery>
          {productState.products.map( (product) =>
            <Card key={product.id} {...product} />
          )}
        </CardGallery>
        <TextButton onClick={() => getProducts()}>Load More</TextButton>
      </main>
    </>
  )
}

export default App
