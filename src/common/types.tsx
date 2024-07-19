export interface IProduct {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
}

export type Tag = "clothing" | "corsets" | "dresses" | "girls' dresses" | "gowns" | "men's shirts" | "men's t-shirts" | "skirts" | "suits";

export type Sort = "none" | "name" | "price";
export type SortFunctionArray = {
  [key in Sort]: ((a: IProduct, b: IProduct) => number) | null;
};export type MenuItem = 'New In' | 'Clothing' | 'Footwear' | 'Accesories' | 'SALE';
export type SubMenuItem = {
  item: string;
  tag: Tag | null;
};
export interface IClickable {
  onClick?: () => void;
}

