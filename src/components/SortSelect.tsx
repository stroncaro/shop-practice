import { ChangeEvent } from "react";
import { Sort } from "../common/types";

interface SortSelectProps {
  value: Sort;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: {
    [key in Sort]: string;
  };
}
export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange, options }) => {
  return (
    <select id="sort" value={value} onChange={onChange}>
      {Object.entries(options).map(([key, value]) => <option key={key} value={key}>
        {value}
      </option>
      )}
    </select>
  );
};
