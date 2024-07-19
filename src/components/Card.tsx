import { BsHeart } from "react-icons/bs";
import { IconButton } from "./buttons";
import { IProduct } from "../common/types";

type CardProps = Pick<IProduct, "thumbnail" | "title" | "description" | "price">;

export const Card: React.FC<CardProps> = ({ thumbnail, title, description, price }) => {
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
  );
};
