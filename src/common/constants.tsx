import { MenuItem, SortFunctionArray, SubMenuItem } from "./types";

export const PRODUCTS_PER_FETCH = 6;
export const SORT_FUNCTIONS: SortFunctionArray = {
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
};
export const MINIMUM_QUERY_LENGTH = 3;
export const QUERY_UPDATE_DELAY_MS = 500;export const SORT_SELECT_OPTS = {
  none: "Sort by",
  name: "Name",
  price: "Price",
};
export const menus: MenuItem[] = ['New In', 'Clothing', 'Footwear', 'Accesories', 'SALE'];
export const subMenues: Partial<Record<MenuItem, SubMenuItem[]>> = {
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
};
