import { useCallback, useEffect, useState } from "react";
import { BsList, BsArrowDownUp, BsHeartFill } from "react-icons/bs";
import { Sidebar } from "./components/Sidebar";
import { IconButton, TextButton } from "./components/buttons";
import { SearchBox } from "./components/SearchBox";
import { SortSelect } from "./components/SortSelect";
import { CardGallery } from "./components/CardGallery";
import { IProduct, Tag, Sort } from "./common/types";
import { Card } from "./components/Card";
import { SORT_FUNCTIONS, QUERY_UPDATE_DELAY_MS, MINIMUM_QUERY_LENGTH, PRODUCTS_PER_FETCH, SORT_SELECT_OPTS } from "./common/constants";

function App() {
  /* UI state */
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  
  /* Product state */
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cache, setCache] = useState<IProduct[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [sort, setSort] = useState<Sort>("none");
  const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);
  const [query, setQuery] = useState<string>('');
  
  /* Update sortedProducts whenever more products are fetched or sort demands change */
  useEffect(() => {
    const productsCopy = products.slice();
    const sortFunction = SORT_FUNCTIONS[sort];

    if (sortFunction) {
      productsCopy.sort(sortFunction);
    }

    setSortedProducts(productsCopy);
  }, [sort, products]);

  /* Debounce query to avoid multiple searches */
  let queryTimeout: number;
  const debounceQuery: (val: string) => void = (val) => {
    clearTimeout(queryTimeout);

    if (val.length > 0) {
      queryTimeout = setTimeout(() => {
        setQuery(val);
      }, QUERY_UPDATE_DELAY_MS);
    } else {
      setQuery(val);
    }
  };

  /* Manage searching and restoring from cache */
  useEffect(() => {
    if (query.length >= MINIMUM_QUERY_LENGTH) {
      fetchProducts(true);
    }

    if (query.length == 0 && cache) {
      setProducts(cache);
    }
  }, [query]);

  /* Fetch products from server according to user requirements */
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
          options={SORT_SELECT_OPTS}
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
